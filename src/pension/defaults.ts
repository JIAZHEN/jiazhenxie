import { FULL_NEW_STATE_PENSION_WEEKLY } from '../uk-constants'
import type { CalculatorInputs } from '../calc/types'

export const defaultInputs: CalculatorInputs = {
  ageNow: 35,
  retirementAge: 67,
  grossAnnualSalary: 32_000,
  targetMonthlyIncome: 1_500,
  employeePercent: 5,
  employerPercent: 3,
  matchRule: 'none',
  matchUpToPercent: 6,
  salarySacrifice: 'unknown',
  taxRelief: 'reliefAtSource',
  contributionBasis: 'qualifying',
  currentPensionPot: 0,
  employerPassesOnNiSaving: false,
  hoursPerWeek: null,
  statePensionWeekly: FULL_NEW_STATE_PENSION_WEEKLY,
  statePensionAge: 67,
  otherSavingsBalance: 0,
  otherMonthlySaving: 0,
  realReturnBeforePercent: 3,
  realReturnAfterPercent: 2,
  safeWithdrawalPercent: 4,
  inflationPercent: 2.5,
  showNominal: false,
}

export const STORAGE_KEY = 'payday-to-pension-inputs'
