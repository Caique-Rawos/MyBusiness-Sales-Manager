import { describe, expect, it } from 'vitest'
import { papelSchema } from './schemas'

describe('papelSchema', () => {
  it('should accept a nome with at least one permissao', () => {
    expect(papelSchema.safeParse({ nome: 'Admin', permissaoIds: [1] }).success).toBe(true)
  })

  it('should require nome', () => {
    const result = papelSchema.safeParse({ nome: '', permissaoIds: [1] })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Nome é obrigatório')
  })

  it('should require at least one permissao', () => {
    const result = papelSchema.safeParse({ nome: 'Admin', permissaoIds: [] })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Selecione ao menos uma permissão')
  })
})
