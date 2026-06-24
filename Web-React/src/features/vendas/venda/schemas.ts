import { z } from 'zod'

export const vendaSchema = z.object({
  selecionarCliente: z.string().min(1, 'Selecione um cliente'),
  dataVenda: z.string().min(1, 'Data é obrigatória'),
})

export type VendaFormData = z.infer<typeof vendaSchema>
