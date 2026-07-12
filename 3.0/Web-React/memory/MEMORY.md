# Memory Index

- [Confirmação antes de refatorar](feedback_confirmacao_refatoracao.md) — Sempre pedir aprovação do usuário antes de refatorar ou mudar estrutura; nunca decidir sozinho
- [Strip silencioso em vez de erro](feedback_silently_strip_fields.md) — Campos somente-leitura em determinado contexto devem ser ignorados silenciosamente, não causar erro
- [Padrões de delete com vínculo](project_delete_validation_patterns.md) — ConflictException quando vínculo tem valor de negócio; CASCADE quando filho deve sumir junto com o pai; extrair mensagem real do backend (409/400) em vez de toast genérico
- [Fila para evitar dep circular](project_queue_circular_dep_pattern.md) — Módulos que não podem se importar mutuamente comunicam via BullMQ; nomes centralizados em `src/shared/queue-names.ts`
- [Entrada de estoque no cadastro](project_estoque_entrada_record_only.md) — `registrarEntrada` só grava movimento, não ajusta estoque; campo `motivo` identifica a origem
- [TypeORM getRawMany retorna snake_case](project_typeorm_raw_query_casing.md) — Aliases de `.select()` manual voltam em lowercase do Postgres; nunca assumir camelCase
- [Cupom fiscal — detalhes](project_cupom_fiscal.md) — Endpoint, campos da loja, QR code bitcoin, pacote `qrcode` (não qrcode.react)
- [Independência entre features no frontend](feedback_feature_independence.md) — Não usar hook de feature A para enriquecer display de feature B, nem mesmo em runtime
- [Print CSS global](project_print_css.md) — @media print em index.css oculta aside e reseta main; telas só precisam de print:hidden nos controles
- [Evitar comentários inline](feedback_no_inline_comments.md) — Só comentar em código crítico/sensível, e mesmo assim o mais breve possível
- [Matriz para checkboxes 2D](feedback_permission_matrix_ui.md) — Pra grade item×ação fixa (ex. permissões), usar tabela/matriz, não blocos empilhados de checkbox
- [Suite de testes (Vitest+RTL)](project_test_suite.md) — 107 arquivos/490 testes, cobertura full-project ~97%; useId() em Input/Select não pode ser removido; `coverage.all:true` necessário pro número ser honesto; gotchas de mutationFn/handleSubmit/recharts/http.spec
- [Layout responsivo](project_responsive_layout.md) — Sidebar fixo virou off-canvas com backdrop abaixo de 1024px (`lg`); padrão a replicar em outros painéis fixos
