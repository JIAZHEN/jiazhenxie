import { FREEDOM_MAX_AGE, PENSION_TAX_FREE_SHARE } from '../uk-constants'
import { incomeTaxAnnual } from './tax'

export interface FreedomInputs {
  age: number; pension: number; isa: number; monthlyIsa: number; spending: number
  liveTo: number; access: number; stateAge: number; stateAnnual: number; includeState: boolean
}
export interface WealthPoint { age: number; pension: number; isa: number }

/** End-of-year contributions, start-of-year withdrawals. All amounts stay real. */
export function simulateFreedom(input: FreedomInputs, annualPension: number, rate: number, stop: number, ignoreBridge = false) {
  let pension = input.pension, isa = input.isa, shortfall = 0, bridgeFailed = false
  const points: WealthPoint[] = [{ age: input.age, pension, isa }]
  let isaAtStop = isa
  for (let age = input.age; age < input.liveTo; age++) {
    if (age < stop) {
      pension = pension * (1 + rate) + annualPension
      isa = isa * (1 + rate) + input.monthlyIsa * 12
      isaAtStop = isa
    } else {
      const state = input.includeState && age >= input.stateAge ? input.stateAnnual : 0
      const stateNet = state - incomeTaxAnnual(state)
      let needed = Math.max(0, input.spending - stateNet)
      if (age >= input.access || ignoreBridge) {
        const net = (gross: number) => gross - (incomeTaxAnnual(state + gross * (1 - PENSION_TAX_FREE_SHARE)) - incomeTaxAnnual(state))
        let lo = 0, hi = pension
        for (let i = 0; i < 45; i++) { const mid = (lo + hi) / 2; if (net(mid) < needed) lo = mid; else hi = mid }
        const gross = Math.min(pension, hi)
        pension -= gross
        needed = Math.max(0, needed - net(gross))
      }
      if (needed > isa + .001 && age < input.access) bridgeFailed = true
      shortfall += Math.max(0, needed - isa) / Math.pow(1 + rate, age - stop)
      isa = Math.max(0, isa - needed) * (1 + rate)
      pension *= 1 + rate
    }
    points.push({ age: age + 1, pension, isa })
  }
  let bridgeNeeded = 0
  for (let age = stop; age < input.access; age++) {
    const state = input.includeState && age >= input.stateAge ? input.stateAnnual : 0
    bridgeNeeded += Math.max(0, input.spending - state + incomeTaxAnnual(state)) / Math.pow(1 + rate, age - stop)
  }
  return { works: shortfall < .01, shortfall, bridgeFailed, bridgeNeeded, isaAtStop, points }
}
export function freedomAge(input: FreedomInputs, annualPension: number, rate: number) {
  let pensionOnlyAge: number | null = null
  for (let age = input.age; age <= Math.min(FREEDOM_MAX_AGE, input.liveTo - 1); age++) {
    if (pensionOnlyAge == null && simulateFreedom(input, annualPension, rate, age, true).works) pensionOnlyAge = age
    const simulation = simulateFreedom(input, annualPension, rate, age)
    if (simulation.works) return { age, pensionOnlyAge, ...simulation }
  }
  return { age: null, pensionOnlyAge, ...simulateFreedom(input, annualPension, rate, Math.min(FREEDOM_MAX_AGE, input.liveTo - 1)) }
}
