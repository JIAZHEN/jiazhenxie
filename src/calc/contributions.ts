import {
  BASIC_RATE,
  LISA_ANNUAL_ALLOWANCE,
  LISA_BONUS_RATE,
  LISA_OPEN_BEFORE_AGE,
  LISA_PAY_IN_UNTIL_AGE,
  LISA_WITHDRAW_FROM_AGE,
  MINIMUM_WAGE_HOURLY,
  PENSION_ANNUAL_ALLOWANCE,
  QUALIFYING_EARNINGS_LOWER,
  QUALIFYING_EARNINGS_UPPER,
} from '../uk-constants'
import type {
  CalculatorInputs,
  ContributionMethod,
  MinimumWageStatus,
} from './types'
import {
  employeeNiAnnual,
  employerNiAnnual,
  incomeTaxAnnual,
  niRelievedSacrifice,
} from './tax'

export const MAX_SENSIBLE_EMPLOYEE_PERCENT = 40
export const HONEST_EMPLOYEE_PERCENT = 20
export const HONEST_RETIREMENT_AGE = 70
export const MAX_RETIREMENT_AGE = 75

/** Gap within 25p a month counts as closed. Whole-pound display would hide it anyway. */
export const GAP_TOLERANCE_MONTHLY = 0.25

export function pensionablePay(
  salary: number,
  basis: CalculatorInputs['contributionBasis']
): number {
  const gross = Math.max(0, salary)
  if (basis === 'full') return gross
  return Math.max(
    0,
    Math.min(gross, QUALIFYING_EARNINGS_UPPER) - QUALIFYING_EARNINGS_LOWER
  )
}

/**
 * Employer percent at a new employee percent.
 * "Matches up to X%" means each extra 1% you pay is matched by 1% from them, until X.
 * The employer percent you typed is what they pay at your current employee percent.
 * "None" and "other" stay on the percent you typed.
 */
export function employerPercentAt(
  inputs: Pick<
    CalculatorInputs,
    'employeePercent' | 'employerPercent' | 'matchRule' | 'matchUpToPercent'
  >,
  newEmployeePercent: number
): number {
  if (inputs.matchRule !== 'upTo') return inputs.employerPercent
  const cap = inputs.matchUpToPercent
  const currentEmployee = inputs.employeePercent
  const currentEmployer = inputs.employerPercent
  if (newEmployeePercent >= currentEmployee) {
    const room = Math.max(0, cap - currentEmployee)
    const increase = Math.min(newEmployeePercent - currentEmployee, room)
    return currentEmployer + increase
  }
  if (currentEmployee > cap) {
    const unmatched = currentEmployee - cap
    const drop = currentEmployee - newEmployeePercent
    const matchedDrop = Math.max(0, drop - unmatched)
    return Math.max(0, currentEmployer - matchedDrop)
  }
  return Math.max(0, currentEmployer - (currentEmployee - newEmployeePercent))
}

export function contributionMethod(
  inputs: Pick<CalculatorInputs, 'salarySacrifice' | 'taxRelief'>
): ContributionMethod {
  if (inputs.salarySacrifice === 'yes') return 'salarySacrifice'
  if (inputs.taxRelief === 'netPay') return 'netPay'
  return 'reliefAtSource'
}

export interface PaydayEffect {
  takeHomeDropAnnual: number
  employeeIntoPensionAnnual: number
  claimableReliefAnnual: number
  employerNiSavingAnnual: number
}

