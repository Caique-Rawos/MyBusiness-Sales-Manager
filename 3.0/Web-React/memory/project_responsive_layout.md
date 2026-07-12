---
name: project-responsive-layout
description: Sidebar fixo quebrava o layout abaixo de 1024px — virou off-canvas com hamburger
metadata:
  type: project
---

Frontend era inutilizável no celular ("fica horrivel"). Causa raiz: `Sidebar` era um `<aside>` sempre visível com `w-60` fixo e o `<main>` tinha `ml-60` fixo — em telas estreitas o conteúdo ficava espremido/cortado, sem forma de esconder o menu.

## Solução: off-canvas abaixo do breakpoint `lg` (1024px)

- `Layout.tsx` guarda `sidebarOpen` (state) e só mostra o header com botão hamburger (`lg:hidden`) abaixo de 1024px. O `<main>` usa `lg:ml-60` (sem margem em mobile, com margem fixa a partir de `lg`).
- `Sidebar.tsx` recebe `open`/`onClose`: em mobile funciona como drawer (`translate-x-0` vs `-translate-x-full`, com transição), com **backdrop** (`fixed inset-0 bg-black/50 lg:hidden`, clicável, fecha o menu). A partir de `lg`, `lg:translate-x-0` sempre visível, independente do state `open`.
- Todo `NavItem`/`NavLink` recebe `onNavigate={onClose}` — navegar fecha o drawer automaticamente em mobile.

**Why:** único jeito de ter sidebar fixo no desktop (padrão de admin dashboard) e drawer no mobile sem duas implementações separadas — o mesmo componente muda de comportamento via classes Tailwind condicionadas ao breakpoint, o `open` state só importa abaixo de `lg`.

**How to apply:** qualquer tela nova não precisa de nada especial — o padrão já é global via `Layout`. Se adicionar outro painel fixo (ex. um segundo sidebar/drawer), replicar o mesmo trio: backdrop com `lg:hidden` + `onClose`, `translate-x` condicionado a `open`, `lg:translate-x-0` fixo.
