import { describe, expect, it } from 'vitest'
import { vendaItemSchema } from './schemas'

describe('vendaItemSchema', () => {
  const valid = { selecionarProduto: '1', valor_venda: '10', valor_desconto: '0', quantidade: '1' }

  it('should accept a valid payload', () => {
    expect(vendaItemSchema.safeParse(valid).success).toBe(true)
  })

  it('should require selecionarProduto', () => {
    const result = vendaItemSchema.safeParse({ ...valid, selecionarProduto: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Selecione um produto')
  })

  it('should require quantidade', () => {
    const result = vendaItemSchema.safeParse({ ...valid, quantidade: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Quantidade é obrigatória')
  })
})
