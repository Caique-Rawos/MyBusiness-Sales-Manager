import { describe, expect, it } from 'vitest'
import { vendaSchema } from './schemas'

describe('vendaSchema', () => {
  it('should accept a valid payload', () => {
    expect(vendaSchema.safeParse({ selecionarCliente: '1', dataVenda: '2026-01-01' }).success).toBe(true)
  })

  it('should require selecionarCliente', () => {
    const result = vendaSchema.safeParse({ selecionarCliente: '', dataVenda: '2026-01-01' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Selecione um cliente')
  })

  it('should require dataVenda', () => {
    const result = vendaSchema.safeParse({ selecionarCliente: '1', dataVenda: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Data é obrigatória')
  })
})
