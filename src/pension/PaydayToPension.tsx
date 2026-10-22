import { useEffect, useMemo, useRef, useState } from 'react'
import SEO from '../components/SEO'
import { analyse } from '../calc/analyse'
import type { CalculatorInputs } from '../calc/types'
import { DISCLAIMER, MONEYHELPER_URL, STATE_PENSION_FORECAST_URL } from './copy'
import { defaultInputs, STORAGE_KEY } from './defaults'
import { Choice, NumberField, Section } from './Fields'
import { decodeInputs, encodeInputs } from './hash'
import { Hint } from './Hint'
import { PayslipStory } from './Payslip'
import { Results } from './Results'
import { PensionIntro } from './PensionIntro'

function loadInitial(): CalculatorInputs {
  if (typeof window === 'undefined') return defaultInputs
  const fromHash = decodeInputs(window.location.hash)
  if (fromHash) return fromHash
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = decodeInputs(stored)
      if (parsed) return parsed
    }
  } catch {
    // Storage can throw in private mode.
  }
  return defaultInputs
}

export function PaydayToPension() {
  const [inputs, setInputs] = useState<CalculatorInputs>(loadInitial)
  const [shareNote, setShareNote] = useState('')
  const shareHash = useRef(
    typeof window !== 'undefined' && window.location.hash.length > 1
  )
  const today = useMemo(() => new Date(), [])
  const analysis = useMemo(() => analyse(inputs, today), [inputs, today])
  const alternateBasis =
    inputs.contributionBasis === 'full' ? 'qualifying' : 'full'
  const alternateMonthly = useMemo(
    () =>
      analyse({ ...inputs, contributionBasis: alternateBasis }, today).current
        .atRetirementMonthly,
    [alternateBasis, inputs, today]
  )

  useEffect(() => {
    const encoded = encodeInputs(inputs)
    try {
      window.localStorage.setItem(STORAGE_KEY, encoded)
    } catch {
      // Ignore quota and private-mode failures.
    }
    if (!shareHash.current) return
    const nextHash = `#${encoded}`
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash)
    }
  }, [inputs])

  function patch(partial: Partial<CalculatorInputs>) {
    shareHash.current = true
    setInputs(current => ({ ...current, ...partial }))
  }

  function clearData() {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore.
    }
    shareHash.current = false
    setInputs(defaultInputs)
    window.history.replaceState(null, '', window.location.pathname)
    setShareNote(
      'Cleared on this phone. The figures are back to the starting example.'
    )
  }

  async function share() {
    shareHash.current = true
    const url = `${window.location.origin}${window.location.pathname}#${encodeInputs(inputs)}`
    window.history.replaceState(null, '', `#${encodeInputs(inputs)}`)
    try {
      await navigator.clipboard.writeText(url)
      setShareNote(
        'Link copied. It only lives in the address bar, not on a server.'
      )
    } catch {
      setShareNote(
        'Copy failed. The link is already in the address bar. Select it from there.'
      )
    }
  }

  return (
    <div className="pension-tool mt-16 sm:mt-20 min-h-screen bg-[#faf8f5] pb-8 text-[#262626]">
      <SEO
        title="Payday to Pension — UK Pension Calculator"
        description="Work backwards from the monthly retirement income you want, in today's money. Explore pension contributions and their effect on take-home pay."
        canonicalUrl="https://jiazhenxie.com/payday-to-pension"
      />
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to your results
      </a>
      <PensionIntro />
      <div id="your-numbers" className="mx-auto max-w-6xl px-4 pt-6 pb-2">
        <p className="pension-eyebrow">YOUR TURN</p>
        <h2 className="font-serif text-3xl text-[#a34832]">What could your pension pay you?</h2>
        <p className="mt-3 text-sm text-[#57534e]">Use your own numbers below. Change one thing at a time and see what happens.</p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <form
          className="space-y-4"
          onSubmit={event => event.preventDefault()}
        >
          <Section title="You">
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                id="age-now"
                label="Age now"
                value={inputs.ageNow}
                min={16}
                max={80}
                onChange={value => patch({ ageNow: value ?? inputs.ageNow })}
              />
              <NumberField
                id="stop-age"
                label="Stop working"
                hint="67 is the state pension age for most people born after 1978."
                value={inputs.retirementAge}
                min={16}
                max={80}
                onChange={value =>
                  patch({ retirementAge: value ?? inputs.retirementAge })
                }
              />
            </div>
            <NumberField
              id="salary"
              label="Gross annual salary"
              hint="Gross means before tax and National Insurance."
              prefix="£"
              value={inputs.grossAnnualSalary}
              step={500}
              onChange={value => patch({ grossAnnualSalary: value ?? 0 })}
            />
          </Section>

          <div className="lg:hidden">
            <PayslipStory
              inputs={inputs}
              analysis={analysis}
              alternateMonthly={alternateMonthly}
              today={today}
              onPatch={patch}
              onBasis={basis => patch({ contributionBasis: basis })}
              onToggleNominal={value => patch({ showNominal: value })}
              nominalId="nominal-label-mobile"
              targetId="target-mobile"
            />
          </div>

          <Section title="Pension percent">
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                id="employee-percent"
                label="You pay in"
                hint="Percent of the pay that counts. The payslip uses this."
                suffix="%"
                value={inputs.employeePercent}
                min={0}
                max={100}
                step={0.5}
                onChange={value => patch({ employeePercent: value ?? 0 })}
              />
              <NumberField
                id="employer-percent"
                label="Employer pays in"
                suffix="%"
                value={inputs.employerPercent}
                min={0}
                max={100}
                step={0.5}
                onChange={value => patch({ employerPercent: value ?? 0 })}
              />
            </div>
          </Section>

          <details className="group rounded-3xl border border-[#e5e0d9] bg-[#fdfcfa] p-4 sm:p-5">
            <summary className="ptp-summary flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-[#a34832] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a34832]">
              More detail
              <span className="text-sm group-open:hidden">Show</span>
              <span className="hidden text-sm group-open:inline">Hide</span>
            </summary>
            <div className="mt-4 space-y-4">
              <NumberField
                id="pot"
                label="Pension pot today"
                hint="Use 0 if you're not sure. A small pot is a starting point."
                prefix="£"
                value={inputs.currentPensionPot}
                step={500}
                onChange={value => patch({ currentPensionPot: value ?? 0 })}
              />
              <Choice
                name="match"
                label="Does your employer pay more if you do?"
                hint="Check your contract or ask HR."
                value={inputs.matchRule}
                options={[
                  { value: 'none', label: 'No' },
                  { value: 'upTo', label: 'Up to a %' },
                  { value: 'other', label: 'Other' },
                ]}
                onChange={value => patch({ matchRule: value })}
              />
              {inputs.matchRule === 'upTo' ? (
                <NumberField
                  id="match-cap"
                  label="They match up to"
                  suffix="%"
                  value={inputs.matchUpToPercent}
                  min={0}
                  max={100}
                  step={0.5}
                  onChange={value => patch({ matchUpToPercent: value ?? 0 })}
                />
              ) : null}
              {inputs.matchRule === 'other' ? (
                <p className="text-sm text-[#57534e]">
                  Employer stays at the percent you typed.
                </p>
              ) : null}
              <Choice
                name="sacrifice"
                label="Salary sacrifice?"
                hint="Your employer pays your contribution from your salary, so you pay less National Insurance. It can't take you below minimum wage."
                value={inputs.salarySacrifice}
                options={[
                  { value: 'unknown', label: "Don't know" },
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
                onChange={value => patch({ salarySacrifice: value })}
              />
              {inputs.salarySacrifice === 'no' ? (
                <Choice
                  name="relief"
                  label="Tax relief"
                  hint="Provider adds 20% means you pay 80%. Net pay takes it before income tax. The pot ends up in the same place."
                  value={inputs.taxRelief}
                  options={[
                    { value: 'reliefAtSource', label: 'Provider adds 20%' },
                    { value: 'netPay', label: 'Net pay' },
                  ]}
                  onChange={value => patch({ taxRelief: value })}
                />
              ) : null}
              {inputs.salarySacrifice === 'yes' ? (
                <label className="flex items-start gap-3 text-sm leading-snug">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 accent-[#a34832]"
                    checked={inputs.employerPassesOnNiSaving}
                    onChange={event =>
                      patch({ employerPassesOnNiSaving: event.target.checked })
                    }
                  />
                  <span>
                    Employer adds their National Insurance saving to your
                    pension
                  </span>
                </label>
              ) : null}
              {inputs.salarySacrifice === 'yes' ? (
                <NumberField
                  id="hours"
                  label="Hours each week"
                  hint="Optional. Used only to warn if salary sacrifice would drop you under the minimum wage."
                  optional
                  value={inputs.hoursPerWeek}
                  min={1}
                  max={80}
                  step={0.5}
                  onChange={value => patch({ hoursPerWeek: value })}
                />
              ) : null}
              <NumberField
                id="state-weekly"
                label="State pension per week"
                hint="Starts as the full new state pension. Yours can be lower."
                prefix="£"
                value={inputs.statePensionWeekly}
                min={0}
                max={2000}
                step={0.01}
                onChange={value => patch({ statePensionWeekly: value ?? 0 })}
              />
              <p className="text-sm">
                <a className="underline" href={STATE_PENSION_FORECAST_URL}>
                  Check yours at gov.uk
                </a>
              </p>
              <NumberField
                id="state-age"
                label="State pension age"
                value={inputs.statePensionAge}
                min={55}
                max={80}
                onChange={value =>
                  patch({ statePensionAge: value ?? inputs.statePensionAge })
                }
              />
              <NumberField
                id="other-balance"
                label="ISA and other savings today"
                prefix="£"
                value={inputs.otherSavingsBalance}
                step={500}
                onChange={value => patch({ otherSavingsBalance: value ?? 0 })}
              />
              <NumberField
                id="other-monthly"
                label="Other saving each month"
                prefix="£"
                value={inputs.otherMonthlySaving}
                step={10}
                onChange={value => patch({ otherMonthlySaving: value ?? 0 })}
              />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  Growth before you stop, after inflation
                  <Hint text="3% a year is a cautious middle guess for a mix of shares and bonds, in today's money." />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    ['Low', 1],
                    ['Mid', 3],
                    ['High', 5],
                  ].map(([label, value]) => {
                    const selected = inputs.realReturnBeforePercent === value
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={selected}
                        className={`min-h-[2.75rem] rounded-xl border text-sm ${
                          selected
                            ? 'border-[#a34832] bg-[#a34832] text-[#faf8f5]'
                            : 'border-[#d4cec4] bg-white'
                        }`}
                        onClick={() =>
                          patch({ realReturnBeforePercent: Number(value) })
                        }
                      >
                        {label} {value}%
                      </button>
                    )
                  })}
                </div>
              </div>
              <NumberField
                id="swr"
                label="Taken from the pot each year"
                hint="A rough rule, not a promise. The monthly income uses this, not a second drawdown sum."
                suffix="%"
                value={inputs.safeWithdrawalPercent}
                min={0}
                max={20}
                step={0.5}
                onChange={value => patch({ safeWithdrawalPercent: value ?? 0 })}
              />
              <NumberField
                id="return-after"
                label="Growth after you stop, after inflation"
                suffix="%"
                value={inputs.realReturnAfterPercent}
                min={-5}
                max={15}
                step={0.5}
                onChange={value =>
                  patch({ realReturnAfterPercent: value ?? 0 })
                }
              />
              <NumberField
                id="inflation"
                label="Inflation, for the future-money label"
                suffix="%"
                value={inputs.inflationPercent}
                min={0}
                max={20}
                step={0.1}
                onChange={value => patch({ inflationPercent: value ?? 0 })}
              />
            </div>
          </details>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="min-h-[2.75rem] rounded-xl bg-[#a34832] px-4 py-3 text-sm font-medium text-[#faf8f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a34832]"
              onClick={() => void share()}
            >
              Copy a link to these numbers
            </button>
            <button
              type="button"
              className="min-h-[2.75rem] rounded-xl border border-[#a34832] bg-white px-4 py-3 text-sm font-medium text-[#a34832] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a34832]"
              onClick={clearData}
            >
              Clear my data
            </button>
          </div>
          {shareNote ? (
            <p role="status" className="text-sm">
              {shareNote}
            </p>
          ) : (
            <p className="text-sm text-[#57534e]">
              Stays on this phone. Nothing is sent to a server.
            </p>
          )}
        </form>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <div className="hidden lg:block">
            <PayslipStory
              inputs={inputs}
              analysis={analysis}
              alternateMonthly={alternateMonthly}
              today={today}
              onPatch={patch}
              onBasis={basis => patch({ contributionBasis: basis })}
              onToggleNominal={value => patch({ showNominal: value })}
              nominalId="nominal-label-desktop"
              targetId="target-desktop"
            />
          </div>
          <Results inputs={inputs} analysis={analysis} />
        </aside>
      </div>

      <footer
        className="mx-auto mt-8 max-w-6xl border-t border-[#e5e0d9] px-4 py-6 text-xs leading-relaxed text-[#57534e]"
      >
        <p className="mx-auto max-w-6xl">
          {DISCLAIMER.split('MoneyHelper')[0]}
          <a className="underline" href={MONEYHELPER_URL}>
            MoneyHelper
          </a>
          {DISCLAIMER.split('MoneyHelper')[1]}
        </p>
      </footer>
    </div>
  )
}
