---
name: project-test-suite
description: Suite de testes do front (Vitest + RTL) — cobertura completa (shared, schemas, hooks, Forms, Tables, Pages, http/api)
metadata:
  type: project
---

Front não tinha nenhum teste até esta feature. Stack escolhida: **Vitest + React Testing Library + jsdom**, config em `vite.config.ts` (bloco `test`, reaproveita a config do Vite), setup em `src/test/setup.ts` (`@testing-library/jest-dom/vitest`). Convenção de nome: `.spec.ts`/`.spec.tsx` ao lado do arquivo testado (mesma da `../Api`).

Estado atual: 107 arquivos, 490 testes. Cobertura full-project: **97% statements / 93% branch / 99% functions / 99% lines**. Cobre `shared/` inteiro (UI, lib, `http.ts`, AuthContext, ProtectedRoute), todos os `schemas.ts`/`hooks.ts`/`api.ts`, todos os Forms/Tables e **todas as Pages** de todas as features (incluindo os fluxos de erro de create/update/delete, botões "Novo"/"Cancelar", e o botão "Imprimir" de cupom fiscal e relatórios).

## `coverage.all: true` — sem isso o número é mentira

`vitest run --coverage` só instrumenta por padrão os arquivos **de fato importados por algum teste**. Isso inflava o número pra ~96% mesmo faltando Pages inteiras sem nenhum teste. Corrigido em `vite.config.ts`:

```ts
coverage: {
  provider: 'v8',
  all: true,
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/test/**', 'src/**/*.d.ts', 'src/**/types.ts', 'src/**/*.spec.{ts,tsx}'],
},
```

**Why:** sem `all: true` + `include` explícito, arquivo nunca importado por teste nenhum simplesmente não aparece no relatório — parece 100% do que existe, quando na real cobre uma fração do projeto. Foi assim que o número real apareceu: caiu de ~96% pra ~43% só ajustando a config (mesma convenção que a `../Api` já usa no `jest.config.ts`).

## `useId()` em Input/Select — não remover

`Input`/`Select` (`shared/components/ui/`) não geravam `id` quando não recebido explicitamente, então `label htmlFor` ficava vazio — quebra acessibilidade **e** a query `getByLabelText` do RTL (forma recomendada de selecionar campo em teste). Corrigido com `useId()` como fallback. Sem isso, todo teste de Form cairia pra `container.querySelector(...)`, bem mais frágil.

## Gotchas descobertos escrevendo os testes

- **`mutationFn` passado como referência direta** (`mutationFn: api.create`) recebe um **segundo argumento de contexto** do React Query v5 (`{client, meta, mutationKey}`). Usar `.mock.calls[0][0]` pra checar só o 1º argumento, ou `expect.anything()` como 2º esperado.
- **`onSubmit` passado direto pro `handleSubmit`** (`<form onSubmit={handleSubmit(onSubmit)}>`) faz o RHF chamar `onSubmit(data, event)` — dois argumentos. Mesma solução (`expect.anything()`).
- **`<input type="email">` tem validação nativa do browser** (jsdom inclusive) que bloqueia `submit` **antes** do React rodar, se o valor não for vazio mas malformado. Deixar o campo **vazio** pra testar a mensagem do zod, não mandar `'invalido'`.
- **Cor via style inline com hex+alpha** (`${color}22`) — jsdom converte pra `rgba(r,g,b,0.NNN)` com 3 casas (`0x22/255 = 0.133`, não `0.13`). Conferir o valor real antes de hardcodar.
- `renderHook` de mutation/query precisa de `QueryClientProvider` real (`src/test/query-wrapper.tsx`, `createQueryWrapper()`) — mockar `useQueryClient` não vale a pena.
- **Botão de ícone com `title="Excluir"` some com o texto "Excluir" do `ConfirmModal`** — `screen.getByRole('button', {name: 'Excluir'})` acha os dois. Usar `screen.getAllByRole('button', {name: 'Excluir'}).at(-1)!` (o modal é sempre o último a montar).
- **Select populado por query assíncrona** — trocar o valor com `fireEvent.change` antes da query resolver não seleciona nada (a `<option>` ainda não existe). Sempre `await screen.findByRole('option', {name: '...'})` antes do `fireEvent.change`.
- **Fluxo "criar X inline e a lista já vem atualizada"** (ex: criar categoria de dentro do form de produto) — mockar a segunda chamada de `getAll` (pós-invalidação) com `mockResolvedValueOnce(listaAntiga).mockResolvedValue(listaNova)`, simulando o backend já devolvendo o item novo.
- **`window.location.href` não navega no jsdom** ("Not implemented: navigation to another Document") — trocar por um stub gravável via `Object.defineProperty` antes de disparar a ação.
- **`recharts`'s `ResponsiveContainer`** não renderiza (0x0) no jsdom, sem `ResizeObserver`/layout real. Mockar só esse export (`vi.mock('recharts', async (importOriginal) => ({...await importOriginal(), ResponsiveContainer: fixedSizeDiv}))`), mantendo o resto real via `importOriginal()`.
- **Tooltip/Legend do `recharts` via `content={() => ...}`** só disparam com interação real de mouse sobre o SVG, que o jsdom não simula de forma confiável — aceitar como gap de cobertura conhecido (`SalesChart.tsx`), não vale o esforço/fragilidade de forçar.
- **`http.spec.ts`**: não mockar `auth-session.ts` inteiro ao testar o interceptor de refresh — só mockar `refreshSession` (de `refresh-session.ts`), deixando `setSession`/`clearSession`/`getAccessToken` reais, senão a retentativa usa token velho.
- **`axios-mock-adapter`**: match por body exato falha fácil; melhor casar só pela URL e conferir o corpo à parte via `JSON.parse(mock.history.post[0].data)`.
- **Guards defensivos tipo `if (!x) return`** onde o botão/callback que dispara a função só existe quando `x` já é truthy (ex: `handleConfirmDelete` só é chamado a partir de um `ConfirmModal` que só abre com `deleting` setado) são **estruturalmente inalcançáveis pela UI** — não vale forçar cobertura desses ramos via chamada direta da função; ficam como gap aceito.
- Depois de deletar o item que está em edição (`if (editing?.id === deleting.id) setEditing(null)`), vale testar esse caminho de verdade quando fizer sentido — é comportamento real (evita formulário travado com um registro que não existe mais), não só cobertura por cobertura.
