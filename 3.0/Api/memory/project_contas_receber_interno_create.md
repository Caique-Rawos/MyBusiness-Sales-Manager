---
name: project-contas-receber-interno-create
description: idPagamento/idStatusPagamento opcionais só na criação via fila — DTO público continua obrigatório
metadata:
  type: project
---

`contas_receber` criada automaticamente pela `venda` (via fila, quando a venda ainda não tem forma de pagamento/status definidos) precisa aceitar `idPagamento`/`idStatusPagamento` ausentes. O DTO público (`POST /contas_receber` manual, feito por usuário) **continua exigindo os dois campos** — a flexibilização é estritamente interna.

## Implementação: tipo derivado, não um DTO novo

```typescript
// create-contas_receber.dto.ts
export type CreateContasReceberInterno = Omit<
  CreateContasReceberDto,
  'idPagamento' | 'idStatusPagamento'
> &
  Partial<Pick<CreateContasReceberDto, 'idPagamento' | 'idStatusPagamento'>>;
```

`ContasReceberRepository.create()` (domain) usa `CreateContasReceberInterno`; `update()` **não muda**, continua `UpdateContasReceberDto` de sempre. Coluna `idPagamento`/`idStatusPagamento` na entity fica `nullable: true`.

**Why:** o usuário foi explícito — "no dto não vai poder ser opcional, deve ser obrigatorio, essa 'brecha' deve ser interna, apenas a fila vai conseguir fazer isso" e "e o update não muda, essa brecha sera apenas no create". `class-validator` roda em cima do DTO da camada `presentation/` (HTTP), que não muda; o tipo relaxado só existe na fronteira `application/domain`, usado exclusivamente por quem chama `repository.create()` fora do controller (o `VendaProcessor`/fila).

**How to apply:** se aparecer outro caso de "campo obrigatório pro usuário final, mas opcional numa criação disparada internamente pelo sistema", replicar o padrão `Omit<Dto, campos> & Partial<Pick<Dto, campos>>` em vez de criar um DTO paralelo duplicado ou tornar o campo opcional no DTO público — a obrigatoriedade do DTO público é regra de negócio, não só de tipo.
