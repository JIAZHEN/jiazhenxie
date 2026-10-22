import {
  QUALIFYING_EARNINGS_LOWER,
  QUALIFYING_EARNINGS_UPPER,
} from '../uk-constants'
import type { Analysis, CalculatorInputs } from './types'
import { pensionInflow } from './contributions'
import { formatGbp, formatPercent } from './format'
import { project } from './project'

/** A pay rise used only to show how little salary moves the retirement figure. */
export const SALARY_STEP = 10_000

export interface PayslipSide {
  employeePercent: number
  employerPercent: number
  takeHomeMonthly: number
  fromPayMonthly: number
  employerMonthly: number
  intoPensionMonthly: number
  retirementMonthly: number
}

export type LeverId = 'state' | 'payday' | 'later' | 'salary'

export interface Lever {
  id: LeverId
  label: string
  /** Pounds a month of retirement income this lever accounts for. */
  amount: number
  note: string
}

export interface Story {
  hero: {
    mode: 'already' | 'raise' | 'short'
    now: PayslipSide
    next: PayslipSide | null
  }
  levers: Lever[]
}

function quiet(amount: number): number {
  return Math.abs(amount) < 0.5 ? 0 : amount
}

function side(
  inputs: CalculatorInputs,
  employeePercent: number,
  employerPercent: number,
  today: Date,
  projected = project(inputs, { employeePercent, employerPercent }, today)
): PayslipSide {
  const inflow = pensionInflow(inputs, employeePercent, employerPercent, today)
  return {
    employeePercent: projected.employeePercent,
    employerPercent: projected.employerPercent,
    takeHomeMonthly: projected.takeHomeMonthly,
    fromPayMonthly: projected.takeHomeDropAnnual / 12,
    employerMonthly: inflow.employerAnnual / 12,
    intoPensionMonthly: projected.intoPensionAnnual / 12,
    retirementMonthly: projected.atRetirementMonthly,
  }
}

function salaryNote(inputs: CalculatorInputs, amount: number): string {
  if (inputs.contributionBasis === 'full') {
    return 'The percent applies to your whole salary, so this rise counts in full.'
  }
  if (amount === 0) {
    return `Adds nothing. Pay above ${formatGbp(QUALIFYING_EARNINGS_UPPER)} is ignored.`
  }
  if (inputs.grossAnnualSalary + SALARY_STEP > QUALIFYING_EARNINGS_UPPER) {
    return `Only the part still under ${formatGbp(QUALIFYING_EARNINGS_UPPER)} counts.`
  }
  return `This rise sits inside ${formatGbp(QUALIFYING_EARNINGS_LOWER)} to ${formatGbp(QUALIFYING_EARNINGS_UPPER)}.`
}

/**
 * The payslip change that aims at the target, plus a ranking of what
 * actually moves retirement income. Salary is a fixed £10,000 step so a
 * pay rise can lose to the state pension.
 */
export function buildStory(
  inputs: CalculatorInputs,
  analysis: Analysis,
  today: Date
): Story {
  const now = side(
    inputs,
    inputs.employeePercent,
    inputs.employerPercent,
    today,
    analysis.current
  )
  const gap = analysis.gapMonthly
  const hero =
    gap <= 1
      ? { mode: 'already' as const, now, next: null }
      : {
          mode: analysis.raise.reached
            ? ('raise' as const)
            : ('short' as const),
          now,
          next: side(
            inputs,
            analysis.raise.employeePercent,
            analysis.raise.employerPercent,
            today
          ),
        }

  const paydayAmount = hero.next
    ? quiet(hero.next.retirementMonthly - now.retirementMonthly)
    : 0
  const laterAmount = quiet(
    analysis.later.incomeMonthly - now.retirementMonthly
  )
  const salaryIncome = project(
    {
      ...inputs,
      grossAnnualSalary: Math.max(0, inputs.grossAnnualSalary) + SALARY_STEP,
    },
    {},
    today
  ).atRetirementMonthly
  const salaryAmount = quiet(salaryIncome - now.retirementMonthly)

  const drop = hero.next ? now.takeHomeMonthly - hero.next.takeHomeMonthly : 0
  const pensionGain = hero.next
    ? hero.next.intoPensionMonthly - now.intoPensionMonthly
    : 0

  const levers: Lever[] = [
    {
      id: 'state',
      label: 'State pension',
      amount: quiet(analysis.current.parts.state),
      note: 'Already in the figure. Your salary does not raise it.',
    },
    {
      id: 'salary',
      label: `${formatGbp(SALARY_STEP)} more salary`,
      amount: salaryAmount,
      note: salaryNote(inputs, salaryAmount),
    },
  ]

  if (paydayAmount > 0 && hero.next) {
    levers.push({
      id: 'payday',
      label: `Pay ${formatPercent(hero.next.employeePercent)} instead of ${formatPercent(now.employeePercent)}`,
      amount: paydayAmount,
      note: `Take-home down ${formatGbp(drop)}. Pension up ${formatGbp(pensionGain)}.`,
    })
  }

  if (laterAmount > 0) {
    levers.push({
      id: 'later',
      label: `Stop at ${analysis.later.retirementAge}`,
      amount: laterAmount,
      note: analysis.later.reached
        ? 'Payday stays the same.'
        : 'Still short of the target. This stops at 75.',
    })
  }

  const order: Record<LeverId, number> = {
    state: 0,
    payday: 1,
    later: 2,
    salary: 3,
  }
  levers.sort((a, b) => b.amount - a.amount || order[a.id] - order[b.id])

  return { hero, levers }
}
