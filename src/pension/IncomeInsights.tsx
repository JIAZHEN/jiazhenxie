import { compareSchemeSwitch, type SchemeSwitchInputs } from '../calc/schemeSwitch'
import { exchangeRate, incomeCliffs, niSavingAffected } from '../calc/pensionInsights'
import { CHILDCARE_INCOME_LIMIT, CLIFF_HINT_DISTANCE, CHILDCARE_MAX_ANNUAL, CHILD_BENEFIT_CHARGE_END, HIGHER_RATE_LIMIT } from '../uk-constants'
import { pensionablePay } from '../calc/contributions'
import { formatGbp } from '../calc/format'
import { Hint } from './Hint'

export function IncomeInsights({ input, childcare, setTarget, showExchange = true }: { input: SchemeSwitchInputs; childcare: boolean; setTarget: (percent: number) => void; showExchange?: boolean }) {
  const r = compareSchemeSwitch(input)
  const exchange = exchangeRate(r.extraMonthly, r.cashCostMonthly)
  const before = incomeCliffs(r.beforeAni), after = incomeCliffs(r.afterAni)
  const affected = niSavingAffected(input.salary, r.sacrificeMonthly * 12)
  const above = r.afterAni - CHILDCARE_INCOME_LIMIT
  const target = (input.salary - CHILDCARE_INCOME_LIMIT) * 100 / pensionablePay(input.salary, input.targetBasis ?? 'full')
  return <div className="my-4 space-y-3 text-sm">
    {showExchange && exchange && <p className="rounded-xl bg-[color:var(--pension-tint)] p-4 font-serif text-xl">{exchange.kind === 'ratio' ? `Every £1 less in your take-home pay puts £${exchange.value.toFixed(2)} into your pension.` : exchange.kind === 'gain' ? `You keep ${formatGbp(exchange.value)} more take-home pay AND add ${formatGbp(r.extraMonthly)} to your pension each month.` : `This change costs you nothing in take-home pay: £0 less pay, ${formatGbp(r.extraMonthly)} more pension each month.`}</p>}
    <p>Income used for these thresholds: {formatGbp(r.beforeAni)} before → {formatGbp(r.afterAni)} after, a year. <Hint text="Adjusted net income means income after pension contributions that qualify for tax relief. This example has salary and pension only; other income, Gift Aid and your partner’s circumstances can change eligibility." /></p>
    {(before.childBenefit || after.childBenefit || (input.children ?? 0) > 0) && <article className="rounded-xl border border-[color:var(--pension-border)] p-3"><p>Between £60,000 and £80,000, you pay back 1% of Child Benefit for every full £200 above £60,000; at £80,000 it is all repaid.</p>{(input.children ?? 0) > 0 ? <p>This change {r.childBenefitSavingMonthly >= 0 ? 'keeps' : 'costs'} {formatGbp(Math.abs(r.childBenefitSavingMonthly * 12))} a year of Child Benefit. Included in the monthly take-home comparison as a yearly charge spread over 12 months, assuming you are the higher earner and claim for a full year. A higher-earning partner can change this.</p> : <p>Add children in step 1 to include a Child Benefit charge estimate.</p>}</article>}
    {(before.allowanceTaper || after.allowanceTaper) && <article className="rounded-xl border border-[color:var(--pension-border)] p-3">Between £100,000 and £125,140, every £2 of income removes £1 of tax-free Personal Allowance. Income Tax on this slice is effectively 60%, plus NI; the tax saving above already includes this.</article>}
    {(before.childcareLost || after.childcareLost || r.beforeAni === CHILDCARE_INCOME_LIMIT || r.afterAni === CHILDCARE_INCOME_LIMIT) && <article className="rounded-xl border border-[color:var(--pension-border)] p-3">Above £100,000 you lose Tax-Free Childcare and England’s funded hours for working parents (other funded hours have different rules). {childcare && before.childcareLost && !after.childcareLost ? `This change could regain support: it can be worth up to ${formatGbp(CHILDCARE_MAX_ANNUAL)} per child per year in Tax-Free Childcare, plus funded hours.` : 'Check both parents’ income and the other eligibility rules.'} No childcare value is included in take-home pay.</article>}
    {above > 0 && above <= CLIFF_HINT_DISTANCE && target <= 100 && <p>You are {formatGbp(above)} above the £100,000 line. Sacrificing {formatGbp(above)} more a year would bring you to the line. <button type="button" className="underline" onClick={() => setTarget(target)}>Set sacrifice to £100,000 income</button></p>}
    {[CHILD_BENEFIT_CHARGE_END, HIGHER_RATE_LIMIT].map(line => {
      const distance = r.afterAni - line
      const percent = (input.salary - line) * 100 / pensionablePay(input.salary, input.targetBasis ?? 'full')
      return distance > 0 && distance <= CLIFF_HINT_DISTANCE && percent <= 100 ? <p key={line}>You are {formatGbp(distance)} above the {formatGbp(line)} line. Sacrificing {formatGbp(distance)} more a year would bring you to that line. <button type="button" className="underline" onClick={() => setTarget(percent)}>Set sacrifice to this line</button></p> : null
    })}
    <p className="text-xs text-[color:var(--pension-muted)]">From April 2029, only the first £2,000 a year of salary-sacrificed pension contributions will be free of National Insurance (November 2025 Budget). At today’s rates, {formatGbp(affected.employee)} / year of your employee NI saving and {formatGbp(affected.employer)} / year of the employer saving would be affected. Current figures above are unchanged.</p>
  </div>
}
