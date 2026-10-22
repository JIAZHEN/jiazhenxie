import type {
  CalculatorInputs,
  ContributionBasis,
  MatchRule,
  SalarySacrifice,
  TaxRelief,
} from '../calc/types'
import { defaultInputs } from './defaults'

const MATCH: readonly MatchRule[] = ['none', 'upTo', 'other']
const SACRIFICE: readonly SalarySacrifice[] = ['yes', 'no', 'unknown']
const RELIEF: readonly TaxRelief[] = ['reliefAtSource', 'netPay']
const BASIS: readonly ContributionBasis[] = ['full', 'qualifying']

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function readNumber(
  params: URLSearchParams,
  key: string,
  fallback: number,
  min: number,
  max: number
): number {
  const raw = params.get(key)
  if (raw == null || raw.trim() === '') return fallback
  const value = Number(raw)
  if (!Number.isFinite(value)) return fallback
  return clamp(value, min, max)
}

function oneOf<T extends string>(
  raw: string | null,
  allowed: readonly T[],
  fallback: T
): T {
  return allowed.includes(raw as T) ? (raw as T) : fallback
}

/** Hash payload only. Nothing here is sent as a query string. */
export function encodeInputs(inputs: CalculatorInputs): string {
  const params = new URLSearchParams()
  params.set('v', '1')
  params.set('age', String(inputs.ageNow))
  params.set('stop', String(inputs.retirementAge))
  params.set('pay', String(inputs.grossAnnualSalary))
  params.set('target', String(inputs.targetMonthlyIncome))
  params.set('you', String(inputs.employeePercent))
  params.set('er', String(inputs.employerPercent))
  params.set('match', inputs.matchRule)
  params.set('matchTo', String(inputs.matchUpToPercent))
  params.set('ss', inputs.salarySacrifice)
  params.set('relief', inputs.taxRelief)
  params.set('basis', inputs.contributionBasis)
  params.set('pot', String(inputs.currentPensionPot))
  params.set('nipass', inputs.employerPassesOnNiSaving ? '1' : '0')
  params.set(
    'hours',
    inputs.hoursPerWeek == null ? '' : String(inputs.hoursPerWeek)
  )
  params.set('sp', String(inputs.statePensionWeekly))
  params.set('spa', String(inputs.statePensionAge))
  params.set('isa', String(inputs.otherSavingsBalance))
  params.set('isamo', String(inputs.otherMonthlySaving))
  params.set('grow', String(inputs.realReturnBeforePercent))
  params.set('grow2', String(inputs.realReturnAfterPercent))
  params.set('swr', String(inputs.safeWithdrawalPercent))
  params.set('inf', String(inputs.inflationPercent))
  params.set('nominal', inputs.showNominal ? '1' : '0')
  return params.toString()
}

export function decodeInputs(hash: string): CalculatorInputs | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (!raw) return null
  const params = new URLSearchParams(raw)
  if (params.get('v') !== '1') return null
  const hoursRaw = params.get('hours')
  const hours =
    hoursRaw == null || hoursRaw.trim() === ''
      ? null
      : clamp(Number(hoursRaw), 1, 80)
  return {
    ageNow: readNumber(params, 'age', defaultInputs.ageNow, 16, 80),
    retirementAge: readNumber(
      params,
      'stop',
      defaultInputs.retirementAge,
      16,
      80
    ),
    grossAnnualSalary: readNumber(
      params,
      'pay',
      defaultInputs.grossAnnualSalary,
      0,
      10_000_000
    ),
    targetMonthlyIncome: readNumber(
      params,
      'target',
      defaultInputs.targetMonthlyIncome,
      0,
      1_000_000
    ),
    employeePercent: readNumber(
      params,
      'you',
      defaultInputs.employeePercent,
      0,
      100
    ),
    employerPercent: readNumber(
      params,
      'er',
      defaultInputs.employerPercent,
      0,
      100
    ),
    matchRule: oneOf(params.get('match'), MATCH, defaultInputs.matchRule),
    matchUpToPercent: readNumber(
      params,
      'matchTo',
      defaultInputs.matchUpToPercent,
      0,
      100
    ),
    salarySacrifice: oneOf(
      params.get('ss'),
      SACRIFICE,
      defaultInputs.salarySacrifice
    ),
    taxRelief: oneOf(params.get('relief'), RELIEF, defaultInputs.taxRelief),
    contributionBasis: oneOf(
      params.get('basis'),
      BASIS,
      defaultInputs.contributionBasis
    ),
    currentPensionPot: readNumber(
      params,
      'pot',
      defaultInputs.currentPensionPot,
      0,
      100_000_000
    ),
    employerPassesOnNiSaving: params.get('nipass') === '1',
    hoursPerWeek: hours != null && Number.isFinite(hours) ? hours : null,
    statePensionWeekly: readNumber(
      params,
      'sp',
      defaultInputs.statePensionWeekly,
      0,
      10_000
    ),
    statePensionAge: readNumber(
      params,
      'spa',
      defaultInputs.statePensionAge,
      55,
      80
    ),
    otherSavingsBalance: readNumber(
      params,
      'isa',
      defaultInputs.otherSavingsBalance,
      0,
      100_000_000
    ),
    otherMonthlySaving: readNumber(
      params,
      'isamo',
      defaultInputs.otherMonthlySaving,
      0,
      1_000_000
    ),
    realReturnBeforePercent: readNumber(
      params,
      'grow',
      defaultInputs.realReturnBeforePercent,
      -5,
      15
    ),
    realReturnAfterPercent: readNumber(
      params,
      'grow2',
      defaultInputs.realReturnAfterPercent,
      -5,
      15
    ),
    safeWithdrawalPercent: readNumber(
      params,
      'swr',
      defaultInputs.safeWithdrawalPercent,
      0,
      20
    ),
    inflationPercent: readNumber(
      params,
      'inf',
      defaultInputs.inflationPercent,
      0,
      20
    ),
    showNominal: params.get('nominal') === '1',
  }
}
