import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { pensionDecision } from '../calc/decision'
import type { ContributionBasis, ContributionMethod } from '../calc/types'
import { formatGbp } from '../calc/format'
import { Choice, NumberField, Section } from './Fields'
import { defaultInputs } from './defaults'
const RetirementCalculator = lazy(() => import('./PaydayToPension').then(module => ({ default: module.RetirementCalculator })))

interface Setup {
  salary: number | null; bonus: number; otherIncome: number; giftAidNet: number; otherRasAnnual: number
  employeePercent: number | null; currentWorkplaceAnnual: number | null; employerAnnual: number | null; extraMonthly: number
  basis: ContributionBasis | ''; method: ContributionMethod | ''; region: 'ewni' | 'scotland' | ''
  pensionAccessed: boolean; unsupportedIncome: boolean
}
const empty: Setup = { salary: null, bonus: 0, otherIncome: 0, giftAidNet: 0, otherRasAnnual: 0, employeePercent: null, currentWorkplaceAnnual: null, employerAnnual: null, extraMonthly: 500, basis: '', method: '', region: '', pensionAccessed: false, unsupportedIncome: false }
const example: Setup = { ...empty, salary: 110000, employeePercent: 5, employerAnnual: 3300, basis: 'full', method: 'salarySacrifice', region: 'ewni' }
const storageKey = 'pension-decision-v2'
function initial(): Setup {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (!saved || saved.version !== 2) return empty
    const result = { ...empty }
    for (const key of ['salary', 'bonus', 'otherIncome', 'giftAidNet', 'otherRasAnnual', 'employeePercent', 'currentWorkplaceAnnual', 'employerAnnual', 'extraMonthly'] as const) {
      const value = saved.inputs?.[key]
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0) result[key] = value
    }
    if (['full', 'qualifying'].includes(saved.inputs?.basis)) result.basis = saved.inputs.basis
    if (['salarySacrifice', 'netPay', 'reliefAtSource'].includes(saved.inputs?.method)) result.method = saved.inputs.method
    if (['ewni', 'scotland'].includes(saved.inputs?.region)) result.region = saved.inputs.region
    result.pensionAccessed = saved.inputs?.pensionAccessed === true
    result.unsupportedIncome = saved.inputs?.unsupportedIncome === true
    return result
  } catch { return empty }
}

