import {
  SALARY_SACRIFICE_NI_CAP_START,
  SALARY_SACRIFICE_NI_SAVINGS_CAP,
} from '../uk-constants'
import {
  employerPercentAt,
  HONEST_EMPLOYEE_PERCENT,
  HONEST_RETIREMENT_AGE,
  lisaAllowed,
  lisaMonthlyCap,
  MAX_RETIREMENT_AGE,
  MAX_SENSIBLE_EMPLOYEE_PERCENT,
  meetsTarget,
  minimumWageStatus,
  pensionInflow,
} from './contributions'
import { monthsBetweenAges } from './grow'
import { project } from './project'
import { marginalIncomeTaxRate, salarySacrificeNiCapApplies } from './tax'
import type {
  Analysis,
  CalculatorInputs,
  FreeMoney,
  HonestMode,
  LaterOption,
  LisaOption,
  MatchOption,
  Projection,
  RaiseOption,
} from './types'

export interface SolvePercentResult {
  percent: number
  incomeMonthly: number
  reached: boolean
}

/**
 * Smallest employee percent (up to the sensible cap) whose projected
 * retirement income meets the target. Numeric bisection, not a closed form.
 */
export function solveEmployeePercent(
  inputs: CalculatorInputs,
  targetMonthly: number,
  today: Date,
  retirementAge: number = inputs.retirementAge,
  maxPercent: number = MAX_SENSIBLE_EMPLOYEE_PERCENT
): SolvePercentResult {
  const incomeAt = (percent: number): number => {
    const employerPercent = employerPercentAt(inputs, percent)
    return project(
      inputs,
      { employeePercent: percent, employerPercent, retirementAge },
      today
    ).atRetirementMonthly
  }
  const atMax = incomeAt(maxPercent)
  if (!meetsTarget(atMax, targetMonthly)) {
    return { percent: maxPercent, incomeMonthly: atMax, reached: false }
  }
  const atZero = incomeAt(0)
  if (meetsTarget(atZero, targetMonthly)) {
    return { percent: 0, incomeMonthly: atZero, reached: true }
  }
  let low = 0
  let high = maxPercent
  for (let step = 0; step < 48; step++) {
    const mid = (low + high) / 2
    if (meetsTarget(incomeAt(mid), targetMonthly)) high = mid
    else low = mid
  }
  return { percent: high, incomeMonthly: incomeAt(high), reached: true }
}

function incremental(
  current: Projection,
  next: Projection
): { takeHomeDropMonthly: number; gainMonthly: number } {
  return {
    takeHomeDropMonthly:
      (next.takeHomeDropAnnual - current.takeHomeDropAnnual) / 12,
    gainMonthly: (next.intoPensionAnnual - current.intoPensionAnnual) / 12,
  }
}

function buildRaise(
  inputs: CalculatorInputs,
  current: Projection,
  today: Date
): RaiseOption {
  const solved = solveEmployeePercent(inputs, inputs.targetMonthlyIncome, today)
  const next = project(
    inputs,
    {
      employeePercent: solved.percent,
      employerPercent: employerPercentAt(inputs, solved.percent),
    },
    today
  )
  const delta = incremental(current, next)
  return {
    reached: solved.reached,
    employeePercent: solved.percent,
    employerPercent: next.employerPercent,
    takeHomeDropMonthly: delta.takeHomeDropMonthly,
    gainMonthly: delta.gainMonthly,
    incomeMonthly: next.atRetirementMonthly,
    allowanceCapped: next.allowanceCapped,
  }
}

