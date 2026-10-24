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
  const { compare, sacrificeForCost, payPicture, futureValue, freedomAge, simulate, exampleInputs } = require(path.join(scratch, 'calc/payday.js'))
  const close = (a,b,t=.01) => assert.ok(Math.abs(a-b)<t, `${a} != ${b}`)
  const pay = {salary:110000,ownPct:0,employerPct:0,children:0,basis:'full'}
  close(sacrificeForCost(pay,3800),10000)
  for (const salary of [25000,65000,75000,110000,140000]) for (const children of [0,2]) {
    const p = {...pay,salary,children}
    const s = sacrificeForCost(p,4800)
    close(payPicture(p,0).takeHome-payPicture(p,s).takeHome,4800)
  }
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
  const projection = {...c.best.s,pension:1e7,isa:0,pensionYearly:0,isaYearly:0}
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
  console.log('Payday: solver, split/tie selection, bridge/total failure, 75+, accessible savings, earnings basis and future amounts pass.')
} finally {fs.rmSync(scratch,{recursive:true,force:true})}
