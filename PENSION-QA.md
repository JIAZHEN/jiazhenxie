# Pension calculator QA — 23 October 2026

## Completed

- 912 annual payroll calculation scenarios checked against a separately written tax/NI reference implementation (not the calculator's tax helper).
- 64 budget-solver scenarios checked for budget overspend, valid target percentages, pension allowance limits and earnings capacity.
- 7 invalid model inputs rejected: negative amounts, NaN, Infinity and out-of-range contribution rates.
- Threshold coverage: £6,240, £12,570, £50,270, £100,000, £125,140 and £200,000, including adjacent pennies where relevant.
- Zero salary, zero contributions, zero budget, 100% contribution, qualifying-earnings caps, separate employee/employer bases and changed employer contributions covered by the audit and existing regression checks.
- Production build, TypeScript and existing pension page metadata/model checks passed.

Run: `npm run build && npm run check:pension`.

## Payroll scope

The calculator estimates annual tax divided by 12. It does not reproduce cumulative PAYE ledgers, individual tax codes, or payroll rounding. The simple wizard assumes current net-pay contributions; other methods are outside the simplified calculator’s scope.

Personal validation inputs and reconciliation details are excluded from the published repository.

## Fixed during this audit

- Hide wizard results while numeric entries are invalid; expose invalid fields accessibly.
- Reject invalid amounts and percentages at the model boundary.
- Stack the money comparison on screens at or below 380 CSS pixels.
- Keep grid children shrinkable and wizard labels wrappable.
- Position hint popups within horizontal viewport margins rather than allowing a right-edge popup to overflow.
- State that salary sacrifice must preserve minimum-wage pay. The calculator does not have contracted-hours/age inputs to certify a permitted sacrifice rate.

## Not verified — do not treat as passed

The browser security policy refused this turn's attempt to acquire the localhost preview. Its explicit instruction prohibited alternate browser surfaces or indirect workarounds, so no device-emulation or new browser interaction tests were performed this turn.

Pending browser matrix: 320, 360, 375, 390, 414, 768, 1024 and 1440 CSS pixel widths; portrait/landscape; light/dark; all three steps; optional employer settings; hints near viewport edges; invalid text, blank, negative and very large values; Back/Next/reset; percentage/budget switching. CSS was inspected and adjusted, but that is not visual QA.

No real payroll-system connection is available. Formula verification is not certification by payroll software.

## Rules checked

- https://www.gov.uk/income-tax-rates
- https://www.gov.uk/national-insurance-rates-letters
- https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay

## Simplification follow-up

Removed the second calculator and the budget input mode from the page. Employer NI sharing now accepts 0–100% of actual employer NI savings. Regression checks cover 0%, 60%, 100%, an invalid 101% and the employer NI threshold. Production build and calculation checks passed; new visual verification remains blocked as described above.
