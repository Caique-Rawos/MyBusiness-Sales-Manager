import { describe, expect, it } from 'vitest'
import { contaSchema } from './schemas'

describe('contaSchema', () => {
  const validData = {
    descricao: 'Conta teste',
    valorTotal: '100',
    valorPago: '0',
    dataVencimento: '2026-12-31',
    idPagamento: '1',
    idStatusPagamento: '1',
  }

  it('should accept a fully filled payload', () => {
    const result = contaSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should give a friendly message when idPagamento is missing', () => {
    const result = contaSchema.safeParse({ ...validData, idPagamento: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Selecione a forma de pagamento')
    }
  })

  it('should give a friendly message when idStatusPagamento is missing', () => {
    const result = contaSchema.safeParse({ ...validData, idStatusPagamento: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Selecione o status de pagamento')
    }
  })

  it('should require descricao and dataVencimento', () => {
    const withoutDescricao = contaSchema.safeParse({ ...validData, descricao: '' })
    const withoutData = contaSchema.safeParse({ ...validData, dataVencimento: '' })

    expect(withoutDescricao.success).toBe(false)
    expect(withoutData.success).toBe(false)
  })
})
