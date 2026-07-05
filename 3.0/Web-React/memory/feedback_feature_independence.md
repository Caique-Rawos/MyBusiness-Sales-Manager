---
name: feedback_feature_independence
description: Features devem ser verdadeiramente independentes — proibido usar hook de uma feature para resolver display de outra
metadata:
  type: feedback
---

Não usar dados de uma feature para resolver informações de display de outra feature, mesmo que seja tecnicamente possível.

**Why:** O usuário rejeitou explicitamente quando tentei usar `useProdutos()` para mapear nomes de produtos na tabela do Estoque. A regra do CLAUDE.md diz que features não importam entre si (exceto tipos), mas a proibição vai além do código — inclui uso de dados de uma feature para enriquecer outra em runtime.

**How to apply:** Se a tela de Estoque precisa mostrar o nome do produto, isso deve vir diretamente da própria resposta da API (`m.produto?.descricao`), não de um join manual no frontend entre dois hooks de features diferentes. O select de filtro pode usar `useProdutos()` (é input do usuário, não enriquecimento de dados), mas a listagem não.
