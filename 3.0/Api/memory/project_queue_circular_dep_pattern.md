---
name: project-queue-circular-dep-pattern
description: Usar BullMQ para comunicação entre módulos que não podem importar um ao outro
metadata:
  type: project
---

Quando dois módulos teriam dependência circular se importados diretamente, o módulo produtor registra apenas a fila (`BullModule.registerQueue`) e emite jobs — sem importar o módulo consumidor.

**Why:** `EstoqueModule` importa `ProdutoModule` (para ajustar estoque). Se `ProdutoModule` importasse `EstoqueModule`, haveria ciclo. A solução foi `ProdutoModule` registrar `QUEUE_NAMES.ESTOQUE` e emitir `JOB_NAMES.ESTOQUE.ENTRADA` — o `EstoqueProcessor` consome sem criar dependência.

**How to apply:** Sempre que uma chamada cross-module criaria ciclo, preferir fila assíncrona. Todos os nomes de filas e jobs ficam centralizados em `src/shared/queue-names.ts`.

**Padrão atual de produtores:**
- `VendaItemService` → emite para `venda` e `estoque`
- `VendaService` → emite para `estoque` e `contas-receber`
- `ProdutoService` → emite para `estoque`