export function PaydayToPension() {
  const [opening] = useState(() => {
    const saved = initial()
    const hasPersonalSetup = Object.entries(saved).some(([key, value]) => value !== empty[key as keyof Setup])
    return { setup: hasPersonalSetup ? saved : { ...example }, isExample: !hasPersonalSetup }
  })
  const [setup, setSetup] = useState<Setup>(opening.setup)
  const [isExample, setExample] = useState(opening.isExample)
  const [showRetirement, setRetirement] = useState(false)
  const legacy = typeof window !== 'undefined' && window.location.hash.startsWith('#v=1&')
  const patch = (value: Partial<Setup>) => { setSetup(previous => ({ ...previous, ...value })) }
  useEffect(() => {
    // Demo choices never become the visitor's saved personal setup.
    if (isExample) return
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 2, inputs: setup })) } catch { /* Storage is optional. */ }
  }, [setup, isExample])
  const ready = setup.salary != null && (setup.currentWorkplaceAnnual != null || (setup.employeePercent != null && setup.basis !== '')) && setup.employerAnnual != null && setup.method !== '' && setup.region !== ''
  const missing = [
    setup.salary == null ? 'annual salary' : '',
    !setup.region ? 'tax region' : '',
    !setup.method ? 'contribution method' : '',
    setup.currentWorkplaceAnnual == null && !setup.basis ? 'earnings basis' : '',
    setup.currentWorkplaceAnnual == null && setup.employeePercent == null ? 'current pension %' : '',
    setup.employerAnnual == null ? 'employer contribution' : '',
  ].filter(Boolean)
  const decision = ready ? pensionDecision({ ...setup, salary: setup.salary!, employeePercent: setup.employeePercent ?? 0, employerAnnual: setup.employerAnnual!, basis: (setup.basis || 'full') as ContributionBasis, method: setup.method as ContributionMethod }) : null
  const unsupported = setup.region === 'scotland' || setup.pensionAccessed || setup.unsupportedIncome
  const valid = decision != null && !unsupported && decision.issues.length === 0
  const retirement = decision ? { ...defaultInputs, grossAnnualSalary: (setup.salary ?? 0) + setup.bonus, contributionBasis: 'full' as const, employeePercent: ((decision.existing + setup.extraMonthly * 12) / Math.max(1, (setup.salary ?? 0) + setup.bonus)) * 100, employerPercent: (setup.employerAnnual ?? 0) / Math.max(1, (setup.salary ?? 0) + setup.bonus) * 100, salarySacrifice: setup.method === 'salarySacrifice' ? 'yes' as const : 'no' as const, taxRelief: setup.method === 'netPay' ? 'netPay' as const : 'reliefAtSource' as const } : undefined
  const demo = () => { setSetup({ ...example }); setExample(true); requestAnimationFrame(() => document.getElementById('decision-results')?.scrollIntoView({ block: 'start' })) }

  return <div className="pension-tool mt-16 sm:mt-20 bg-[color:var(--pension-canvas)] p-4 text-[color:var(--pension-ink)] sm:p-6">
    <SEO title="UK Pension Contribution Calculator" description="Compare how extra pension contributions affect take-home pay and adjusted net income. A UK calculator with clearly stated assumptions." canonicalUrl="https://jiazhenxie.com/payday-to-pension" />
    <header className="mx-auto max-w-6xl py-5">
      <p className="pension-eyebrow">PAYDAY TO PENSION · 2026/27</p>
      <h1 className="font-serif text-3xl leading-tight text-[color:var(--pension-accent)] sm:text-4xl">Understand your pension contributions.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--pension-muted)]">A small calculator to connect pension contributions with take-home pay. Compare a change using your own setup, or start with an example.</p>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm"><button type="button" onClick={demo} className="underline underline-offset-4">View an example</button><Link to="/blog/why-i-built-payday-to-pension" className="underline underline-offset-4">Why I built this →</Link></div>
      {isExample && <div role="status" className="mt-4 rounded-xl border border-[color:var(--pension-border)] p-3 text-xs leading-relaxed"><strong>Example setup — hypothetical inputs.</strong> You can edit them to explore. <button type="button" className="underline underline-offset-2" onClick={() => { setSetup(initial()); setExample(false); requestAnimationFrame(() => document.getElementById('pension-setup')?.scrollIntoView({ block: 'start' })) }}>Return to my setup</button></div>}
      <p className="mt-3 text-xs text-[color:var(--pension-muted)]">Annual estimate · England, Wales & Northern Ireland · inputs stay in this browser</p>
      <details className="mt-2 text-xs leading-relaxed text-[color:var(--pension-muted)]"><summary className="cursor-pointer underline underline-offset-2">What this estimate covers</summary><p className="mt-2">Full-year amounts are divided by 12. Bonus timing, tax codes and actual monthly National Insurance can differ. Supports employment income and optional non-savings income. Savings/dividends, shares, Scottish tax and reduced annual allowances are outside scope.</p></details>
    </header>
    <div className="mx-auto grid max-w-6xl items-start gap-5 lg:grid-cols-2">
      <form id="pension-setup" className="scroll-mt-24 space-y-4" onSubmit={event => event.preventDefault()}>
        <Section title="1. This tax year’s income">
          <Choice name="decision-region" label="Which income tax rates apply?" value={setup.region} options={[{ value: 'ewni', label: 'England / Wales / NI' }, { value: 'scotland', label: 'Scotland' }]} onChange={region => patch({ region })} />
          <NumberField id="decision-salary" label="Annual base salary before pension sacrifice" prefix="£" value={setup.salary} onChange={salary => patch({ salary })} />
          <NumberField id="decision-bonus" label="Expected cash bonus this tax year" hint="Enter the gross amount before any pension exchange. Leave 0 if none. Excludes shares and benefits in kind." prefix="£" value={setup.bonus} onChange={bonus => patch({ bonus: bonus ?? 0 })} />
        </Section>
        <Section title="2. Confirm your pension setup">
          <Choice name="decision-method" label="How does your contribution go in?" value={setup.method} options={[{ value: 'salarySacrifice', label: 'Salary sacrifice' }, { value: 'netPay', label: 'Net pay' }, { value: 'reliefAtSource', label: 'Relief at source' }]} onChange={method => patch({ method })} />
          <details className="text-xs leading-relaxed text-[color:var(--pension-muted)]"><summary className="cursor-pointer underline">Not sure? Where to check</summary><p className="mt-2">Check your benefits portal or ask payroll: “Is this salary sacrifice, net pay, or relief at source? Which earnings are the percentages based on?” Salary sacrifice exchanges gross salary for pension; net pay deducts pension before Income Tax; relief at source means the provider adds basic-rate relief. Use the labelled example until you know.</p></details>
          <Choice name="decision-basis" label="Your current % is based on…" value={setup.basis} options={[{ value: 'full', label: 'Base salary before sacrifice' }, { value: 'qualifying', label: 'Qualifying earnings' }]} onChange={basis => patch({ basis })} />
          <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">Base salary excludes bonus here. Qualifying earnings includes cash bonus in the annual £6,240–£50,270 band. Schemes based on a different pay definition need payroll figures instead.</p>
          <NumberField id="decision-percent" label="Your current gross pension %" hint="For relief at source, include the provider’s basic-rate top-up; this is not just the net amount deducted from your bank or pay." suffix="%" value={setup.employeePercent} max={100} step={.5} onChange={employeePercent => patch({ employeePercent })} />
          <NumberField id="decision-employer" label="Employer pension contribution this tax year" hint="Annual pounds, excluding your salary sacrifice. Keep it unchanged in this comparison; include any matching you already receive. Enter 0 explicitly if none." prefix="£" value={setup.employerAnnual} onChange={employerAnnual => patch({ employerAnnual })} />
          {decision && <p className="rounded-xl bg-[color:var(--pension-tint)] p-3 text-xs leading-relaxed">Current employee contribution: {setup.currentWorkplaceAnnual != null ? 'confirmed payroll amount' : `${setup.employeePercent}% × ${formatGbp(decision.base)}`} = {formatGbp(decision.existing)} gross / year. Employer: {formatGbp(setup.employerAnnual ?? 0)} / year.</p>}
        </Section>
        <details className="rounded-2xl border border-[color:var(--pension-border)] bg-[color:var(--pension-surface)] p-4"><summary className="cursor-pointer text-sm">Other income, personal pensions & scope checks</summary><div className="mt-4 space-y-4">
          <NumberField id="decision-payroll-override" label="Confirmed gross workplace pension this year (optional override)" hint="Use the annual payroll figure for your own contribution or salary exchange, including provider top-up where applicable. Exclude employer pension and personal/SIPP contributions. If entered, this replaces the current percentage calculation above; the earnings-basis choice is then unnecessary." prefix="£" optional value={setup.currentWorkplaceAnnual} onChange={currentWorkplaceAnnual => patch({ currentWorkplaceAnnual })} />
          <NumberField id="decision-other" label="Other taxable non-savings income this year" hint="For example taxable rental profit, after allowable expenses. No extra National Insurance is modelled on this amount. Do not put dividends, savings interest, self-employment or foreign income here." prefix="£" value={setup.otherIncome} onChange={otherIncome => patch({ otherIncome: otherIncome ?? 0 })} />
          <NumberField id="decision-other-pension" label="Other personal pension / SIPP contributions this year (gross)" hint="Existing relief-at-source contributions only, including the provider top-up. Do not include the workplace pension above or the new extra contribution below. Net-pay and salary-sacrifice arrangements belong in the main setup." prefix="£" value={setup.otherRasAnnual} onChange={otherRasAnnual => patch({ otherRasAnnual: otherRasAnnual ?? 0 })} />
          <NumberField id="decision-gift" label="Gift Aid donations you pay this year (net)" hint="We gross this up by 25% for adjusted net income and tax-band extension." prefix="£" value={setup.giftAidNet} onChange={giftAidNet => patch({ giftAidNet: giftAidNet ?? 0 })} />
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={setup.unsupportedIncome} onChange={event => patch({ unsupportedIncome: event.target.checked })} />I have savings interest, dividends, shares/RSUs, benefits in kind, self-employment or foreign income.</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={setup.pensionAccessed} onChange={event => patch({ pensionAccessed: event.target.checked })} />I have flexibly accessed a pension, or a reduced annual allowance applies to me.</label>
        </div></details>
        {ready && <a href="#decision-results" className="inline-block rounded-xl bg-[color:var(--pension-accent)] px-4 py-3 text-sm text-[color:var(--pension-on-accent)]">See my comparison ↓</a>}
        <button type="button" className="ml-3 text-xs underline" onClick={() => { setSetup(empty); setExample(false); setRetirement(false) }}>Clear my setup</button>
      </form>
      <section aria-labelledby="decision-results-title" className="space-y-4 lg:sticky lg:top-24">
        <div id="decision-results" className="scroll-mt-24 rounded-3xl border border-[color:var(--pension-border-strong)] bg-[color:var(--pension-surface)] p-5">
          <h2 id="decision-results-title" className="font-serif text-2xl text-[color:var(--pension-accent)]">{isExample ? 'Example — not your forecast' : 'Your comparison'}</h2>
          {isExample && <div className="mt-3 text-xs leading-relaxed"><p>These are example scheme choices, even if you edit a number. Check every input against your own setup.</p><button type="button" className="mt-2 underline" onClick={() => setExample(false)}>I’ve checked the inputs — use as my setup</button></div>}
          <div className="my-4 space-y-2 border-b border-[color:var(--pension-border)] pb-4">
          <NumberField id="decision-extra" label="Extra gross pension each month" prefix="£" value={setup.extraMonthly} max={10000} step={50} onChange={extraMonthly => patch({ extraMonthly: extraMonthly ?? 0 })} />
          <p className="text-xs text-[color:var(--pension-muted)]">This is extra money into the pension, not your reduction in take-home pay. Annualised over 12 months; employer contribution held fixed.</p>
          </div>
          {!ready && <div className="mt-3 text-sm leading-relaxed"><p>Still needed: {missing.join(', ')}.</p><p className="mt-2 text-xs text-[color:var(--pension-muted)]">Use a current pension % with a confirmed earnings basis, or an annual payroll amount in optional settings.</p><a href="#pension-setup" className="mt-2 inline-block underline">Complete my setup ↑</a></div>}
          {ready && <a href="#pension-setup" className="mt-3 inline-block text-xs underline underline-offset-2">Edit income & pension setup ↑</a>}
          {unsupported && <p role="alert" className="mt-3 text-sm leading-relaxed">This setup is outside the supported calculation. Scottish tax, savings/dividend tax, share awards, self-employment, foreign income and reduced annual allowances need a separate assessment. We won’t show a personal tax-saving figure.</p>}
          {decision?.issues.map(issue => <p role="alert" key={issue} className="mt-3 text-sm leading-relaxed">{issue}</p>)}
          {valid && decision && <>
            <dl className="pension-tradeoff mt-4" aria-live="polite" aria-atomic="true"><div><dt>Less cash / month, after tax relief</dt><dd>{formatGbp(decision.finalCostMonthly)}</dd><small>Annual net cost ÷ 12</small></div><div><dt>Extra pension / month</dt><dd>{formatGbp(setup.extraMonthly)}</dd><small>Gross contribution</small></div></dl>
            {(setup.method === 'reliefAtSource' || setup.otherRasAnnual > 0) && <div className="mt-4 rounded-xl bg-[color:var(--pension-tint)] p-3 text-sm leading-relaxed"><strong>Cash before extra HMRC relief:</strong> {formatGbp(decision.cashCostMonthly)} more cash paid / month. Additional tax relief from this change: {formatGbp(decision.extraReliefAnnual)} / year, equivalent to {formatGbp(decision.extraReliefAnnual / 12)} / month. A claim or tax-code change may be needed; it is not assumed already on your payslip.</div>}
            <h3 className="mt-5 font-medium">Income & allowances</h3>
            {decision.before.ani >= 90000 && <div className="mt-4 space-y-2 text-xs" aria-hidden="true">
              {([['Now', decision.before.ani], ['After', decision.after.ani]] as const).map(([label, income]) => {
                const scale = Math.max(110000, Math.ceil(decision.before.ani / 10000) * 10000)
                return <div key={label} className="flex items-center gap-2"><span className="w-10">{label}</span><div className="relative h-4 flex-1 rounded bg-[color:var(--pension-border)]"><div className="h-4 rounded" style={{ width: `${Math.max(0, income) / scale * 100}%`, background: label === 'After' ? 'var(--pension-positive)' : 'var(--pension-accent)' }} /><span className="absolute -top-1 bottom-[-4px] border-l-2 border-dashed border-[color:var(--pension-ink)]" style={{ left: `${100000 / scale * 100}%` }} /></div></div>
              })}
              <p className="text-right text-[color:var(--pension-muted)]">Dashed marker: £100,000 adjusted net income · bars start at £0</p>
            </div>}
            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm"><div><dt>Adjusted net income now</dt><dd className="mt-1 text-xl">{formatGbp(decision.before.ani)}</dd></div><div><dt>After the change</dt><dd className="mt-1 text-xl">{formatGbp(decision.after.ani)}</dd></div><div><dt>Personal Allowance now</dt><dd>{formatGbp(decision.before.allowance)}</dd></div><div><dt>After the change</dt><dd>{formatGbp(decision.after.allowance)}</dd></div></dl>
            {decision.before.ani >= 90000 && <p className="mt-3 text-sm leading-relaxed">{decision.before.ani <= 100000 ? 'You are already at or below £100,000 on these inputs.' : decision.after.ani <= 100000 ? 'This change brings your estimated adjusted net income to £100,000 or below.' : `You would still be ${formatGbp(decision.after.ani - 100000)} above £100,000.`}</p>}
            {decision.extraNeededFor100k > 0 && <button type="button" className="mt-3 rounded-xl border border-[color:var(--pension-accent)] px-3 py-2 text-sm" onClick={() => patch({ extraMonthly: Math.ceil(decision.extraNeededFor100k / 12 * 100) / 100 })}>Compare a £100,000 adjusted-income scenario ({formatGbp(decision.extraNeededFor100k)} / year)</button>}
            <p className="mt-4 text-xs leading-relaxed text-[color:var(--pension-muted)]">Total projected pension contributions this year, including employer: {formatGbp(decision.annualPension)}. No extra employer matching is assumed. Salary sacrifice must also satisfy your employer’s rules and minimum-wage requirements.</p>
            <details className="mt-4 text-xs leading-relaxed text-[color:var(--pension-muted)]"><summary className="cursor-pointer underline">Childcare & calculation details</summary><p className="mt-2">The £100k test uses adjusted net income, not salary alone. Childcare eligibility can change for you or your partner; other conditions apply. No childcare savings are included. The estimate covers a full 2026/27 tax year, not a part-year payroll change. Net pay and sacrifice tax relief are reflected immediately in the annual model; relief at source separates the initial payment from additional relief. NI uses annual employment earnings for a standard category A employee below State Pension age; actual bonus-month NI can differ. Student loan repayments and benefits are not included. Carry-forward, tax charges and multiple-pension allowances are not calculated.</p><p className="mt-2"><a className="underline" href="https://www.gov.uk/guidance/adjusted-net-income">HMRC adjusted net income</a> · <a className="underline" href="https://www.gov.uk/tax-on-your-private-pension/pension-tax-relief">Pension tax relief</a> · <a className="underline" href="https://www.gov.uk/tax-free-childcare">Childcare eligibility</a></p></details>
          </>}
        </div>
      </section>
    </div>
    <details className="mx-auto mt-8 max-w-6xl rounded-2xl border border-[color:var(--pension-border)] p-4" open={showRetirement} onToggle={event => setRetirement(event.currentTarget.open)}><summary className="cursor-pointer font-serif text-xl">Then explore the long-term retirement picture</summary>
      <p className="mt-3 text-xs leading-relaxed text-[color:var(--pension-muted)]">Separate illustrative projection: adjust the starting age, retirement age and existing pot. This year’s salary plus bonus and pension contributions repeat every year; other income, personal/SIPP contributions and Gift Aid are not carried into the projection. Future tax rules and bonus income may change.</p>
      {showRetirement && valid ? <Suspense fallback={<p>Loading projection…</p>}><RetirementCalculator key={JSON.stringify(retirement)} initialInputs={retirement} /></Suspense> : <p className="mt-3 text-sm">Complete a supported pension setup above to initialise the projection.</p>}
    </details>
    {legacy && <details className="mx-auto mt-4 max-w-6xl p-4"><summary className="cursor-pointer">Open your older retirement share link</summary><Suspense fallback={<p>Loading saved projection…</p>}><RetirementCalculator /></Suspense></details>}
    <footer className="mx-auto mt-6 max-w-6xl text-xs leading-relaxed text-[color:var(--pension-muted)]">This is a calculator, not financial advice. Figures are estimates. Pension money is generally locked until pension access age; future withdrawals may be taxable. Check scheme details and your own tax position before changing contributions.</footer>
  </div>
}
