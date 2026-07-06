---
name: feedback_no_inline_comments
description: Evitar comentários no meio do código — só em lógica crítica/sensível, e mesmo assim o mais breve possível
metadata:
  type: feedback
---

Não adicionar comentários no meio do código, exceto em situações de extrema importância ou sensibilidade que exijam cuidado (ex: um workaround não-óbvio, uma invariante escondida que quebra silenciosamente se violada). Quando necessário, o comentário deve ser o mais breve e direto possível — uma linha, não um bloco.

**Why:** O usuário confirmou essa preferência ao revisar comentários deixados no backend (roteamento de conexão por tenant) — casos de lógica genuinamente não-óbvia são a exceção onde comentário se justifica, mas o texto deve ser o mais enxuto possível.

**How to apply:** Antes de escrever um comentário, perguntar: "isso é uma invariante escondida, um workaround de bug de terceiro, ou comportamento que vai surpreender quem ler depois?" Se sim, uma linha é aceitável. Se é só descrevendo o que o código já deixa óbvio, não escrever.
