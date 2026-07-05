import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido').max(18, 'CPF/CNPJ inválido'),
  observacao: z.string().optional(),
})

export type ClienteFormData = z.infer<typeof clienteSchema>
