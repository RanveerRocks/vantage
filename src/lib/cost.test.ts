import { describe, expect, it } from 'vitest'
import { firstYearCostUsd } from './cost'
import type { TrueCost } from './schemas'

describe('firstYearCostUsd', () => {
  it('sums the four per-year items plus one-time visa fees', () => {
    const record: TrueCost = {
      countryId: 'de',
      tuitionPerYearUsd: 1500,
      livingPerYearUsd: 11000,
      insurancePerYearUsd: 1300,
      visaFeesOneTimeUsd: 300,
      flightsPerYearUsd: 900,
      hiddenNotes: [],
      confidence: 'placeholder',
      sources: [],
    }
    expect(firstYearCostUsd(record)).toBe(15000)
  })
})
