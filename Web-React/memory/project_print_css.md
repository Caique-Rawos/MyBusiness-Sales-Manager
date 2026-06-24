---
name: project_print_css
description: Solução de impressão — @media print no index.css oculta sidebar e reseta margens
metadata:
  type: project
---

Impressão de páginas (cupom fiscal, relatórios) usa `@media print` global em `src/index.css`:

```css
@media print {
  aside { display: none !important; }
  main { margin-left: 0 !important; padding: 0 !important; }
  .print\:hidden { display: none !important; }
}
```

**Why:** O `<aside>` é o elemento raiz do `Sidebar`. O `<main>` tem `ml-60` do Layout que precisa ser zerado. O `print:hidden` do Tailwind já funciona sozinho, mas é reforçado explicitamente.

**How to apply:** Qualquer nova tela de impressão só precisa adicionar `print:hidden` nos elementos de UI que não devem aparecer (botões, filtros). A sidebar já some automaticamente.
