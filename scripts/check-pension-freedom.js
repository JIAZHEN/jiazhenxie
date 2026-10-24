import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'pension-freedom-'))
const close = (a, b, tolerance = 1e-6) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`)
try {
  fs.mkdirSync(path.join(scratch, 'calc'))
  for (const name of ['uk-constants.ts', ...fs.readdirSync('src/calc').filter(n => n.endsWith('.ts')).map(n => `calc/${n}`)]) {
    fs.writeFileSync(path.join(scratch, name.replace('.ts', '.js')), ts.transpileModule(fs.readFileSync(`src/${name}`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)
  }
  const require = createRequire(import.meta.url)
  const { exchangeRate, incomeCliffs, childBenefitCharge, niSavingAffected, aboveIncomeLine, sacrificeToIncomeLine, childBenefitCard } = require(path.join(scratch, 'calc/pensionInsights.js'))
  const { compareSchemeSwitch, splitPlan } = require(path.join(scratch, 'calc/schemeSwitch.js'))
  const { freedomAge, simulateFreedom } = require(path.join(scratch, 'calc/freedom.js'))
  const { FREEDOM_DEFAULTS } = require(path.join(scratch, 'uk-constants.js'))
  assert.equal(exchangeRate(0, 0), null)
  assert.equal(exchangeRate(200, 100).value, 2)
  assert.equal(exchangeRate(200, 0).kind, 'free')
  assert.equal(exchangeRate(200, -10).kind, 'gain')
  for (const [ani, cb, lost, taper] of [[59999,false,false,false],[60000,true,false,false],[80000,true,false,false],[100000,false,false,false],[100001,false,true,true],[125140,false,true,true]]) assert.deepEqual(incomeCliffs(ani), { childBenefit: cb, childcareLost: lost, allowanceTaper: taper })
  // Income-line presentation tolerance must never alter payroll amounts.
  for (const [ani, expected] of [[100000,false],[100000.40,false],[100000.50,false],[100001,true]]) {
    assert.equal(aboveIncomeLine(ani), expected)
    assert.equal(incomeCliffs(ani).childcareLost, expected)
    assert.equal(incomeCliffs(ani).allowanceTaper, expected)
  }
  const thresholdTarget = sacrificeToIncomeLine(110000,110000)
  assert.equal(thresholdTarget.annual,10000)
  assert.equal(thresholdTarget.percent,9.10)
  assert.ok(/^\d+(\.\d{1,2})?$/.test(String(thresholdTarget.percent)))
  const atLine = compareSchemeSwitch({salary:110000,currentMethod:'netPay',currentGrossMonthly:200,employerMonthly:150,targetPercent:thresholdTarget.percent,niTopUpPercent:0})
  assert.ok(atLine.afterAni <= 100000)
  assert.equal(aboveIncomeLine(atLine.afterAni),false)
  for (const salary of [110000,110000.4,105000.01]) for (const basis of [salary,44030]) {
    const target = sacrificeToIncomeLine(salary,basis)
    assert.equal(target.annual,Math.ceil(salary-100000))
    assert.ok(salary - basis * target.percent / 100 <= 100000)
    close(target.percent * 100,Math.round(target.percent * 100))
  }
  assert.equal(sacrificeToIncomeLine(110000,0),null)
  assert.deepEqual(childBenefitCard(59000,59000),{kind:'hidden'})
  assert.deepEqual(childBenefitCard(60000,60000),{kind:'hidden'})
  assert.deepEqual(childBenefitCard(85000,82000),{kind:'full',aboveBefore:5000,aboveAfter:2000})
  assert.deepEqual(childBenefitCard(80000,80000),{kind:'full',aboveBefore:0,aboveAfter:0})
  assert.deepEqual(childBenefitCard(75000,67500),{kind:'partial'})
  close(childBenefitCharge(75000,1)-childBenefitCharge(67500,1),534.508)
  close(childBenefitCharge(60000, 1), 0)
  close(childBenefitCharge(60199, 1), 0)
  close(childBenefitCharge(60200, 1), 14.066)
  close(childBenefitCharge(70000, 2), (27.05 + 17.90) * 52 / 2)
  close(childBenefitCharge(80000, 2), (27.05 + 17.90) * 52)
  close(childBenefitCharge(200000, 0), 0)
  close(niSavingAffected(80000, 8000).employee, 120)
  close(niSavingAffected(80000, 8000).employer, 900)
  close(niSavingAffected(80000, 2000).employee, 0)
  close(niSavingAffected(16000, 10000).employee, 114.4)
  const example = { salary:80000, currentMethod:'netPay', currentGrossMonthly:44030*.05/12, employerMonthly:44030*.03/12, targetPercent:10, niTopUpPercent:0 }
  const unchanged = compareSchemeSwitch(example)
  assert.equal(Math.round(unchanged.cashCostMonthly), 277)
  assert.equal(Math.round(unchanged.extraMonthly), 483)
  const children = compareSchemeSwitch({...example,children:2})
  close(children.beforeAni, example.salary - example.currentGrossMonthly*12)
  close(children.afterAni, 72000)
  close(unchanged.cashCostMonthly - children.cashCostMonthly, children.childBenefitSavingMonthly)
  close(children.beforeTakeHomeMonthly - children.afterTakeHomeMonthly, children.cashCostMonthly)
  for (const input of [example,{...example,children:2},{...example,salary:105000}]) {
    const full = compareSchemeSwitch(input)
    for (const fraction of [0,.5,1]) {
      const isa = Math.max(0,full.cashCostMonthly) * fraction
      const plan = splitPlan(input, isa)
      close(plan.cashCostMonthly + isa, full.cashCostMonthly, .1)
    }
  }
  const bridge = { ...FREEDOM_DEFAULTS, age:45, pension:2000000, isa:0, monthlyIsa:0, spending:24000 }
  const bridgeResult = freedomAge(bridge,0,.04)
  assert.equal(bridgeResult.age,57)
  assert.equal(bridgeResult.pensionOnlyAge,45)
  assert.equal(simulateFreedom(bridge,0,.04,45).bridgeFailed,true)
  const pensionLimit = { ...FREEDOM_DEFAULTS, age:57, pension:0, isa:0, monthlyIsa:0, spending:20000, includeState:false }
  const pensionResult = freedomAge(pensionLimit,50000,.04)
  assert.ok(pensionResult.age > 57 && pensionResult.age <=75)
  assert.equal(pensionResult.pensionOnlyAge,pensionResult.age)
  const none = freedomAge({...pensionLimit,spending:100000},0,.02)
  assert.equal(none.age,null)
  assert.ok(none.shortfall > 0)
  const noTax = simulateFreedom({...FREEDOM_DEFAULTS,age:60,liveTo:61,pension:10000,isa:0,spending:10000,includeState:false},0,0,60)
  assert.ok(noTax.works)
  close(noTax.points.at(-1).pension,0,.01)
  for (const rate of [.02,.04,.06]) { const result = freedomAge(FREEDOM_DEFAULTS, 15000, rate); assert.ok(result.points.every(p => p.pension>=0 && p.isa>=0)); if (result.age != null) assert.ok(result.works) }
  // Independent closed-form checks: an existing £50k pot is a starting balance,
  // not an annual contribution, and appears in both comparison plans.
  const existingPot = { ...FREEDOM_DEFAULTS, pension:50000 }
  const years = 20
  const stop = existingPot.age + years
  for (const rate of [.02,.04,.06]) {
    const growth = (1 + rate) ** years
    const contributionFactor = (growth - 1) / rate
    const noPayments = simulateFreedom(existingPot,0,rate,stop)
    close(noPayments.points[0].pension,50000)
    close(noPayments.points.find(p => p.age === stop).pension,50000 * growth)
    for (const monthly of [unchanged.beforeMonthly, unchanged.afterMonthly]) {
      const simulation = simulateFreedom(existingPot,monthly * 12,rate,stop)
      close(simulation.points.find(p => p.age === stop).pension,50000 * growth + monthly * 12 * contributionFactor)
      const withoutExisting = simulateFreedom({...existingPot,pension:0},monthly * 12,rate,stop)
      close(simulation.points.find(p => p.age === stop).pension - withoutExisting.points.find(p => p.age === stop).pension,50000 * growth)
    }
    const locked = simulateFreedom({...existingPot,age:50,isa:0,monthlyIsa:0,spending:10000,liveTo:60},0,rate,50)
    assert.equal(locked.bridgeFailed,true)
    close(locked.points[1].pension,50000 * (1 + rate))
    close(locked.bridgeNeeded,[0,1,2,3,4,5,6].reduce((sum,year)=>sum+10000/(1+rate)**year,0))
    const beforeAge = freedomAge(existingPot,unchanged.beforeMonthly * 12,rate)
    const afterAge = freedomAge(existingPot,unchanged.afterMonthly * 12,rate)
    if (beforeAge.age != null && afterAge.age != null) assert.ok(afterAge.age <= beforeAge.age)
    console.log(`Existing £50k, ${(rate*100).toFixed(0)}% real: pot alone at ${stop} £${Math.round(50000*growth)}; current stop ${beforeAge.age}; changed stop ${afterAge.age}.`)
  }
  console.log('Pension insights, boundaries, Child Benefit, 2029 NI, default regression, split budget and freedom model passed.')
} finally { fs.rmSync(scratch, {recursive:true,force:true}) }
