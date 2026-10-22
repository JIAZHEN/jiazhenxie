/**
 * UK tax, National Insurance, and pension figures used by Payday to Pension.
 *
 * Every value is for the 2026/27 tax year unless the comment says otherwise.
 * VERIFY BEFORE LAUNCH — do not treat this file as checked against gov.uk.
 */

/** Tax year these statutory figures are written for. VERIFY BEFORE LAUNCH. */
export const TAX_YEAR = '2026/27'

/** Personal allowance. 2026/27. VERIFY BEFORE LAUNCH. */
export const PERSONAL_ALLOWANCE = 12_570

/** Basic rate. 2026/27. VERIFY BEFORE LAUNCH. */
export const BASIC_RATE = 0.2

/**
 * Gross income at which basic rate ends, assuming a full personal allowance.
 * Taxable basic-rate band is this minus the personal allowance (£37,700).
 * 2026/27. VERIFY BEFORE LAUNCH.
 */
export const BASIC_RATE_LIMIT = 50_270

/** Higher rate. 2026/27. VERIFY BEFORE LAUNCH. */
export const HIGHER_RATE = 0.4

/**
 * Taxable income above this is additional rate (personal allowance is already 0).
 * 2026/27. VERIFY BEFORE LAUNCH.
 */
export const HIGHER_RATE_LIMIT = 125_140

/** Additional rate. 2026/27. VERIFY BEFORE LAUNCH. */
export const ADDITIONAL_RATE = 0.45

/**
 * Personal allowance tapers by £1 for every £2 of income above this.
 * 2026/27. VERIFY BEFORE LAUNCH.
 */
export const PERSONAL_ALLOWANCE_TAPER_START = 100_000

/** Employee NI primary threshold. 2026/27. VERIFY BEFORE LAUNCH. */
export const EMPLOYEE_NI_PRIMARY_THRESHOLD = 12_570

/** Employee NI upper earnings limit. 2026/27. VERIFY BEFORE LAUNCH. */
export const EMPLOYEE_NI_UPPER_THRESHOLD = 50_270

/** Employee NI main rate, between the primary threshold and the upper limit. 2026/27. VERIFY BEFORE LAUNCH. */
export const EMPLOYEE_NI_MAIN_RATE = 0.08

/** Employee NI rate above the upper earnings limit. 2026/27. VERIFY BEFORE LAUNCH. */
export const EMPLOYEE_NI_UPPER_RATE = 0.02

/** Employer NI secondary threshold. 2026/27. VERIFY BEFORE LAUNCH. */
export const EMPLOYER_NI_THRESHOLD = 5_000

/** Employer NI rate above the secondary threshold. 2026/27. VERIFY BEFORE LAUNCH. */
export const EMPLOYER_NI_RATE = 0.15

/** Auto-enrolment qualifying earnings, lower limit. 2026/27. VERIFY BEFORE LAUNCH. */
export const QUALIFYING_EARNINGS_LOWER = 6_240

/** Auto-enrolment qualifying earnings, upper limit. 2026/27. VERIFY BEFORE LAUNCH. */
export const QUALIFYING_EARNINGS_UPPER = 50_270

/** Auto-enrolment minimum total contribution. 2026/27. VERIFY BEFORE LAUNCH. */
export const AUTO_ENROLMENT_MIN_TOTAL = 0.08

/** Auto-enrolment minimum employer contribution, inside the 8% total. 2026/27. VERIFY BEFORE LAUNCH. */
export const AUTO_ENROLMENT_MIN_EMPLOYER = 0.03

/** Full new state pension, weekly. 2026/27. VERIFY BEFORE LAUNCH. */
export const FULL_NEW_STATE_PENSION_WEEKLY = 241.3

/** ISA annual allowance. 2026/27. VERIFY BEFORE LAUNCH. */
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

/** Standard pension annual allowance. 2026/27. VERIFY BEFORE LAUNCH. Taper for high earners is not modelled. */
export const PENSION_ANNUAL_ALLOWANCE = 60_000

/**
 * National Living Wage hourly floor used for the salary-sacrifice warning.
 * 2026/27. VERIFY BEFORE LAUNCH.
 */
export const MINIMUM_WAGE_HOURLY = 12.21

/**
 * From this date, National Insurance relief on salary-sacrifice pension
 * contributions is capped. Announced for 6 April 2029. VERIFY BEFORE LAUNCH.
 */
export const SALARY_SACRIFICE_NI_CAP_START = '2029-04-06'

/**
 * Annual salary-sacrifice amount that still gets NI relief once the cap applies.
 * Announced for April 2029. VERIFY BEFORE LAUNCH.
 */
export const SALARY_SACRIFICE_NI_SAVINGS_CAP = 2_000
