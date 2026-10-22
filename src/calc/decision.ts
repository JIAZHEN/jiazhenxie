import { employeeNiAnnual, personalAllowance } from './tax'
import { pensionablePay } from './contributions'
import type { ContributionBasis, ContributionMethod } from './types'

export interface DecisionInputs {
  salary: number
  bonus: number
  otherIncome: number // non-savings, non-dividend income only; no NI modelled on it
  giftAidNet: number
  currentWorkplaceAnnual?: number | null // confirmed gross annual payroll amount overrides percentage
  employeePercent: number
  otherRasAnnual?: number // existing personal/SIPP contributions, gross including provider top-up
  employerAnnual: number
  basis: ContributionBasis
  method: ContributionMethod
  extraMonthly: number // gross pension contribution
}

/** England/Wales/NI non-savings income tax, with RAS band extension and ANI allowance. */
export function decisionIncomeTax(taxableIncomeBeforeAllowance: number, ani: number, rasGross = 0) {
  const taxable = Math.max(0, taxableIncomeBeforeAllowance - personalAllowance(ani))
  const basicBand = 37_700 + rasGross
  const higherEnd = 125_140 + rasGross
  return Math.min(taxable, basicBand) * .2 + Math.max(0, Math.min(taxable, higherEnd) - basicBand) * .4 + Math.max(0, taxable - higherEnd) * .45
}

export function pensionDecision(input: DecisionInputs) {
  const earnings = Math.max(0, input.salary) + Math.max(0, input.bonus)
  // Base-salary schemes exclude bonus; qualifying earnings includes annual cash bonus.
  const base = input.basis === 'full' ? Math.max(0, input.salary) : pensionablePay(earnings, 'qualifying')
  const existing = input.currentWorkplaceAnnual != null ? Math.max(0, input.currentWorkplaceAnnual) : base * input.employeePercent / 100
  const giftAidGross = Math.max(0, input.giftAidNet) * 1.25
  const position = (pension: number) => {
    const salarySacrifice = input.method === 'salarySacrifice' ? pension : 0
    const netPay = input.method === 'netPay' ? pension : 0
    const ras = (input.method === 'reliefAtSource' ? pension : 0) + Math.max(0, input.otherRasAnnual ?? 0)
    const income = earnings + input.otherIncome - salarySacrifice - netPay
    const ani = income - ras - giftAidGross
    const tax = decisionIncomeTax(income, ani, ras + giftAidGross)
    // RAS top-up goes to the pot; extra relief can require a claim/tax-code adjustment.
    const payrollTax = ras > 0
      ? decisionIncomeTax(income, income - giftAidGross, giftAidGross)
      : tax
    const ni = employeeNiAnnual(Math.max(0, earnings - salarySacrifice))
    const paid = salarySacrifice + netPay + ras * .8
    return { ani, allowance: personalAllowance(ani), tax, ni, paid, extraRelief: payrollTax - tax, cash: earnings - paid - payrollTax - ni, finalCash: earnings - paid - tax - ni }
  }
  const before = position(existing)
  const after = position(existing + Math.max(0, input.extraMonthly) * 12)
  const extraReliefAnnual = after.extraRelief - before.extraRelief
  const extraNeededFor100k = Math.max(0, before.ani - 100_000)
  const annualPension = existing + Math.max(0, input.extraMonthly) * 12 + input.employerAnnual + Math.max(0, input.otherRasAnnual ?? 0)
  const issues: string[] = []
  if (earnings + input.otherIncome > 200_000) issues.push('Income above £200,000 needs a tapered-allowance assessment that this calculator does not provide.')
  if (input.currentWorkplaceAnnual == null && input.basis === 'qualifying' && input.bonus > 0 && input.salary < 50_270) issues.push('Qualifying-earnings contributions with a lower base salary and a bonus depend on pay-period timing. Use actual payroll contribution figures; this annual model cannot give a reliable personal result for that setup.')
  if (annualPension > 60_000) issues.push('Total pension contributions exceed the standard £60,000 annual allowance. Carry-forward and allowance charges are not modelled; contributions have not been silently capped.')
  if (existing + input.extraMonthly * 12 + Math.max(0, input.otherRasAnnual ?? 0) > earnings) issues.push('The employee pension amount exceeds the employment income entered. Check your figures and scheme limits.')
  if (giftAidGross * .2 > after.tax + .01) issues.push('Gift Aid top-ups exceed the Income Tax in this estimate. Check the donation rules; Capital Gains Tax is not modelled.')
  return { before, after, existing, base, annualPension, extraNeededFor100k, extraReliefAnnual, cashCostMonthly: (before.cash - after.cash) / 12, finalCostMonthly: (before.finalCash - after.finalCash) / 12, issues }
}
