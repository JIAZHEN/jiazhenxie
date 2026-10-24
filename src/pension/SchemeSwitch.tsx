import { Freedom } from './Freedom'
import { IncomeInsights } from './IncomeInsights'
import { useState } from 'react'
import { compareSchemeSwitch, type SchemeSwitchInputs } from '../calc/schemeSwitch'
import { pensionablePay } from '../calc/contributions'
import type { ContributionBasis } from '../calc/types'
import { formatGbp } from '../calc/format'
import { Choice, NumberField, Section } from './Fields'

const example: SchemeSwitchInputs = { salary: 80000, currentMethod: 'netPay', currentGrossMonthly: 200, employerMonthly: 150, targetPercent: 10, niTopUpPercent: 0, employerNiSharePercent: 0 }
const basisOptions: { value: ContributionBasis; label: string }[] = [{ value: 'full', label: 'Full base salary' }, { value: 'qualifying', label: 'Qualifying earnings' }]
const primary = 'rounded-xl bg-[color:var(--pension-accent)] px-5 py-3 text-sm font-medium text-[color:var(--pension-on-accent)] disabled:opacity-40'

export function SchemeSwitch() {
  const [childcare, setChildcare] = useState(false)
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({})
  const hasInvalidFields = Object.values(invalidFields).some(Boolean)
  const fieldValidity = (id: string, valid: boolean) => setInvalidFields(previous => ({ ...previous, [id]: !valid }))
  const [submittedKey, setSubmittedKey] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [input, setInput] = useState(example)
  const [entryMode, setEntryMode] = useState<'percent' | 'monthly'>('percent')
  const [employeeBasis, setEmployeeBasis] = useState<ContributionBasis>('qualifying')
  const [employerBasis, setEmployerBasis] = useState<ContributionBasis>('qualifying')
  const [employeeRate, setEmployeeRate] = useState(5)
  const [employerRate, setEmployerRate] = useState(3)
  const [targetBasis, setTargetBasis] = useState<ContributionBasis>('full')
  const [keepEmployer, setKeepEmployer] = useState(true)
  const [newEmployerRate, setNewEmployerRate] = useState(3)
  const [newEmployerBasis, setNewEmployerBasis] = useState<ContributionBasis>('qualifying')
  const patch = (value: Partial<SchemeSwitchInputs>) => setInput(previous => ({ ...previous, ...value }))
  const employeeMonthly = entryMode === 'percent' ? pensionablePay(input.salary, employeeBasis) * employeeRate / 1200 : input.currentGrossMonthly
  const employerMonthly = entryMode === 'percent' ? pensionablePay(input.salary, employerBasis) * employerRate / 1200 : input.employerMonthly
  const employerAfterMonthly = keepEmployer ? employerMonthly : pensionablePay(input.salary, newEmployerBasis) * newEmployerRate / 1200
  const current = { ...input, currentGrossMonthly: employeeMonthly, employerMonthly, employerAfterMonthly, targetBasis }
  const result = compareSchemeSwitch(current)
  const calculationKey = JSON.stringify(current)
  const showResult = submittedKey === calculationKey && !hasInvalidFields
  const targetPercent = input.targetPercent
  const supported = !hasInvalidFields && input.salary > 0 && input.salary <= 200000 && result.issues.length === 0
  const go = (next: number) => { if (next < 3) setSubmittedKey(null); setStep(next); requestAnimationFrame(() => document.getElementById('switch-inputs')?.scrollIntoView({ block: 'start' })) }
  const reset = () => { setSubmittedKey(null); setInvalidFields({}); setInput(example); setChildcare(false); setStep(1); setEntryMode('percent'); setEmployeeBasis('qualifying'); setEmployerBasis('qualifying'); setEmployeeRate(5); setEmployerRate(3); setTargetBasis('full'); setKeepEmployer(true); setNewEmployerRate(3); setNewEmployerBasis('qualifying') }
  return <section id="switch-inputs" className="mx-auto max-w-6xl scroll-mt-24 space-y-5" aria-label="Pension calculator">
    <nav aria-label="Calculator steps" className="grid grid-cols-3 gap-2">
      {['Your salary', 'Current pension', 'Make a change'].map((label, index) => <button key={label} type="button" aria-current={step === index + 1 ? 'step' : undefined} disabled={index > 0 && (input.salary <= 0 || input.salary > 200000 || hasInvalidFields)} onClick={() => go(index + 1)} className={`rounded-xl border p-3 text-left text-sm ${step === index + 1 ? 'border-[color:var(--pension-accent)] bg-[color:var(--pension-tint)]' : 'border-[color:var(--pension-border)]'}`}><span className="mr-2 font-semibold">{index + 1}</span>{' '}{label}</button>)}
    </nav>
    <p className="text-xs text-[color:var(--pension-muted)]">Fictional example · edit any figure · your inputs stay in this page</p>
    {step === 1 && <Section title="1. What do you earn?" intro="Use your annual base salary before pension deductions.">
      <NumberField id="switch-salary" onValidityChange={valid => fieldValidity("switch-salary", valid)} label="Annual salary" prefix="£" value={input.salary} onChange={value => patch({ salary: value ?? 0 })} />
      <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">2026/27 · England, Wales & Northern Ireland. This simple comparison excludes bonuses, other income, benefits and student loans.</p>
      <details><summary className="cursor-pointer text-sm underline">Do you have children? (optional)</summary><div className="mt-3 space-y-3">
        <NumberField id="benefit-children" label="Number of children you get Child Benefit for" value={input.children ?? 0} max={20} onValidityChange={valid => fieldValidity('benefit-children', valid)} onChange={value => patch({ children: Math.floor(value ?? 0) })} />
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={childcare} onChange={e => setChildcare(e.target.checked)} />Do you use, or plan to use, Tax-Free Childcare or funded childcare hours?</label>
      </div></details>
      {input.salary > 200000 && <p role="alert" className="text-sm">Above £200,000, a separate pension allowance assessment is needed.</p>}
      <button type="button" className={primary} disabled={input.salary <= 0 || input.salary > 200000 || hasInvalidFields} onClick={() => go(2)}>Next: your current pension →</button>
    </Section>}
    {step === 2 && <Section title="2. What goes into your pension today?" intro="Your rate and your employer’s rate can use different earnings bases.">
      <Choice name="switch-entry" label="Enter your contributions as…" value={entryMode} options={[{ value: 'percent', label: 'Percentages' }, { value: 'monthly', label: 'Monthly amounts' }]} onChange={mode => {
        if (mode === 'monthly') patch({ currentGrossMonthly: employeeMonthly, employerMonthly })
        else { const employeeBase = pensionablePay(input.salary, employeeBasis); const employerBase = pensionablePay(input.salary, employerBasis); if (employeeBase > 0) setEmployeeRate(employeeMonthly * 1200 / employeeBase); if (employerBase > 0) setEmployerRate(employerMonthly * 1200 / employerBase) }
        setEntryMode(mode)
      }} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-[color:var(--pension-border)] p-4"><h3 className="font-medium">You contribute</h3>
          {entryMode === 'percent' ? <><NumberField id="switch-employee-rate" onValidityChange={valid => fieldValidity("switch-employee-rate", valid)} label="Your pension rate" suffix="%" max={100} value={employeeRate} onChange={value => setEmployeeRate(value ?? 0)} /><Choice name="employee-basis" label="Your percentage applies to" value={employeeBasis} options={basisOptions} onChange={setEmployeeBasis} /></> : <NumberField id="switch-current" onValidityChange={valid => fieldValidity("switch-current", valid)} label="Pension deducted / month" prefix="£" value={input.currentGrossMonthly} onChange={value => patch({ currentGrossMonthly: value ?? 0 })} />}
          <p className="text-sm text-[color:var(--pension-muted)]">{formatGbp(employeeMonthly)} / month before Income Tax</p>
        </div>
        <div className="space-y-3 rounded-xl border border-[color:var(--pension-border)] p-4"><h3 className="font-medium">Your employer contributes</h3>
          {entryMode === 'percent' ? <><NumberField id="switch-employer-rate" onValidityChange={valid => fieldValidity("switch-employer-rate", valid)} label="Employer pension rate" suffix="%" max={100} value={employerRate} onChange={value => setEmployerRate(value ?? 0)} /><Choice name="employer-basis" label="Employer percentage applies to" value={employerBasis} options={basisOptions} onChange={setEmployerBasis} /></> : <NumberField id="switch-employer" onValidityChange={valid => fieldValidity("switch-employer", valid)} label="Employer payment / month" prefix="£" value={input.employerMonthly} onChange={value => patch({ employerMonthly: value ?? 0 })} />}
          <p className="text-sm text-[color:var(--pension-muted)]">{formatGbp(employerMonthly)} / month</p>
        </div>
      </div>
      {entryMode === 'percent' && <p className="rounded-xl bg-[color:var(--pension-tint)] p-3 text-xs leading-relaxed">Full base salary: your percentage applies to {formatGbp(input.salary)} / year. Qualifying earnings: it applies to {formatGbp(pensionablePay(input.salary, 'qualifying'))} / year, the slice between £6,240 and £50,270. Your employer may use a different basis from you. Check your benefits portal; use monthly amounts if your scheme uses another definition.</p>}
      <p className="text-xs text-[color:var(--pension-muted)]">Assumes your current deduction is before Income Tax (net pay). An existing salary-sacrifice or relief-at-source scheme needs a different tax calculation; this simplified comparison does not cover it.</p>
      <div className="flex flex-wrap items-center gap-4"><button type="button" className="text-sm underline" onClick={() => go(1)}>← Back</button><button type="button" className={primary} disabled={hasInvalidFields} onClick={() => go(3)}>Next: try a change →</button></div>
    </Section>}
    {step === 3 && <div className="min-w-0 space-y-5">
      {!showResult && <form onSubmit={event => { event.preventDefault(); if (supported) { setSubmittedKey(calculationKey); requestAnimationFrame(() => document.getElementById('freedom-result')?.scrollIntoView({ block: 'start' })) } }}>
      <Section title="3. How much salary would you sacrifice?" intro="Choose your total contribution, then calculate the change in take-home pay and pension.">

        <NumberField id="switch-target" onValidityChange={valid => fieldValidity("switch-target", valid)} label="Total salary sacrifice" hint="Your new total contribution, not an extra percentage." suffix="%" max={100} value={input.targetPercent} onChange={value => patch({ targetPercent: value ?? 0 })} />
        <input type="range" className="pension-salary-slider" aria-label="Total salary sacrifice percentage" min={0} max={Math.max(30, input.targetPercent)} step={.5} value={input.targetPercent} onChange={event => patch({ targetPercent: Number(event.target.value) })} />
        <Choice name="target-basis" label="What is your new sacrifice percentage based on?" value={targetBasis} options={basisOptions} onChange={setTargetBasis} />
        <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">Full base salary uses all {formatGbp(input.salary)} of your annual salary. Qualifying earnings use only {formatGbp(pensionablePay(input.salary, 'qualifying'))}. the slice between £6,240 and £50,270. The same percentage can mean very different payments. Check your employer’s scheme.</p>
        <p className="rounded-xl bg-[color:var(--pension-tint)] p-3 text-sm">Your new contribution: <strong>{targetPercent.toFixed(2)}%</strong> of {targetBasis === 'full' ? 'full base salary' : 'qualifying earnings'} = <strong>{formatGbp(result.sacrificeMonthly)} / month</strong>.</p>
        <div className="space-y-4 rounded-xl border border-[color:var(--pension-border)] p-4"><h3 className="font-medium">What will your employer contribute?</h3>
          <label className="flex items-start gap-2"><input type="checkbox" checked={keepEmployer} onChange={event => setKeepEmployer(event.target.checked)} />Keep my employer’s current contribution rule</label>
          {!keepEmployer && <><NumberField id="new-employer-rate" onValidityChange={valid => fieldValidity("new-employer-rate", valid)} label="New employer rate" suffix="%" max={100} value={newEmployerRate} onChange={value => setNewEmployerRate(value ?? 0)} /><Choice name="new-employer-basis" label="New employer contribution is based on" value={newEmployerBasis} options={basisOptions} onChange={setNewEmployerBasis} /></>}
          <p className="text-sm text-[color:var(--pension-muted)]">Your employer adds {formatGbp(employerAfterMonthly)} / month under this rule.</p>
        </div>
        <details className="text-sm"><summary className="cursor-pointer underline">Does your employer share its NI savings? (optional)</summary><div className="mt-3 space-y-3">
          <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">Salary sacrifice can save your employer National Insurance. Enter the share of that saving they put into your pension: 0% for none, 60% if they return 60%, or 100% for all. This is separate from your own sacrifice.</p>
          <NumberField id="switch-ni" onValidityChange={valid => fieldValidity("switch-ni", valid)} label="Share of employer NI savings returned" hint="Percentage of the NI saving, not of your salary." suffix="%" max={100} value={input.employerNiSharePercent ?? 0} onChange={value => patch({ employerNiSharePercent: value ?? 0 })} />
        </div></details>
        <p className="text-xs text-[color:var(--pension-muted)]">Your employer must offer salary sacrifice and keep cash pay above minimum wage. Confirm the contribution rules with payroll. Extra matching is included only if you enter the changed employer rate.</p>
        {!supported && <div role="alert" className="text-sm"><p>Check your inputs before calculating.</p>{result.issues.map(issue => <p key={issue}>{issue}</p>)}</div>}
        <div className="flex flex-wrap items-center gap-4"><button type="button" className="text-sm underline" onClick={() => go(2)}>← Back</button><button type="submit" className={primary} disabled={!supported}>Calculate my result →</button></div>
      </Section>
      </form>}
      {showResult && <div className="pension-result space-y-5">
        {supported && <Freedom current={current} />}
        <IncomeInsights showExchange={false} input={current} childcare={childcare} setTarget={percent => { patch({ targetPercent: percent }); setSubmittedKey(null) }} />
        <details className="rounded-2xl border border-[color:var(--pension-border)] p-4"><summary className="cursor-pointer py-2 font-serif text-xl text-[color:var(--pension-accent)]">Check the monthly pay, pension and tax breakdown</summary><div className="mt-4"><Section title="Your monthly pension picture" intro="The difference your new contribution makes, in pounds per month.">
        {supported ? <div id="switch-result" className="scroll-mt-24" aria-live="polite" aria-atomic="true">
          <dl className="pension-tradeoff"><div><dt>{result.cashCostMonthly >= 0 ? 'Take-home pay decreases by' : 'Take-home pay increases by'}</dt><dd>{formatGbp(Math.abs(result.cashCostMonthly))}</dd></div><div><dt>{result.extraMonthly >= 0 ? 'Pension increases by' : 'Pension decreases by'}</dt><dd>{result.extraMonthly >= 0 ? '+' : '−'}{formatGbp(Math.abs(result.extraMonthly))}</dd></div></dl>
          <div className="pension-result-total"><p className="text-sm text-[color:var(--pension-muted)]">Total into your pension each month</p><p className="mt-2 font-serif text-5xl text-[color:var(--pension-positive)]">{formatGbp(result.afterMonthly)}</p><p className="mt-2 text-sm text-[color:var(--pension-muted)]">{result.afterMonthly >= result.beforeMonthly ? 'Up' : 'Down'} from {formatGbp(result.beforeMonthly)} today</p></div>
          <div className="pension-result-details"><article className="pension-result-card"><p className="pension-result-kicker">01 · PENSION</p><h3 className="mb-4 font-serif text-xl">Where your pension comes from</h3>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-[color:var(--pension-border)]"><th className="py-2 font-medium">Each month</th><th className="px-2 text-right font-medium">Now</th><th className="text-right font-medium">After</th></tr></thead><tbody>
            {([['Your contribution', employeeMonthly, result.sacrificeMonthly], ['Your employer', employerMonthly, employerAfterMonthly], ['Employer NI savings added', 0, result.topUpMonthly], ['Total into pension', result.beforeMonthly, result.afterMonthly]] as const).map(([label, before, after]) => <tr key={label} className={label === 'Total into pension' ? 'pension-result-table-total' : 'border-b border-[color:var(--pension-border)]'}><th className="py-3 font-normal">{label}</th><td className="px-2 text-right tabular-nums">{formatGbp(before)}</td><td className="text-right tabular-nums">{formatGbp(after)}</td></tr>)}
          </tbody></table></div></article>
          <article className="pension-result-card"><p className="pension-result-kicker">02 · TAKE-HOME PAY</p><h3 className="mb-4 font-serif text-xl">Why your take-home pay changes</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt>New salary sacrifice</dt><dd>{formatGbp(result.sacrificeMonthly)}</dd></div>
            <div className="flex justify-between gap-3"><dt>Replace your current pension deduction</dt><dd>−{formatGbp(employeeMonthly)}</dd></div>
            <div className="flex justify-between gap-3 text-[color:var(--pension-positive-strong)]"><dt>Income Tax saving</dt><dd>{result.incomeTaxSavingMonthly >= 0 ? '−' : '+'}{formatGbp(Math.abs(result.incomeTaxSavingMonthly))}</dd></div>
            <div className="flex justify-between gap-3 text-[color:var(--pension-positive-strong)]"><dt>Employee NI saving</dt><dd>−{formatGbp(result.employeeNiSavingMonthly)}</dd></div>
            {(input.children ?? 0) > 0 && <div className="flex justify-between gap-3"><dt>Child Benefit charge saving</dt><dd>{result.childBenefitSavingMonthly >= 0 ? '−' : '+'}{formatGbp(Math.abs(result.childBenefitSavingMonthly))}</dd></div>}
            <div className="pension-result-cash-total flex justify-between gap-3"><dt>{result.cashCostMonthly >= 0 ? 'Take-home pay decreases by' : 'Take-home pay increases by'}</dt><dd>{formatGbp(Math.abs(result.cashCostMonthly))}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-[color:var(--pension-muted)]">New sacrifice − old deduction − tax saving − employee NI saving − Child Benefit charge saving = reduction in take-home pay. Figures are rounded; employer payments go into your pension separately.</p></article></div>


        </div> : <div role="alert" className="space-y-2 text-sm"><p>Check your inputs before using this result.</p>{input.salary <= 0 && <p>Enter a salary above zero.</p>}{input.salary > 200000 && <p>Income above £200,000 needs a separate allowance assessment.</p>}{result.issues.map(issue => <p key={issue}>{issue}</p>)}</div>}
        <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">Annual estimates divided by 12, at the same salary. Payroll timing and tax codes can change actual monthly pay. Pension money is locked until pension access age; withdrawals may be taxed.</p>
        <button type="button" className={primary} onClick={() => { setSubmittedKey(null); requestAnimationFrame(() => document.getElementById('switch-inputs')?.scrollIntoView({ block: 'start' })) }}>Edit and calculate again</button>
      </Section></div></details>
        <button type="button" className={primary} onClick={() => { setSubmittedKey(null); requestAnimationFrame(() => document.getElementById('switch-inputs')?.scrollIntoView({ block: 'start' })) }}>Change my pension contribution</button>
      </div>}
    </div>}
    {hasInvalidFields && <p role="alert" className="text-sm text-[color:var(--pension-danger)]">Enter a valid number within the field’s range. Results are hidden while an entry is invalid.</p>}
    <button type="button" className="text-xs underline" onClick={reset}>Reset fictional example</button>
  </section>
}
