import { z } from 'zod'

export const usuarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
  papelIds: z.array(z.number()),
})

export type UsuarioFormData = z.infer<typeof usuarioSchema>
