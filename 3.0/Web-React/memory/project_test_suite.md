---
name: project-test-suite
description: Suite de testes do front (Vitest + RTL) criada do zero, cobrindo fundação compartilhada, schemas, hooks, Forms e Tables de todas as features
metadata:
  type: project
---

Front não tinha nenhum teste até esta sessão. Stack escolhida: **Vitest + React Testing Library + jsdom**, config em `vite.config.ts` (bloco `test`, reaproveita a config do Vite), setup em `src/test/setup.ts` (`@testing-library/jest-dom/vitest`). Convenção de nome: `.spec.ts`/`.spec.tsx` ao lado do arquivo testado (mesma da `../Api`).

Estado atual: 67 arquivos, 268 testes, cobrindo `shared/` inteiro (UI, lib, AuthContext, ProtectedRoute), todos os `schemas.ts`, todos os `hooks.ts`, todos os Forms e todas as Tables de todas as features.

## `useId()` em Input/Select — não remover

`Input`/`Select` (`shared/components/ui/`) não geravam `id` quando não recebido explicitamente, então `label htmlFor` ficava vazio — quebra acessibilidade **e** a query `getByLabelText` do RTL (que é a forma recomendada de selecionar campo em teste). Corrigido com `useId()` como fallback. Sem isso, todo teste de Form teria que cair pra `container.querySelector('label:has-text(...) + input')`, bem mais frágil.

## Gotchas descobertos escrevendo os testes (guardar pra próxima sessão)

- **`mutationFn` passado como referência direta** (`mutationFn: api.create` em vez de `mutationFn: (data) => api.create(data)`) recebe um **segundo argumento de contexto** do React Query v5 (`{client, meta, mutationKey}`). `toHaveBeenCalledWith` falha se não contar com isso — ou usar `.mock.calls[0][0]` pra checar só o 1º argumento (mais robusto, não depende de saber se o hook envolve a chamada numa arrow ou não), ou adicionar `expect.anything()` como 2º argumento esperado.
- **`onSubmit` passado direto pro `handleSubmit`** (`<form onSubmit={handleSubmit(onSubmit)}>`, sem uma arrow function no meio) faz o RHF chamar `onSubmit(data, event)` — **dois argumentos**. Forms que fazem `handleSubmit(data => { onSubmit(data); ... })` só passam `data`. Checar caso a caso qual padrão o form usa antes de escrever `toHaveBeenCalledWith`.
- **`<input type="email">` tem validação nativa do browser** (jsdom inclusive) que bloqueia o evento `submit` **antes** do React rodar, se o valor não for vazio mas tiver formato inválido. Pra testar a mensagem de erro do zod (`E-mail inválido`), deixar o campo **vazio** em vez de mandar um valor tipo `'invalido'` — vazio passa direto pela validação nativa (que só barra formato malformado, não campo vazio sem `required`).
- Cor via style inline com hex+alpha (`#RRGGBBAA`, ex: `${color}22`) — jsdom converte pra `rgba(r, g, b, 0.NNN)` com 3 casas decimais (ex: `0x22/255 = 0.133`, não `0.13`). Conferir o valor real antes de hardcodar o esperado.
- `renderHook` de mutation/query precisa de `QueryClientProvider` real (helper em `src/test/query-wrapper.tsx`, `createQueryWrapper()`) — mockar `useQueryClient` direto não vale a pena, o client real é barato de instanciar em teste.
