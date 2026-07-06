import type { CareerVisaMetrics, CountryId, FactorId, StudentLifeScore } from './schemas'

export interface CountryScore {
  countryId: CountryId
  score: number
}

export type FactorWeights = Record<FactorId, number>

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Min-max normalise a set to 0–100 (0 = worst in set, 100 = best in set).
 * When every value is identical there is no spread to rank; all map to 50.
 */
export function minMax(values: number[]): number[] {
  if (values.length === 0) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return values.map(() => 50)
  return values.map((value) => ((value - min) / (max - min)) * 100)
}

/** Min-max normalise where lower raw values are better (fewer years → higher score). */
export function minMaxInverted(values: number[]): number[] {
  return minMax(values).map((score) => 100 - score)
}

/** Weights of the four Career & Visa Score components (Graph 1 X axis). */
export const X_WEIGHTS = {
  jobDemand: 0.35,
  visaOpenness: 0.25,
  postStudyScore: 0.2,
  prScore: 0.2,
} as const

export interface CareerVisaComponents {
  countryId: CountryId
  jobDemand: number
  visaOpenness: number
  postStudyScore: number
  prScore: number
  score: number
}

/**
 * Graph 1 X-axis with its four components, computed across the country set
 * for one degree:
 *   postStudyScore = clamp(postStudyWorkYears / 3, 0, 1) × 100
 *   prScore        = minMaxInverted(prPathwayYears)
 *   X = 0.35·jobDemand + 0.25·visaOpenness + 0.20·postStudyScore + 0.20·prScore
 */
export function careerVisaBreakdown(records: CareerVisaMetrics[]): CareerVisaComponents[] {
  const prScores = minMaxInverted(records.map((record) => record.prPathwayYears))
  return records.map((record, index) => {
    const postStudyScore = clamp(record.postStudyWorkYears / 3, 0, 1) * 100
    const prScore = prScores[index]
    return {
      countryId: record.countryId,
      jobDemand: record.jobDemand,
      visaOpenness: record.visaOpenness,
      postStudyScore,
      prScore,
      score:
        X_WEIGHTS.jobDemand * record.jobDemand +
        X_WEIGHTS.visaOpenness * record.visaOpenness +
        X_WEIGHTS.postStudyScore * postStudyScore +
        X_WEIGHTS.prScore * prScore,
    }
  })
}

/** Graph 1 X-axis — the Career & Visa Score alone; see careerVisaBreakdown. */
export function careerVisaScore(records: CareerVisaMetrics[]): CountryScore[] {
  return careerVisaBreakdown(records).map(({ countryId, score }) => ({ countryId, score }))
}

/**
 * Graph 1 Y-axis, computed across the country set for one degree:
 *   roiRaw = (medianSalaryY1PppUsd × 5) / totalDegreeCostUsd
 *   Y = minMax(roiRaw)
 */
export function roiScore(records: CareerVisaMetrics[]): CountryScore[] {
  const raw = records.map(
    (record) => (record.medianSalaryY1PppUsd * 5) / record.totalDegreeCostUsd,
  )
  const normalised = minMax(raw)
  return records.map((record, index) => ({
    countryId: record.countryId,
    score: normalised[index],
  }))
}

/**
 * Graph 2 — Student Life Index:
 *   SLI = Σ(score_f × w_f) / Σ(w_f), factors with w = 0 excluded entirely.
 * Throws when no factor carries a positive weight — the UI must keep ≥1 slider above 0.
 */
export function studentLifeIndex(
  scores: StudentLifeScore[],
  weights: FactorWeights,
): CountryScore[] {
  const totals = new Map<CountryId, { weighted: number; weightSum: number }>()
  for (const record of scores) {
    const weight = weights[record.factorId]
    if (weight <= 0) continue
    const entry = totals.get(record.countryId) ?? { weighted: 0, weightSum: 0 }
    entry.weighted += record.score * weight
    entry.weightSum += weight
    totals.set(record.countryId, entry)
  }
  if (totals.size === 0) {
    throw new Error('studentLifeIndex requires at least one factor with weight > 0')
  }
  return [...totals.entries()].map(([countryId, { weighted, weightSum }]) => ({
    countryId,
    score: weighted / weightSum,
  }))
}
