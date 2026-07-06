import { z } from 'zod'

export const statusPagamentoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  cor: z.string().min(1),
})

export type StatusPagamentoFormData = z.infer<typeof statusPagamentoSchema>
