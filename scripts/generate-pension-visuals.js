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
  const { pensionDecision, solveCashBudget } = requireModel(path.join(scratch, 'calc/decision.js'));
  const decisionBase = { salary: 110000, bonus: 0, otherIncome: 0, giftAidNet: 0, employeePercent: 0, employerAnnual: 0, basis: 'full', method: 'salarySacrifice', extraMonthly: 10000 / 12 };
  const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < .001, `${actual} != ${expected}`);
  const { compareSchemeSwitch, solveSchemeSwitchBudget } = requireModel(path.join(scratch, 'calc/schemeSwitch.js'));
  const switchInput = { salary: 80000, currentMethod: 'reliefAtSource', currentGrossMonthly: 200, employerMonthly: 150, targetPercent: 10, niTopUpPercent: 0 };
  const switched = compareSchemeSwitch(switchInput);
  close(switched.beforeMonthly, 350);
  close(switched.afterMonthly, 816.6666666667);
  close(switched.extraMonthly, 466.6666666667);
  close(switched.cashCostMonthly, 8000 / 12 * .58 - 200 * .8);
  // Compare final costs including the old RAS higher-rate claim, not payday alone.
  close(switched.finalCostMonthly, 8000 / 12 * .58 - 200 * .6);
  const noTopUp = compareSchemeSwitch({ ...switchInput, niTopUpPercent: 5 });
  close(noTopUp.afterMonthly - switched.afterMonthly, 8000 / 12 * .05);
  close(switched.cashCostMonthly, noTopUp.cashCostMonthly);
  const unchangedNetPay = compareSchemeSwitch({ ...switchInput, currentMethod: 'netPay', currentGrossMonthly: 8000 / 12, niTopUpPercent: 0 });
  close(unchangedNetPay.extraMonthly, 0);
  close(unchangedNetPay.cashCostMonthly, -8000 * .02 / 12);
  assert.ok(compareSchemeSwitch({ ...switchInput, targetPercent: 100 }).issues.length > 0);
  const separateBases = { ...switchInput, currentMethod: 'netPay', currentGrossMonthly: 44030 * .05 / 12, employerMonthly: 44030 * .03 / 12, employerAfterMonthly: 44030 * .03 / 12, targetBasis: 'full' };
  const separate = compareSchemeSwitch(separateBases);
  close(separate.sacrificeMonthly, 8000 / 12);
  close(separate.afterMonthly, 8000 / 12 + 44030 * .03 / 12);
  const changedEmployer = compareSchemeSwitch({ ...separateBases, employerAfterMonthly: 80000 * .03 / 12 });
  close(changedEmployer.afterMonthly - separate.afterMonthly, (80000 - 44030) * .03 / 12);
  close(changedEmployer.cashCostMonthly, separate.cashCostMonthly);
  const cashSwitch = solveSchemeSwitchBudget(separateBases, 200);
  assert.ok(cashSwitch.result.cashCostMonthly <= 200 && cashSwitch.result.cashCostMonthly > 199.99);
  const cappedSwitch = solveSchemeSwitchBudget({ ...separateBases, targetBasis: 'qualifying' }, 5000);
  assert.ok(cappedSwitch.limited);
  assert.ok(cappedSwitch.targetPercent <= 100);
  console.log('Scheme-switch checks passed: same-salary costs, gross RAS top-up, later relief, employer NI top-up and allowance boundary.');
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
  const cashExample = { ...decisionBase, employeePercent: 5, employerPercent: 3, extraMonthly: 0 };
  const cash200 = solveCashBudget(cashExample, 200);
  close(cash200.extraMonthly, 474.13);
  assert.ok(cash200.spent <= 200 && cash200.spent > 199.99);
  const generous = solveCashBudget({ ...cashExample, employerPercent: 10, matchRate: 2, matchCapPercent: 12 }, 200);
  close(generous.decision.totalExtraMonthly, 1422.39);
  close(generous.decision.employerExtraAnnual / 12, 948.26);
  const qualifyingEmployer = pensionDecision({ ...cashExample, basis: 'qualifying' });
  close(qualifyingEmployer.employerCurrentAnnual, 1320.9);
  close(pensionDecision(cashExample).employerCurrentAnnual, 3300);
  close(pensionDecision({ ...cashExample, employerPercent: undefined, employerAnnual: 3300, basis: 'qualifying' }).employerCurrentAnnual, 3300);
  const rasCash = solveCashBudget({ ...cashExample, method: 'reliefAtSource' }, 200);
  close(rasCash.extraMonthly, 250);
  close(rasCash.decision.finalCostMonthly, 100);
  const existingSippCash = solveCashBudget({ ...cashExample, otherRasAnnual: 5000 }, 200);
  assert.ok(existingSippCash.decision.extraReliefAnnual < 0);
  assert.ok(existingSippCash.decision.finalCostMonthly > existingSippCash.decision.cashCostMonthly);
  const rasNet = solveCashBudget({ ...cashExample, method: 'reliefAtSource' }, 200, 'afterRelief');
  assert.ok(rasNet.decision.cashCostMonthly > 200);
  assert.ok(rasNet.decision.finalCostMonthly <= 200);
  const exhausted = solveCashBudget({ ...cashExample, employerAnnual: 60000, employerPercent: undefined, employeePercent: 0 }, 200);
  assert.equal(exhausted.extraMonthly, 0);
  assert.equal(exhausted.limited, true);
  const noBudget = solveCashBudget(cashExample, 0);
  close(noBudget.extraMonthly, 0);
  const decomposition = generous.decision;
  close(decomposition.finalCostMonthly + decomposition.incomeTaxReliefMonthly + decomposition.niSavingMonthly + decomposition.providerTopUpMonthly + decomposition.employerExtraAnnual / 12, decomposition.totalExtraMonthly);
  console.log('Cash-budget solver: £200 → £474.13 without extra match; £1,422.39 only with explicit 2:1 matching. Employer % basis, fixed amounts, RAS timing and allowance limits verified.');
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
  const oneToOne = solveCashBudget({ ...cashExample, employerPercent: 5, matchRate: 1, matchCapPercent: 8 }, 200);
  close(oneToOne.decision.totalExtraMonthly, 749.13);
  const scenarios = [
    ['No extra match', cash200.decision.totalExtraMonthly, 0],
    ['£1 for £1, up to 8%', oneToOne.decision.totalExtraMonthly, oneToOne.decision.employerExtraAnnual / 12],
    ['£2 for £1, up to 12%', generous.decision.totalExtraMonthly, generous.decision.employerExtraAnnual / 12],
  ];
  const matchChart = shell('What a £200 monthly cash budget could put into a pension', 'Illustrative £110,000 salary, 5% current employee contribution, salary sacrifice. No extra match: £474 a month extra pension; 1:1 match to 8%: £749; 2:1 match: £1,422. The matching examples require different, explicitly assumed employer schemes.', `${head('CASH BUDGET → PENSION CONTRIBUTIONS', 'Same £200 cash budget. Different schemes.')}
  ${scenarios.map(([label, total, employer], i) => {
    const top = 118 + i * 83;
    const employeeWidth = (total - employer) / 1500 * 570;
    const employerWidth = employer / 1500 * 570;
    return `<text x="40" y="${top}" font-size="16">${label}</text><rect x="40" y="${top+12}" width="${employeeWidth}" height="26" rx="3" fill="#a34832"/><rect x="${40+employeeWidth}" y="${top+12}" width="${employerWidth}" height="26" fill="#4d704d"/><text x="${Math.min(730, 50+employeeWidth+employerWidth)}" y="${top+32}" font-size="17" font-weight="600">${gbp(total)}</text>`;
  }).join('')}
  <text x="40" y="380" fill="#a34832" font-size="14">■ Extra employee pension, including tax/NI savings</text>
  <text x="40" y="404" fill="#4d704d" font-size="14">■ Additional employer matching</text>
  <text x="40" y="434" font-size="12" fill="#57534e">£110k salary · 5% current employee pension · 2026/27 · salary sacrifice.</text>
  <text x="40" y="452" font-size="12" fill="#57534e">Current employer: 3% / 5% / 10% respectively. Match caps: 8% for 1:1; 12% for 2:1.</text>
  <text x="40" y="470" font-size="12" fill="#57534e">Hypothetical schemes, not standard entitlements. Rounded extra contributions per month.</text>`);
  fs.writeFileSync('public/images/pension/cash-budget-matching.svg', matchChart);
  fs.writeFileSync('public/images/pension/example.json', JSON.stringify(result, null, 2)+'\n');
  console.log('Pension illustration generated:', result);
} finally { fs.rmSync(scratch, {recursive:true, force:true}); }
