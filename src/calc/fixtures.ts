import { FULL_NEW_STATE_PENSION_WEEKLY } from '../uk-constants'
import type { CalculatorInputs } from './types'

/** Fixed clock so salary-sacrifice NI cap tests do not depend on the machine date. */
export const TEST_TODAY = new Date('2026-09-27T00:00:00Z')

export function baseInputs(
  overrides: Partial<CalculatorInputs> = {}
): CalculatorInputs {
  return {
    ageNow: 35,
    retirementAge: 67,
    grossAnnualSalary: 30_000,
    targetMonthlyIncome: 2_000,
    employeePercent: 5,
    employerPercent: 3,
    matchRule: 'none',
    matchUpToPercent: 6,
    salarySacrifice: 'no',
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
    ...overrides,
  }
}
