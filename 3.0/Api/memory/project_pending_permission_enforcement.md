---
name: project_pending_permission_enforcement
description: RBAC granular ainda não aplicado às rotas existentes — pendência prioritária a atacar em breve
metadata:
  type: project
---

`PermissionGuard` + `@RequirePermission('modulo:acao')` existem e funcionam (ver `project_multi_tenant_auth.md`), e as 60 permissões (`{criar,listar,editar,deletar}` × 15 módulos) já são seedadas no boot. **Mas nenhum dos 15 controllers de negócio usa `@RequirePermission` ainda.**

Estado atual: qualquer usuário autenticado acessa qualquer endpoint de negócio, independente do que está no array `permissions` do JWT. Só a autenticação (login obrigatório) está sendo aplicada de fato — a granularidade por permissão ainda é decorativa.

**Prioridade:** o usuário confirmou que isso é pendência a atacar assim que possível, logo após o frontend (login screen, sessão, proteção de rotas) estar pronto.

**How to apply quando for implementar:** mapear cada rota dos 15 controllers (`categoria`, `cliente`, `contagem_cliente`, `contas_pagar`, `contas_receber`, `estoque`, `loja`, `pagamento`, `paginas`, `produto`, `regra_fiscal`, `status_pagamento`, `venda`, `venda_item`, `venda_relatorio`) pra sua chave de permissão (ex: `POST /cliente` → `@RequirePermission('cliente:criar')`), usando as chaves já seedadas em `src/modules/auth/application/permission-catalog.ts`. Mudança mecânica, mas toca bastante arquivo.
