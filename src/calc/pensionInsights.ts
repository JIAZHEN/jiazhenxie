import { CHILD_BENEFIT_CHARGE_START, CHILD_BENEFIT_CHARGE_END, CHILD_BENEFIT_CHARGE_STEP, CHILD_BENEFIT_FIRST_WEEKLY, CHILD_BENEFIT_OTHER_WEEKLY, BENEFIT_WEEKS, CHILDCARE_INCOME_LIMIT, PERSONAL_ALLOWANCE_TAPER_START, HIGHER_RATE_LIMIT, SALARY_SACRIFICE_NI_SAVINGS_CAP } from '../uk-constants'
import { employeeNiAnnual, employerNiAnnual } from './tax'
export function exchangeRate(pensionIncrease: number, cashCost: number) {
  return pensionIncrease === 0 ? null : cashCost > 0 ? { kind: 'ratio' as const, value: pensionIncrease / cashCost } : { kind: cashCost < 0 ? 'gain' as const : 'free' as const, value: Math.abs(cashCost) }
}
export function incomeCliffs(ani: number) {
  return { childBenefit: ani >= CHILD_BENEFIT_CHARGE_START && ani <= CHILD_BENEFIT_CHARGE_END, childcareLost: ani > CHILDCARE_INCOME_LIMIT, allowanceTaper: ani > PERSONAL_ALLOWANCE_TAPER_START && ani <= HIGHER_RATE_LIMIT }
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
