export type MatchRule = 'none' | 'upTo' | 'other'

export type SalarySacrifice = 'yes' | 'no' | 'unknown'

export type TaxRelief = 'reliefAtSource' | 'netPay'

export type ContributionBasis = 'full' | 'qualifying'

export type ContributionMethod = 'salarySacrifice' | 'reliefAtSource' | 'netPay'

/** Everything the page can change. Percents are numbers as typed: 5 means 5%. */
export interface CalculatorInputs {
  ageNow: number
  retirementAge: number
  grossAnnualSalary: number
  targetMonthlyIncome: number

  employeePercent: number
  employerPercent: number
  matchRule: MatchRule
  matchUpToPercent: number
  salarySacrifice: SalarySacrifice
  taxRelief: TaxRelief
  contributionBasis: ContributionBasis
  currentPensionPot: number
  employerPassesOnNiSaving: boolean
  /** Blank in the form. Used only for the minimum-wage warning. */
  hoursPerWeek: number | null

  statePensionWeekly: number
  statePensionAge: number

  otherSavingsBalance: number
  otherMonthlySaving: number

  realReturnBeforePercent: number
  realReturnAfterPercent: number
  safeWithdrawalPercent: number
  inflationPercent: number
  showNominal: boolean
}

export interface IncomeParts {
  state: number
  workplace: number
  other: number
}

export interface Projection {
  pensionPot: number
  otherPot: number
  lisaPot: number
  lisaCountsAtRetirement: boolean
  workplaceGrossMonthly: number
  workplaceNetMonthly: number
  pensionTaxAnnual: number
  stateMonthly: number
  otherMonthly: number
  atRetirementMonthly: number
  withStatePensionMonthly: number
  bridgeYears: number
  parts: IncomeParts
  employeePercent: number
  employerPercent: number
  takeHomeDropAnnual: number
  intoPensionAnnual: number
  claimableReliefAnnual: number
  allowanceCapped: boolean
  takeHomeMonthly: number
  method: ContributionMethod
}

export interface FreeMoney {
  extraEmployerMonthly: number
  fromPercent: number
  toPercent: number
  takeHomeDropMonthly: number
  pensionGainMonthly: number
}

export interface RaiseOption {
  reached: boolean
  employeePercent: number
  employerPercent: number
  takeHomeDropMonthly: number
  gainMonthly: number
  incomeMonthly: number
  allowanceCapped: boolean
}

export interface MatchOption {
  employeePercent: number
  employerPercent: number
  takeHomeDropMonthly: number
  gainMonthly: number
  extraEmployerMonthly: number
  incomeMonthly: number
  reached: boolean
}

export interface LaterOption {
  reached: boolean
  yearsLater: number | null
  retirementAge: number
  incomeMonthly: number
}

export interface LisaOption {
  reached: boolean
  monthlyPayIn: number
  bonusMonthly: number
  gainMonthly: number
  takeHomeDropMonthly: number
  incomeMonthly: number
  lockedUntil60: boolean
  /** Monthly income the LISA could pay from 60, even if retirement is earlier. */
  unlockedIncomeMonthly: number
}

export interface HonestMode {
  incomeMonthly: number
  employeePercent: number
  retirementAge: number
  stateMonthly: number
  /** Employee percent that would hit the target at the honest-mode retirement age, if 40% is enough. */
  neededEmployeePercent: number | null
  incomeAtMaxAgeOnHonestPercent: number
  maxAge: number
}

export type MinimumWageStatus = 'hidden' | 'generic' | 'ok' | 'breach'

export interface Analysis {
  current: Projection
  gapMonthly: number
  targetMonthly: number
  freeMoney: FreeMoney | null
  raise: RaiseOption
  match: MatchOption | null
  later: LaterOption
  lisa: LisaOption | null
  honest: HonestMode | null
  marginalTaxRate: number
  isBasicRateTaxpayer: boolean
  salarySacrificeAssumed: boolean
  minimumWage: MinimumWageStatus
  niCapChangesPayslip: boolean
  withdrawalAboveGrowth: boolean
  yearsToRetirement: number
}
