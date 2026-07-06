import { z } from 'zod'

export const regraFiscalSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  ncm: z.string().min(1, 'NCM é obrigatório'),
  icms: z.string().min(1, 'ICMS é obrigatório'),
  pis: z.string().min(1, 'PIS é obrigatório'),
  cofins: z.string().min(1, 'COFINS é obrigatório'),
  ipi: z.string().min(1, 'IPI é obrigatório'),
})

export type RegraFiscalFormData = z.infer<typeof regraFiscalSchema>
