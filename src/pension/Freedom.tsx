import { useMemo, useState } from 'react'
import { FREEDOM_DEFAULTS, FREEDOM_SCENARIOS, FREEDOM_TARGET_AGE, ISA_ANNUAL_ALLOWANCE, SPLIT_SEARCH_STEPS } from '../uk-constants'
import { freedomAge, simulateFreedom, type FreedomInputs } from '../calc/freedom'
import { compareSchemeSwitch, splitPlan, type SchemeSwitchInputs } from '../calc/schemeSwitch'
import { exchangeRate } from '../calc/pensionInsights'
import { formatGbp } from '../calc/format'
import { NumberField, Section } from './Fields'

export function Freedom({ current }: { current: SchemeSwitchInputs }) {
  const [input, setInput] = useState<FreedomInputs>(FREEDOM_DEFAULTS)
  const [targetAge, setTargetAge] = useState(FREEDOM_TARGET_AGE)
  const [showScenarios, setShowScenarios] = useState(false)
  const [split, setSplit] = useState(0)
  const [invalid, setInvalid] = useState<Record<string, boolean>>({})
  const full = useMemo(() => compareSchemeSwitch(current), [current])
  const budget = Math.max(0, full.cashCostMonthly)
  const isaMonthly = budget * split / 100
  const changed = useMemo(() => splitPlan(current, isaMonthly), [current, isaMonthly])
  const valid = !Object.values(invalid).some(Boolean) && input.liveTo > Math.max(input.age, 75) && input.stateAge >= input.access
  const planInput = useMemo(() => ({ ...input, monthlyIsa: input.monthlyIsa + isaMonthly }), [input, isaMonthly])
  const goalAge = Math.max(input.age, Math.min(targetAge, 75))
  const scenarios = useMemo(() => FREEDOM_SCENARIOS.map(scenario => ({ ...scenario,
    before: freedomAge(input, full.beforeMonthly * 12, scenario.rate),
    after: freedomAge(planInput, changed.afterMonthly * 12, scenario.rate),
    goal: simulateFreedom(planInput, changed.afterMonthly * 12, scenario.rate, goalAge),
    goalUnlocked: simulateFreedom(planInput, changed.afterMonthly * 12, scenario.rate, goalAge, true),
    currentGoal: simulateFreedom(input, full.beforeMonthly * 12, scenario.rate, goalAge),
  })), [input, full.beforeMonthly, changed.afterMonthly, planInput, goalAge])
  const best = useMemo(() => {
    let bestAge = Infinity, bestSplit = 0
    for (let i = 0; i <= SPLIT_SEARCH_STEPS; i++) {
      const isa = budget * i / SPLIT_SEARCH_STEPS
      const plan = splitPlan(current, isa)
      if (plan.issues.length) continue
      const age = freedomAge({ ...input, monthlyIsa: input.monthlyIsa + isa }, plan.afterMonthly * 12, FREEDOM_SCENARIOS[1].rate).age
      if (age != null && age < bestAge) { bestAge = age; bestSplit = isa }
    }
    const bestPlan = splitPlan(current, bestSplit)
    const ages = FREEDOM_SCENARIOS.map(scenario => ({ label: scenario.label, age: freedomAge({ ...input, monthlyIsa: input.monthlyIsa + bestSplit }, bestPlan.afterMonthly * 12, scenario.rate).age }))
    return { age: bestAge, isa: bestSplit, ages }
  }, [current, input, budget])
  const visibleScenarios = scenarios.filter(s => showScenarios || s.label === 'Middle')
  const middle = scenarios[1]
  const yearsEarlier = middle.before.age != null && middle.after.age != null ? middle.before.age - middle.after.age : null
  const exchange = exchangeRate(full.extraMonthly, full.cashCostMonthly)
  const bridgeYears = Math.max(0, input.access - goalAge)
  const bridgeGap = Math.max(0, middle.goal.bridgeNeeded - middle.goal.isaAtStop)
  const bridgeLimits = bridgeGap > .01 && middle.goalUnlocked.works
  const points = middle.after.points
  const max = Math.max(1, ...points.map(p => p.pension + p.isa))
  const x = (age: number) => 35 + (age - input.age) / (input.liveTo - input.age) * 570
  const y = (money: number) => 205 - money / max * 170
  const area = (total: boolean) => `M${x(points[0].age)},205 ` + points.map(p => `L${x(p.age)},${y(total ? p.pension + p.isa : p.isa)}`).join(' ') + ` L${x(points[points.length - 1].age)},205 Z`
  function field(key: Exclude<keyof FreedomInputs, 'includeState'>, label: string, min = 0, maxValue = 100_000_000) {
    return <NumberField key={key} id={`freedom-${key}`} label={label} hint={key === 'pension' ? 'Enter the total already saved in all your workplace and personal pension pots today. This starting balance is included in both plans, separately from future contributions. Do not enter a promised yearly income from a defined benefit pension.' : undefined} value={input[key]} min={min} max={maxValue} onValidityChange={ok => setInvalid(old => ({ ...old, [key]: !ok }))} onChange={value => setInput(old => ({ ...old, [key]: ['age', 'liveTo', 'access', 'stateAge'].includes(key) ? Math.floor(value ?? 0) : value ?? 0 }))} />
  }
  return <section id="freedom-result" className="scroll-mt-24" aria-label="Your freedom age">
    <Section title="When could you stop working?" intro="What could this monthly change mean for your time? Start with the fictional example, then make it yours. Every projection is in today’s money, after inflation.">
      <p className="text-sm text-[color:var(--pension-muted)]">Your change: {formatGbp(Math.abs(full.cashCostMonthly))} {full.cashCostMonthly >= 0 ? 'less' : 'more'} take-home pay / month → {formatGbp(Math.abs(full.extraMonthly))} {full.extraMonthly >= 0 ? 'more' : 'less'} pension / month.</p>
      <dl aria-label="Monthly change summary" className="grid grid-cols-3 gap-2 rounded-xl border border-[color:var(--pension-border)] p-3 text-sm">
        <div><dt className="text-xs text-[color:var(--pension-muted)]">Take-home / month</dt><dd className="mt-1 font-semibold tabular-nums">{full.cashCostMonthly > 0 ? '−' : full.cashCostMonthly < 0 ? '+' : ''}{formatGbp(Math.abs(full.cashCostMonthly))}</dd></div>
        <div><dt className="text-xs text-[color:var(--pension-muted)]">Pension / month</dt><dd className="mt-1 font-semibold tabular-nums">{full.extraMonthly > 0 ? '+' : full.extraMonthly < 0 ? '−' : ''}{formatGbp(Math.abs(full.extraMonthly))}</dd></div>
        <div><dt className="text-xs text-[color:var(--pension-muted)]">Pension per £1 less pay</dt><dd className="mt-1 font-semibold tabular-nums">{exchange?.kind === 'ratio' ? `£${exchange.value.toFixed(2)}` : exchange?.kind === 'free' ? 'No take-home cost' : exchange?.kind === 'gain' ? 'Take-home rises' : 'No pension increase'}</dd></div>
      </dl>
      {!valid || changed.issues.length > 0 ? <p role="alert">Check the numbers below: the planning age must be above 75 and your age today; State Pension age must be at or after pension access age. {changed.issues.join(' ')}</p> : <>
        <div className="rounded-2xl bg-[color:var(--pension-tint)] p-4 sm:p-6" aria-live="polite" aria-atomic="true">
          <p className="pension-eyebrow">YOUR FREEDOM AGE · MIDDLE EXAMPLE</p>
          {middle.after.age == null ? <p className="mt-3 font-serif text-2xl text-[color:var(--pension-accent)]">No stopping age up to 75 works with these figures.</p> : <>
            <p className="mt-3 font-serif text-3xl text-[color:var(--pension-accent)] sm:text-4xl">You could stop working at about {middle.after.age}.</p>
            <p className="mt-3 text-base">{yearsEarlier != null ? yearsEarlier > 0 ? `About ${yearsEarlier} ${yearsEarlier === 1 ? 'year' : 'years'} earlier than your current plan.` : yearsEarlier === 0 ? 'This change does not bring your stopping age forward in whole years.' : `About ${Math.abs(yearsEarlier)} ${Math.abs(yearsEarlier) === 1 ? 'year' : 'years'} later than your current plan.` : 'Your current plan does not support stopping by 75 in this example.'}</p>
          </>}
          <p className="mt-2 text-sm">Cautious {scenarios[0].after.age ?? 'no age up to 75'} · Hopeful {scenarios[2].after.age ?? 'no age up to 75'}</p>
          <p className="mt-2 text-sm">Current plan: {middle.before.age ?? 'no age up to 75'} · With this pension / ISA split: {middle.after.age ?? 'no age up to 75'}</p>
        </div>
        {middle.after.age == null && <p className="text-sm">At 75, missing {formatGbp(middle.after.shortfall)} in money available then to fund spending through {input.liveTo}.</p>}
        <button type="button" className="min-h-11 text-sm underline" aria-expanded={showScenarios} aria-controls="freedom-scenario-details" onClick={() => setShowScenarios(show => !show)}>{showScenarios ? 'Hide cautious and hopeful' : 'Show cautious and hopeful'}</button>
        <div id="freedom-scenario-details" hidden={!showScenarios} className={showScenarios ? 'grid gap-3 sm:grid-cols-2' : ''} aria-label="Cautious and hopeful freedom ages">{scenarios.filter(s => s.label !== 'Middle').map(s => <article key={s.label} className="rounded-xl border border-[color:var(--pension-border)] p-3"><h3 className="font-medium">{s.label} · {s.rate * 100}% after inflation</h3><p className="mt-2 text-sm">Current plan: {s.before.age ?? 'no age up to 75'}</p><p className="text-sm">With this split: <strong>{s.after.age ?? 'no age up to 75'}</strong></p>{s.after.age == null && <p className="mt-2 text-sm">At 75, missing {formatGbp(s.after.shortfall)} in money available then to fund spending through {input.liveTo}.</p>}</article>)}</div>
      </>}

      <div id="freedom-your-life" className="space-y-4 rounded-xl border border-[color:var(--pension-border)] p-4">
        <h3 className="font-serif text-xl text-[color:var(--pension-accent)]">Start with the life you want</h3>
        <p className="text-sm text-[color:var(--pension-muted)]">What age would you like to stop, and how much would you need to live on? Change these to see what stands in the way.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {field('age', 'Your age today', 18, 75)}
          <NumberField id="freedom-target-age" label="Age you would like to stop working" min={input.age} max={75} value={goalAge} onValidityChange={ok => setInvalid(old => ({ ...old, target: !ok }))} onChange={value => setTargetAge(Math.floor(value ?? input.age))} />
          {field('spending', 'What you want to spend each year (£)')}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field('pension', 'Already saved in your pensions (£)')}{field('isa', 'ISA and other accessible savings today (£)')}{field('monthlyIsa', 'Monthly ISA / savings amount now (£)')}
        </div>
      </div>

      {valid && changed.issues.length === 0 && <div className="space-y-4" aria-live="polite">
        <article className="rounded-2xl border-2 border-[color:var(--pension-accent)] p-4 sm:p-6" aria-label="Savings bridge before pension access">
          <p className="pension-eyebrow">THE YEARS YOUR PENSION CANNOT PAY FOR</p>
          <h3 className="mt-2 font-serif text-2xl text-[color:var(--pension-accent)]">{middle.after.age == null ? `You asked about stopping at ${goalAge}. No age up to 75 works in the Middle example. Here is what is missing at ${goalAge}.` : goalAge < middle.after.age ? `You asked about stopping at ${goalAge}. The earliest in this example is ${middle.after.age}. Here is what is missing at ${goalAge}.` : `Stopping at ${goalAge} works in the Middle example.`}</h3>
          <p className="mt-3 text-sm">{bridgeYears > 0 ? `That leaves ${bridgeYears} ${bridgeYears === 1 ? 'year' : 'years'} of bills to cover from ISAs or other accessible savings. A bigger pension cannot pay those bills while it is locked.` : 'You do not need savings to bridge the years before pension access. Your pots still need to cover spending for the rest of your plan.'}</p>
          <div className={`mt-4 grid gap-3 ${showScenarios ? 'sm:grid-cols-3' : ''}`}>{visibleScenarios.map(s => {
            const gap = Math.max(0, s.goal.bridgeNeeded - s.goal.isaAtStop)
            const ending = s.goal.points[s.goal.points.length - 1]
            const spare = ending.pension + ending.isa
            return <div key={s.label} className="rounded-xl bg-[color:var(--pension-tint)] p-3 text-sm"><h4 className="font-medium">{s.label}{s.label === 'Middle' ? ' · headline' : ''}</h4><dl className="mt-2 space-y-2"><div><dt>Need at {goalAge}</dt><dd className="font-semibold">{formatGbp(s.goal.bridgeNeeded)}</dd></div><div><dt>Current plan savings at {goalAge}</dt><dd>{formatGbp(s.currentGoal.isaAtStop)}</dd></div><div><dt>With this split</dt><dd>{formatGbp(s.goal.isaAtStop)}</dd></div>{middle.after.age != null && goalAge >= middle.after.age && s.goal.works ? <div><dt>Spare in your pots at {input.liveTo}, after planned spending</dt><dd className="font-semibold">{formatGbp(spare)}</dd></div> : <div><dt>Still to cover before {input.access}</dt><dd className="font-semibold">{formatGbp(gap)}</dd></div>}</dl></div>
          })}</div>
          <p className="mt-4 text-sm font-medium">{bridgeLimits ? `The lock is what holds you back in the Middle example: there is enough money overall, but ${formatGbp(bridgeGap)} is missing from accessible savings at ${goalAge}. Try moving part of your monthly budget into an ISA below.` : bridgeGap > .01 ? `In the Middle example, accessible savings are ${formatGbp(bridgeGap)} short at ${goalAge}. You also need more money overall to make this stopping age last through ${input.liveTo}.` : middle.goal.works ? `This split covers the gap and supports stopping at ${goalAge} in the Middle example.` : `The savings bridge is covered in the Middle example. Money for the later years is the remaining limit on stopping at ${goalAge}.`}</p>
        </article>
      </div>}

      {budget > 0 ? <div className="rounded-2xl bg-[color:var(--pension-tint)] p-4 sm:p-6 space-y-4">
        <h3 className="font-serif text-2xl text-[color:var(--pension-accent)]">Pension or ISA: which buys you more time?</h3>
        <label htmlFor="freedom-split" className="block text-sm">You have {formatGbp(budget)} a month of take-home pay to put towards stopping work. How much goes into an ISA?</label>
        <input id="freedom-split" className="pension-salary-slider" type="range" min="0" max="100" step="1" value={split} onChange={e => setSplit(Number(e.target.value))} aria-valuetext={`${formatGbp(isaMonthly)} a month into an ISA`} />
        <div className="flex justify-between gap-3 text-xs"><span>All extra money to pension</span><span>All take-home budget to ISA</span></div>
        <div className="grid grid-cols-2 gap-3"><p className="text-sm">Extra ISA / month<strong className="mt-1 block font-serif text-2xl">{formatGbp(isaMonthly)}</strong></p><p className="text-sm">Extra pension / month<strong className="mt-1 block font-serif text-2xl">{formatGbp(changed.extraMonthly)}</strong></p></div>
        {split >= 100 && changed.extraMonthly > 0 && <p className="text-sm">Still {formatGbp(changed.extraMonthly)} a month into your pension: switching your existing contribution to salary sacrifice saves National Insurance, so your pension can rise a little without changing your take-home pay.</p>}
        <p className="text-sm">£1 of take-home pay adds £1 to your ISA. Pension gets tax relief, but stays locked until {input.access}. Move the slider to see both your freedom age and the savings gap change.</p>
        {valid && changed.issues.length === 0 && <div className={`grid gap-2 ${showScenarios ? 'sm:grid-cols-3' : ''}`} aria-label="Live split freedom ages">{visibleScenarios.map(s => <p key={s.label} className="rounded-xl border border-[color:var(--pension-border)] p-3 text-sm">{s.label}<strong className="block">{s.after.age == null ? 'No age up to 75' : `Stop at about ${s.after.age}`}</strong></p>)}</div>}
        {valid && Number.isFinite(best.age) && <div className="space-y-2 text-sm"><p>Earliest age in this example (Middle): <strong>{best.age}</strong>, with {formatGbp(best.isa)} / month to ISA.</p><div className="grid gap-2 sm:grid-cols-3">{best.ages.filter(s => showScenarios || s.label === 'Middle').map(s => <p key={s.label}>{s.label}: {s.age == null ? 'no age up to 75' : `about ${s.age}`}</p>)}</div><button type="button" className="min-h-11 rounded-xl border border-[color:var(--pension-accent)] px-4 py-2 text-[color:var(--pension-accent)]" onClick={() => setSplit(budget > 0 ? best.isa / budget * 100 : 0)}>Try this example split</button><p className="text-xs text-[color:var(--pension-muted)]">Compared in {SPLIT_SEARCH_STEPS + 1} splits; ties use the smallest ISA amount. This is not a recommendation. Use “Show cautious and hopeful” to compare the other scenarios. The headline range always shows both.</p></div>}
        {(input.monthlyIsa + isaMonthly) * 12 > ISA_ANNUAL_ALLOWANCE && <p className="text-sm">These payments exceed the £20,000 annual ISA allowance. The excess is treated as other savings here, with no savings tax modelled.</p>}
      </div> : <p className="text-sm">This change does not reduce your take-home pay, so there is no take-home cost to divide between pension and ISA here. Your existing ISA payments still count towards your savings bridge.</p>}

      <details><summary className="min-h-11 cursor-pointer py-3 text-sm underline">See how your pots could change over time</summary>
        {valid && <figure className="mt-4"><svg viewBox="0 0 640 220" role="img" aria-label="Middle scenario: pension and ISA wealth over age in today's money" className="w-full"><path d={area(true)} fill="var(--pension-accent)" opacity=".7" /><path d={area(false)} fill="var(--pension-positive)" />{[{ age: middle.after.age, label: 'Stop', row: 0 }, { age: input.access, label: 'Pension', row: 1 }, { age: input.stateAge, label: 'State', row: 2 }].map(mark => mark.age != null && mark.age >= input.age && mark.age <= input.liveTo ? <g key={mark.label}><line x1={x(mark.age)} x2={x(mark.age)} y1="25" y2="205" stroke="var(--pension-ink)" strokeDasharray="4" /><title>{mark.label} {mark.age}</title></g> : null)}<text x="35" y="15" fontSize="12" fill="var(--pension-ink)">{formatGbp(max)} · today’s money</text></svg><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-label="Chart age markers"><span>Stop {middle.after.age ?? 'not reached by 75'}</span><span>Pension {input.access}</span><span>State {input.stateAge}</span></div><figcaption className="mt-2 text-xs">Middle scenario · green: ISA / savings · other area: pension. Use “Show cautious and hopeful” for the other outcomes.</figcaption></figure>}
      </details>
      <details><summary className="min-h-11 cursor-pointer py-3 text-sm underline">Assumptions and advanced settings</summary><div className="mt-4 grid gap-4 sm:grid-cols-2">
        {field('liveTo', 'Plan for money to last to age', 76, 110)}{field('access', 'Pension access age', 55, 75)}{field('stateAge', 'State Pension age', 55, 80)}{field('stateAnnual', 'Full new State Pension / year (£)')}
        <label className="flex items-center gap-2"><input type="checkbox" checked={input.includeState} onChange={e => setInput(old => ({ ...old, includeState: e.target.checked }))} />Include State Pension</label>
      </div><p className="mt-4 text-xs leading-relaxed text-[color:var(--pension-muted)]">Annual model, whole-year ages. Contributions and spending stay flat after inflation. Withdrawals happen at the start of each retirement year; contributions at the end of each working year. Pension is used first once accessible, then savings. 25% of each pension withdrawal is assumed tax-free; the rest and State Pension use today’s Income Tax bands, held flat in real terms. The tax-free cash lifetime limit, fees, savings tax, future rule changes and changing investment returns are not modelled. Access age and State Pension entitlement vary: check your own forecast. No further pension payments after stopping work.</p></details>
      <p className="text-xs leading-relaxed text-[color:var(--pension-muted)]">Fictional example until you enter your figures. Not financial advice. Projections are based on assumed returns and are not guaranteed.</p>
    </Section>
  </section>
}
