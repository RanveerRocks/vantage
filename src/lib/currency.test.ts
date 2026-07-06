import { describe, expect, it } from 'vitest'
import { formatInrLakh, formatMoney, formatUsd, usdToInrLakh } from './currency'

describe('usdToInrLakh', () => {
  it('converts USD to lakh at the given rate', () => {
    expect(usdToInrLakh(100000, 84)).toBeCloseTo(84, 6)
    expect(usdToInrLakh(10000, 84)).toBeCloseTo(8.4, 6)
    expect(usdToInrLakh(0, 84)).toBe(0)
  })
})

describe('formatInrLakh', () => {
  it('shows one decimal below 100 lakh', () => {
    expect(formatInrLakh(10000, 84)).toBe('₹8.4 L')
    expect(formatInrLakh(50000, 84)).toBe('₹42.0 L')
  })

  it('rounds to whole lakh from 100 lakh up', () => {
    expect(formatInrLakh(160000, 84)).toBe('₹134 L')
  })
})

describe('formatUsd', () => {
  it('formats with en-US grouping and no decimals', () => {
    expect(formatUsd(52000)).toBe('$52,000')
    expect(formatUsd(999.6)).toBe('$1,000')
  })
})

describe('formatMoney', () => {
  it('dispatches on the selected currency', () => {
    expect(formatMoney(10000, 'inr', 84)).toBe('₹8.4 L')
    expect(formatMoney(10000, 'usd', 84)).toBe('$10,000')
  })
})
