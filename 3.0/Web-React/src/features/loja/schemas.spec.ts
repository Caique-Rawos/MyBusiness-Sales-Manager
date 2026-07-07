import { describe, expect, it } from 'vitest'
import { lojaSchema } from './schemas'

describe('lojaSchema', () => {
  const valid = { nomeFantasia: 'Minha Loja', cpfCnpj: '12345678900', endereco: 'Rua A, 1' }

  it('should accept a valid loja without ie', () => {
    expect(lojaSchema.safeParse(valid).success).toBe(true)
  })

  it('should accept an optional ie', () => {
    expect(lojaSchema.safeParse({ ...valid, ie: 'ISENTO' }).success).toBe(true)
  })

  it('should require nomeFantasia and endereco', () => {
    expect(lojaSchema.safeParse({ ...valid, nomeFantasia: '' }).success).toBe(false)
    expect(lojaSchema.safeParse({ ...valid, endereco: '' }).success).toBe(false)
  })

  it('should reject a cpfCnpj shorter than 11 characters', () => {
    const result = lojaSchema.safeParse({ ...valid, cpfCnpj: '1' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('CPF/CNPJ inválido')
  })
})
