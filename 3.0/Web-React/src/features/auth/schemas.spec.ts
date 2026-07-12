import { describe, expect, it } from 'vitest'
import { loginSchema, signupSchema } from './schemas'

describe('loginSchema', () => {
  it('should accept a valid email and a 6+ char senha', () => {
    expect(loginSchema.safeParse({ email: 'a@a.com', senha: '123456' }).success).toBe(true)
  })

  it('should reject an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalido', senha: '123456' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('E-mail inválido')
  })

  it('should reject a senha shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'a@a.com', senha: '123' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Senha deve ter no mínimo 6 caracteres')
  })
})

describe('signupSchema', () => {
  const valid = {
    nomeFantasia: 'Minha Loja',
    cpfCnpj: '12345678900',
    endereco: 'Rua A, 1',
    nome: 'Fulano',
    email: 'a@a.com',
    senha: '123456',
  }

  it('should accept a fully filled payload', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true)
  })

  it.each([
    ['nomeFantasia', '', 'Nome da loja é obrigatório'],
    ['endereco', '', 'Endereço é obrigatório'],
    ['nome', '', 'Seu nome é obrigatório'],
  ])('should require %s', (field, value, message) => {
    const result = signupSchema.safeParse({ ...valid, [field]: value })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe(message)
  })

  it('should reject a cpfCnpj shorter than 11 characters', () => {
    const result = signupSchema.safeParse({ ...valid, cpfCnpj: '123' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('CPF/CNPJ inválido')
  })
})
