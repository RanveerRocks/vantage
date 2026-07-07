import type { TrueCost } from './schemas'

/**
 * Estimated first-year cost: the four per-year items plus one-time visa fees.
 * Full-degree totals depend on programme length, so the True Cost view
 * compares first-year figures instead of assuming a duration.
 */
export function firstYearCostUsd(record: TrueCost): number {
  return (
    record.tuitionPerYearUsd +
    record.livingPerYearUsd +
    record.insurancePerYearUsd +
    record.flightsPerYearUsd +
    record.visaFeesOneTimeUsd
  )
}
