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

**Regra de negócio confirmada com o usuário**: o usuário que cria o tenant (via signup) **sempre** deve ter permissão geral (todas as permissões) e **isso não pode ser alterado por ninguém** — ele é permanentemente o admin daquele tenant. Ao implementar a tela/endpoints de gestão:
- Não permitir remover o papel "Administrador" desse usuário específico.
- Não permitir editar as permissões do papel "Administrador" pra removê-las (ou, alternativa mais simples: tratar esse usuário como "owner" via alguma flag, e o próprio papel "Administrador" pode até ser editável por outros, mas o owner nunca perde acesso total).
- Provavelmente vale adicionar um campo tipo `isOwner`/`souOwner` no `usuario` (catalog) pra marcar isso explicitamente, em vez de inferir "é o primeiro usuário criado" — mais fácil de checar e mais à prova de erro.

**Escopo esperado quando for implementar**:
- Backend: endpoints para criar usuário (dentro do tenant logado), listar usuários do tenant, criar/editar papel, listar permissões disponíveis (o catálogo de 60 já existe), atribuir papel a usuário.
- Frontend: tela nova (ex: `/usuarios` ou `/configuracoes/usuarios`) — lista de usuários do tenant, formulário de convite/criação, gestão de papéis e permissões.
- Depende de já ter `@RequirePermission` aplicado nos controllers (ver `project_pending_permission_enforcement.md`) pra decidir quem pode acessar essa tela.
