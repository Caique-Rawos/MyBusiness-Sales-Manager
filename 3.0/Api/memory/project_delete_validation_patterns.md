---
name: project-delete-validation-patterns
description: Dois padrões distintos de delete dependendo da semântica do vínculo
metadata:
  type: project
---

Existem dois padrões de delete estabelecidos no projeto, escolhidos pelo significado de negócio do vínculo:

**ConflictException (409)** — quando o vínculo tem valor de negócio e o registro referenciado não deve ser apagado enquanto existir:
- `Categoria` com `Produto` vinculado
- `RegraFiscal` com `Produto` vinculado
- `Produto` com `VendaItem` vinculado
- `Pagamento` / `StatusPagamento` referenciado em `ContasPagar` ou `ContasReceber`
- `ContasReceber` vinculada a uma `Venda` (não pode deletar)

**CASCADE no banco (`onDelete: 'CASCADE'`)** — quando os registros filhos devem sumir junto com o pai, como se nunca tivessem existido:
- `VendaItem` e `ContasReceber` ao deletar `Venda`
- `MovimentoEstoque` ao deletar `Produto`

**Why:** O usuário definiu explicitamente: deleção de produto deve apagar o histórico de estoque "como se o produto nunca tivesse existido mesmo".

**How to apply:** Antes de implementar delete com vínculo, perguntar ao usuário qual semântica se aplica: bloquear (ConflictException) ou limpar junto (CASCADE).
