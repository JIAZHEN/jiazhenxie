import { useMemo } from 'react'
import { buildStory, SALARY_STEP } from '../calc/story'
import type { PayslipSide } from '../calc/story'
import { formatGbp, formatPercent } from '../calc/format'
import type {
  Analysis,
  CalculatorInputs,
  ContributionBasis,
} from '../calc/types'
import { NumberField } from './Fields'
import { Receipt } from './Results'

function payslipPercent(percent: number): number {
  return Math.ceil(percent * 10 - 1e-6) / 10
}

function signed(delta: number): { text: string; className: string } {
  if (Math.abs(delta) < 0.5) {
    return { text: 'Same', className: 'text-[color:var(--pension-muted)]' }
  }
  if (delta > 0) {
    return { text: `+${formatGbp(delta)}`, className: 'text-[color:var(--pension-accent)]' }
  }
  return {
    text: `−${formatGbp(Math.abs(delta))}`,
    className: 'text-[color:var(--pension-danger)]',
  }
}

function MoneyCell({ now, next }: { now: number; next: number | null }) {
  if (next == null) {
    return (
      <td className="py-2 text-right font-medium tabular-nums">
        {formatGbp(now)}
      </td>
    )
  }
  const delta = signed(next - now)
  return (
    <>
      <td className="py-2 text-right tabular-nums text-[color:var(--pension-muted)]">
        {formatGbp(now)}
      </td>
      <td className="py-2 text-right">
        <div className="font-medium tabular-nums">{formatGbp(next)}</div>
        <div className={`text-xs ${delta.className}`}>{delta.text}</div>
      </td>
    </>
  )
}

function Row({
  label,
  now,
  next,
  field,
}: {
  label: string
  now: PayslipSide
  next: PayslipSide | null
  field: keyof Pick<
    PayslipSide,
    | 'takeHomeMonthly'
    | 'fromPayMonthly'
    | 'employerMonthly'
    | 'intoPensionMonthly'
  >
}) {
  return (
    <tr className="border-t border-[color:var(--pension-subtle)]">
      <th scope="row" className="py-2 pr-2 text-left font-normal">
        {label}
      </th>
      <MoneyCell now={now[field]} next={next ? next[field] : null} />
    </tr>
  )
}

