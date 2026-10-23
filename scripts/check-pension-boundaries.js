import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'pension-audit-'));
const transpile = source => ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText;
// Independent 2026/27 EWNI tax and Category A NI reference, checked against GOV.UK.
function tax(pay) {
  const allowance = Math.max(0, 12570 - Math.max(0, pay - 100000) / 2);
  const bands = [[37700, .2], [87440, .4], [Infinity, .45]];
  let remaining = Math.max(0, pay - allowance), total = 0;
  for (const [width, rate] of bands) { const slice = Math.min(remaining, width); total += slice * rate; remaining -= slice; }
  return total;
}
const ni = pay => Math.max(0, Math.min(pay, 50270) - 12570) * .08 + Math.max(0, pay - 50270) * .02;
const base = (pay, basis) => basis === 'full' ? pay : Math.max(0, Math.min(pay, 50270) - 6240);
const close = (a,b) => assert.ok(Math.abs(a-b) < 1e-7, `${a} != ${b}`);
try {
  fs.mkdirSync(path.join(scratch, 'calc'));
  for (const name of fs.readdirSync('src/calc').filter(n => n.endsWith('.ts') && !n.includes('.test.'))) fs.writeFileSync(path.join(scratch, 'calc', name.replace(/\.ts$/, '.js')), transpile(fs.readFileSync(`src/calc/${name}`, 'utf8')));
  fs.writeFileSync(path.join(scratch, 'uk-constants.js'), transpile(fs.readFileSync('src/uk-constants.ts', 'utf8')));
  const { compareSchemeSwitch, solveSchemeSwitchBudget } = createRequire(import.meta.url)(path.join(scratch, 'calc/schemeSwitch.js'));
  let cases = 0;
  for (const salary of [0, 1, 6239.99,6240,6240.01,12569.99,12570,12570.01,50269.99,50270,50270.01,99999.99,100000,100000.01,125139.99,125140,125140.01,200000,200000.01]) {
    for (const currentRate of [0,5,100]) for (const targetPercent of [0,.01,10,100]) for (const targetBasis of ['full','qualifying']) for (const niTopUpPercent of [0,15]) {
      const currentGrossMonthly = base(salary, 'qualifying') * currentRate / 1200;
      const employerMonthly = base(salary, 'qualifying') * .03 / 12;
      const input = { salary, currentMethod:'netPay', currentGrossMonthly, employerMonthly, targetBasis, targetPercent, niTopUpPercent };
      const result = compareSchemeSwitch(input);
      const sacrifice = base(salary, targetBasis) * targetPercent / 100;
      const beforeCash = salary - currentGrossMonthly * 12 - tax(salary-currentGrossMonthly*12) - ni(salary);
      const afterCash = salary-sacrifice-tax(salary-sacrifice)-ni(salary-sacrifice);
      close(result.cashCostMonthly,(beforeCash-afterCash)/12);
      close(result.afterMonthly, sacrifice / 12 * (1+niTopUpPercent/100)+employerMonthly);
      close(result.extraMonthly, result.afterMonthly-result.beforeMonthly);
      assert.ok(Object.values(result).filter(v => typeof v === 'number').every(Number.isFinite));
      if ((salary > 200000) || result.afterMonthly*12 > 60000+.00001) assert.ok(result.issues.length);
      cases++;
    }
  }
  const validInput = { salary:80000,currentMethod:'netPay',currentGrossMonthly:200,employerMonthly:150,targetPercent:10,niTopUpPercent:0 };
  for (const [field, value] of [['salary',NaN],['salary',Infinity],['salary',-1],['currentGrossMonthly',-1],['employerMonthly',Infinity],['targetPercent',101],['niTopUpPercent',16]]) assert.ok(compareSchemeSwitch({...validInput,[field]:value}).issues.length);
  let solverCases = 0;
  for (const salary of [1,6240,12570,50270,80000,100000,125140,200000]) for (const budget of [0,.01,200,5000]) for (const targetBasis of ['full','qualifying']) {
    const input = { salary,currentMethod:'netPay',currentGrossMonthly:base(salary,'qualifying')*.05/12,employerMonthly:base(salary,'qualifying')*.03/12,targetPercent:10,targetBasis,niTopUpPercent:0 };
    const solved = solveSchemeSwitchBudget(input,budget);
    assert.ok(solved.result.cashCostMonthly <= budget + 1e-7);
    assert.ok(solved.result.issues.length === 0);
    assert.ok(solved.targetPercent>=0 && solved.targetPercent<=100);
    if (!solved.limited && base(salary,targetBasis)>0) assert.ok(budget-solved.result.cashCostMonthly < .02);
    solverCases++;
  }
  console.log(`Independent payroll-formula cross-check: ${cases} scenarios passed. Budget/allowance boundaries: ${solverCases} passed.`);
} finally { fs.rmSync(scratch,{recursive:true,force:true}); }
