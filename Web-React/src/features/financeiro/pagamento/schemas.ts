import { z } from 'zod'

export const pagamentoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
})

export type PagamentoFormData = z.infer<typeof pagamentoSchema>
