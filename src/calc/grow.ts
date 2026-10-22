/** Monthly rate that compounds to the annual rate. */
export function monthlyRate(annualRate: number): number {
  return (1 + annualRate) ** (1 / 12) - 1
}

/**
 * End-of-month contributions. The starting pot grows for every month.
 * The last contribution does not grow inside the loop.
 */
export function growPot(
  start: number,
  monthlyContribution: number | ((monthIndex: number) => number),
  annualRate: number,
  months: number
): number {
  const rate = monthlyRate(annualRate)
  const contributionAt =
    typeof monthlyContribution === 'function'
      ? monthlyContribution
      : () => monthlyContribution
  let pot = start
  const steps = Math.max(0, months)
  for (let month = 0; month < steps; month++) {
    pot = pot * (1 + rate) + contributionAt(month)
  }
  return pot
}

export function monthsBetweenAges(fromAge: number, toAge: number): number {
  if (toAge <= fromAge) return 0
  return Math.round((toAge - fromAge) * 12)
}

export function addMonthsUtc(start: Date, months: number): Date {
  const date = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1)
  )
  date.setUTCMonth(date.getUTCMonth() + months)
  return date
}
