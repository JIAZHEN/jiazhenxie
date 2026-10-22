import { PERSONAL_ALLOWANCE, BASIC_RATE } from '../uk-constants'
import { addMonthsUtc, growPot, monthsBetweenAges } from './grow'
import {
  contributionMethod,
  employerPercentAt,
  lisaAccessible,
  lisaBonusOn,
  lisaPayInMonths,
  monthlyIntoPension,
  pensionInflow,
} from './contributions'
import { takeHomeAnnual } from './tax'
import type { CalculatorInputs, IncomeParts, Projection } from './types'

export interface ProjectOverrides {
  employeePercent?: number
  employerPercent?: number
  retirementAge?: number
  /** Extra Lifetime ISA pay-in from take-home, before the 25% bonus. */
  lisaMonthlyPayIn?: number
}

function statePensionMonthly(weekly: number): number {
  return (Math.max(0, weekly) * 52) / 12
}

/**
 * Pension withdrawal after a simple tax estimate.
 * 25% tax free. The rest is taxed at basic rate once it sits above the
 * personal allowance. State pension, when it is being paid, uses the
 * allowance first. Higher-rate tax in retirement is not modelled.
 */
export function netWorkplaceWithdrawal(
  pot: number,
  swr: number,
  stateAnnualInPayment: number
): {
  grossMonthly: number
  netMonthly: number
  taxAnnual: number
} {
  const withdrawalAnnual = Math.max(0, pot) * swr
  const taxable = withdrawalAnnual * 0.75
  const allowanceLeft = Math.max(
    0,
    PERSONAL_ALLOWANCE - Math.max(0, stateAnnualInPayment)
  )
  const taxAnnual = Math.max(0, taxable - allowanceLeft) * BASIC_RATE
  return {
    grossMonthly: withdrawalAnnual / 12,
    netMonthly: (withdrawalAnnual - taxAnnual) / 12,
    taxAnnual,
  }
}

function savingsIncomeMonthly(pot: number, swr: number): number {
  return (Math.max(0, pot) * swr) / 12
}

export function project(
  inputs: CalculatorInputs,
  overrides: ProjectOverrides = {},
  today: Date = new Date()
): Projection {
  const employeePercent = overrides.employeePercent ?? inputs.employeePercent
  const employerPercent =
    overrides.employerPercent ?? employerPercentFor(inputs, employeePercent)
  const retirementAge = overrides.retirementAge ?? inputs.retirementAge
  const lisaMonthlyPayIn = Math.max(0, overrides.lisaMonthlyPayIn ?? 0)
  const annualReturn = inputs.realReturnBeforePercent / 100
  const swr = inputs.safeWithdrawalPercent / 100
  const months = monthsBetweenAges(inputs.ageNow, retirementAge)
  const method = contributionMethod(inputs)

  let allowanceCapped = false
  const pensionPot = growPot(
    Math.max(0, inputs.currentPensionPot),
    monthIndex => {
      const on = addMonthsUtc(today, monthIndex)
      const slice = monthlyIntoPension(
        inputs,
        employeePercent,
        employerPercent,
        on
      )
      if (slice.allowanceCapped) allowanceCapped = true
      return slice.monthly
    },
    annualReturn,
    months
  )

  const otherPot = growPot(
    Math.max(0, inputs.otherSavingsBalance),
    Math.max(0, inputs.otherMonthlySaving),
    annualReturn,
    months
  )

  const payMonths = lisaPayInMonths(inputs.ageNow, retirementAge)
  const lisaMonthlyIntoPot = lisaMonthlyPayIn + lisaBonusOn(lisaMonthlyPayIn)
  const lisaPot =
    lisaMonthlyPayIn > 0
      ? growPot(
          0,
          monthIndex => (monthIndex < payMonths ? lisaMonthlyIntoPot : 0),
          annualReturn,
          months
        )
      : 0

  const stateAnnual = Math.max(0, inputs.statePensionWeekly) * 52
  const stateMonthly = statePensionMonthly(inputs.statePensionWeekly)
  const bridgeYears = Math.max(0, inputs.statePensionAge - retirementAge)
  const stateInPaymentAtRetirement =
    retirementAge + 1e-9 >= inputs.statePensionAge

  const workplaceAtRetirement = netWorkplaceWithdrawal(
    pensionPot,
    swr,
    stateInPaymentAtRetirement ? stateAnnual : 0
  )
  const workplaceWithState = netWorkplaceWithdrawal(
    pensionPot,
    swr,
    stateAnnual
  )

  const otherMonthly = savingsIncomeMonthly(otherPot, swr)
  const lisaCountsAtRetirement = lisaAccessible(retirementAge)
  const lisaMonthly = lisaCountsAtRetirement
    ? savingsIncomeMonthly(lisaPot, swr)
    : 0
  const lisaAtStateAge = lisaAccessible(
    Math.max(retirementAge, inputs.statePensionAge)
  )
    ? savingsIncomeMonthly(lisaPot, swr)
    : 0

  const stateAtRetirement = stateInPaymentAtRetirement ? stateMonthly : 0
  const atRetirementMonthly =
    workplaceAtRetirement.netMonthly +
    stateAtRetirement +
    otherMonthly +
    lisaMonthly
  const withStatePensionMonthly =
    workplaceWithState.netMonthly + stateMonthly + otherMonthly + lisaAtStateAge

  const parts: IncomeParts = {
    state: stateAtRetirement,
    workplace: workplaceAtRetirement.netMonthly,
    other: otherMonthly + lisaMonthly,
  }

  const inflowNow = pensionInflow(
    inputs,
    employeePercent,
    employerPercent,
    today
  )
  const takeHomeMonthly =
    (takeHomeAnnual(inputs.grossAnnualSalary) -
      inflowNow.effect.takeHomeDropAnnual) /
    12

  return {
    pensionPot,
    otherPot,
    lisaPot,
    lisaCountsAtRetirement,
    workplaceGrossMonthly: workplaceAtRetirement.grossMonthly,
    workplaceNetMonthly: workplaceAtRetirement.netMonthly,
    pensionTaxAnnual: workplaceAtRetirement.taxAnnual,
    stateMonthly: stateAtRetirement,
    otherMonthly: otherMonthly + lisaMonthly,
    atRetirementMonthly,
    withStatePensionMonthly,
    bridgeYears,
    parts,
    employeePercent,
    employerPercent,
    takeHomeDropAnnual: inflowNow.effect.takeHomeDropAnnual,
    intoPensionAnnual: inflowNow.intoPensionAnnual,
    claimableReliefAnnual: inflowNow.effect.claimableReliefAnnual,
    allowanceCapped: allowanceCapped || inflowNow.allowanceCapped,
    takeHomeMonthly,
    method,
  }
}

function employerPercentFor(
  inputs: CalculatorInputs,
  employeePercent: number
): number {
  if (employeePercent === inputs.employeePercent) return inputs.employerPercent
  return employerPercentAt(inputs, employeePercent)
}
