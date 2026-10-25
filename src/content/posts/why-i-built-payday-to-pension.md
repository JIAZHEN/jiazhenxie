---
title: Why I built Payday to Pension
description: What could £200 less monthly take-home pay add to your pension? Explore tax relief, the £100k threshold and employer matching with Payday to Pension.
date: 2026-10-22T00:00:00.000Z
updated: 2026-10-25T00:00:00.000Z
tags:
  - personal-finance
  - pensions
  - building-tools
draft: false
---

If I gave up a little take-home pay each month, when could I stop working?

That is the question I wanted to answer. Most pension calculators stop one step earlier. They tell you how much less you take home and how much more goes into your pension. That is useful, but it is not what I actually wanted to know.

So I rebuilt Payday to Pension around one question: what could a little less take-home pay buy you?

All figures here are hypothetical. They use 2026/27 rules for England, Wales and Northern Ireland.

## The example that changed how I built it

Take someone who is 35, earns £80,000 and wants to live on £24,000 a year once they stop. They have £100,000 in pensions, £20,000 in an ISA, and already save £200 a month into it. They pay 5% into their workplace pension and their employer pays 3%.

They decide they can give up £275 a month of take-home pay. Where should it go?

| Where the £275 goes | Could stop at |
|---|---|
| Nowhere, keep things as they are | 53 |
| All into the pension (+£474 a month, after tax and NI relief) | 53 |
| All into an ISA | 50 |

Putting more into the pension does not let them stop any earlier. Not by a single year.

That surprised me. The pension gets the better deal: every £1 of take-home pay becomes about £1.72 in the pension, and only £1 in the ISA. So why does it lose?

## The years before 57

Private pensions are locked until 57 (from April 2028). If you want to stop at 50, you have 7 years of bills that your pension cannot pay. Only money you can reach, like an ISA, can cover them.

In this example, the pension is already big enough for later life. What holds them back is those 7 years. Extra pension money just sits there, locked, while the gap stays the same.

Once I saw that, a lot of advice I had heard started to sound incomplete. "Put more into your pension" is often right. It is not always the thing that gets you there sooner.

## It is not always the ISA

The answer changes with your numbers.

On a salary above £100,000, pension money can be worth much more. Between £100,000 and £125,140 you lose some of your tax-free allowance, so each £1 you give up can become about £2.63 in your pension. There, a split often works best: most of it to the pension, a little to an ISA to cover the locked years.

It also depends on what you assume about growth. In a cautious example (2% a year after price rises), the same £80,000 person does slightly better with the pension. In a hopeful one (6%), the ISA wins by more. The tool shows all three, because I don't think anyone knows which one we will get.

## What the tool shows

- The age you could stop, with and without the change.
- Where the money should go: all pension, all ISA, or a split, with a range for cautious and hopeful growth.
- What you would live on in each stage after you stop. For example, £2,000 a month in today's money would be about £2,897 a month in 2041, because prices rise. That is the number your bank account would actually show.

It also tells you when you are near £100,000, when Child Benefit changes, and what the April 2029 limit on National Insurance relief for salary sacrifice could mean.

<h2 id="the-rules-behind-the-numbers">The rules behind the numbers</h2>

The headline uses 2026/27 tax and National Insurance rules. Your existing employee pension contribution is treated as net pay. The extra contribution uses salary sacrifice. Your employer keeps the same contribution percentage. If you choose Half or All, the tool adds that share of the employer's NI saving on your extra sacrifice to your pension.

From 6 April 2029, only the first £2,000 a year of pension salary sacrifice is free of employee and employer NI. Income Tax relief continues above that limit, and pension contributions still reduce the income used to check childcare eligibility. The projection applies the NI change from 2029/30. It holds the £2,000 cap fixed in cash in later years as a modelling assumption. Further details on how the limit will work are still to be set out. See [the government's explanation](https://www.gov.uk/government/publications/changes-to-salary-sacrifice-for-pensions-from-april-2029/changes-to-salary-sacrifice-for-pensions-from-april-2029).

Up to a quarter of each pension withdrawal is tax-free until total tax-free cash reaches £268,275 across your lifetime. The model tracks this in pounds at the time you take it. The cap does not rise with prices. Once it is used, all further pension withdrawals are taxable income. The tool assumes you have not already taken any tax-free cash and have no protected allowance. See [HMRC's lump sum allowance rules](https://www.gov.uk/tax-on-your-private-pension/lump-sum-allowance).

Tax bands rise with prices in this model. In reality, they are frozen until 2031, so tax could be higher. Projected pension and ISA balances are rounded to thousands because these are estimates, not precise forecasts.

<h2 id="childcare-support">Childcare support</h2>

If you enter children aged 11 or under, the tool checks your income after the pension contribution on your selected plan. If it is above £100,000 and no more than £125,140, it shows the extra monthly take-home pay you would need to give up to bring it down to £100,000.

The amount you could get back counts Tax-Free Childcare only: up to £2,000 per eligible child each year, depending on what you spend on childcare. Eligibility normally ends in September after a child turns 11. Both parents must meet the rules, including income of no more than £100,000 each. Other work and eligibility conditions apply. See [the Tax-Free Childcare eligibility rules](https://www.gov.uk/tax-free-childcare/check-if-youre-eligible).

Free childcare hours in England could be worth more. Their value depends on the child's age and the nursery, so the tool shows a note rather than a cash estimate. See [the free childcare eligibility rules](https://www.gov.uk/free-childcare-if-working/check-youre-eligible).

Neither Tax-Free Childcare nor free childcare hours are added to the retirement projection.

## What it does not do

It is a simple model. Growth is the same every year. It ignores fees, pay rises, bonuses, Scottish tax rates and future rule changes. It assumes a full State Pension and money that needs to last to 95. Nothing you type is stored or sent anywhere.

Use it to find the right question, then check the details with your scheme and payroll.

## Why it matters to me

"Save more for retirement" is easy to agree with and hard to act on. "Give up £275 a month and you could stop three years earlier, if it goes into the right place" is something you can actually decide about.

That is the kind of answer I wanted.

[Try Payday to Pension →](/payday-to-pension?example=80k)
