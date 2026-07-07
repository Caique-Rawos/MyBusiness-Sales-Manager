import { describe, expect, it } from 'vitest'
import { pagamentoSchema } from './schemas'

describe('pagamentoSchema', () => {
  it('should accept a valid descricao', () => {
    expect(pagamentoSchema.safeParse({ descricao: 'Dinheiro' }).success).toBe(true)
  })

  it('should require descricao', () => {
    const result = pagamentoSchema.safeParse({ descricao: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Descrição é obrigatória')
  })
})
