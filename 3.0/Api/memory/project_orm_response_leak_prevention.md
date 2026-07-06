---
name: project_orm_response_leak_prevention
description: Nunca retornar entidade ORM (ou spread dela) direto na resposta HTTP quando ela tem campo sensível
metadata:
  type: project
---

`UsuarioTypeOrmRepository.findAllByTenantId` fazia `{ ...usuario, papeis: [...] }` a partir da entidade ORM completa, que inclui `senhaHash`. O `GET /usuarios` vazava o hash bcrypt da senha de todo usuário do tenant no JSON — só foi pego em teste manual (curl), não por tipo ou lint.

**Why:** A entidade ORM (`UsuarioOrmEntity`) é a "verdade" da tabela, incluindo colunas que nunca deveriam sair da camada de infra. Spread (`...entity`) copia tudo, inclusive o que não devia.

**How to apply:** Na camada `presentation/` (controller), nunca retornar o resultado do `service`/`repository` direto se ele pode conter segredo — desestruturar e descartar o campo explicitamente antes de responder (ver `toPublicUsuario` em `usuario.controller.ts`, que faz `const { senhaHash, ...publico } = usuario`). Ao criar um novo endpoint que retorna `Usuario`/`UsuarioComPapeis`, sempre checar se `senhaHash` está sendo removido antes de expor.
