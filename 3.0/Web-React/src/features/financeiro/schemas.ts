import { z } from 'zod'

export const contaSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valorTotal: z.string(),
  valorPago: z.string(),
  dataVencimento: z.string().min(1, 'Data é obrigatória'),
  idPagamento: z.string().min(1, 'Selecione a forma de pagamento'),
  idStatusPagamento: z.string().min(1, 'Selecione o status de pagamento'),
})

export const pagamentoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
})

export const statusPagamentoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  cor: z.string().min(1),
})

export type ContaFormData = z.infer<typeof contaSchema>
export type PagamentoFormData = z.infer<typeof pagamentoSchema>
export type StatusPagamentoFormData = z.infer<typeof statusPagamentoSchema>
