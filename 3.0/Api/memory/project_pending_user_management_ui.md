---
name: project_pending_user_management_ui
description: Falta tela (front) + endpoints (back) pra gerenciar usuários/papéis dentro de um tenant — cadastrar novos e-mails, atribuir permissões
metadata:
  type: project
---

Hoje só existe `POST /tenants/signup` (cria o primeiro usuário, sempre "Administrador" com todas as permissões). Não existe nenhum endpoint nem tela para:
- Convidar/cadastrar um segundo (terceiro, etc) usuário dentro do mesmo tenant.
- Criar papéis customizados (além do "Administrador" seedado no signup) e escolher quais das 60 permissões cada papel tem.
- Atribuir papéis a um usuário.

**Regra de negócio confirmada com o usuário**: o usuário que cria o tenant (via signup) **sempre** deve ter acesso total e **isso não pode ser alterado por ninguém** — ele é permanentemente o admin/owner daquele tenant.

**Design decidido (importante, não é só "dar todas as permissões")**: hoje o `PapelPermissao` do "Administrador" é uma fotografia das permissões que existiam no momento do signup — se uma feature nova (com permissão nova) for lançada depois, o admin de um tenant já existente **não ganha essa permissão automaticamente**, porque ninguém sincroniza `papel_permissao` retroativamente. Isso deixaria o próprio criador do tenant "trancado pra fora" de telas novas até alguém arrumar manualmente.

A solução (confirmada com o usuário): campo `isOwner: boolean` no `usuario` (catalog), `true` só pra quem faz o signup, **nunca editável por ninguém depois**. O `PermissionGuard` passa a checar `isOwner` **antes** de olhar a lista de permissões — se `true`, libera a rota direto, sem nem consultar `permissions[]`. Isso resolve os dois problemas de uma vez:
1. Owner nunca fica sem acesso a feature nova (não depende de sincronizar permissão nenhuma).
2. Owner nunca pode ser "rebaixado" removendo permissão do papel dele, porque a checagem pra ele nem passa pela lista de permissões.

O papel "Administrador" seedado no signup pode continuar existindo (com todas as permissões do momento) como um papel normal, atribuível a outros usuários do tenant — só não é ele que garante o acesso do owner; quem garante é a flag `isOwner`.

**Escopo esperado quando for implementar**:
- Backend: adicionar `isOwner` ao `usuario` (migration catalog) + embutir no JWT payload; `PermissionGuard` checa `isOwner` antes de `permissions[]`; endpoints para criar usuário (dentro do tenant logado), listar usuários do tenant, criar/editar papel, listar permissões disponíveis (catálogo de 60 já existe), atribuir papel a usuário.
- Frontend: tela nova (ex: `/usuarios` ou `/configuracoes/usuarios`) — lista de usuários do tenant, formulário de convite/criação, gestão de papéis e permissões.
- `@RequirePermission` já está aplicado nos 15 controllers de negócio (feito).
