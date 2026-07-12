import { z } from 'zod'

export const papelSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  permissaoIds: z.array(z.number()).min(1, 'Selecione ao menos uma permissão'),
})

export type PapelFormData = z.infer<typeof papelSchema>
