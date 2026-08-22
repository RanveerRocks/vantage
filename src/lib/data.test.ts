import { describe, expect, it } from 'vitest'
import { loadData, parseDataFile } from './data'
import { careerVisaMetricsSchema } from './schemas'

describe('loadData', () => {
  it('validates every data file and returns the expected record counts', () => {
    const data = loadData()
    expect(data.countries).toHaveLength(8)
    expect(data.careerVisa).toHaveLength(64)
    expect(data.studentLife).toHaveLength(72)
    expect(data.factors).toHaveLength(9)
    expect(data.pathways).toHaveLength(8)
    expect(data.trueCost).toHaveLength(8)
    expect(data.emerging).toHaveLength(40)
    expect(data.config.usdToInr).toBeGreaterThan(0)
  })

  it('backs every curated (non-placeholder) record with a real, non-sample source', () => {
    const data = loadData()
    const records = [...data.careerVisa, ...data.studentLife, ...data.pathways, ...data.trueCost]
    const curated = records.filter((record) => record.confidence !== 'placeholder')
    for (const record of curated) {
      expect(record.sources.length).toBeGreaterThan(0)
      expect(record.sources.every((source) => !source.url.includes('example.com'))).toBe(true)
    }
  })
})

describe('parseDataFile', () => {
  it('throws a readable error naming the file and the failing field', () => {
    const bad = { countryId: 'us', degreeId: 'cs-it', jobDemand: 150 }
    expect(() => parseDataFile(careerVisaMetricsSchema, bad, 'careerVisa.json')).toThrow(
      /careerVisa\.json/,
    )
    expect(() => parseDataFile(careerVisaMetricsSchema, bad, 'careerVisa.json')).toThrow(
      /jobDemand/,
    )
  })
})
