import {
  ADDITIONAL_RATE,
  BASIC_RATE,
  BASIC_RATE_LIMIT,
  EMPLOYEE_NI_MAIN_RATE,
  EMPLOYEE_NI_PRIMARY_THRESHOLD,
  EMPLOYEE_NI_UPPER_RATE,
  EMPLOYEE_NI_UPPER_THRESHOLD,
  EMPLOYER_NI_RATE,
  EMPLOYER_NI_THRESHOLD,
  HIGHER_RATE,
  HIGHER_RATE_LIMIT,
  PERSONAL_ALLOWANCE,
  PERSONAL_ALLOWANCE_TAPER_START,
  SALARY_SACRIFICE_NI_CAP_START,
  SALARY_SACRIFICE_NI_SAVINGS_CAP,
} from '../uk-constants'

/** Width of the basic-rate band of taxable income. */
export const BASIC_RATE_BAND = BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE

export function personalAllowance(grossAnnual: number): number {
  if (grossAnnual <= PERSONAL_ALLOWANCE_TAPER_START) return PERSONAL_ALLOWANCE
  const reduction = (grossAnnual - PERSONAL_ALLOWANCE_TAPER_START) / 2
  return Math.max(0, PERSONAL_ALLOWANCE - reduction)
}

/** Income tax for a full year on employment income. No other reliefs. */
export function incomeTaxAnnual(grossAnnual: number): number {
  const taxable = Math.max(0, grossAnnual - personalAllowance(grossAnnual))
  const basic = Math.min(taxable, BASIC_RATE_BAND)
  const higher = Math.max(
    0,
    Math.min(taxable, HIGHER_RATE_LIMIT) - BASIC_RATE_BAND
  )
  const additional = Math.max(0, taxable - HIGHER_RATE_LIMIT)
  return (
    basic * BASIC_RATE + higher * HIGHER_RATE + additional * ADDITIONAL_RATE
  )
}

/** Tax on one extra pound of gross income. Handles the personal-allowance taper. */
export function marginalIncomeTaxRate(grossAnnual: number): number {
  if (grossAnnual < 0) return 0
  return incomeTaxAnnual(grossAnnual + 1) - incomeTaxAnnual(grossAnnual)
}

export function employeeNiAnnual(grossAnnual: number): number {
  const mainBand = Math.max(
    0,
    Math.min(grossAnnual, EMPLOYEE_NI_UPPER_THRESHOLD) -
      EMPLOYEE_NI_PRIMARY_THRESHOLD
  )
  const upper = Math.max(0, grossAnnual - EMPLOYEE_NI_UPPER_THRESHOLD)
  return mainBand * EMPLOYEE_NI_MAIN_RATE + upper * EMPLOYEE_NI_UPPER_RATE
}

export function marginalEmployeeNiRate(grossAnnual: number): number {
  if (grossAnnual < EMPLOYEE_NI_PRIMARY_THRESHOLD) return 0
  if (grossAnnual < EMPLOYEE_NI_UPPER_THRESHOLD) return EMPLOYEE_NI_MAIN_RATE
  return EMPLOYEE_NI_UPPER_RATE
}

export function employerNiAnnual(grossAnnual: number): number {
  return Math.max(0, grossAnnual - EMPLOYER_NI_THRESHOLD) * EMPLOYER_NI_RATE
}

export function salarySacrificeNiCapApplies(on: Date): boolean {
  const start = Date.parse(`${SALARY_SACRIFICE_NI_CAP_START}T00:00:00Z`)
  return on.getTime() >= start
}

/** Slice of salary sacrifice that still reduces National Insurance. */
export function niRelievedSacrifice(annualSacrifice: number, on: Date): number {
  const sacrifice = Math.max(0, annualSacrifice)
  if (!salarySacrificeNiCapApplies(on)) return sacrifice
  return Math.min(sacrifice, SALARY_SACRIFICE_NI_SAVINGS_CAP)
}

export function takeHomeAnnual(grossAnnual: number): number {
  return (
    grossAnnual - incomeTaxAnnual(grossAnnual) - employeeNiAnnual(grossAnnual)
  )
}
