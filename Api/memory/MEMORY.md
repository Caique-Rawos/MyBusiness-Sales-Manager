# Memory Index

- [Confirmação antes de refatorar](feedback_confirmacao_refatoracao.md) — Sempre pedir aprovação do usuário antes de refatorar ou mudar estrutura; nunca decidir sozinho
- [Strip silencioso em vez de erro](feedback_silently_strip_fields.md) — Campos somente-leitura em determinado contexto devem ser ignorados silenciosamente, não causar erro
- [Padrões de delete com vínculo](project_delete_validation_patterns.md) — ConflictException quando vínculo tem valor de negócio; CASCADE quando filho deve sumir junto com o pai
- [Fila para evitar dep circular](project_queue_circular_dep_pattern.md) — Módulos que não podem se importar mutuamente comunicam via BullMQ; nomes centralizados em `src/shared/queue-names.ts`
- [Entrada de estoque no cadastro](project_estoque_entrada_record_only.md) — `registrarEntrada` só grava movimento, não ajusta estoque; campo `motivo` identifica a origem
