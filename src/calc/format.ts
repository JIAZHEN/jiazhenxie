/** Pounds at or above £100 are whole pounds. Smaller amounts keep pence. */
export function formatGbp(amount: number): string {
  const abs = Math.abs(amount)
  const digits = Math.round(abs * 100) / 100 < 100 ? 2 : 0
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount)
}

export function formatPercent(percent: number): string {
  const rounded = Math.round(percent * 10) / 10
  if (Math.abs(rounded - Math.round(rounded)) < 0.05)
    return `${Math.round(rounded)}%`
  return `${rounded.toFixed(1)}%`
}

/** Future cash amount beside a real-terms figure. */
export function nominalFromReal(
  real: number,
  years: number,
  inflationAnnual: number
): number {
  if (years <= 0) return real
  return real * (1 + inflationAnnual) ** years
}