export function paydayEffect(
  grossSalary: number,
  employeeGrossAnnual: number,
  method: ContributionMethod,
  on: Date
): PaydayEffect {
  const gross = Math.max(0, employeeGrossAnnual)
  const salary = Math.max(0, grossSalary)
  if (method === 'reliefAtSource') {
    const entitled =
      incomeTaxAnnual(salary) - incomeTaxAnnual(Math.max(0, salary - gross))
    const basicRelief = gross * BASIC_RATE
    return {
      takeHomeDropAnnual: gross * (1 - BASIC_RATE),
      employeeIntoPensionAnnual: gross,
      claimableReliefAnnual: Math.max(0, entitled - basicRelief),
      employerNiSavingAnnual: 0,
    }
  }

  const taxSaving =
    incomeTaxAnnual(salary) - incomeTaxAnnual(Math.max(0, salary - gross))
  if (method === 'netPay') {
    return {
      takeHomeDropAnnual: gross - taxSaving,
      employeeIntoPensionAnnual: gross,
      claimableReliefAnnual: 0,
      employerNiSavingAnnual: 0,
    }
  }

  const niEligible = niRelievedSacrifice(gross, on)
  const niSaving =
    employeeNiAnnual(salary) -
    employeeNiAnnual(Math.max(0, salary - niEligible))
  const employerNiSaving =
    employerNiAnnual(salary) -
    employerNiAnnual(Math.max(0, salary - niEligible))
  return {
    takeHomeDropAnnual: gross - taxSaving - niSaving,
    employeeIntoPensionAnnual: gross,
    claimableReliefAnnual: 0,
    employerNiSavingAnnual: employerNiSaving,
  }
}

export interface PensionInflow {
  employeeGrossAnnual: number
  employerAnnual: number
  intoPensionAnnual: number
  effect: PaydayEffect
  allowanceCapped: boolean
}

export function pensionInflow(
  inputs: CalculatorInputs,
  employeePercent: number,
  employerPercent: number,
  on: Date
): PensionInflow {
  const base = pensionablePay(
    inputs.grossAnnualSalary,
    inputs.contributionBasis
  )
  const employeeGrossAnnual = (base * Math.max(0, employeePercent)) / 100
  const employerAnnual = (base * Math.max(0, employerPercent)) / 100
  const method = contributionMethod(inputs)
  const effect = paydayEffect(
    inputs.grossAnnualSalary,
    employeeGrossAnnual,
    method,
    on
  )
  const niAdd = inputs.employerPassesOnNiSaving
    ? effect.employerNiSavingAnnual
    : 0
  const raw = effect.employeeIntoPensionAnnual + employerAnnual + niAdd
  const allowanceCapped = raw > PENSION_ANNUAL_ALLOWANCE
  return {
    employeeGrossAnnual,
    employerAnnual,
    intoPensionAnnual: Math.min(raw, PENSION_ANNUAL_ALLOWANCE),
    effect,
    allowanceCapped,
  }
}

export function monthlyIntoPension(
  inputs: CalculatorInputs,
  employeePercent: number,
  employerPercent: number,
  on: Date
): { monthly: number; allowanceCapped: boolean } {
  const inflow = pensionInflow(inputs, employeePercent, employerPercent, on)
  return {
    monthly: inflow.intoPensionAnnual / 12,
    allowanceCapped: inflow.allowanceCapped,
  }
}

export function minimumWageStatus(
  inputs: CalculatorInputs,
  employeeGrossAnnual: number
): MinimumWageStatus {
  if (inputs.salarySacrifice !== 'yes') return 'hidden'
  if (inputs.hoursPerWeek == null || inputs.hoursPerWeek <= 0) return 'generic'
  const floor = inputs.hoursPerWeek * 52 * MINIMUM_WAGE_HOURLY
  const left = inputs.grossAnnualSalary - employeeGrossAnnual
  return left + 0.005 < floor ? 'breach' : 'ok'
}

export function lisaAllowed(ageNow: number): boolean {
  return ageNow < LISA_OPEN_BEFORE_AGE
}

export function lisaPayInMonths(ageNow: number, retirementAge: number): number {
  const stopAge = Math.min(LISA_PAY_IN_UNTIL_AGE, retirementAge)
  if (stopAge <= ageNow) return 0
  return Math.round((stopAge - ageNow) * 12)
}

export function lisaMonthlyCap(): number {
  return LISA_ANNUAL_ALLOWANCE / 12
}

export function lisaBonusOn(monthlyPayIn: number): number {
  return monthlyPayIn * LISA_BONUS_RATE
}

export function lisaAccessible(age: number): boolean {
  return age >= LISA_WITHDRAW_FROM_AGE
}

export function meetsTarget(
  incomeMonthly: number,
  targetMonthly: number
): boolean {
  return incomeMonthly + 0.001 >= targetMonthly - GAP_TOLERANCE_MONTHLY
}
