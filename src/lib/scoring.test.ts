import { describe, expect, it } from 'vitest'
import { careerVisaScore, clamp, minMax, minMaxInverted, roiScore, studentLifeIndex } from './scoring'
import { FACTOR_IDS } from './schemas'
import type { CareerVisaMetrics, CountryId, FactorId, StudentLifeScore } from './schemas'
import type { FactorWeights } from './scoring'

function career(countryId: CountryId, overrides: Partial<CareerVisaMetrics>): CareerVisaMetrics {
  return {
    countryId,
    degreeId: 'cs-it',
    jobDemand: 0,
    visaOpenness: 0,
    postStudyWorkYears: 0,
    prPathwayYears: 0,
    medianSalaryY1PppUsd: 1,
    totalDegreeCostUsd: 1,
    narrative: 'test',
    confidence: 'placeholder',
    sources: [],
    ...overrides,
  }
}

function life(countryId: CountryId, factorId: FactorId, score: number): StudentLifeScore {
  return {
    countryId,
    factorId,
    score,
    blurb: 'test',
    confidence: 'placeholder',
    sources: [],
  }
}

function weights(overrides: Partial<Record<FactorId, number>> = {}, fill = 0): FactorWeights {
  return Object.fromEntries(
    FACTOR_IDS.map((id) => [id, overrides[id] ?? fill]),
  ) as FactorWeights
}

describe('clamp', () => {
  it('clamps below, inside, and above the range', () => {
    expect(clamp(-1, 0, 3)).toBe(0)
    expect(clamp(2, 0, 3)).toBe(2)
    expect(clamp(5, 0, 3)).toBe(3)
  })
})

describe('minMax', () => {
  it('maps min to 0, max to 100, midpoints linearly', () => {
    expect(minMax([10, 20, 30])).toEqual([0, 50, 100])
  })

  it('maps identical values to 50 (no spread to rank)', () => {
    expect(minMax([5, 5, 5])).toEqual([50, 50, 50])
  })

  it('handles a single outlier: outlier gets 100, the rest 0', () => {
    expect(minMax([0, 0, 0, 10])).toEqual([0, 0, 0, 100])
  })

  it('returns an empty array for empty input', () => {
    expect(minMax([])).toEqual([])
  })
})

describe('minMaxInverted', () => {
  it('gives fewer years the higher score', () => {
    expect(minMaxInverted([2, 4, 6])).toEqual([100, 50, 0])
  })

  it('maps identical values to 50', () => {
    expect(minMaxInverted([3, 3])).toEqual([50, 50])
  })
})

describe('careerVisaScore (X axis)', () => {
  it('applies the 0.35 / 0.25 / 0.20 / 0.20 weights exactly', () => {
    const records = [
      career('us', { jobDemand: 80, visaOpenness: 60, postStudyWorkYears: 3, prPathwayYears: 2 }),
      career('de', { jobDemand: 40, visaOpenness: 80, postStudyWorkYears: 1.5, prPathwayYears: 6 }),
    ]
    const scores = careerVisaScore(records)
    // us: prScore 100 (fewest years), postStudy 3/3 → 100:
    //   0.35·80 + 0.25·60 + 0.20·100 + 0.20·100 = 83
    expect(scores[0]).toEqual({ countryId: 'us', score: expect.closeTo(83, 6) })
    // de: prScore 0, postStudy 1.5/3 → 50:
    //   0.35·40 + 0.25·80 + 0.20·50 + 0.20·0 = 44
    expect(scores[1]).toEqual({ countryId: 'de', score: expect.closeTo(44, 6) })
  })

  it('clamps post-study work beyond 3 years to a score of 100', () => {
    const records = [
      career('us', { postStudyWorkYears: 6, prPathwayYears: 4 }),
    ]
    // Single-record set: prScore falls back to 50; postStudy clamps to 100:
    //   0.20·100 + 0.20·50 = 30
    expect(careerVisaScore(records)[0].score).toBeCloseTo(30, 6)
  })
})

describe('roiScore (Y axis)', () => {
  it('normalises salary×5/cost and preserves the roiRaw ordering', () => {
    const records = [
      career('us', { medianSalaryY1PppUsd: 50000, totalDegreeCostUsd: 100000 }), // roiRaw 2.5
      career('uk', { medianSalaryY1PppUsd: 60000, totalDegreeCostUsd: 300000 }), // roiRaw 1.0
      career('de', { medianSalaryY1PppUsd: 30000, totalDegreeCostUsd: 50000 }), // roiRaw 3.0
    ]
    const scores = roiScore(records)
    expect(scores[0].score).toBeCloseTo(75, 6)
    expect(scores[1].score).toBeCloseTo(0, 6)
    expect(scores[2].score).toBeCloseTo(100, 6)
    expect(scores[2].score).toBeGreaterThan(scores[0].score)
    expect(scores[0].score).toBeGreaterThan(scores[1].score)
  })
})

describe('studentLifeIndex', () => {
  const records = [
    life('ca', 'affordability', 40),
    life('ca', 'safety', 75),
    life('ca', 'openness', 80),
    life('de', 'affordability', 70),
    life('de', 'safety', 72),
    life('de', 'openness', 62),
  ]

  it('equals the plain average when all weights are equal', () => {
    const scores = studentLifeIndex(records, weights({}, 3))
    expect(scores).toEqual([
      { countryId: 'ca', score: expect.closeTo((40 + 75 + 80) / 3, 6) },
      { countryId: 'de', score: expect.closeTo((70 + 72 + 62) / 3, 6) },
    ])
  })

  it('weights factors and excludes zero-weight factors entirely', () => {
    const scores = studentLifeIndex(
      records,
      weights({ affordability: 2, safety: 4, openness: 0 }),
    )
    // openness (w=0) must not appear in numerator or denominator.
    expect(scores[0].score).toBeCloseTo((40 * 2 + 75 * 4) / 6, 6)
    expect(scores[1].score).toBeCloseTo((70 * 2 + 72 * 4) / 6, 6)
  })

  it('is unaffected by the score of an excluded factor', () => {
    const tampered = records.map((record) =>
      record.factorId === 'openness' ? { ...record, score: 0 } : record,
    )
    const w = weights({ affordability: 2, safety: 4, openness: 0 })
    expect(studentLifeIndex(tampered, w)).toEqual(studentLifeIndex(records, w))
  })

  it('throws a readable error when every weight is zero', () => {
    expect(() => studentLifeIndex(records, weights())).toThrow(/weight > 0/)
  })
})