function buildMatch(
  inputs: CalculatorInputs,
  current: Projection,
  today: Date
): MatchOption | null {
  if (inputs.matchRule !== 'upTo') return null
  if (inputs.employeePercent + 0.05 >= inputs.matchUpToPercent) return null
  const toPercent = inputs.matchUpToPercent
  const employerPercent = employerPercentAt(inputs, toPercent)
  if (employerPercent <= inputs.employerPercent + 0.05) return null
  const next = project(
    inputs,
    { employeePercent: toPercent, employerPercent },
    today
  )
  const delta = incremental(current, next)
  const currentIn = pensionInflow(
    inputs,
    inputs.employeePercent,
    inputs.employerPercent,
    today
  )
  const nextIn = pensionInflow(inputs, toPercent, employerPercent, today)
  const reached = meetsTarget(
    next.atRetirementMonthly,
    inputs.targetMonthlyIncome
  )
  return {
    employeePercent: toPercent,
    employerPercent,
    takeHomeDropMonthly: delta.takeHomeDropMonthly,
    gainMonthly: delta.gainMonthly,
    extraEmployerMonthly:
      (nextIn.employerAnnual - currentIn.employerAnnual) / 12,
    incomeMonthly: next.atRetirementMonthly,
    reached,
  }
}

function buildFreeMoney(
  inputs: CalculatorInputs,
  current: Projection,
  today: Date
): FreeMoney | null {
  const match = buildMatch(inputs, current, today)
  if (!match || match.extraEmployerMonthly <= 0.5) return null
  return {
    extraEmployerMonthly: match.extraEmployerMonthly,
    fromPercent: inputs.employeePercent,
    toPercent: match.employeePercent,
    takeHomeDropMonthly: match.takeHomeDropMonthly,
    pensionGainMonthly: match.gainMonthly,
  }
}

function buildLater(inputs: CalculatorInputs, today: Date): LaterOption {
  const incomeAt = (retirementAge: number) =>
    project(inputs, { retirementAge }, today).atRetirementMonthly
  if (inputs.retirementAge >= MAX_RETIREMENT_AGE) {
    const income = incomeAt(inputs.retirementAge)
    return {
      reached: meetsTarget(income, inputs.targetMonthlyIncome),
      yearsLater: null,
      retirementAge: inputs.retirementAge,
      incomeMonthly: income,
    }
  }
  for (let age = inputs.retirementAge + 1; age <= MAX_RETIREMENT_AGE; age++) {
    const income = incomeAt(age)
    if (meetsTarget(income, inputs.targetMonthlyIncome)) {
      return {
        reached: true,
        yearsLater: age - inputs.retirementAge,
        retirementAge: age,
        incomeMonthly: income,
      }
    }
  }
  return {
    reached: false,
    yearsLater: null,
    retirementAge: MAX_RETIREMENT_AGE,
    incomeMonthly: incomeAt(MAX_RETIREMENT_AGE),
  }
}

function buildLisa(
  inputs: CalculatorInputs,
  current: Projection,
  today: Date
): LisaOption | null {
  if (!lisaAllowed(inputs.ageNow)) return null
  const cap = lisaMonthlyCap()
  const incomeAt = (monthlyPayIn: number) =>
    project(inputs, { lisaMonthlyPayIn: monthlyPayIn }, today)
      .atRetirementMonthly
  const atCap = incomeAt(cap)
  let monthlyPayIn = cap
  const reached = meetsTarget(atCap, inputs.targetMonthlyIncome)
  if (
    reached &&
    !meetsTarget(current.atRetirementMonthly, inputs.targetMonthlyIncome)
  ) {
    let low = 0
    let high = cap
    for (let step = 0; step < 40; step++) {
      const mid = (low + high) / 2
      if (meetsTarget(incomeAt(mid), inputs.targetMonthlyIncome)) high = mid
      else low = mid
    }
    monthlyPayIn = high
  } else if (
    meetsTarget(current.atRetirementMonthly, inputs.targetMonthlyIncome)
  ) {
    return null
  }
  const next = project(inputs, { lisaMonthlyPayIn: monthlyPayIn }, today)
  const bonusMonthly = monthlyPayIn * 0.25
  const swr = inputs.safeWithdrawalPercent / 100
  return {
    reached,
    monthlyPayIn,
    bonusMonthly,
    gainMonthly: monthlyPayIn + bonusMonthly,
    takeHomeDropMonthly: monthlyPayIn,
    incomeMonthly: next.atRetirementMonthly,
    lockedUntil60: inputs.retirementAge < 60,
    unlockedIncomeMonthly: (next.lisaPot * swr) / 12,
  }
}

