import fs from 'node:fs';
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
