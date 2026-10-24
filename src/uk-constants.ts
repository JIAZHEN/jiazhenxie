/**
 * UK tax, National Insurance, and pension figures used by Payday to Pension.
 *
 * Every value is for the 2026/27 tax year unless the comment says otherwise.
 * Payroll, Child Benefit, childcare, State Pension and 2029 cap checked 24 October 2026.
 * Payroll source: https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
 * Income Tax source: https://www.gov.uk/income-tax-rates
 * Other legacy figures retain their verification markers below.
 */

/** Tax year these statutory figures are written for. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const TAX_YEAR = '2026/27'

/** Personal allowance. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const PERSONAL_ALLOWANCE = 12_570

/** Basic rate. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const BASIC_RATE = 0.2

/**
 * Gross income at which basic rate ends, assuming a full personal allowance.
 * Taxable basic-rate band is this minus the personal allowance (£37,700).
 * 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026.
 */
export const BASIC_RATE_LIMIT = 50_270

/** Higher rate. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const HIGHER_RATE = 0.4

/**
 * Taxable income above this is additional rate (personal allowance is already 0).
 * 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026.
 */
export const HIGHER_RATE_LIMIT = 125_140

/** Additional rate. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const ADDITIONAL_RATE = 0.45

/**
 * Personal allowance tapers by £1 for every £2 of income above this.
 * 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026.
 */
export const PERSONAL_ALLOWANCE_TAPER_START = 100_000

/** Employee NI primary threshold. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const EMPLOYEE_NI_PRIMARY_THRESHOLD = 12_570

/** Employee NI upper earnings limit. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const EMPLOYEE_NI_UPPER_THRESHOLD = 50_270

/** Employee NI main rate, between the primary threshold and the upper limit. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const EMPLOYEE_NI_MAIN_RATE = 0.08

/** Employee NI rate above the upper earnings limit. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const EMPLOYEE_NI_UPPER_RATE = 0.02

/** Employer NI secondary threshold. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const EMPLOYER_NI_THRESHOLD = 5_000

/** Employer NI rate above the secondary threshold. 2026/27. Verified against GOV.UK payroll / Income Tax sources above, 24 October 2026. */
export const EMPLOYER_NI_RATE = 0.15

/** Auto-enrolment qualifying earnings, lower limit. 2026/27. Verified: https://www.gov.uk/workplace-pensions-employers/how-to-enrol-staff */
export const QUALIFYING_EARNINGS_LOWER = 6_240

/** Auto-enrolment qualifying earnings, upper limit. 2026/27. Verified: https://www.gov.uk/workplace-pensions-employers/how-to-enrol-staff */
export const QUALIFYING_EARNINGS_UPPER = 50_270

/** Auto-enrolment minimum total contribution. 2026/27. VERIFY BEFORE LAUNCH. */
export const AUTO_ENROLMENT_MIN_TOTAL = 0.08

/** Auto-enrolment minimum employer contribution, inside the 8% total. 2026/27. VERIFY BEFORE LAUNCH. */
export const AUTO_ENROLMENT_MIN_EMPLOYER = 0.03

/** Full new state pension, weekly. 2026/27. Verified 24 October 2026: https://www.gov.uk/new-state-pension/what-youll-get */
export const FULL_NEW_STATE_PENSION_WEEKLY = 241.3

/** ISA annual allowance. 2026/27. Verified: https://www.gov.uk/individual-savings-accounts/overview */
export const ISA_ANNUAL_ALLOWANCE = 20_000

/** Lifetime ISA annual pay-in cap, inside the ISA allowance. 2026/27. VERIFY BEFORE LAUNCH. */
export const LISA_ANNUAL_ALLOWANCE = 4_000

/** Lifetime ISA government bonus. 2026/27. VERIFY BEFORE LAUNCH. */
export const LISA_BONUS_RATE = 0.25

/** A Lifetime ISA must be opened before this age. 2026/27. VERIFY BEFORE LAUNCH. */
export const LISA_OPEN_BEFORE_AGE = 40

