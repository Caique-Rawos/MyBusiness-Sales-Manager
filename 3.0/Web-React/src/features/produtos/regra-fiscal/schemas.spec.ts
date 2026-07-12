import { describe, expect, it } from 'vitest'
import { regraFiscalSchema } from './schemas'

describe('regraFiscalSchema', () => {
  const valid = { descricao: 'Tributado', ncm: '1234.56.78', icms: '18', pis: '1.65', cofins: '7.6', ipi: '0' }

  it('should accept a fully filled payload', () => {
    expect(regraFiscalSchema.safeParse(valid).success).toBe(true)
  })

  it.each([
    ['descricao', 'Descrição é obrigatória'],
    ['ncm', 'NCM é obrigatório'],
    ['icms', 'ICMS é obrigatório'],
    ['pis', 'PIS é obrigatório'],
    ['cofins', 'COFINS é obrigatório'],
    ['ipi', 'IPI é obrigatório'],
  ])('should require %s', (field, message) => {
    const result = regraFiscalSchema.safeParse({ ...valid, [field]: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toBe(message)
  })
})
