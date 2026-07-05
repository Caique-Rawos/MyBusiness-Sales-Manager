---
name: feedback-silently-strip-fields
description: Quando um campo é somente-leitura em determinado contexto, ignorá-lo silenciosamente em vez de lançar erro
metadata:
  type: feedback
---

Quando o frontend pode enviar um campo que deve ser ignorado em determinado contexto, remover o campo silenciosamente (`delete data.campo`) em vez de lançar `BadRequestException`.

**Why:** O frontend pode reutilizar o mesmo objeto/formulário e enviar campos extras. Lançar erro quebraria o fluxo desnecessariamente — o comportamento correto é ignorar o campo proibido.

**How to apply:** Exemplo aplicado em `contas_receber.service.ts`: se a conta estiver vinculada a uma venda, `delete data.valorTotal` e `delete data.idVenda` antes de prosseguir com o update, sem lançar exceção.
