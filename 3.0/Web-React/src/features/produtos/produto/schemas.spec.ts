import { describe, expect, it } from 'vitest'
import { produtoSchema } from './schemas'

describe('produtoSchema', () => {
  const valid = {
    descricao: 'Produto Teste',
    precoCusto: '10.00',
    precoVenda: '20.00',
    estoque: '5',
    idCategoria: '1',
    idRegraFiscal: '1',
  }

  it('should accept a fully filled payload', () => {
    expect(produtoSchema.safeParse(valid).success).toBe(true)
  })

  it('should accept optional codigoDeBarra and unidade', () => {
    expect(produtoSchema.safeParse({ ...valid, codigoDeBarra: '789', unidade: 'UN' }).success).toBe(true)
  })

  it('should require descricao', () => {
    const result = produtoSchema.safeParse({ ...valid, descricao: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Descrição é obrigatória')
  })

  it('should require idCategoria', () => {
    const result = produtoSchema.safeParse({ ...valid, idCategoria: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Categoria é obrigatória')
  })

  it('should require idRegraFiscal', () => {
    const result = produtoSchema.safeParse({ ...valid, idRegraFiscal: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe('Regra fiscal é obrigatória')
  })
})