export function PayslipStory({
  inputs,
  analysis,
  alternateMonthly,
  today,
  onPatch,
  onBasis,
  onToggleNominal,
  nominalId,
  targetId,
}: {
  inputs: CalculatorInputs
  analysis: Analysis
  alternateMonthly: number
  today: Date
  onPatch: (partial: Partial<CalculatorInputs>) => void
  onBasis: (basis: ContributionBasis) => void
  onToggleNominal: (value: boolean) => void
  nominalId: string
  targetId: string
}) {
  const story = useMemo(
    () => buildStory(inputs, analysis, today),
    [inputs, analysis, today]
  )
  const { hero, levers } = story
  const next = hero.next
  const maxLever = Math.max(...levers.map(lever => lever.amount), 1)
  const title =
    hero.mode === 'already'
      ? 'Nothing on this payslip has to change'
      : hero.mode === 'raise'
        ? 'One change on this month’s payslip'
        : 'Even a big payslip change falls short'
  const subtitle =
    next == null
      ? `You’re heading for ${formatGbp(hero.now.retirementMonthly)} a month, against ${formatGbp(inputs.targetMonthlyIncome)}.`
      : hero.mode === 'raise'
        ? `Pay ${formatPercent(next.employeePercent)} instead of ${formatPercent(hero.now.employeePercent)}.`
        : `At ${formatPercent(next.employeePercent)} you’d be on ${formatGbp(next.retirementMonthly)}, not ${formatGbp(inputs.targetMonthlyIncome)}.`

  return (
    <div className="space-y-4">
      <article className="overflow-hidden rounded-3xl border border-[color:var(--pension-ink)] bg-[color:var(--pension-surface)] shadow-[0_1px_0_var(--pension-ink)]">
        <header className="border-b border-dashed border-[color:var(--pension-border-strong)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--pension-accent)]">
            This month’s payslip
          </p>
          <div className="mt-3">
            <NumberField
              id={targetId}
              label="You want, a month"
              hint="In today's money. The rows under this are the payslip that gets you there."
              prefix="£"
              primary
              value={inputs.targetMonthlyIncome}
              step={50}
              onChange={value => onPatch({ targetMonthlyIncome: value ?? 0 })}
            />
          </div>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-[color:var(--pension-ink)]">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-snug">{subtitle}</p>
        </header>
        <table className="w-full px-4 text-sm">
          <caption className="sr-only">
            Payslip now
            {next
              ? ` compared with paying ${formatPercent(next.employeePercent)}`
              : ''}
          </caption>
          <thead>
            <tr className="text-xs uppercase tracking-wide text-[color:var(--pension-muted)]">
              <th className="px-4 py-2 text-left font-medium" />
              <th className="px-2 py-2 text-right font-medium">Now</th>
              {next ? (
                <th className="px-4 py-2 text-right font-medium">
                  If you did this
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="[&_th]:px-4 [&_td]:px-4">
            <Row
              label="Take-home"
              now={hero.now}
              next={next}
              field="takeHomeMonthly"
            />
            <Row
              label="From your pay"
              now={hero.now}
              next={next}
              field="fromPayMonthly"
            />
            <Row
              label="Employer adds"
              now={hero.now}
              next={next}
              field="employerMonthly"
            />
            <Row
              label="Into the pension"
              now={hero.now}
              next={next}
              field="intoPensionMonthly"
            />
          </tbody>
        </table>
        <div
          className={`mt-2 grid items-end gap-2 bg-[color:var(--pension-accent)] px-4 py-3 text-[color:var(--pension-canvas)] ${
            next ? 'grid-cols-[1.3fr_1fr_1fr]' : 'grid-cols-[1.4fr_1fr]'
          }`}
        >
          <p className="text-sm">At {inputs.retirementAge}, in today’s money</p>
          <p className="text-right font-serif text-xl tabular-nums">
            {formatGbp(hero.now.retirementMonthly)}
          </p>
          {next ? (
            <p className="text-right font-serif text-xl tabular-nums">
              {formatGbp(next.retirementMonthly)}
            </p>
          ) : null}
        </div>
        {next && hero.mode === 'raise' ? (
          <div className="px-4 py-3">
            <button
              type="button"
              className="min-h-[2.75rem] w-full rounded-xl bg-[color:var(--pension-accent)] px-4 text-sm font-medium text-[color:var(--pension-canvas)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--pension-accent)]"
              onClick={() =>
                onPatch({
                  employeePercent: payslipPercent(next.employeePercent),
                  employerPercent: payslipPercent(next.employerPercent),
                })
              }
            >
              Put {formatPercent(next.employeePercent)} on this payslip
            </button>
          </div>
        ) : null}
        {levers.some(lever => lever.id === 'salary' && lever.amount === 0) ? (
          <p className="border-t border-[color:var(--pension-subtle)] bg-[color:var(--pension-warning)] px-4 py-3 text-sm leading-snug">
            {formatGbp(SALARY_STEP)} more salary changes the retirement figure
            by £0. Pay above £50,270 is ignored.{' '}
            {inputs.contributionBasis === 'qualifying' ? (
              <button
                type="button"
                className="font-medium text-[color:var(--pension-accent)] underline"
                onClick={() => onBasis('full')}
              >
                Count the whole salary
                {alternateMonthly > hero.now.retirementMonthly + 20
                  ? `, about ${formatGbp(alternateMonthly)} a month`
                  : ''}
              </button>
            ) : null}
          </p>
        ) : null}
        {analysis.freeMoney && hero.mode !== 'already' ? (
          <p className="border-t border-[color:var(--pension-subtle)] bg-[color:var(--pension-warning)] px-4 py-3 text-sm leading-snug">
            Employer money still sitting there:{' '}
            {formatGbp(analysis.freeMoney.extraEmployerMonthly)} a month if you
            pay {formatPercent(analysis.freeMoney.toPercent)} instead of{' '}
            {formatPercent(analysis.freeMoney.fromPercent)}. That costs{' '}
            {formatGbp(analysis.freeMoney.takeHomeDropMonthly)} of take-home.
          </p>
        ) : null}
      </article>

      <section className="rounded-3xl border border-[color:var(--pension-border)] bg-[color:var(--pension-surface)] p-4">
        <h2 className="font-serif text-2xl text-[color:var(--pension-accent)]">
          What actually moves it
        </h2>
        <p className="mt-1 text-sm text-[color:var(--pension-muted)]">
          Ranked by pounds a month when you stop. Salary is smaller than it
          looks.
        </p>
        <ol className="mt-3 space-y-3">
          {levers.map(lever => {
            const width = Math.max(
              lever.amount > 0 ? 4 : 0,
              (lever.amount / maxLever) * 100
            )
            const apply =
              lever.id === 'payday' && next
                ? () =>
                    onPatch({
                      employeePercent: payslipPercent(next.employeePercent),
                      employerPercent: payslipPercent(next.employerPercent),
                    })
                : lever.id === 'later'
                  ? () =>
                      onPatch({ retirementAge: analysis.later.retirementAge })
                  : lever.id === 'salary'
                    ? () =>
                        onPatch({
                          grossAnnualSalary:
                            inputs.grossAnnualSalary + SALARY_STEP,
                        })
                    : null
            const action =
              lever.id === 'salary' &&
              lever.amount === 0 &&
              inputs.contributionBasis === 'qualifying'
                ? 'Count whole salary'
                : lever.id === 'salary'
                  ? `Add ${formatGbp(SALARY_STEP)}`
                  : lever.id === 'payday'
                    ? 'Use this percent'
                    : lever.id === 'later'
                      ? 'Use this age'
                      : null
            const onClick =
              lever.id === 'salary' &&
              lever.amount === 0 &&
              inputs.contributionBasis === 'qualifying'
                ? () => onBasis('full')
                : apply
            return (
              <li key={lever.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{lever.label}</span>
                  <span className="tabular-nums">
                    {formatGbp(lever.amount)}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color:var(--pension-subtle)]">
                  <div
                    className="h-full rounded-full bg-[color:var(--pension-accent)]"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <p className="mt-1 text-xs leading-snug text-[color:var(--pension-muted)]">
                  {lever.note}
                </p>
                {onClick && action ? (
                  <button
                    type="button"
                    className="mt-1 text-sm font-medium text-[color:var(--pension-accent)] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--pension-accent)]"
                    onClick={onClick}
                  >
                    {action}
                  </button>
                ) : null}
              </li>
            )
          })}
        </ol>
      </section>

      <details className="rounded-2xl border border-[color:var(--pension-border)] bg-[color:var(--pension-surface)] px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-[color:var(--pension-accent)]">
          Show the working
        </summary>
        <div className="mt-3">
          <Receipt
            inputs={inputs}
            analysis={analysis}
            alternateMonthly={alternateMonthly}
            onBasis={onBasis}
            onToggleNominal={onToggleNominal}
            nominalId={nominalId}
          />
        </div>
      </details>
    </div>
  )
}
