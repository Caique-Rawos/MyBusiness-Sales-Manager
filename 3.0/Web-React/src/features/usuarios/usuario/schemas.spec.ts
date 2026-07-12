import { describe, expect, it } from 'vitest'
import { usuarioSchema } from './schemas'

describe('usuarioSchema', () => {
  const valid = { nome: 'Fulano', email: 'a@a.com', senha: '123456', papelIds: [] }

  it('should accept a valid usuario, papelIds may be empty', () => {
    expect(usuarioSchema.safeParse(valid).success).toBe(true)
  })

  it('should require nome', () => {
    const result = usuarioSchema.safeParse({ ...valid, nome: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Nome é obrigatório')
  })

  it('should reject an invalid email', () => {
    const result = usuarioSchema.safeParse({ ...valid, email: 'invalido' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('E-mail inválido')
  })

  it('should require a senha with at least 6 characters', () => {
    const result = usuarioSchema.safeParse({ ...valid, senha: '123' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('A senha deve ter ao menos 6 caracteres')
  })
})
