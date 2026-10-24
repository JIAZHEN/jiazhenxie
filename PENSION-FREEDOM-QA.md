# Pension meaning and freedom-age extension

Implemented 24 October 2026. Existing three-step comparison stays separate from optional step 4. All new inputs live in React state: no persistence, requests or analytics added.

## Validation

- `npm run build`: passed.
- `npm run check:pension`: existing 912 payroll scenarios, 64 budget boundaries, page output checks and new insights/freedom tests.
- Default percentage-entry example (£80,000, 5% current employee and 3% employer on qualifying earnings, new 10% full salary): still £277 monthly cost, £483 extra pension; exchange £1.75.
- Headless Chrome, viewport 375 × 812: completed all three steps, opened optional step and advanced inputs, moved ISA slider, checked light/dark screenshots. Document width 375 in both themes; no browser errors.
- Targeted ESLint passes. Repository-wide lint has pre-existing issues in Home.tsx (effect dependency warning) and types/vanta.d.ts (explicit any).

## Verified sources (2026/27 unless stated)

- Income Tax and allowance taper: https://www.gov.uk/income-tax-rates
- Employee/employer NI: https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
- Child Benefit £27.05/£17.90 weekly: https://www.gov.uk/child-benefit/what-youll-get
- £60,000–£80,000 charge, 1% per full £200: https://www.gov.uk/child-benefit-tax-charge
- Childcare £100,000 eligibility: https://www.gov.uk/tax-free-childcare/check-if-youre-eligible and https://www.gov.uk/free-childcare-if-working/check-youre-eligible
- Childcare maximum £2,000 per child/year: https://www.gov.uk/tax-free-childcare
- Full new State Pension £241.30 weekly, modelled as £12,547.60/year: https://www.gov.uk/new-state-pension/what-youll-get
- Pension access age 57 from April 2028: https://www.gov.uk/hmrc-internal-manuals/pensions-tax-manual/ptm028000
- Pension tax-free share 25%: https://www.gov.uk/tax-on-pension/tax-free
- £2,000 NI cap from 6 April 2029: https://www.gov.uk/government/publications/salary-sacrifice-reform-for-pension-contributions-effective-from-6-april-2029
- £20,000 ISA allowance: https://www.gov.uk/individual-savings-accounts/overview
- Qualifying earnings £6,240–£50,270: https://www.gov.uk/workplace-pensions-employers/how-to-enrol-staff
- Standard £60,000 pension allowance: https://www.gov.uk/tax-on-your-private-pension

No unverified new statutory values. Fictional defaults, 2/4/6% real returns, age-75 search limit, 95-year planning horizon and 41 split candidates are assumptions, explicitly identified in constants. State Pension age 67 is a user-editable example, not an eligibility determination. Unrelated legacy constants retain their existing verification markers.

## Deliberate simplifications

- Whole-year simulation and stopping ages; working-year growth precedes end-year payments. Retirement withdrawals occur at the start of each year, growth afterwards.
- 41 evenly spaced split candidates, earliest Middle age with smallest ISA allocation as tie-break; explicitly an example, not a recommendation.
- Retirement tax uses existing Income Tax function, with bands fixed in real terms; 25% of every pension withdrawal assumed tax-free throughout (lifetime tax-free cash cap omitted as requested simple model). State Pension is taxable and reduces pot withdrawals.
- No fees, savings tax, investment volatility, future changes or reduced pension allowances. 2029 NI note uses current NI rates and does not alter either current payroll figures or the projection.
- Child Benefit assumes full-year claims and that the user is the higher earner. Yearly estimated charge changes are spread over 12 months, not promised payroll timing. Charge increases/decreases are separately shown. Childcare eligibility remains conditional on partner income and other rules; funded hours text specifies England.
- Threshold button targets exactly £100,000 (eligible income boundary), rather than misleadingly claiming income must be strictly below it. Other near-band hints target £80,000 and £125,140.
- Changes have not been deployed.

## Product focus revision

The freedom-age result is now the main result, visible immediately after calculation. It is no longer a collapsed optional fourth step. The headline compares stopping ages and years gained, with Cautious/Middle/Hopeful outcomes immediately alongside. The page introduction now leads with time and pension/ISA choices.

A desired stopping-age input drives a dedicated savings-bridge comparison: savings needed at that age, existing-plan savings, selected-split savings and the remaining gap, under all three returns. The explanation distinguishes an access-only constraint from insufficient money overall. The ISA slider sits immediately after this bridge and repeats live stopping ages, with an action to try the earliest Middle example split. That example also shows all three return outcomes.

Payroll details are retained in an expandable section after the main result. Growth charts and detailed assumptions are secondary disclosures. No payroll formula changes in this revision.

Validation: typecheck and targeted ESLint; production build; local Chrome interaction checks for default visible headline, three scenarios, editable target age, changing bridge numbers, example-split action, a pension-rich/ISA-empty case, default £277/£483 payroll figures, 375px light/dark layouts with no horizontal overflow, desktop view, and zero browser errors.

## Existing £50,000 pension balance verification

Added independent closed-form tests for a £50,000 starting pot at 2%, 4% and 6% real returns over 20 years, both without future payments and with the existing/new annual contribution schedules. The £50,000 is included exactly once in both plans. Tests separately verify that it cannot fund spending before pension access; a zero-ISA case still fails the savings bridge while the pension continues growing.

Renamed the balance field to “Already saved in your pensions (£)” with an Explain tooltip distinguishing the current total across workplace/personal pots from future contributions and defined-benefit promised income. The generic £100,000 fictional default remains editable; no personal £50,000 value is stored or applied to other visitors.
