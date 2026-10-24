import { CHILD_BENEFIT_CHARGE_START, CHILD_BENEFIT_CHARGE_END, CHILD_BENEFIT_CHARGE_STEP, CHILD_BENEFIT_FIRST_WEEKLY, CHILD_BENEFIT_OTHER_WEEKLY, BENEFIT_WEEKS, CHILDCARE_INCOME_LIMIT, PERSONAL_ALLOWANCE_TAPER_START, HIGHER_RATE_LIMIT, SALARY_SACRIFICE_NI_SAVINGS_CAP, INCOME_LINE_TOLERANCE } from '../uk-constants'
import { employeeNiAnnual, employerNiAnnual } from './tax'
export function exchangeRate(pensionIncrease: number, cashCost: number) {
  return pensionIncrease === 0 ? null : cashCost > 0 ? { kind: 'ratio' as const, value: pensionIncrease / cashCost } : { kind: cashCost < 0 ? 'gain' as const : 'free' as const, value: Math.abs(cashCost) }
}
export function incomeCliffs(ani: number) {
  return { childBenefit: ani >= CHILD_BENEFIT_CHARGE_START && ani <= CHILD_BENEFIT_CHARGE_END, childcareLost: aboveIncomeLine(ani, CHILDCARE_INCOME_LIMIT), allowanceTaper: aboveIncomeLine(ani, PERSONAL_ALLOWANCE_TAPER_START) && ani <= HIGHER_RATE_LIMIT }
}
export function childBenefitCharge(ani: number, children: number) {
  const benefit = children < 1 ? 0 : (CHILD_BENEFIT_FIRST_WEEKLY + (Math.floor(children) - 1) * CHILD_BENEFIT_OTHER_WEEKLY) * BENEFIT_WEEKS
  return benefit * Math.min(100, Math.max(0, Math.floor((ani - CHILD_BENEFIT_CHARGE_START) / CHILD_BENEFIT_CHARGE_STEP))) / 100
}
export function niSavingAffected(salary: number, sacrifice: number) {
  const cappedPay = Math.max(0, salary - Math.min(sacrifice, SALARY_SACRIFICE_NI_SAVINGS_CAP))
  const pay = Math.max(0, salary - sacrifice)
  return { employee: employeeNiAnnual(cappedPay) - employeeNiAnnual(pay), employer: employerNiAnnual(cappedPay) - employerNiAnnual(pay) }
}

/** Presentation tolerance only. Payroll and benefit charge calculations stay exact. */
export function aboveIncomeLine(ani: number, line = CHILDCARE_INCOME_LIMIT) {
  return ani - line > INCOME_LINE_TOLERANCE
}

/** Whole-pound sacrifice first, then round percentage upwards to two decimal places.
 * Upward percentage rounding ensures the displayed and stored value reaches the line.
 */
export function sacrificeToIncomeLine(salary: number, pensionableSalary: number, line = CHILDCARE_INCOME_LIMIT) {
  const annual = Math.ceil(Math.max(0, salary - line))
  if (pensionableSalary <= 0) return null
  const percent = Math.ceil(annual / pensionableSalary * 10_000) / 100
  return percent <= 100 ? { annual, percent } : null
}

/** Card state is separate from the exact charge calculation. */
export function childBenefitCard(beforeAni: number, afterAni: number, children: number) {
  if (children <= 0) {
    const inBand = (ani: number) => ani >= CHILD_BENEFIT_CHARGE_START && ani <= CHILD_BENEFIT_CHARGE_END
    return { kind: inBand(beforeAni) || inBand(afterAni) ? 'prompt' as const : 'hidden' as const }
  }
  if (beforeAni <= CHILD_BENEFIT_CHARGE_START && afterAni <= CHILD_BENEFIT_CHARGE_START) return { kind: 'hidden' as const }
  if (beforeAni >= CHILD_BENEFIT_CHARGE_END && afterAni >= CHILD_BENEFIT_CHARGE_END) {
    return { kind: 'full' as const, aboveBefore: beforeAni - CHILD_BENEFIT_CHARGE_END, aboveAfter: afterAni - CHILD_BENEFIT_CHARGE_END }
  }
  return { kind: 'partial' as const }
}
