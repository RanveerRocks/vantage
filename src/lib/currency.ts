export type Currency = 'inr' | 'usd'

const INR_PER_LAKH = 100_000

export function usdToInrLakh(usd: number, usdToInrRate: number): number {
  return (usd * usdToInrRate) / INR_PER_LAKH
}

/**
 * Format a USD amount as ₹ lakh, e.g. "₹8.4 L".
 * One decimal below 100 lakh; whole numbers from 100 lakh up.
 */
export function formatInrLakh(usd: number, usdToInrRate: number): string {
  const lakh = usdToInrLakh(usd, usdToInrRate)
  const rendered = lakh >= 100 ? Math.round(lakh).toString() : lakh.toFixed(1)
  return `₹${rendered} L`
}

/** Format a USD amount with en-US grouping, e.g. "$52,000". */
export function formatUsd(usd: number): string {
  return `$${Math.round(usd).toLocaleString('en-US')}`
}

export function formatMoney(usd: number, currency: Currency, usdToInrRate: number): string {
  return currency === 'inr' ? formatInrLakh(usd, usdToInrRate) : formatUsd(usd)
}
