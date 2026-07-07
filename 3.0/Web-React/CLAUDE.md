# MyBusiness Sales Manager — Frontend React

## Memória do Projeto

A pasta `memory/` na raiz deste diretório contém o histórico de decisões, padrões e feedbacks acumulados ao longo do desenvolvimento. **Leia o `memory/MEMORY.md` no início de cada sessão** para ter contexto sobre o que já foi decidido e evitar repetir erros anteriores.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS v4** (plugin nativo Vite, sem tailwind.config.js)
- **React Router v6** (SPA)
- **TanStack Query v5** (server state, cache, loading states)
- **React Hook Form** + **Zod** (formulários e validação)
- **Axios** (HTTP client)
- **react-hot-toast** (notificações)
- **react-chartjs-2** + **chart.js** (gráficos)
- **lucide-react** (ícones)

## API

Base URL configurada em `src/shared/api/http.ts`:
```
https://mybusiness-api.caiquerawos.com/
```
O backend é um NestJS em `../Api/` com 14 módulos REST. O frontend chama a API diretamente — não há camada PHP intermediária.

## Arquitetura: Feature-Based (Bulletproof-React)

Referência: https://github.com/alan2207/bulletproof-react

### Regra de subpastas dentro de features

Features com **múltiplos sub-domínios** usam subpastas. Features com **domínio único** ficam flat.

| Feature | Estrutura | Motivo |
|---------|-----------|--------|
| `dashboard/` | flat | domínio único |
| `clientes/` | flat | domínio único |
| `loja/` | flat | domínio único |
| `produtos/` | subpastas | produto + categoria + regra-fiscal |
| `vendas/` | subpastas | venda + venda-item + cupom + relatorios |
| `financeiro/` | subpastas | contas-pagar + contas-receber + pagamento + status-pagamento |

**Sidebar espelha essa estrutura:** features com subpastas viram grupos colapsáveis no menu lateral.

### Estrutura de pastas

```
src/
├── app/
│   ├── App.tsx          # Só providers (QueryClient, Toaster)
│   └── router.tsx       # Todas as rotas centralizadas
│
├── features/            # Código organizado por domínio de negócio
│   ├── dashboard/       # flat — domínio único
│   ├── clientes/        # flat — domínio único
│   ├── loja/            # flat — domínio único
│   ├── produtos/        # subpastas: produto/ + categoria/ + regra-fiscal/
│   ├── vendas/          # subpastas: venda/ + venda-item/ + cupom/ + relatorios/
│   ├── financeiro/      # subpastas: contas-pagar/ + contas-receber/ + pagamento/ + status-pagamento/
│   └── loja/
│
└── shared/              # Código compartilhado entre features
    ├── api/http.ts      # Instância axios (só isso aqui)
    ├── components/
    │   ├── ui/          # Design system: Button, Input, Select, Card, Modal, Badge, Table
    │   └── layout/      # Layout, Sidebar
    └── lib/utils.ts     # cn(), formatCurrency(), formatDate()
```

### Estrutura interna de cada feature

Feature **flat** (domínio único):
```
features/clientes/
├── api.ts           # Chamadas HTTP (axios). Sem lógica de estado.
├── hooks.ts         # useQuery/useMutation. Sem JSX, sem toast.
├── schemas.ts       # Schemas Zod de validação de formulário.
├── types.ts         # Interfaces TypeScript do domínio.
├── ClienteForm.tsx  # Componente de formulário — só JSX + props, sem fetch.
├── ClienteTable.tsx # Componente de tabela — só JSX + props, sem fetch.
└── index.tsx        # Exporta as pages (porta de entrada da feature).
```

Feature **com subpastas** (múltiplos sub-domínios):
```
features/financeiro/
├── contas-pagar/
│   ├── types.ts, api.ts, hooks.ts
│   └── ContasPagarPage.tsx
├── contas-receber/
│   ├── types.ts, api.ts, hooks.ts
│   └── ContasReceberPage.tsx
├── pagamento/
│   ├── types.ts, schemas.ts, api.ts, hooks.ts
│   ├── PagamentoForm.tsx, PagamentoTable.tsx
│   └── PagamentoPage.tsx
├── status-pagamento/
│   ├── types.ts, schemas.ts, api.ts, hooks.ts
│   ├── StatusPagamentoForm.tsx, StatusPagamentoTable.tsx
│   └── StatusPagamentoPage.tsx
├── ContaForm.tsx    # Componente compartilhado entre contas-pagar e contas-receber
├── ContaTable.tsx   # Componente compartilhado
├── schemas.ts       # Schema compartilhado (contaSchema)
├── types.ts         # Barrel re-export de todos os tipos do feature
└── index.tsx        # Exporta as 4 pages
```

**Barrel de types na raiz do feature** (`financeiro/types.ts`):
```ts
// Permite que outros features importem de '../financeiro/types' sem saber a subpasta
export type { Pagamento } from './pagamento/types'
export type { StatusPagamento } from './status-pagamento/types'
```

## Regras de Arquitetura

### 1. Separação de responsabilidades (a mais importante)

