---
name: feedback_permission_matrix_ui
description: Pra checkboxes agrupados em duas dimensões (ex. módulo × ação), usar matriz/tabela, não blocos empilhados
metadata:
  type: feedback
---

A primeira versão do formulário de papel (`PapelForm`) renderizava 17 blocos empilhados (um `<Card>` por módulo, cada um com 4 checkboxes soltos ao lado). O usuário achou "muito feio de usar" e pediu sugestões de modelo alternativo.

**Why:** Quando os dados têm duas dimensões fixas e pequenas (aqui: 17 módulos × 4 ações sempre iguais — Criar/Listar/Editar/Excluir), empilhar blocos verticais desperdiça tela e dificulta comparar visualmente. Ofereci 4 opções por `AskUserQuestion` (matriz, acordeão, matriz+busca, chips+busca) com preview ASCII; o usuário escolheu a matriz sem hesitar.

**How to apply:** Pra qualquer futura tela com "N itens × M ações fixas" (permissões, feature flags por plano, etc.), ir direto de cara com layout de tabela/matriz (linhas = itens, colunas = ações, checkbox na célula) — não propor blocos empilhados como padrão. Vale incluir coluna "Tudo" por linha e botões globais "Marcar tudo"/"Limpar tudo" (ver `PapelForm.tsx`).
