---
name: project_typeorm_raw_query_casing
description: TypeORM getRawMany() retorna aliases em lowercase snake_case, não camelCase das entidades — afeta qualquer query com .select() manual
metadata:
  type: project
---

Queries que usam `createQueryBuilder` com `.select()` manual e terminam em `getRawMany()` retornam os campos com o nome exato do alias definido no SQL — geralmente **lowercase snake_case** (ex: `precounitario`, `subtotal`, `codigodebarra`), nunca camelCase das entidades.

**Why:** O TypeORM não aplica nenhuma transformação de nome quando usa `getRawMany()` — diferente de `getMany()` que mapeia para a entidade. O Postgres retorna tudo em lowercase por padrão.

**How to apply:** Ao tipar a resposta de um endpoint que usa `getRawMany()`, verificar sempre os aliases no `.select()` do repositório antes de definir a interface TypeScript no frontend. Não assumir camelCase.

Exemplo real: `getCupomItens()` em `venda_relatorio.repository.ts` — retorna `precounitario`, `subtotal`, `codigodebarra` mesmo que as propriedades das entidades sejam `precoUnitario`, `subTotal`, `codigoDeBarra`.