| Arquivo | O que FAZ | O que NÃO FAZ |
|---------|-----------|----------------|
| `api.ts` | Chamadas HTTP, retorna Promise | Estado, cache, JSX |
| `hooks.ts` | useQuery/useMutation, invalida cache | JSX, toast, navegação |
| `Form.tsx` / `Table.tsx` | Renderiza JSX, recebe props | Fetch de dados, useQuery |
| `index.tsx` (page) | Usa hooks, compõe componentes, chama toast | Lógica HTTP direta |

### 2. Fluxo unidirecional de dependências

```
shared/  →  features/  →  app/
```

- `shared/` não importa de `features/`
- `features/` não importa de `app/`
- `app/` importa apenas o `index.tsx` de cada feature

### 3. Features não importam entre si — exceto tipos

Features são isoladas. A única exceção permitida são **tipos TypeScript**:

```ts
// ✅ Correto — vendas importa TIPO de clientes
// features/vendas/types.ts
import type { Cliente } from '../clientes/types'

// ❌ Errado — vendas importando hooks ou componentes de clientes
import { useClientes } from '../clientes/hooks'
import { ClienteTable } from '../clientes/ClienteTable'
```

### 4. Componentes Form/Table são "burros" (presentational)

Recebem dados e callbacks via props. Nunca fazem fetch interno.

```tsx
// ✅ Correto
function ClienteForm({ onSubmit, isPending, defaultValues }: ClienteFormProps) { ... }

// ❌ Errado — componente fazendo fetch próprio
function ClienteForm() {
  const { mutate } = useMutation(...)  // não deve estar aqui
}
```

### 5. Toast fica na Page (index.tsx), não nos hooks

Hooks são camada de dados — não têm responsabilidade de UI.

```ts
// ✅ Correto — page chama toast
createMutation.mutate(data, {
  onSuccess: () => toast.success('Salvo!'),
  onError: () => toast.error('Erro ao salvar.'),
})

// ❌ Errado — hook chamando toast
export function useCreateCliente() {
  return useMutation({
    onSuccess: () => toast.success('...')  // não deve estar aqui
  })
}
```

### 6. Router importa apenas de features/*/index.tsx

```ts
// ✅ Correto — importa a "porta de entrada" da feature
import { ClientesPage } from '../features/clientes'

// ❌ Errado — importa arquivo interno da feature
import { ClientesPage } from '../features/clientes/ClientesPage'
```

## Agrupamento de Features (decisão de design)

| Feature | Estrutura | Contém |
|---------|-----------|--------|
| `dashboard` | flat | Gráfico de vendas + cards de métricas |
| `clientes` | flat | CRUD de clientes |
| `loja` | flat | Dados cadastrais da loja |
| `produtos` | subpastas | `produto/` + `categoria/` + `regra-fiscal/` |
| `vendas` | subpastas | `venda/` + `venda-item/` + `cupom/` + `relatorios/` |
| `financeiro` | subpastas | `contas-pagar/` + `contas-receber/` + `pagamento/` + `status-pagamento/` |

## React vs Angular (contexto para devs vindos do Angular)

No Angular, o template fica em `.component.html` separado do `.component.ts`.

No React, **JSX é o template** — eles vivem juntos no `.tsx`. Isso é intencional e é o padrão universal do React.

A separação de concerns em React acontece em outro nível:

| Angular | React (nesta arquitetura) |
|---------|--------------------------|
| `.component.html` | `ClienteForm.tsx` (JSX = template) |
| `.component.ts` | `hooks.ts` (lógica de estado) |
| `service.ts` | `api.ts` (chamadas HTTP) |
| `model.ts` | `types.ts` + `schemas.ts` |

## Comandos

```bash
npm run dev       # Dev server em http://localhost:5173
npm run build     # Build de produção (gera dist/)
npm run preview   # Preview do build
npm run test      # Roda a suíte de testes uma vez (CI-friendly)
npm run test:watch  # Vitest em modo watch
npm run test:cov    # Roda com coverage (v8)
```

## Testes

**Vitest + React Testing Library** (`jsdom`). Config em `vite.config.ts` (bloco `test`), setup global em `src/test/setup.ts` (importa os matchers do `@testing-library/jest-dom`).

- Arquivo de teste fica ao lado do arquivo testado, sufixo `.spec.ts`/`.spec.tsx` (mesma convenção do `../Api`).
- Componente: renderiza com `render()` e consulta via `screen.getByLabelText`/`getByText`/`getByRole` — nunca `container.querySelector` como primeira opção. Isso só funciona porque `Input`/`Select` (`shared/components/ui/`) geram `id` via `useId()` quando não recebem um explícito, associando `label`/`input` — não remover esse `useId()`, é o que permite `getByLabelText` funcionar em qualquer formulário do app.
- Hook/contexto (ex: `useAuth`) que um componente depende: mockar com `vi.mock('caminho/do/contexto', () => ({ useAuth: vi.fn() }))` e configurar o retorno por teste com `vi.mocked(useAuth).mockReturnValue(...)`. Evitar `as any` no mock — tipar com `as unknown as ReturnType<typeof useAuth>` (o eslint bloqueia `any` explícito).
- Schema Zod: testar direto com `schema.safeParse(...)`, sem precisar renderizar nada.
- `react-router-dom`: componentes com `NavLink`/`useNavigate` precisam de `<MemoryRouter>` por fora; pra espiar `useNavigate` sem perder o `NavLink` real, mockar parcialmente com `importOriginal()`.
