import { describe, expect, it } from 'vitest'
import { clienteSchema } from './schemas'

describe('clienteSchema', () => {
  it('should accept a valid cliente without observacao', () => {
    expect(clienteSchema.safeParse({ nome: 'Fulano', cpfCnpj: '12345678900' }).success).toBe(true)
  })

  it('should accept an optional observacao', () => {
    expect(
      clienteSchema.safeParse({ nome: 'Fulano', cpfCnpj: '12345678900', observacao: 'VIP' }).success,
    ).toBe(true)
  })

  it('should require nome', () => {
    const result = clienteSchema.safeParse({ nome: '', cpfCnpj: '12345678900' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Nome é obrigatório')
  })

  it('should reject a cpfCnpj shorter than 11 characters', () => {
    const result = clienteSchema.safeParse({ nome: 'Fulano', cpfCnpj: '123' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('CPF/CNPJ inválido')
  })
})
