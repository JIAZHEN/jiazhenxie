import fs from 'node:fs';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Use the exact same TypeScript model as the interactive example.
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'pension-visuals-'));
const root = process.cwd();
try {
  for (const dir of ['calc', 'pension']) {
    fs.mkdirSync(path.join(scratch, dir), { recursive: true });
    const names = dir === 'calc' ? fs.readdirSync(`src/${dir}`).filter(name => name.endsWith('.ts') && !name.includes('.test.')) : ['illustration.ts', 'defaults.ts'];
    for (const name of names) {
      const source = fs.readFileSync(`src/${dir}/${name}`, 'utf8');
      fs.writeFileSync(path.join(scratch, dir, name.replace(/\.ts$/, '.js')), ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText);
    }
  }
  fs.writeFileSync(path.join(scratch, 'uk-constants.js'), ts.transpileModule(fs.readFileSync('src/uk-constants.ts', 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText);
  const { pensionIllustration } = createRequire(import.meta.url)(path.join(scratch, 'pension/illustration.js'));
  // Regression: sacrifice changes the tax calculation, not the chosen pay basis.
  const requireModel = createRequire(import.meta.url);
  const { pensionInflow } = requireModel(path.join(scratch, 'calc/contributions.js'));
  const { defaultInputs } = requireModel(path.join(scratch, 'pension/defaults.js'));
  const base = { ...defaultInputs, grossAnnualSalary: 80000, salarySacrifice: 'yes', contributionBasis: 'full' };
  const today = new Date('2026-10-22T00:00:00Z');
  const full = pensionInflow(base, 10, 3, today);
  assert.equal(full.employeeGrossAnnual, 8000, '10% must use pre-sacrifice £80k, not reduced cash pay');
  assert.equal(full.employerAnnual, 2400);
  assert.equal(full.intoPensionAnnual, 10400, 'Full salary must not be capped at the qualifying-earnings ceiling');
  const qualifying = pensionInflow({ ...base, contributionBasis: 'qualifying' }, 10, 3, today);
  assert.equal(qualifying.employeeGrossAnnual, 4403);
  const future = pensionInflow(base, 10, 3, new Date('2030-01-01T00:00:00Z'));
  assert.equal(future.intoPensionAnnual, full.intoPensionAnnual, 'The 2029 NI relief limit is not a contribution limit');
  const { pensionDecision } = requireModel(path.join(scratch, 'calc/decision.js'));
  const decisionBase = { salary: 110000, bonus: 0, otherIncome: 0, giftAidNet: 0, employeePercent: 0, employerAnnual: 0, basis: 'full', method: 'salarySacrifice', extraMonthly: 10000 / 12 };
  const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < .001, `${actual} != ${expected}`);
  const ss = pensionDecision(decisionBase);
  close(ss.after.ani, 100000);
  close(ss.finalCostMonthly * 12, 3800);
  close(ss.after.allowance, 12570);
  const net = pensionDecision({ ...decisionBase, method: 'netPay' });
  close(net.finalCostMonthly * 12, 4000);
  const ras = pensionDecision({ ...decisionBase, method: 'reliefAtSource' });
  close(ras.cashCostMonthly * 12, 8000);
  close(ras.extraReliefAnnual, 4000);
  close(ras.finalCostMonthly * 12, 4000);
  close(ras.after.ani, ss.after.ani);
  const bonus = pensionDecision({ ...decisionBase, salary: 95000, bonus: 15000, extraMonthly: 0 });
  close(bonus.before.ani, 110000);
  const existingPension = pensionDecision({ ...decisionBase, employeePercent: 5, extraMonthly: 0 });
  close(existingPension.extraNeededFor100k, 4500);
  const sipp = pensionDecision({ ...decisionBase, otherRasAnnual: 5000, extraMonthly: 0 });
  close(sipp.before.ani, 105000);
  close(sipp.extraNeededFor100k, 5000);
  close(sipp.annualPension, 5000);
  const charity = pensionDecision({ ...decisionBase, giftAidNet: 8000, extraMonthly: 0 });
  close(charity.before.ani, 100000);
  const otherIncome = pensionDecision({ ...decisionBase, salary: 95000, otherIncome: 15000, extraMonthly: 0 });
  close(otherIncome.before.ani, 110000);
  const irregular = pensionDecision({ ...decisionBase, salary: 40000, bonus: 70000, basis: 'qualifying' });
  assert.ok(irregular.issues.some(issue => issue.includes('pay-period')));
  const confirmedPayroll = pensionDecision({ ...decisionBase, salary: 40000, bonus: 70000, basis: 'qualifying', currentWorkplaceAnnual: 2500 });
  close(confirmedPayroll.existing, 2500);
  assert.ok(!confirmedPayroll.issues.some(issue => issue.includes('pay-period')));
  const exceeds = pensionDecision({ ...decisionBase, extraMonthly: 5001 });
  assert.ok(exceeds.issues.some(issue => issue.includes('£60,000')));
  assert.ok(exceeds.annualPension > 60000, 'Do not silently truncate actual contributions');
  console.log('£100k decision checks passed: sacrifice, net pay, RAS claim timing, bonus, existing pension, Gift Aid and allowance boundaries.');
  const result = pensionIllustration();
  const gbp = value => '£' + Math.round(value).toLocaleString('en-GB');
  const shell = (title, desc, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${desc}</desc><rect width="800" height="480" fill="#faf8f5"/><g font-family="Arial, sans-serif" fill="#262626">${inner}</g></svg>`;
  const head = (kicker, title) => `<text x="40" y="38" fill="#a34832" font-size="13" letter-spacing="2">${kicker}</text><text x="40" y="82" font-size="30" font-weight="600">${title}</text>`;
  const flow = shell('What an extra £500 into a pension could mean', 'Illustration at age 35, salary £80,000, salary sacrifice. '+gbp(result.cashCostMonthly)+' less take-home each month; £500 extra monthly contribution; '+gbp(result.extraPot)+' extra total pension pot at 67. These amounts have different units.', `${head('PAYDAY → PENSION', 'A monthly decision. A long-term difference.')}
  <rect x="40" y="115" width="720" height="86" rx="8" fill="#f3e4de"/><text x="60" y="146" font-size="16">LESS TAKE-HOME / MONTH, TODAY</text><text x="60" y="184" fill="#a34832" font-size="34">${gbp(result.cashCostMonthly)}</text>
  <rect x="40" y="215" width="720" height="86" rx="8" fill="#e6ebe6"/><text x="60" y="246" font-size="16">EXTRA INTO THE PENSION / MONTH</text><text x="60" y="284" fill="#4d704d" font-size="34">£500</text>
  <text x="40" y="343" font-size="17">Extra total pot at 67: <tspan font-weight="700" fill="#4d704d">${gbp(result.extraPot)}</tspan></text>
  <text x="40" y="376" font-size="17">Estimated extra retirement income: ${gbp(result.extraIncomeMonthly)} / month</text>
  <text x="40" y="416" font-size="13" fill="#57534e">Age 35 → 67 · £80k salary · 3% real growth · 4% withdrawal rate</text>
  <text x="40" y="440" font-size="13" fill="#57534e">Employer contribution unchanged. No fees. Future figures in today’s money.</text>
  <text x="40" y="463" font-size="12" fill="#57534e">Take-home cost is today’s; NI savings change from April 2029. Estimates, not guarantees.</text>`);
  const x = years => 78 + years / 32 * 640;
  const max = Math.ceil(result.extraPot / 100000) * 100000;
  const y = pot => 356 - pot / max * 230;
  const points = result.points.map(point => `${x(point.years)},${y(point.pot)}`).join(' ');
  const growth = shell('How extra pension contributions could build over 32 years', '£500 extra monthly contributions at 3% real growth from age 35 to 67. Final extra pot '+gbp(result.extraPot)+'. Comparison line shows contributions without growth. No fees. Not a guaranteed return.', `${head('TIME DOES SOME OF THE WORK', '£500 extra a month, from age 35 to 67')}
  ${[0, max/2, max].map(value => `<line x1="78" x2="718" y1="${y(value)}" y2="${y(value)}" stroke="#ded8cf"/><text x="66" y="${y(value)+5}" text-anchor="end" font-size="14">£${Math.round(value/1000)}k</text>`).join('')}
  <polyline points="${result.points.map(point => `${x(point.years)},${y(point.years*6000)}`).join(' ')}" fill="none" stroke="#a34832" stroke-width="3" stroke-dasharray="7 5"/>
  <polyline points="${points}" fill="none" stroke="#4d704d" stroke-width="4"/>
  ${result.points.map(point => `<circle cx="${x(point.years)}" cy="${y(point.pot)}" r="4" fill="#4d704d"/><text x="${x(point.years)}" y="382" text-anchor="middle" font-size="14">${35+point.years}</text>`).join('')}
  <text x="718" y="407" text-anchor="end" font-size="13">AGE</text>
  <text x="40" y="435" fill="#4d704d" font-size="14">━━ With 3% real growth</text><text x="350" y="435" fill="#a34832" font-size="14">┄┄ Contributions only (0% growth)</text>
  <text x="40" y="465" fill="#57534e" font-size="13">Extra pot in today’s money. No fees or pay rises. Illustrative, not a forecast.</text>`);
  fs.mkdirSync('public/images/pension', {recursive:true});
  fs.writeFileSync('public/images/pension/payday-tradeoff.svg', flow);
  fs.writeFileSync('public/images/pension/extra-pot-growth.svg', growth);
  fs.writeFileSync('public/images/pension/example.json', JSON.stringify(result, null, 2)+'\n');
  console.log('Pension illustration generated:', result);
} finally { fs.rmSync(scratch, {recursive:true, force:true}); }
