import { project } from '../calc/project'
import { defaultInputs } from './defaults'

// A fixed, labelled example. It never replaces the visitor's saved inputs.
export function pensionIllustration(extraGrossMonthly = 500) {
  const inputs = { ...defaultInputs, grossAnnualSalary: 80_000, contributionBasis: 'full' as const, salarySacrifice: 'yes' as const }
  const on = new Date('2026-10-22T00:00:00Z')
  const before = project(inputs, {}, on)
  const after = project(inputs, { employeePercent: inputs.employeePercent + extraGrossMonthly * 12 * 100 / inputs.grossAnnualSalary }, on)
  return {
    extraGrossMonthly,
    cashCostMonthly: before.takeHomeMonthly - after.takeHomeMonthly,
    extraPot: after.pensionPot - before.pensionPot,
    extraIncomeMonthly: after.atRetirementMonthly - before.atRetirementMonthly,
    points: [0, 8, 16, 24, 32].map(years => {
      const start = { ...inputs, retirementAge: inputs.ageNow + years }
      return { years, pot: project(start, { employeePercent: inputs.employeePercent + extraGrossMonthly * 12 * 100 / inputs.grossAnnualSalary }, on).pensionPot - project(start, {}, on).pensionPot }
    }),
  }
}
