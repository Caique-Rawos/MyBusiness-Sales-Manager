import { describe, expect, it } from 'vitest'
import { statusPagamentoSchema } from './schemas'

describe('statusPagamentoSchema', () => {
  it('should accept a valid payload', () => {
    expect(statusPagamentoSchema.safeParse({ descricao: 'Pago', cor: '#22c55e' }).success).toBe(true)
  })

  it('should require descricao', () => {
    expect(statusPagamentoSchema.safeParse({ descricao: '', cor: '#22c55e' }).success).toBe(false)
  })

  it('should require cor', () => {
    expect(statusPagamentoSchema.safeParse({ descricao: 'Pago', cor: '' }).success).toBe(false)
  })
})
