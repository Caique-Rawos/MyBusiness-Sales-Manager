import { z } from 'zod'

export const produtoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  codigoDeBarra: z.string().optional(),
  precoCusto: z.string(),
  precoVenda: z.string(),
  estoque: z.string(),
  unidade: z.string().optional(),
  idCategoria: z.string().min(1, 'Categoria é obrigatória'),
  idRegraFiscal: z.string().min(1, 'Regra fiscal é obrigatória'),
})

export type ProdutoFormData = z.infer<typeof produtoSchema>
