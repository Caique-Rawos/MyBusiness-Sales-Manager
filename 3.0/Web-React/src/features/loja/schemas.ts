import { z } from 'zod'

export const lojaSchema = z.object({
  nomeFantasia: z.string().min(1, 'Nome Fantasia é obrigatório'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  ie: z.string().optional(),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
})

export type LojaFormData = z.infer<typeof lojaSchema>
