import { useState } from 'react'
import { compareSchemeSwitch, solveSchemeSwitchBudget, type SchemeSwitchInputs } from '../calc/schemeSwitch'
import { pensionablePay } from '../calc/contributions'
import type { ContributionBasis } from '../calc/types'
import { formatGbp } from '../calc/format'
import { Choice, NumberField, Section } from './Fields'

const example: SchemeSwitchInputs = { salary: 80000, currentMethod: 'netPay', currentGrossMonthly: 200, employerMonthly: 150, targetPercent: 10, niTopUpPercent: 0 }
const basisOptions: { value: ContributionBasis; label: string }[] = [{ value: 'full', label: 'Full base salary' }, { value: 'qualifying', label: 'Qualifying earnings' }]
const primary = 'rounded-xl bg-[color:var(--pension-accent)] px-5 py-3 text-sm font-medium text-[color:var(--pension-on-accent)] disabled:opacity-40'

export function SchemeSwitch() {
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({})
  const hasInvalidFields = Object.values(invalidFields).some(Boolean)
  const fieldValidity = (id: string, valid: boolean) => setInvalidFields(previous => ({ ...previous, [id]: !valid }))
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
  const [budgetMode, setBudgetMode] = useState<'cash' | 'percent'>('percent')
  const [budget, setBudget] = useState(200)
  const patch = (value: Partial<SchemeSwitchInputs>) => setInput(previous => ({ ...previous, ...value }))
  const employeeMonthly = entryMode === 'percent' ? pensionablePay(input.salary, employeeBasis) * employeeRate / 1200 : input.currentGrossMonthly
  const employerMonthly = entryMode === 'percent' ? pensionablePay(input.salary, employerBasis) * employerRate / 1200 : input.employerMonthly
  const employerAfterMonthly = keepEmployer ? employerMonthly : pensionablePay(input.salary, newEmployerBasis) * newEmployerRate / 1200
  const current = { ...input, currentGrossMonthly: employeeMonthly, employerMonthly, employerAfterMonthly, targetBasis }
  const solved = budgetMode === 'cash' ? solveSchemeSwitchBudget(current, budget) : null
  const result = solved?.result ?? compareSchemeSwitch(current)
  const targetPercent = solved?.targetPercent ?? input.targetPercent
  const supported = !hasInvalidFields && input.salary > 0 && input.salary <= 200000 && result.issues.length === 0
  const go = (next: number) => { setStep(next); requestAnimationFrame(() => document.getElementById('switch-inputs')?.scrollIntoView({ block: 'start' })) }
  const reset = () => { setInvalidFields({}); setInput(example); setStep(1); setEntryMode('percent'); setEmployeeBasis('qualifying'); setEmployerBasis('qualifying'); setEmployeeRate(5); setEmployerRate(3); setTargetBasis('full'); setKeepEmployer(true); setNewEmployerRate(3); setNewEmployerBasis('qualifying'); setBudgetMode('percent'); setBudget(200) }
  return <section id="switch-inputs" className="mx-auto max-w-6xl scroll-mt-24 space-y-5" aria-label="Pension calculator">
    <nav aria-label="Calculator steps" className="grid grid-cols-3 gap-2">
      {['Your pay', 'Pension today', 'Your result'].map((label, index) => <button key={label} type="button" aria-current={step === index + 1 ? 'step' : undefined} disabled={index > 0 && (input.salary <= 0 || input.salary > 200000 || hasInvalidFields)} onClick={() => go(index + 1)} className={`rounded-xl border p-3 text-left text-sm ${step === index + 1 ? 'border-[color:var(--pension-accent)] bg-[color:var(--pension-tint)]' : 'border-[color:var(--pension-border)]'}`}><span className="mr-2 font-semibold">{index + 1}</span>{' '}{label}</button>)}
    </nav>
    <p className="text-xs text-[color:var(--pension-muted)]">Fictional example · edit any figure · your inputs stay in this page</p>
    {step === 1 && <Section title="1. What do you earn?" intro="Use your annual base salary before pension deductions.">
      <NumberField id="switch-salary" onValidityChange={valid => fieldValidity("switch-salary", valid)} label="Annual salary" prefix="£" value={input.salary} onChange={value => patch({ salary: value ?? 0 })} />
      <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">2026/27 · England, Wales & Northern Ireland. This simple comparison excludes bonuses, other income, benefits and student loans.</p>
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
      <p className="text-xs text-[color:var(--pension-muted)]">Assumes your current deduction is before Income Tax (net pay). For an existing salary-sacrifice or relief-at-source scheme, use the detailed calculator below.</p>
      <div className="flex flex-wrap items-center gap-4"><button type="button" className="text-sm underline" onClick={() => go(1)}>← Back</button><button type="button" className={primary} disabled={hasInvalidFields} onClick={() => go(3)}>Next: try a change →</button></div>
    </Section>}
    {step === 3 && <div className="grid min-w-0 items-start gap-5 lg:grid-cols-2 [&>*]:min-w-0">
      <Section title="3. How much salary would you sacrifice?" intro="Choose the total percentage you want to exchange for pension. See how much less you take home and how much more goes into your pension.">
        {supported && <div className="rounded-xl bg-[color:var(--pension-tint)] p-4 text-sm lg:hidden" aria-live="polite"><strong>{formatGbp(Math.abs(result.cashCostMonthly))} {result.cashCostMonthly >= 0 ? 'less' : 'more'} to spend.</strong><br /><strong className="text-[color:var(--pension-positive)]">{formatGbp(Math.abs(result.extraMonthly))} {result.extraMonthly >= 0 ? 'more' : 'less'} in your pension each month.</strong></div>}
        <Choice name="switch-budget-mode" label="Choose how to try a change" value={budgetMode} options={[{ value: 'percent', label: 'Salary sacrifice %' }, { value: 'cash', label: 'Take-home budget' }]} onChange={mode => { if (mode === 'percent') patch({ targetPercent }); else setBudget(Math.max(0, Math.round(result.cashCostMonthly))); setBudgetMode(mode) }} />
        {budgetMode === 'cash' ? <><NumberField id="switch-budget" onValidityChange={valid => fieldValidity("switch-budget", valid)} label="I could take home less each month" prefix="£" value={budget} max={5000} onChange={value => setBudget(value ?? 0)} /><input type="range" className="pension-salary-slider" aria-label="Monthly take-home budget" min={0} max={Math.max(1000, budget)} step={25} value={budget} onChange={event => setBudget(Number(event.target.value))} /></> : <><NumberField id="switch-target" onValidityChange={valid => fieldValidity("switch-target", valid)} label="Total salary sacrifice" hint="Your new total percentage, not an extra percentage on top of today’s contribution." suffix="%" max={100} value={input.targetPercent} onChange={value => patch({ targetPercent: value ?? 0 })} /><input type="range" className="pension-salary-slider" aria-label="Total salary sacrifice percentage" min={0} max={Math.max(30, input.targetPercent)} step={.5} value={input.targetPercent} onChange={event => patch({ targetPercent: Number(event.target.value) })} /></>}
        <Choice name="target-basis" label="What is your new sacrifice percentage based on?" value={targetBasis} options={basisOptions} onChange={setTargetBasis} />
        <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">Full base salary uses all {formatGbp(input.salary)} of your annual salary. Qualifying earnings use only {formatGbp(pensionablePay(input.salary, 'qualifying'))} — the slice between £6,240 and £50,270. The same percentage can mean very different payments. Check your employer’s scheme.</p>
        <p className="rounded-xl bg-[color:var(--pension-tint)] p-3 text-sm">Your new contribution: <strong>{targetPercent.toFixed(2)}%</strong> of {targetBasis === 'full' ? 'full base salary' : 'qualifying earnings'} = <strong>{formatGbp(result.sacrificeMonthly)} / month</strong>.</p>
        <div className="space-y-4 rounded-xl border border-[color:var(--pension-border)] p-4"><h3 className="font-medium">What will your employer contribute?</h3>
          <label className="flex items-start gap-2"><input type="checkbox" checked={keepEmployer} onChange={event => setKeepEmployer(event.target.checked)} />Keep my employer’s current contribution rule</label>
          {!keepEmployer && <><NumberField id="new-employer-rate" onValidityChange={valid => fieldValidity("new-employer-rate", valid)} label="New employer rate" suffix="%" max={100} value={newEmployerRate} onChange={value => setNewEmployerRate(value ?? 0)} /><Choice name="new-employer-basis" label="New employer contribution is based on" value={newEmployerBasis} options={basisOptions} onChange={setNewEmployerBasis} /></>}
          <p className="text-sm text-[color:var(--pension-muted)]">Your employer adds {formatGbp(employerAfterMonthly)} / month under this rule.</p>
        </div>
        <details className="text-sm"><summary className="cursor-pointer underline">Does your employer add an extra NI bonus? (optional)</summary><div className="mt-3 space-y-3">
          <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">This is extra money from your employer, separate from the salary you sacrifice. Some employers share their National Insurance savings with you. Leave this at 0 unless your scheme confirms a top-up.</p>
          <NumberField id="switch-ni" onValidityChange={valid => fieldValidity("switch-ni", valid)} label="Employer NI bonus" hint="Bonus as a percentage of your sacrificed salary." suffix="%" max={15} value={input.niTopUpPercent} onChange={value => patch({ niTopUpPercent: value ?? 0 })} />
        </div></details>
        <p className="text-xs text-[color:var(--pension-muted)]">Your employer must offer salary sacrifice and keep cash pay above minimum wage. Confirm the contribution rules with payroll. Extra matching is included only if you enter the changed employer rate.</p>
        <button type="button" className="text-sm underline" onClick={() => go(2)}>← Edit your current pension</button>
      </Section>
      <Section title="Your monthly difference">
        {supported ? <div id="switch-result" className="scroll-mt-24" aria-live="polite" aria-atomic="true">
          <dl className="pension-tradeoff"><div><dt>{result.cashCostMonthly >= 0 ? 'Less to spend' : 'More to spend'}</dt><dd>{formatGbp(Math.abs(result.cashCostMonthly))}</dd></div><div><dt>{result.extraMonthly >= 0 ? 'More in your pension' : 'Less in your pension'}</dt><dd>{result.extraMonthly >= 0 ? '+' : '−'}{formatGbp(Math.abs(result.extraMonthly))}</dd></div></dl>
          <div className="my-5 border-y border-[color:var(--pension-border)] py-5"><p className="text-sm text-[color:var(--pension-muted)]">Total into your pension each month</p><p className="mt-2 font-serif text-5xl text-[color:var(--pension-positive)]">{formatGbp(result.afterMonthly)}</p><p className="mt-2 text-sm">{result.afterMonthly >= result.beforeMonthly ? 'Up' : 'Down'} from {formatGbp(result.beforeMonthly)} today</p></div>
          <dl className="space-y-3 text-sm"><div className="flex justify-between gap-3"><dt>Your salary sacrifice</dt><dd>{formatGbp(result.sacrificeMonthly)}</dd></div><div className="flex justify-between gap-3"><dt>Your employer adds</dt><dd>{formatGbp(employerAfterMonthly)}</dd></div>{result.topUpMonthly > 0 && <div className="flex justify-between gap-3"><dt>Employer NI bonus</dt><dd>{formatGbp(result.topUpMonthly)}</dd></div>}</dl>
          {solved?.limited && <p role="status" className="mt-4 text-sm">Only {formatGbp(Math.max(0, result.cashCostMonthly))} of your {formatGbp(budget)} budget is used. This estimate stops at its earnings or standard annual-allowance limit.</p>}
        </div> : <div role="alert" className="space-y-2 text-sm"><p>Check your inputs before using this result.</p>{input.salary <= 0 && <p>Enter a salary above zero.</p>}{input.salary > 200000 && <p>Income above £200,000 needs a separate allowance assessment.</p>}{result.issues.map(issue => <p key={issue}>{issue}</p>)}</div>}
        <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">Annual estimates divided by 12, at the same salary. Payroll timing and tax codes can change actual monthly pay. Pension money is locked until pension access age; withdrawals may be taxed.</p>
      </Section>
    </div>}
    {hasInvalidFields && <p role="alert" className="text-sm text-[color:var(--pension-danger)]">Enter a valid number within the field’s range. Results are hidden while an entry is invalid.</p>}
    <button type="button" className="text-xs underline" onClick={reset}>Reset fictional example</button>
  </section>
}