function buildHonest(inputs: CalculatorInputs, today: Date): HonestMode | null {
  const employeePercent = Math.min(
    MAX_SENSIBLE_EMPLOYEE_PERCENT,
    Math.max(inputs.employeePercent, HONEST_EMPLOYEE_PERCENT)
  )
  const retirementAge = Math.min(
    MAX_RETIREMENT_AGE,
    Math.max(inputs.retirementAge, HONEST_RETIREMENT_AGE)
  )
  const employerPercent = employerPercentAt(inputs, employeePercent)
  const projected = project(
    inputs,
    { employeePercent, employerPercent, retirementAge },
    today
  )
  if (meetsTarget(projected.atRetirementMonthly, inputs.targetMonthlyIncome))
    return null

  const needed = solveEmployeePercent(
    inputs,
    inputs.targetMonthlyIncome,
    today,
    retirementAge,
    MAX_SENSIBLE_EMPLOYEE_PERCENT
  )
  const atMaxAge = project(
    inputs,
    {
      employeePercent,
      employerPercent,
      retirementAge: MAX_RETIREMENT_AGE,
    },
    today
  )
  return {
    incomeMonthly: projected.atRetirementMonthly,
    employeePercent,
    retirementAge,
    stateMonthly: (Math.max(0, inputs.statePensionWeekly) * 52) / 12,
    neededEmployeePercent: needed.reached ? needed.percent : null,
    incomeAtMaxAgeOnHonestPercent: atMaxAge.atRetirementMonthly,
    maxAge: MAX_RETIREMENT_AGE,
  }
}

function niCapChangesPayslip(inputs: CalculatorInputs, today: Date): boolean {
  if (inputs.salarySacrifice !== 'yes') return false
  const inflow = pensionInflow(
    inputs,
    inputs.employeePercent,
    inputs.employerPercent,
    today
  )
  if (inflow.employeeGrossAnnual <= SALARY_SACRIFICE_NI_SAVINGS_CAP)
    return false
  if (salarySacrificeNiCapApplies(today)) return true
  const cap = Date.parse(`${SALARY_SACRIFICE_NI_CAP_START}T00:00:00Z`)
  const monthsLeft = monthsBetweenAges(inputs.ageNow, inputs.retirementAge)
  if (monthsLeft <= 0) return false
  const end = new Date(today.getTime())
  end.setUTCMonth(end.getUTCMonth() + monthsLeft)
  return end.getTime() >= cap
}

export function analyse(
  inputs: CalculatorInputs,
  today: Date = new Date()
): Analysis {
  const current = project(inputs, {}, today)
  const marginalTaxRate = marginalIncomeTaxRate(inputs.grossAnnualSalary)
  const gapMonthly = inputs.targetMonthlyIncome - current.atRetirementMonthly
  return {
    current,
    gapMonthly,
    targetMonthly: inputs.targetMonthlyIncome,
    freeMoney: buildFreeMoney(inputs, current, today),
    raise: buildRaise(inputs, current, today),
    match: buildMatch(inputs, current, today),
    later: buildLater(inputs, today),
    lisa: buildLisa(inputs, current, today),
    honest: buildHonest(inputs, today),
    marginalTaxRate,
    isBasicRateTaxpayer: Math.abs(marginalTaxRate - 0.2) < 0.011,
    salarySacrificeAssumed: inputs.salarySacrifice === 'unknown',
    minimumWage: minimumWageStatus(inputs, pensionEmployeeGross(inputs, today)),
    niCapChangesPayslip: niCapChangesPayslip(inputs, today),
    withdrawalAboveGrowth:
      inputs.safeWithdrawalPercent > inputs.realReturnAfterPercent + 0.05,
    yearsToRetirement: Math.max(0, inputs.retirementAge - inputs.ageNow),
  }
}

function pensionEmployeeGross(inputs: CalculatorInputs, today: Date): number {
  return pensionInflow(
    inputs,
    inputs.employeePercent,
    inputs.employerPercent,
    today
  ).employeeGrossAnnual
}
