# Memory Index

- [Confirmação antes de refatorar](feedback_confirmacao_refatoracao.md) — Sempre pedir aprovação do usuário antes de refatorar ou mudar estrutura; nunca decidir sozinho
- [Strip silencioso em vez de erro](feedback_silently_strip_fields.md) — Campos somente-leitura em determinado contexto devem ser ignorados silenciosamente, não causar erro
- [Padrões de delete com vínculo](project_delete_validation_patterns.md) — ConflictException quando vínculo tem valor de negócio; CASCADE quando filho deve sumir junto com o pai; BadRequestException pra invariante de negócio (isOwner, auto-exclusão)
- [Fila para evitar dep circular](project_queue_circular_dep_pattern.md) — Módulos que não podem se importar mutuamente comunicam via BullMQ; nomes centralizados em `src/shared/queue-names.ts`
- [Entrada de estoque no cadastro](project_estoque_entrada_record_only.md) — `registrarEntrada` só grava movimento, não ajusta estoque; campo `motivo` identifica a origem
- [Multi-tenant + Auth](project_multi_tenant_auth.md) — Schema-per-tenant, catalog em schema próprio (não mais `public`, liberado pro 2.0), JWT/RBAC, bypass `isOwner`, gotchas de search_path e filas BullMQ
- [Evitar comentários inline](feedback_no_inline_comments.md) — Só comentar em código crítico/sensível, e mesmo assim o mais breve possível
- [TypeORM .set() quebra em many-to-many](project_typeorm_many_to_many_set_bug.md) — RelationQueryBuilder.set() só funciona em many-to-one/one-to-one; usar diff + add()/remove()
- [Vazamento de campo sensível via spread de entidade ORM](project_orm_response_leak_prevention.md) — senhaHash vazou em GET /usuarios; sempre desestruturar e descartar segredo no controller antes de responder
- [contas_receber: brecha só no create interno](project_contas_receber_interno_create.md) — DTO público (`idPagamento`/`idStatusPagamento`) continua obrigatório; opcional só via `CreateContasReceberInterno`, usado pela fila. `update` não muda
