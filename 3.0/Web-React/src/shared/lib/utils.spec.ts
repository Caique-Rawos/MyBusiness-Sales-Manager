import { describe, expect, it } from 'vitest'
import { cn, formatCpfCnpj, formatCurrency, formatDate, formatNcm } from './utils'

describe('cn', () => {
  it('should merge class names and resolve tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should drop falsy values', () => {
    expect(cn('text-sm', false, undefined, null, 'font-medium')).toBe('text-sm font-medium')
  })
})

describe('formatCurrency', () => {
  it('should format a number as BRL currency', () => {
    expect(formatCurrency(1234.5)).toBe('R$ 1.234,50')
  })

  it('should parse a numeric string before formatting', () => {
    expect(formatCurrency('99.9')).toBe('R$ 99,90')
  })

  it('should fall back to zero when the value is not a number', () => {
    expect(formatCurrency('abc')).toBe('R$ 0,00')
  })
})

describe('formatNcm', () => {
  it('should mask digits as 0000.00.00 while typing', () => {
    expect(formatNcm('1234')).toBe('1234')
    expect(formatNcm('12345')).toBe('1234.5')
    expect(formatNcm('12345678')).toBe('1234.56.78')
  })

  it('should strip non-digit characters and cap at 8 digits', () => {
    expect(formatNcm('1234.56.78abc9999')).toBe('1234.56.78')
  })
})

describe('formatCpfCnpj', () => {
  it('should mask up to 11 digits as CPF', () => {
    expect(formatCpfCnpj('12345678900')).toBe('123.456.789-00')
  })

  it('should mask partial CPF input while typing', () => {
    expect(formatCpfCnpj('123')).toBe('123')
    expect(formatCpfCnpj('1234')).toBe('123.4')
  })

  it('should mask 12+ digits as CNPJ', () => {
    expect(formatCpfCnpj('12345678000199')).toBe('12.345.678/0001-99')
  })

  it('should strip non-digit characters before masking', () => {
    expect(formatCpfCnpj('123.456.789-00')).toBe('123.456.789-00')
  })
})

describe('formatDate', () => {
  it('should format an ISO date string as dd/mm/yyyy using UTC', () => {
    expect(formatDate('2024-03-05T00:00:00.000Z')).toBe('05/03/2024')
  })

  it('should return a dash for an empty string', () => {
    expect(formatDate('')).toBe('-')
  })
})
