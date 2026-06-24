import { z } from 'zod'

export const vendaItemSchema = z.object({
  selecionarProduto: z.string().min(1, 'Selecione um produto'),
  valor_venda: z.string(),
  valor_desconto: z.string(),
  quantidade: z.string().min(1, 'Quantidade é obrigatória'),
})

export type VendaItemFormData = z.infer<typeof vendaItemSchema>
