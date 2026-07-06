---
name: project_delete_validation_patterns
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
- `Papel` atribuído a algum `Usuario` (tela `/usuarios`, aba Papéis)

**CASCADE no banco (`onDelete: 'CASCADE'`)** — quando os registros filhos devem sumir junto com o pai, como se nunca tivessem existido:
- `VendaItem` e `ContasReceber` ao deletar `Venda`
- `MovimentoEstoque` ao deletar `Produto`

**BadRequestException (400)** — terceiro padrão, pra regra de negócio que não é sobre integridade referencial (não existe "vínculo" a checar, é uma proibição direta): `Usuario` com `isOwner: true` não pode ser excluído por ninguém, e ninguém pode excluir a própria conta.

**Why:** O usuário definiu explicitamente: deleção de produto deve apagar o histórico de estoque "como se o produto nunca tivesse existido mesmo".

**How to apply:** Antes de implementar delete com vínculo, perguntar qual semântica se aplica (bloquear / cascatear / proibir por invariante). No front, quando o backend pode recusar por uma regra de negócio específica (409/400 com mensagem), extrair `error.response.data.message` do axios e mostrar no toast em vez de um texto genérico — ver `extractErrorMessage` em `features/usuarios/index.tsx`.
