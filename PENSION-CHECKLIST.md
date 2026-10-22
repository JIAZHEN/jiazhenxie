# Verify before this goes public

Every figure below is what the calculator currently uses. Check each one against the official page for the tax year you are launching in. The code marks them `VERIFY BEFORE LAUNCH` in [`src/uk-constants.ts`](src/uk-constants.ts). Nothing in that file has been signed off.

Tax year the constants were written for: **2026/27**.

## Income tax

- [ ] Personal allowance £12,570 — [Income Tax rates](https://www.gov.uk/income-tax-rates)
- [ ] Basic rate 20% up to £50,270 of gross income when the full allowance is in place (taxable band £37,700)
- [ ] Higher rate 40%
- [ ] Additional rate 45% on taxable income above £125,140
- [ ] Personal allowance tapers by £1 for every £2 of income above £100,000, gone by £125,140

## National Insurance

- [ ] Employee NI 8% between £12,570 and £50,270 — [NI rates](https://www.gov.uk/national-insurance-rates-letters)
- [ ] Employee NI 2% above £50,270
- [ ] Employer NI 15% above £5,000

## Workplace pension

- [ ] Auto-enrolment qualifying earnings £6,240 to £50,270 — [The Pensions Regulator earnings thresholds](https://www.thepensionsregulator.gov.uk/en/business-advisers/automatic-enrolment-guide-for-business-advisers/automatic-enrolment-earnings-threshold)
- [ ] Auto-enrolment minimum 8% total, of which at least 3% from the employer — [Workplace pensions](https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay)
- [ ] Pension annual allowance £60,000 — [Annual allowance](https://www.gov.uk/tax-on-your-private-pension/annual-allowance)
- [ ] Basic-rate relief at source is 20% (you pay 80%, the provider adds 20%)
- [ ] 25% of pension withdrawals treated as tax free — confirm this is still the rule you want to simplify to

## State pension

- [ ] Full new state pension £241.30 a week — [The new State Pension](https://www.gov.uk/new-state-pension/what-youll-get)
- [ ] State pension age default 67 for people born after 5 April 1978 — [State pension age](https://www.gov.uk/state-pension-age)
- [ ] Forecast link still https://www.gov.uk/check-state-pension

## ISAs

- [ ] ISA annual allowance £20,000 — [ISAs](https://www.gov.uk/individual-savings-accounts)
- [ ] Lifetime ISA £4,000 inside that allowance, 25% bonus — [Lifetime ISA](https://www.gov.uk/lifetime-isa)
- [ ] Lifetime ISA opened before 40, pay in until 50, withdraw from 60 (first home aside)

## Salary sacrifice limits

- [ ] National Living Wage used as the floor: £12.21 an hour — [Minimum wage rates](https://www.gov.uk/national-minimum-wage-rates)
- [ ] £2,000 a year cap on salary-sacrifice National Insurance relief from 6 April 2029. Confirm the date, the £2,000 figure, and that it applies to both employee and employer NI. The switch is `SALARY_SACRIFICE_NI_CAP_START` and `SALARY_SACRIFICE_NI_SAVINGS_CAP`.

## Wording that points at official help

- [ ] Footer still matches the sentence in the README
- [ ] MoneyHelper link still https://www.moneyhelper.org.uk/en/pensions-and-retirement

## Not from gov.uk

These are choices in the tool, not rates to copy from a tax page. Re-read them before launch, and do not describe them as official.

- [ ] Sensible employee-contribution cap used in the options: 40% of pensionable pay (`MAX_SENSIBLE_EMPLOYEE_PERCENT`)
- [ ] Honest-mode case: 20% employee contribution and working to 70 (`HONEST_EMPLOYEE_PERCENT`, `HONEST_RETIREMENT_AGE`)
- [ ] Working-longer search stops at 75 (`MAX_RETIREMENT_AGE`)
- [ ] Default assumptions: 3% real return before retirement, 2% after, 4% withdrawal rate, 2.5% inflation
- [ ] Default example on first load: age 35, stop at 67, £32,000 salary, £1,500 a month target, 5% / 3% on qualifying earnings
