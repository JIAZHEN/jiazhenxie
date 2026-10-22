import type { ReactNode } from 'react'
import { formatGbp, formatPercent, nominalFromReal } from '../calc/format'
import { minimumWageStatus, pensionablePay } from '../calc/contributions'
import {
  MINIMUM_WAGE_HOURLY,
  QUALIFYING_EARNINGS_LOWER,
  QUALIFYING_EARNINGS_UPPER,
} from '../uk-constants'
import type {
  Analysis,
  CalculatorInputs,
  ContributionBasis,
} from '../calc/types'
import { Hint } from './Hint'

function Future({
  value,
  years,
  inputs,
}: {
  value: number
  years?: number
  inputs: CalculatorInputs
}) {
  if (!inputs.showNominal || years == null || years <= 0) return null
  const future = nominalFromReal(value, years, inputs.inflationPercent / 100)
  return (
    <span className="font-normal text-[#57534e]">
      {' '}
      ({formatGbp(future)} in future money)
    </span>
  )
}

function Line({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="flex items-center gap-1.5 text-sm text-[#57534e]">
        <span>{label}</span>
        {hint ? <Hint text={hint} /> : null}
      </dt>
      <dd className="text-right font-medium tabular-nums">{value}</dd>
    </div>
  )
}

function Shape({
  takeHomeMonthly,
  gainMonthly,
  gainNoun,
  incomeMonthly,
  years,
  inputs,
}: {
  takeHomeMonthly: number
  gainMonthly: number
  gainNoun: string
  incomeMonthly: number
  years: number
  inputs: CalculatorInputs
}) {
  const takeHome =
    Math.abs(takeHomeMonthly) < 0.5
      ? 'Take-home stays the same.'
      : takeHomeMonthly > 0
        ? `Take-home drops by ${formatGbp(takeHomeMonthly)} a month.`
        : `Take-home rises by ${formatGbp(Math.abs(takeHomeMonthly))} a month.`
  const gain =
    Math.abs(gainMonthly) < 0.5
      ? `Nothing extra goes into ${gainNoun} each month.`
      : `${gainNoun.charAt(0).toUpperCase()}${gainNoun.slice(1)} gains ${formatGbp(gainMonthly)} a month.`
  return (
    <dl className="mt-3 grid gap-2 border-t border-[#e5e0d9] pt-3 sm:grid-cols-3">
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-[#57534e]">
          On payday
        </dt>
        <dd className="mt-1">{takeHome}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-[#57534e]">
          Going in
        </dt>
        <dd className="mt-1">{gain}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-[#57534e]">
          In retirement
        </dt>
        <dd className="mt-1">
          About {formatGbp(incomeMonthly)} a month
          <Future value={incomeMonthly} years={years} inputs={inputs} />.
        </dd>
      </div>
    </dl>
  )
}

function Card({
  title,
  children,
  tone = 'plain',
}: {
  title: string
  children: ReactNode
  tone?: 'plain' | 'gold' | 'honest'
}) {
  const toneClass =
    tone === 'gold'
      ? 'border-[#c4a15a] bg-[#f8efd4]'
      : tone === 'honest'
        ? 'border-[#d7c4b0] bg-[#f6efe6]'
        : 'border-[#e5e0d9] bg-[#fdfcfa]'
  return (
    <article className={`rounded-3xl border p-4 ${toneClass}`}>
      <h3 className="font-serif text-xl text-[#262626]">{title}</h3>
      <div className="mt-2 text-[0.98rem] leading-snug">{children}</div>
    </article>
  )
}

export function Receipt({
  inputs,
  analysis,
  alternateMonthly,
  onBasis,
  onToggleNominal,
  nominalId,
}: {
  inputs: CalculatorInputs
  analysis: Analysis
  alternateMonthly: number
  onBasis: (basis: ContributionBasis) => void
  onToggleNominal: (value: boolean) => void
  nominalId: string
}) {
  const years = analysis.yearsToRetirement
  const income = analysis.current.atRetirementMonthly
  const gap = analysis.gapMonthly
  const salary = Math.max(0, inputs.grossAnnualSalary)
  const base = pensionablePay(salary, inputs.contributionBasis)
  const state = analysis.current.parts.state
  const workplace = analysis.current.parts.workplace
  const other = analysis.current.parts.other
  const scale = Math.max(income, analysis.targetMonthly, 1)
  const gapWidth = Math.max(0, analysis.targetMonthly - income)
  const aboveBand =
    inputs.contributionBasis === 'qualifying' &&
    salary > QUALIFYING_EARNINGS_UPPER
  const ignored = Math.max(0, salary - QUALIFYING_EARNINGS_UPPER)
  const showAlternate = Math.abs(alternateMonthly - income) >= 20
  const parts = [
    { label: 'State pension', value: state, color: '#a34832' },
    { label: 'Workplace pension', value: workplace, color: '#2d6a4f' },
    { label: 'Other savings', value: other, color: '#9a7b2f' },
  ]

  return (
    <div>
      <p
        className="font-serif text-4xl leading-none text-[#a34832]"
        aria-live="polite"
      >
        About {formatGbp(income)} a month
        <Future value={income} years={years} inputs={inputs} />
      </p>
      <p className="mt-2 text-sm">
        {gap > 1
          ? `${formatGbp(gap)} short of ${formatGbp(analysis.targetMonthly)}.`
          : gap < -1
            ? `${formatGbp(Math.abs(gap))} a month above your target.`
            : `Meets your target of ${formatGbp(analysis.targetMonthly)}.`}
      </p>
      <div
        className="mt-3 flex h-3 overflow-hidden rounded-full bg-[#efe6d6]"
        role="img"
        aria-label={parts
          .filter(part => part.value > 1)
          .map(part => `${part.label} ${formatGbp(part.value)}`)
          .concat(gapWidth > 1 ? `Gap ${formatGbp(gapWidth)}` : [])
          .join(', ')}
      >
        {parts.map(part =>
          part.value > 0 ? (
            <span
              key={part.label}
              style={{
                width: `${(part.value / scale) * 100}%`,
                background: part.color,
              }}
            />
          ) : null
        )}
        {gapWidth > 1 ? (
          <span
            style={{ width: `${(gapWidth / scale) * 100}%` }}
            className="bg-[repeating-linear-gradient(135deg,#e7d7c4,#e7d7c4_4px,#f6efe6_4px,#f6efe6_8px)]"
          />
        ) : null}
      </div>
      <dl className="mt-2">
        <Line
          label="State pension"
          value={formatGbp(state)}
          hint="Paid by the government from state pension age. It does not rise when your salary does. Your own forecast can be lower."
        />
        <Line label="Workplace pension" value={formatGbp(workplace)} />
        {other > 1 ? (
          <Line label="Other savings" value={formatGbp(other)} />
        ) : null}
      </dl>

      <dl className="mt-2 rounded-2xl bg-white px-3 py-1">
        <Line
          label="Pay this percent applies to"
          value={formatGbp(base)}
          hint={
            inputs.contributionBasis === 'qualifying'
              ? `The usual auto-enrolment band is ${formatGbp(QUALIFYING_EARNINGS_LOWER)} to ${formatGbp(QUALIFYING_EARNINGS_UPPER)}. Pay outside that band is left out.`
              : 'The percent applies to your whole salary.'
          }
        />
        <Line
          label={`${formatPercent(analysis.current.employeePercent)} you + ${formatPercent(analysis.current.employerPercent)} employer`}
          value={`${formatGbp(analysis.current.intoPensionAnnual / 12)} / month in`}
        />
        <Line
          label="Comes off take-home"
          value={`${formatGbp(analysis.current.takeHomeDropAnnual / 12)} / month`}
          hint="Tax relief means the pension gain is larger than the drop in take-home. Higher-rate extra relief is not assumed unless this is salary sacrifice."
        />
        {inputs.currentPensionPot > 1 ? (
          <Line label="Pot today" value={formatGbp(inputs.currentPensionPot)} />
        ) : null}
        <Line
          label={`Pot at ${inputs.retirementAge}`}
          value={formatGbp(analysis.current.pensionPot)}
          hint={`${formatPercent(inputs.realReturnBeforePercent)} real growth a year, after inflation, in today's money.`}
        />
        <Line
          label={`${formatPercent(inputs.safeWithdrawalPercent)} a year, after tax`}
          value={`${formatGbp(workplace)} / month`}
          hint="25% of pension withdrawals are treated as tax free. The rest is taxed at 20% once income is over the personal allowance. The state pension uses that allowance first."
        />
      </dl>

      {aboveBand ? (
        <div className="mt-3 rounded-2xl border border-[#c4a15a] bg-[#f8efd4] p-3">
          <p className="text-sm leading-snug">
            {formatGbp(ignored)} of this salary is above{' '}
            {formatGbp(QUALIFYING_EARNINGS_UPPER)}, so it is left out. The state
            pension does not rise with salary either.
          </p>
          {showAlternate ? (
            <p className="mt-2 font-medium">
              On your whole salary: about {formatGbp(alternateMonthly)} a month.
            </p>
          ) : null}
          <button
            type="button"
            className="mt-3 min-h-[2.75rem] rounded-xl bg-[#a34832] px-4 py-2 text-sm font-medium text-[#faf8f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a34832]"
            onClick={() => onBasis('full')}
          >
            Count my whole salary
          </button>
        </div>
      ) : showAlternate ? (
        <button
          type="button"
          className="mt-3 text-left text-sm font-medium text-[#a34832] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a34832]"
          onClick={() =>
            onBasis(inputs.contributionBasis === 'full' ? 'qualifying' : 'full')
          }
        >
          {inputs.contributionBasis === 'full'
            ? `Usual pay band would be about ${formatGbp(alternateMonthly)} a month.`
            : `Whole salary would be about ${formatGbp(alternateMonthly)} a month.`}
        </button>
      ) : null}

      {analysis.current.bridgeYears > 0 ? (
        <p className="mt-3 text-sm leading-snug">
          State pension starts at {inputs.statePensionAge}. For the{' '}
          {analysis.current.bridgeYears} years before that, this is about{' '}
          {formatGbp(income)} a month. From {inputs.statePensionAge}, about{' '}
          {formatGbp(analysis.current.withStatePensionMonthly)}.
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <span id={nominalId} className="text-sm">
          Also show future money
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={inputs.showNominal}
          aria-labelledby={nominalId}
          className={`relative h-8 w-14 shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a34832] ${
            inputs.showNominal ? 'bg-[#a34832]' : 'bg-[#d4cec4]'
          }`}
          onClick={() => onToggleNominal(!inputs.showNominal)}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
              inputs.showNominal ? 'left-7' : 'left-1'
            }`}
          />
          <span className="sr-only">{inputs.showNominal ? 'On' : 'Off'}</span>
        </button>
      </div>
    </div>
  )
}

export function Results({
  inputs,
  analysis,
}: {
  inputs: CalculatorInputs
  analysis: Analysis
}) {
  const years = analysis.yearsToRetirement
  const gap = analysis.gapMonthly
  const showOptions = gap > 1
  const base = pensionablePay(
    inputs.grossAnnualSalary,
    inputs.contributionBasis
  )
  const raiseGross = (base * analysis.raise.employeePercent) / 100
  const raiseWage = minimumWageStatus(inputs, raiseGross)
  const matchIsSeparate =
    analysis.match != null &&
    Math.abs(analysis.raise.employeePercent - analysis.match.employeePercent) >=
      0.2

  return (
    <div id="results" className="space-y-4 scroll-mt-24">
      {showOptions ? (
        <div className="space-y-3">
          <h2 className="font-serif text-2xl text-[#a34832]">Other ways</h2>

          {analysis.match && matchIsSeparate ? (
            <Card title="Take the full employer match">
              <p>
                One option is {formatPercent(analysis.match.employeePercent)}{' '}
                instead of {formatPercent(inputs.employeePercent)}.
                {analysis.match.reached
                  ? ' If you did this, the gap would close.'
                  : ' If you did this, the gap would still be there.'}
              </p>
              <Shape
                takeHomeMonthly={analysis.match.takeHomeDropMonthly}
                gainMonthly={analysis.match.gainMonthly}
                gainNoun="your pension"
                incomeMonthly={analysis.match.incomeMonthly}
                years={years}
                inputs={inputs}
              />
            </Card>
          ) : null}

          {analysis.raise.allowanceCapped ? (
            <p className="text-sm">
              Contributions above £60,000 a year don't all get tax relief. The
              pension gain is capped there.
            </p>
          ) : null}
          {raiseWage === 'breach' ? (
            <p className="text-sm">
              At the hours you entered, that would take pay below the minimum
              wage of £{MINIMUM_WAGE_HOURLY.toFixed(2)} an hour. Salary
              sacrifice can't do that.
            </p>
          ) : null}

          <Card title="Stop working later">
            {analysis.later.reached && analysis.later.yearsLater != null ? (
              <p>
                One option is to stop at {analysis.later.retirementAge},{' '}
                {analysis.later.yearsLater}{' '}
                {analysis.later.yearsLater === 1 ? 'year' : 'years'} later.
              </p>
            ) : (
              <p>
                Working until {analysis.later.retirementAge} gets you to about{' '}
                {formatGbp(analysis.later.incomeMonthly)} a month. Still about{' '}
                {formatGbp(
                  Math.max(
                    0,
                    analysis.targetMonthly - analysis.later.incomeMonthly
                  )
                )}{' '}
                short. This stops at 75.
              </p>
            )}
            <Shape
              takeHomeMonthly={0}
              gainMonthly={0}
              gainNoun="your pension"
              incomeMonthly={analysis.later.incomeMonthly}
              years={Math.max(0, analysis.later.retirementAge - inputs.ageNow)}
              inputs={inputs}
            />
          </Card>

          {analysis.lisa ? (
            <Card title="Lifetime ISA">
              <p>
                {analysis.lisa.reached
                  ? `One option is ${formatGbp(analysis.lisa.monthlyPayIn)} a month. The government adds 25%.`
                  : `The Lifetime ISA cap is ${formatGbp(analysis.lisa.monthlyPayIn)} a month from you. On its own, that won't get you there.`}{' '}
                Locked until 60, except a first home.
              </p>
              {analysis.lisa.lockedUntil60 ? (
                <p className="mt-2">
                  It does not count at {inputs.retirementAge}. From 60, about{' '}
                  {formatGbp(analysis.lisa.unlockedIncomeMonthly)} a month, tax
                  free.
                </p>
              ) : null}
              <Shape
                takeHomeMonthly={analysis.lisa.takeHomeDropMonthly}
                gainMonthly={analysis.lisa.gainMonthly}
                gainNoun="your Lifetime ISA"
                incomeMonthly={analysis.lisa.incomeMonthly}
                years={years}
                inputs={inputs}
              />
            </Card>
          ) : null}

          {analysis.isBasicRateTaxpayer ? (
            <p className="text-sm leading-snug text-[#57534e]">
              On basic-rate tax, a pension gets 20% relief on the way in. A
              Lifetime ISA gets a 25% bonus and is locked until 60. An ISA has
              neither. This is the shape of the rules, not a suggestion.
            </p>
          ) : null}
        </div>
      ) : null}

      {analysis.current.claimableReliefAnnual > 1 ? (
        <p className="text-sm leading-snug">
          You can claim about{' '}
          {formatGbp(analysis.current.claimableReliefAnnual)} a year more
          through self-assessment. These figures do not assume you claim it.
        </p>
      ) : null}

      {analysis.honest ? (
        <Card title="If you push the realistic changes" tone="honest">
          <p>
            {formatPercent(analysis.honest.employeePercent)} from you, working
            to {analysis.honest.retirementAge}, gets you to about{' '}
            {formatGbp(analysis.honest.incomeMonthly)} a month. Your target
            would need{' '}
            {analysis.honest.neededEmployeePercent != null
              ? `about ${formatPercent(analysis.honest.neededEmployeePercent)} from you at that age`
              : `more than 40% of the pay that counts, or working past ${analysis.honest.maxAge}`}
            . The state pension is {formatGbp(analysis.honest.stateMonthly)} of
            that.
          </p>
        </Card>
      ) : null}

      <ul className="space-y-1 text-sm leading-snug text-[#57534e]">
        {analysis.salarySacrificeAssumed ? (
          <li>
            Salary sacrifice is unknown, so these figures assume it is not.
          </li>
        ) : null}
        {analysis.minimumWage === 'generic' ? (
          <li>
            Salary sacrifice can't drop pay under £
            {MINIMUM_WAGE_HOURLY.toFixed(2)} an hour. Hours are blank, so check
            with HR.
          </li>
        ) : null}
        {analysis.minimumWage === 'breach' ? (
          <li>
            At the hours you entered, salary sacrifice would take pay below £
            {MINIMUM_WAGE_HOURLY.toFixed(2)} an hour.
          </li>
        ) : null}
        {analysis.niCapChangesPayslip ? (
          <li>
            From April 2029, National Insurance relief on salary sacrifice is
            capped at £2,000 a year here.
          </li>
        ) : null}
        {analysis.withdrawalAboveGrowth ? (
          <li>
            The withdrawal rate is above the growth after retirement, so the pot
            would tend to shrink.
          </li>
        ) : null}
        {analysis.current.allowanceCapped ? (
          <li>Pension contributions above £60,000 a year are capped here.</li>
        ) : null}
        {years <= 0 ? (
          <li>
            Stop-working age is not after your age, so only savings you already
            have are used.
          </li>
        ) : null}
      </ul>
    </div>
  )
}