/** Lifetime ISA contributions stop at this age. 2026/27. VERIFY BEFORE LAUNCH. */
export const LISA_PAY_IN_UNTIL_AGE = 50

/** Lifetime ISA withdrawals without penalty from this age (first home excepted). 2026/27. VERIFY BEFORE LAUNCH. */
export const LISA_WITHDRAW_FROM_AGE = 60

/** Standard pension annual allowance. 2026/27. Verified: https://www.gov.uk/tax-on-your-private-pension Taper for high earners is not modelled. */
export const PENSION_ANNUAL_ALLOWANCE = 60_000

/**
 * National Living Wage hourly floor used for the salary-sacrifice warning.
 * Age 21+, April 2026: https://www.gov.uk/national-minimum-wage-rates
 */
export const MINIMUM_WAGE_HOURLY = 12.71

/**
 * From this date, National Insurance relief on salary-sacrifice pension
 * contributions is capped. Verified: https://www.gov.uk/government/publications/salary-sacrifice-reform-for-pension-contributions-effective-from-6-april-2029
 */
export const SALARY_SACRIFICE_NI_CAP_START = '2029-04-06'

/**
 * Annual salary-sacrifice amount that still gets NI relief once the cap applies.
 * Verified: https://www.gov.uk/government/publications/salary-sacrifice-reform-for-pension-contributions-effective-from-6-april-2029
 */
export const SALARY_SACRIFICE_NI_SAVINGS_CAP = 2_000

/** 2026/27 GOV.UK: https://www.gov.uk/child-benefit-tax-charge */
export const CHILD_BENEFIT_CHARGE_START = 60_000
export const CHILD_BENEFIT_CHARGE_END = 80_000
export const CHILD_BENEFIT_CHARGE_STEP = 200
/** 2026/27 GOV.UK: https://www.gov.uk/child-benefit/what-youll-get */
export const CHILD_BENEFIT_FIRST_WEEKLY = 27.05
export const CHILD_BENEFIT_OTHER_WEEKLY = 17.90
/** 2026/27 GOV.UK: https://www.gov.uk/tax-free-childcare/check-if-youre-eligible */
export const CHILDCARE_INCOME_LIMIT = 100_000
/** 2026/27 modelling assumption: a full year of weekly benefits; https://www.gov.uk/new-state-pension/what-youll-get */
export const BENEFIT_WEEKS = 52
/** From April 2028, GOV.UK: https://www.gov.uk/hmrc-internal-manuals/pensions-tax-manual/ptm028000 */
export const DEFAULT_PENSION_ACCESS_AGE = 57
/** Simplified withdrawal assumption, 2026/27: https://www.gov.uk/tax-on-pension/tax-free */
export const PENSION_TAX_FREE_SHARE = .25
/** User-requested real-return assumptions, not statutory figures; 2026/27 modelling choices (no GOV.UK forecast). */
export const FREEDOM_SCENARIOS = [{ label: 'Cautious', rate: .02 }, { label: 'Middle', rate: .04 }, { label: 'Hopeful', rate: .06 }] as const
/** Fictional defaults and search limits, not government guidance; 2026/27 model assumptions. */
export const FREEDOM_DEFAULTS = { age: 35, pension: 100_000, isa: 20_000, monthlyIsa: 200, spending: 24_000, liveTo: 95, access: DEFAULT_PENSION_ACCESS_AGE, stateAge: 67, stateAnnual: FULL_NEW_STATE_PENSION_WEEKLY * BENEFIT_WEEKS, includeState: true }
export const FREEDOM_MAX_AGE = 75
export const CLIFF_HINT_DISTANCE = 5_000
export const SPLIT_SEARCH_STEPS = 40
/** 2026/27 UI explanation, GOV.UK: https://www.gov.uk/tax-free-childcare */
export const CHILDCARE_MAX_ANNUAL = 2_000

/** Fictional desired stopping age, a 2026/27 example choice, not GOV.UK guidance. */
export const FREEDOM_TARGET_AGE = 50

/** UI-only rounding tolerance requested for 2026/27 income-line hints, not a tax relief. */
export const INCOME_LINE_TOLERANCE = .50
