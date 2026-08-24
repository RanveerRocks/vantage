import { z } from 'zod'

export const COUNTRY_IDS = ['us', 'uk', 'ca', 'au', 'de', 'ie', 'nl', 'sg'] as const
export const countryIdSchema = z.enum(COUNTRY_IDS)
export type CountryId = z.infer<typeof countryIdSchema>

export const DEGREE_IDS = [
  'cs-it',
  'engineering',
  'business-finance',
  'economics',
  'data-science',
  'health-life-sciences',
  'design-media',
  'humanities-social',
] as const
export const degreeIdSchema = z.enum(DEGREE_IDS)
export type DegreeId = z.infer<typeof degreeIdSchema>

export const FACTOR_IDS = [
  'affordability',
  'safety',
  'openness',
  'work-rights',
  'healthcare',
  'language',
  'community',
  'political-climate',
  'climate-lifestyle',
] as const
export const factorIdSchema = z.enum(FACTOR_IDS)
export type FactorId = z.infer<typeof factorIdSchema>

export const confidenceSchema = z.enum(['high', 'medium', 'low', 'placeholder'])
export type Confidence = z.infer<typeof confidenceSchema>

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be an ISO date (YYYY-MM-DD)')
const score0to100 = z.number().min(0).max(100)

export const sourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  lastUpdated: isoDate,
})
export type Source = z.infer<typeof sourceSchema>

export const countrySchema = z.object({
  id: countryIdSchema,
  name: z.string().min(1),
  flag: z.string().min(1),
  currency: z.string().min(1),
  blurb: z.string().min(1),
})
export type Country = z.infer<typeof countrySchema>

export const careerVisaMetricsSchema = z.object({
  countryId: countryIdSchema,
  degreeId: degreeIdSchema,
  jobDemand: score0to100,
  visaOpenness: score0to100,
  postStudyWorkYears: z.number().min(0),
  prPathwayYears: z.number().min(0),
  medianSalaryY1PppUsd: z.number().positive(), // year-1 total comp, nominal USD (legacy key name)
  medianSalaryY5Usd: z.number().positive(), // year-5 total comp, nominal USD
  totalDegreeCostUsd: z.number().positive(),
  narrative: z.string().min(1),
  confidence: confidenceSchema,
  sources: z.array(sourceSchema),
})
export type CareerVisaMetrics = z.infer<typeof careerVisaMetricsSchema>

export const studentLifeScoreSchema = z.object({
  countryId: countryIdSchema,
  factorId: factorIdSchema,
  score: score0to100,
  blurb: z.string().min(1),
  confidence: confidenceSchema,
  sources: z.array(sourceSchema),
})
export type StudentLifeScore = z.infer<typeof studentLifeScoreSchema>

export const factorSchema = z.object({
  id: factorIdSchema,
  name: z.string().min(1),
  description: z.string().min(1),
})
export type Factor = z.infer<typeof factorSchema>

export const pathwayStageSchema = z.object({
  label: z.string().min(1),
  years: z.number().min(0),
  description: z.string().min(1),
})
export type PathwayStage = z.infer<typeof pathwayStageSchema>

export const pathwaySchema = z.object({
  countryId: countryIdSchema,
  stages: z.array(pathwayStageSchema).min(1),
  totalYearsToPr: z.number().min(0),
  confidence: confidenceSchema,
  sources: z.array(sourceSchema),
})
export type Pathway = z.infer<typeof pathwaySchema>

export const trueCostSchema = z.object({
  countryId: countryIdSchema,
  tuitionPerYearUsd: z.number().min(0),
  livingPerYearUsd: z.number().min(0),
  insurancePerYearUsd: z.number().min(0),
  visaFeesOneTimeUsd: z.number().min(0),
  flightsPerYearUsd: z.number().min(0),
  hiddenNotes: z.array(z.string().min(1)),
  confidence: confidenceSchema,
  sources: z.array(sourceSchema),
})
export type TrueCost = z.infer<typeof trueCostSchema>

export const emergingDestinationSchema = z.object({
  degreeId: degreeIdSchema,
  country: z.string().min(1),
  flag: z.string().min(1),
  pitch: z.string().min(1),
  links: z.array(sourceSchema),
})
export type EmergingDestination = z.infer<typeof emergingDestinationSchema>

export const configSchema = z.object({
  usdToInr: z.number().positive(),
  ratesLastUpdated: isoDate,
})
export type Config = z.infer<typeof configSchema>
