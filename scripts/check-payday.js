import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'payday-'))
try {
  fs.mkdirSync(path.join(scratch, 'calc'))
  for (const name of ['uk-constants.ts', ...fs.readdirSync('src/calc').filter(n => n.endsWith('.ts')).map(n => `calc/${n}`)]) {
    fs.writeFileSync(path.join(scratch, name.replace('.ts', '.js')), ts.transpileModule(fs.readFileSync(`src/${name}`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)
  }
  const require = createRequire(import.meta.url)
  const { compare, sacrificeForCost, payPicture, futureValue, freedomAge, simulate, phases, grossWithdrawal, LUMP_SUM_ALLOWANCE, exampleInputs, inputsForExample } = require(path.join(scratch, 'calc/payday.js'))
  const close = (a,b,t=.01) => assert.ok(Math.abs(a-b)<t, `${a} != ${b}`)
  const pay = {salary:110000,ownPct:0,employerPct:0,children:0,basis:'full'}
  close(sacrificeForCost(pay,3800),10000)
  for (const salary of [25000,65000,75000,110000,140000]) for (const children of [0,2]) {
    const p = {...pay,salary,children}
    const s = sacrificeForCost(p,4800)
    close(payPicture(p,0).takeHome-payPicture(p,s).takeHome,4800)
  }
  const blog = inputsForExample('80k')
  assert.deepEqual(inputsForExample('unknown'), exampleInputs)
  assert.deepEqual(inputsForExample(null), exampleInputs)
  const results = [.02,.04,.06].map(r => compare({...blog,r}))
  assert.deepEqual([results[1].nothing.f.age,results[1].allPension.f.age,results[1].allIsa.f.age],[53,53,50])
  assert.equal(Math.round(results[1].allPension.pensionMonthlyExtra),474)
  assert.ok(results[0].allPension.f.age < results[0].allIsa.f.age)
  assert.ok(results[2].allIsa.f.age < results[2].allPension.f.age)
  assert.equal(Math.round(futureValue(2000,.025,15)),2897)
  console.log('Blog example:', results.map(c => ({keep:c.nothing.f.age,pension:c.allPension.f.age,isa:c.allIsa.f.age})))
  const c = compare(exampleInputs)
  assert.deepEqual([c.nothing.f.age,c.allPension.f.age,c.best.f.age,c.allIsa.f.age],[56,54,53,54])
  close(c.best.isaMonthly,120)
  close(c.best.pensionCostMonthly,280)
  close(c.rate,2.63,.01)
  close(c.allPension.pensionMonthlyExtra,1053,1)
  for (let i=0;i<=20;i++) {
    const opt = c.scenario(i/20)
    assert.ok((opt.f.age??999)>=(c.best.f.age??999))
    if (opt.f.age===c.best.f.age) assert.ok(opt.isaShare>=c.best.isaShare)
  }
  const projection = {...c.best.s,pension:1e7,isa:0,pensionYearly:0,pensionByYear:undefined,isaYearly:0}
  assert.equal(freedomAge(projection).age,57)
  assert.equal(simulate(projection,56).why,'bridge')
  const total = {...projection,access:38,pension:100000,sp:0}
  assert.equal(simulate(total,38).why,'total')
  const impossible = {...total,pension:0,isa:0}
  assert.equal(freedomAge(impossible).age,null)
  const isaOnly = {...projection,pension:0,isa:1e7,sp:0}
  assert.equal(freedomAge(isaOnly).age,38)
  for (const [years,expected] of [[15,4828],[19,5329],[29,6821]]) close(futureValue(40000/12,.025,years),expected,1)
  close(futureValue(1000,0,20),1000)
  const qe = compare({...exampleInputs,basis:'qualifying'})
  assert.ok(qe.base.pensionIn<c.base.pensionIn)
  console.log(JSON.stringify({ages:[c.nothing.f.age,c.allPension.f.age,c.best.f.age,c.allIsa.f.age],pensionCost:c.best.pensionCostMonthly,isa:c.best.isaMonthly,rate:c.rate,extra:c.allPension.pensionMonthlyExtra,futureMonthly:[15,19,29].map(y=>Math.round(futureValue(40000/12,.025,y)))},null,2))
  const laterExtra = sacrificeForCost(exampleInputs,4800,2029)
  close(payPicture(exampleInputs,0,2029).takeHome-payPicture(exampleInputs,laterExtra,2029).takeHome,4800)
  close(payPicture(exampleInputs,laterExtra,2029).ni, payPicture(exampleInputs,2000,2029).ni)
  const shared = {...exampleInputs,employerNiShare:1}
  close(payPicture(shared,10000).employerTopUp,1500)
  close(payPicture(shared,10000,2029).employerTopUp,300)
  close(payPicture({...shared,employerNiShare:.5},10000,2029).employerTopUp,150)
  assert.ok(grossWithdrawal(40000,0,0)>grossWithdrawal(40000,0))
  for (const infl of [0,.025,.1]) {
    const sim = simulate({...projection,access:38,infl},38)
    close(sim.taxFreeCashTaken,LUMP_SUM_ALLOWANCE)
    assert.ok(sim.taxFreeCashTaken<=268275)
  }
  for (let i=0;i<=20;i++) assert.ok(c.scenario(i/20).f.sim.taxFreeCashTaken<=268275)
  const chosen = c.best.pic, gap = chosen.ani-100000
  const childcareCost = (chosen.takeHome-payPicture(exampleInputs,c.best.extra+gap).takeHome)/12
  assert.ok(gap>0 && childcareCost>0)
  console.log('Updated default:',JSON.stringify({age:c.best.f.age,stages:phases(c.best.s,c.best.f.age).list.map(p=>({age:p.from,monthly:p.net/12,pension:p.balance.pen,isa:p.balance.isa})),end:c.best.f.sim.end,taxFree:c.best.f.sim.taxFreeCashTaken,childcare:{gap,monthly:childcareCost,support:4000},rate2029:laterExtra/4800}))
  console.log('Payday: solver, split/tie selection, bridge/total failure, 75+, accessible savings, earnings basis and future amounts pass.')
} finally {fs.rmSync(scratch,{recursive:true,force:true})}
