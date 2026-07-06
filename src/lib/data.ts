import { z } from 'zod'
import careerVisaJson from '../data/careerVisa.json'
import configJson from '../data/config.json'
import countriesJson from '../data/countries.json'
import emergingJson from '../data/emerging.json'
import factorsJson from '../data/factors.json'
import pathwaysJson from '../data/pathways.json'
import studentLifeJson from '../data/studentLife.json'
import trueCostJson from '../data/trueCost.json'
import {
  COUNTRY_IDS,
  DEGREE_IDS,
  FACTOR_IDS,
  careerVisaMetricsSchema,
  configSchema,
  countrySchema,
  emergingDestinationSchema,
  factorSchema,
  pathwaySchema,
  studentLifeScoreSchema,
  trueCostSchema,
  type CareerVisaMetrics,
  type Config,
  type Country,
  type EmergingDestination,
  type Factor,
  type Pathway,
  type StudentLifeScore,
  type TrueCost,
} from './schemas'

export interface AppData {
  countries: Country[]
  careerVisa: CareerVisaMetrics[]
  studentLife: StudentLifeScore[]
  factors: Factor[]
  pathways: Pathway[]
  trueCost: TrueCost[]
  emerging: EmergingDestination[]
  config: Config
}

/** Validate one JSON file against its schema; throw a readable, file-named error on failure. */
export function parseDataFile<T>(schema: z.ZodType<T>, raw: unknown, fileName: string): T {
  const result = schema.safeParse(raw)
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.length > 0 ? issue.path.join('.') : '(root)'}: ${issue.message}`)
      .join('\n')
    throw new Error(`Invalid data in ${fileName}:\n${issues}`)
  }
  return result.data
}

function assertComplete<A extends string, B extends string>(
  fileName: string,
  records: { a: A; b: B }[],
  as: readonly A[],
  bs: readonly B[],
  pairLabel: string,
): void {
  const seen = new Set<string>()
  for (const record of records) {
    const key = `${record.a}×${record.b}`
    if (seen.has(key)) {
      throw new Error(`Invalid data in ${fileName}: duplicate ${pairLabel} record for ${key}`)
    }
    seen.add(key)
  }
  const missing: string[] = []
  for (const a of as) {
    for (const b of bs) {
      if (!seen.has(`${a}×${b}`)) missing.push(`${a}×${b}`)
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Invalid data in ${fileName}: missing ${pairLabel} records for ${missing.join(', ')}`,
    )
  }
}

function assertOnePerCountry(fileName: string, countryIds: string[]): void {
  const seen = new Set(countryIds)
  if (countryIds.length !== seen.size) {
    throw new Error(`Invalid data in ${fileName}: duplicate country records`)
  }
  const missing = COUNTRY_IDS.filter((id) => !seen.has(id))
  if (missing.length > 0) {
    throw new Error(`Invalid data in ${fileName}: missing countries ${missing.join(', ')}`)
  }
}

let cache: AppData | null = null

/**
 * Validate every data file through zod once at startup.
 * Throws with a readable, file-named message if anything is malformed or incomplete.
 */
export function loadData(): AppData {
  if (cache) return cache

  const countries = parseDataFile(z.array(countrySchema), countriesJson, 'countries.json')
  const careerVisa = parseDataFile(
    z.array(careerVisaMetricsSchema),
    careerVisaJson,
    'careerVisa.json',
  )
  const studentLife = parseDataFile(
    z.array(studentLifeScoreSchema),
    studentLifeJson,
    'studentLife.json',
  )
  const factors = parseDataFile(z.array(factorSchema), factorsJson, 'factors.json')
  const pathways = parseDataFile(z.array(pathwaySchema), pathwaysJson, 'pathways.json')
  const trueCost = parseDataFile(z.array(trueCostSchema), trueCostJson, 'trueCost.json')
  const emerging = parseDataFile(
    z.array(emergingDestinationSchema),
    emergingJson,
    'emerging.json',
  )
  const config = parseDataFile(configSchema, configJson, 'config.json')

  assertOnePerCountry(
    'countries.json',
    countries.map((country) => country.id),
  )
  assertOnePerCountry(
    'pathways.json',
    pathways.map((pathway) => pathway.countryId),
  )
  assertOnePerCountry(
    'trueCost.json',
    trueCost.map((record) => record.countryId),
  )
  assertComplete(
    'careerVisa.json',
    careerVisa.map((record) => ({ a: record.countryId, b: record.degreeId })),
    COUNTRY_IDS,
    DEGREE_IDS,
    'country×degree',
  )
  assertComplete(
    'studentLife.json',
    studentLife.map((record) => ({ a: record.countryId, b: record.factorId })),
    COUNTRY_IDS,
    FACTOR_IDS,
    'country×factor',
  )

  const seenFactors = new Set(factors.map((factor) => factor.id))
  const missingFactors = FACTOR_IDS.filter((id) => !seenFactors.has(id))
  if (missingFactors.length > 0) {
    throw new Error(`Invalid data in factors.json: missing factors ${missingFactors.join(', ')}`)
  }

  for (const degreeId of DEGREE_IDS) {
    const count = emerging.filter((record) => record.degreeId === degreeId).length
    if (count < 4 || count > 5) {
      throw new Error(
        `Invalid data in emerging.json: expected 4–5 destinations for ${degreeId}, found ${count}`,
      )
    }
  }

  cache = { countries, careerVisa, studentLife, factors, pathways, trueCost, emerging, config }
  return cache
}
