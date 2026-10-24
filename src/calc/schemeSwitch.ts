import { childBenefitCharge } from './pensionInsights'
import { pensionDecision } from './decision'
import { pensionablePay } from './contributions'
import { employerNiAnnual } from './tax'
import type { ContributionBasis, ContributionMethod } from './types'

export interface SchemeSwitchInputs {
  children?: number
  salary: number
  currentMethod: Exclude<ContributionMethod, 'salarySacrifice'>
  currentGrossMonthly: number
  employerMonthly: number
  targetBasis?: ContributionBasis
  employerAfterMonthly?: number
  targetPercent: number
  niTopUpPercent: number // direct % of sacrifice, retained for existing model callers
  employerNiSharePercent?: number // share of actual employer NI savings returned to pension
}

/** Compare two schemes at the same salary, with existing employer money retained. */
export function compareSchemeSwitch(input: SchemeSwitchInputs) {
  const amounts = [input.children ?? 0, input.salary, input.currentGrossMonthly, input.employerMonthly, input.employerAfterMonthly ?? input.employerMonthly, input.targetPercent, input.niTopUpPercent, input.employerNiSharePercent ?? 0]
  if (amounts.some(value => !Number.isFinite(value) || value < 0) || input.targetPercent > 100 || input.niTopUpPercent > 15 || (input.employerNiSharePercent ?? 0) > 100) {
    return { beforeAni: 0, afterAni: 0, childBenefitSavingMonthly: 0, incomeTaxSavingMonthly: 0, employeeNiSavingMonthly: 0, beforeTakeHomeMonthly: 0, afterTakeHomeMonthly: 0, beforeMonthly: 0, afterMonthly: 0, extraMonthly: 0, cashCostMonthly: 0, finalCostMonthly: 0, sacrificeMonthly: 0, topUpMonthly: 0, issues: ['Enter finite, non-negative amounts and valid contribution percentages.'] }
  }
  const common = { salary: input.salary, bonus: 0, otherIncome: 0, giftAidNet: 0,
    employeePercent: 0, employerAnnual: input.employerMonthly * 12,
    basis: 'full' as const, extraMonthly: 0 }
  const before = pensionDecision({ ...common, method: input.currentMethod,
    currentWorkplaceAnnual: input.currentGrossMonthly * 12 })
  const sacrificeMonthly = pensionablePay(input.salary, input.targetBasis ?? 'full') * input.targetPercent / 1200
  const employerNiSavingMonthly = (employerNiAnnual(input.salary) - employerNiAnnual(Math.max(0, input.salary - sacrificeMonthly * 12))) / 12
  const topUpMonthly = input.employerNiSharePercent != null ? employerNiSavingMonthly * input.employerNiSharePercent / 100 : sacrificeMonthly * input.niTopUpPercent / 100
  const after = pensionDecision({ ...common, method: 'salarySacrifice',
    currentWorkplaceAnnual: sacrificeMonthly * 12,
    employerAnnual: ((input.employerAfterMonthly ?? input.employerMonthly) + topUpMonthly) * 12 })
  const childBenefitSavingMonthly = (childBenefitCharge(before.before.ani, input.children ?? 0) - childBenefitCharge(after.before.ani, input.children ?? 0)) / 12
  return {
    beforeAni: before.before.ani, afterAni: after.before.ani, childBenefitSavingMonthly,
    incomeTaxSavingMonthly: (before.before.tax - after.before.tax) / 12,
    employeeNiSavingMonthly: (before.before.ni - after.before.ni) / 12,
    beforeTakeHomeMonthly: (before.before.cash - childBenefitCharge(before.before.ani, input.children ?? 0)) / 12,
    afterTakeHomeMonthly: (after.before.cash - childBenefitCharge(after.before.ani, input.children ?? 0)) / 12,
    beforeMonthly: before.annualPension / 12, afterMonthly: after.annualPension / 12,
    extraMonthly: (after.annualPension - before.annualPension) / 12,
    cashCostMonthly: (before.before.cash - after.before.cash) / 12 - childBenefitSavingMonthly,
    finalCostMonthly: (before.before.finalCash - after.before.finalCash) / 12 - childBenefitSavingMonthly,
    sacrificeMonthly, topUpMonthly,
    issues: [...new Set([...before.issues, ...after.issues])],
  }
}

/** Largest target contribution within a cash budget and the standard allowance. */
export function solveSchemeSwitchBudget(input: SchemeSwitchInputs, budget: number) {
  let lo = 0, hi = 100
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    const result = compareSchemeSwitch({ ...input, targetPercent: mid })
    if (result.issues.length === 0 && result.cashCostMonthly <= Math.max(0, budget)) lo = mid
    else hi = mid
  }
  const targetPercent = Math.floor(lo * 10000) / 10000
  const result = compareSchemeSwitch({ ...input, targetPercent })
  return { targetPercent, result, limited: result.cashCostMonthly < Math.max(0, budget) - .02 }
}

/** Solve in take-home pounds, using the original payroll calculation at every trial. */
export function splitPlan(input: SchemeSwitchInputs, isaMonthly: number) {
  const full = compareSchemeSwitch(input)
  const budget = Math.max(0, full.cashCostMonthly) - isaMonthly
  let lo = 0, hi = input.targetPercent
  for (let i = 0; i < 55; i++) {
    const mid = (lo + hi) / 2
    if (compareSchemeSwitch({ ...input, targetPercent: mid }).cashCostMonthly <= budget) lo = mid
    else hi = mid
  }
  return compareSchemeSwitch({ ...input, targetPercent: lo })
}
