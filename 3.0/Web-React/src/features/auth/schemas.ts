import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  nomeFantasia: z.string().min(1, 'Nome da loja é obrigatório'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido').max(18, 'CPF/CNPJ inválido'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  nome: z.string().min(1, 'Seu nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type SignupFormData = z.infer<typeof signupSchema>
