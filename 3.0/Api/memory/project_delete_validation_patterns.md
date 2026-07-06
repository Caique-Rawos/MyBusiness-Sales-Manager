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
- `Papel` atribuído a algum `Usuario` (`PapelService.remove` chama `UsuarioService.existsByPapelId`)

**CASCADE no banco (`onDelete: 'CASCADE'`)** — quando os registros filhos devem sumir junto com o pai, como se nunca tivessem existido:
- `VendaItem` e `ContasReceber` ao deletar `Venda`
- `MovimentoEstoque` ao deletar `Produto`

**BadRequestException (400)** — terceiro padrão, pra regra de negócio que não é sobre integridade referencial e sim sobre uma invariante do domínio (não existe "vínculo" a checar, é uma proibição direta):
- `Usuario` com `isOwner: true` não pode ser excluído por ninguém
- `Usuario` não pode excluir a própria conta (`currentUserId === id`)

**Why:** O usuário definiu explicitamente: deleção de produto deve apagar o histórico de estoque "como se o produto nunca tivesse existido mesmo". As proteções de `isOwner`/auto-exclusão vieram do design do bypass de permissão (ver `project_multi_tenant_auth.md`) — não são sobre dado órfão, são sobre nunca deixar o tenant sem admin.

**How to apply:** Antes de implementar delete com vínculo, perguntar ao usuário qual semântica se aplica: bloquear (ConflictException), limpar junto (CASCADE), ou é uma proibição de invariante de negócio sem relação com integridade referencial (BadRequestException).
