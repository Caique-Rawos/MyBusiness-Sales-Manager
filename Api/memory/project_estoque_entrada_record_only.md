---
name: project-estoque-entrada-record-only
description: Entrada de estoque no cadastro de produto é registro apenas — sem ajustar o campo estoque do produto
metadata:
  type: project
---

Quando um produto é cadastrado com `estoque > 0`, o job `estoque:entrada` registra o `MovimentoEstoque(ENTRADA)` para rastreabilidade, mas **não chama `ajustarEstoque`** — o valor já está correto no produto.

**Why:** O estoque é salvo diretamente no produto via `repository.create(data)`. Chamar `ajustarEstoque` em cima duplicaria o valor (ex: `0 + 10 = 10`, mas o produto já tem `10`).

**How to apply:** `EstoqueService.registrarEntrada` só grava o movimento (`repository.registrar`). Futuramente, entradas por compra/reposição precisarão de um fluxo diferente que também chame `ajustarEstoque`.

**Campo `motivo`:** Adicionado em `MovimentoEstoque` para identificar a origem. Valores atuais: `'Cadastro de produto'`. Futuros: `'Compra'`, `'Devolução'`, etc.
