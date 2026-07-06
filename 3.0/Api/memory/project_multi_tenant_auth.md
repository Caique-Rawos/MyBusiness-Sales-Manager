---
name: project-multi-tenant-auth
description: Arquitetura de multi-tenancy (schema-per-tenant) + autenticação JWT + RBAC introduzida na branch feature/multi-tenant-auth
metadata:
  type: project
---

Loja = tenant. Cada loja tem seu próprio schema Postgres, criado no signup. Login obrigatório (JWT) em toda rota, permissões customizadas por usuário.

## Dois grupos de dados, duas conexões

- **Catalog** (schema `public`, conexão default do `app.module.ts`): `tenant`, `usuario`, `papel`, `permissao`, `papel_permissao`, `usuario_papel`, `refresh_token`. Entidades em `src/modules/auth/` e `src/modules/tenant/`. Nunca é roteado por tenant — sempre a mesma conexão.
- **Negócio** (schema por tenant, ex. `tenant_3`): os 15 módulos existentes (categoria, cliente, venda, etc). Roteado dinamicamente por `TenantContextService`.

Arrays explícitos em `src/shared/entities/{catalog,tenant}-entities.ts` — **todo entity novo precisa ser adicionado no array certo manualmente** (não é mais glob automático).

## Migrations: duas streams, não uma

`src/migrations/catalog/` (rodada uma vez, contra `public`) e `src/migrations/tenant/` (rodada sob demanda, uma vez por schema de tenant real — `tenant_1`, `tenant_2`...). CLIs: `npm run migration:generate:catalog` / `:tenant`. **Nunca gerar uma migration combinada** — cada stream tem seu próprio `data-source-{catalog,tenant}.ts`. `public` recebe **só** as migrations de catalog — não é tratado como tenant (isso já foi assim numa versão inicial, e foi removido; ver `TenantConnectionRegistryService`, sem `onModuleInit`).

## Roteamento de conexão (o coração do isolamento)

`TenantConnectionRegistryService` mantém um `Map<schema, DataSource>`, criado sob demanda. `TenantContextService.getRepository(Entity)` é **síncrono** — depende do `DataSource` já estar no cache. Por isso `JwtAuthGuard` chama `ensureDataSource(schema)` (async) **antes** de popular o contexto, garantindo que qualquer repository chamado depois já ache a conexão pronta.

**Gotcha que já mordeu uma vez:** a opção `schema` do TypeORM só prefixa queries geradas via QueryBuilder/Repository. Migration com SQL cru (`CREATE TABLE "categoria"`) ignora isso e vai pro `search_path` da sessão. Sem setar `extra.options: '-c search_path=...'` na conexão, toda migration de tenant cai sempre em `public`. Ver `TenantConnectionRegistryService.createDataSource`.

## Contexto de tenant não atravessa fila BullMQ

`nestjs-cls` só existe dentro do ciclo de vida de uma request HTTP. Todo `queue.add()` que ficar disponível numa request precisa incluir `schema`/`tenantId` no payload (lidos de `tenantContext.getTenant()`), e todo `*Processor.process(job)` precisa rechamar `tenantContext.runWithTenant({schema, tenantId}, () => ...)` antes de tocar em qualquer repository. Já feito em `VendaProcessor`, `EstoqueProcessor`, `ContasReceberProcessor` — **qualquer processor novo precisa do mesmo tratamento**.

## Auth: JWT + refresh token

Access token JWT (15min, payload `{sub, tenantId, schema, permissions[]}`) + refresh token opaco (7 dias, hash sha256 em `refresh_token`, cookie httpOnly em `/auth/*`, sempre rotacionado a cada uso). `@Public()` isenta rotas do guard global; sem isso, toda rota exige token válido.

## RBAC: aplicado nos 15 controllers de negócio

`PermissionGuard` + `@RequirePermission(PERMISSOES.MODULO.acao)` (`src/modules/auth/application/permission-catalog.ts`) travam cada rota dos 15 módulos pela permissão certa. 60 permissões (`{criar,listar,editar,deletar}` × 15 módulos) seedadas no boot (`PermissionSeedService`). `PermissaoChave` é um template literal type derivado das mesmas listas — digitar uma chave inválida quebra o build.

**Gotcha de design a lembrar (RBAC ainda não implementado, ver `project_pending_user_management_ui.md`)**: o papel "Administrador" criado no signup é uma fotografia das permissões que existiam naquele momento — permissão nova adicionada depois (feature nova) não chega automaticamente pros tenants já existentes. A solução decidida é um bypass via flag `isOwner` no usuário (não sincronizar `papel_permissao` retroativamente), a implementar na Task de gestão de usuários.

## Signup self-service

`POST /tenants/signup` (público): valida e-mail único → cria `tenant` → `CREATE SCHEMA` → migra → cria a primeira `Loja` (reaproveita `LojaService.create()` sem nenhuma mudança, rodando dentro do contexto do novo schema) → cria usuário + papel "Administrador" com todas as permissões → devolve já logado.

## Onde as coisas vivem

- `src/shared/tenant/` — `TenantConnectionRegistryService`, `TenantContextService`, `TenantConnectionModule` (infra de roteamento)
- `src/modules/auth/` — login/refresh/logout, guards, decorators, papel/permissão/refresh-token, seed, provisionamento
- `src/modules/tenant/` — registro fino do tenant (schema, ativo) — não confundir com a `Loja` de negócio, que continua em `src/modules/loja/` sem mudanças
