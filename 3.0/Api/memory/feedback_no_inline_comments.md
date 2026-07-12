---
name: feedback_no_inline_comments
description: Evitar comentários no meio do código — só em lógica crítica/sensível, e mesmo assim o mais breve possível
metadata:
  type: feedback
---

Não adicionar comentários no meio do código, exceto em situações de extrema importância ou sensibilidade que exijam cuidado (ex: um workaround não-óbvio, uma invariante escondida que quebra silenciosamente se violada). Quando necessário, o comentário deve ser o mais breve e direto possível — uma linha, não um bloco.

**Why:** Durante a implementação de multi-tenancy (ver `project_multi_tenant_auth.md`), adicionei comentários em alguns pontos do roteamento de conexão por tenant (explicando o gotcha do `search_path`, por que `ensureDataSource` precisa rodar antes da request seguir). O usuário confirmou que esses casos (isolamento de tenant, comportamento não-óbvio de biblioteca) são exatamente a exceção onde comentário se justifica — mas quer o texto mais enxuto possível, nunca um bloco de várias linhas.

**How to apply:** Antes de escrever um comentário, perguntar: "isso é uma invariante escondida, um workaround de bug de terceiro, ou comportamento que vai surpreender quem ler depois?" Se sim, uma linha é aceitável. Se é só descrevendo o que o código já deixa óbvio, não escrever.
