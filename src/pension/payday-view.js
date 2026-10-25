import { compare, phases, futureValue, payPicture, inputsForExample, sacrificeForCost } from '../calc/payday'

export function mountPayday(root) {
const $ = id => root.querySelector('#' + id);
const num = id => { return Number(String($(id).value).replace(/,/g, '').trim()); };
const gbp = v => '£' + Math.round(v).toLocaleString('en-GB');
const gbpK = v => v >= 1000 ? '£' + Math.round(v / 1000).toLocaleString('en-GB') + 'k' : gbp(v);
let r = 0.04, userSel = null;
const YEAR = 2026;

function inputs(rate){
  return { age: Math.round(num('age')), salary: num('salary'), spend: num('spend'), budget: num('budget'),
    pension: num('pension'), isa: num('isa'), isaMonthly: num('isaMonthly'), children: Math.round(num('children')), childcareChildren: Math.round(num('childcareChildren')), employerNiShare: num('employerNiShare'),
    ownPct: num('ownPct'), employerPct: num('employerPct'), access: Math.round(num('access')) || 57,
    spAge: Math.round(num('spAge')) || 67, liveTo: 95, includeSP: true, r: rate, infl: num('infl') / 100, basis: $('basis').value };
}
const ageTxt = a => a == null ? '75+' : String(a);

function render(){
  const u = inputs(r);
  $('miniVal').textContent = gbp(u.budget);
  const affordable = (u.budget + u.isaMonthly) * 12 <= payPicture(u, 0).takeHome;
  $('budgetOut').innerHTML = gbp(u.budget) + '<small> / month</small>';
  $('scenHelp').textContent = 'Investments grow ' + (((1 + r) * (1 + u.infl) - 1) * 100).toFixed(1) + '% a year, prices rise ' + (u.infl * 100).toFixed(1) + '%.';
  if (u.age < 18 || u.age > 74 || u.salary < 13000 || u.spend <= 0 || u.ownPct > 100 || u.employerPct > 100 || u.access < 55 || u.access > 75 || u.spAge < u.access || u.spAge > 80 || u.infl > .2 || !affordable || Object.values(u).some(v => typeof v === 'number' && (!Number.isFinite(v) || v < 0))) { root.querySelectorAll('.sec,.maths').forEach(el => el.hidden = true); $('childcareHero').hidden = true; $('childcareHero').textContent = ''; $('miniAge').textContent = '?'; $('heroMeta').textContent = ''; $('heroDays').textContent = ''; $('heroAge').textContent = ''; $('heroCtx').textContent = 'Check your inputs: age 18 to 74, salary at least £13,000, positive spending, pension percentages up to 100%, access age 55 to 75, State Pension age at least access age and no later than 80, price rises up to 20%, and total monthly saving within take-home pay.'; return; }

  root.querySelectorAll('.sec,.maths').forEach(el => el.hidden = false);
  const c = compare(u), lo = compare(inputs(0.02)), hi = compare(inputs(0.06));
  const nA = c.nothing.f.age, bA = c.best.f.age;
  const interior = c.best.isaShare > 0 && c.best.isaShare < 1;
  const improves = u.budget > 0 && bA != null && (nA == null || bA < nA);
  const bestKey = !improves ? 'nothing' : interior ? 'mix' : c.best.isaShare === 1 ? 'isa' : 'pension';

  const opts = [
    { key: 'nothing', t: 'Keep things as they are', how: 'Your current pension and ISA saving only', sc: c.nothing, lo: lo.nothing, hi: hi.nothing },
    { key: 'pension', t: 'All into your pension', how: '+' + gbp(c.allPension.pensionMonthlyExtra) + ' a month into your pension', sc: c.allPension, lo: lo.allPension, hi: hi.allPension },
  ];
  if (interior) opts.push({ key: 'mix', t: 'Split it', how: gbp(c.best.pensionCostMonthly) + ' towards pension (+' + gbp(c.best.pensionMonthlyExtra) + ' in it), ' + gbp(c.best.isaMonthly) + ' into an ISA',
    sc: c.best, lo: lo.scenario(c.best.isaShare), hi: hi.scenario(c.best.isaShare) });
  opts.push({ key: 'isa', t: 'All into an ISA', how: '+' + gbp(u.budget) + ' a month into an ISA', sc: c.allIsa, lo: lo.allIsa, hi: hi.allIsa });
  const shown = u.budget > 0 ? opts : opts.slice(0, 1);
  if (!shown.find(o => o.key === userSel)) userSel = null;
  const selKey = userSel || bestKey;
  const sel = shown.find(o => o.key === selKey) || shown[0];

  // HERO
  const scen = r === 0.02 ? 'Cautious' : r === 0.06 ? 'Hopeful' : 'Middle';
  if (!improves) {
    $('heroAge').textContent = ageTxt(nA);
    $('heroCtx').innerHTML = nA == null ? 'Not reachable by 75 on this plan. Try spending less, or giving up more.'
      : u.budget > 0 ? 'is when you could stop already. Giving up ' + gbp(u.budget) + ' a month would not make it earlier.'
      : 'is when you could stop on your current plan. Move the slider to see what could change.';
    $('heroMeta').textContent = scen + ' example';
    $('heroDays').innerHTML = '';
  } else {
    $('heroAge').textContent = bA;
    $('heroCtx').innerHTML = 'is when you could stop working, instead of <s>' + ageTxt(nA) + '</s>, by giving up ' + gbp(u.budget) + ' a month.';
    const how = interior ? gbp(c.best.pensionCostMonthly) + ' to pension, ' + gbp(c.best.isaMonthly) + ' to an ISA' : c.best.isaShare === 1 ? 'all into an ISA' : 'all into your pension';
    $('heroMeta').textContent = scen + ' example · best use of the money: ' + how;
    const yrs = nA == null ? 0 : nA - bA, months = (bA - u.age) * 12;
    const d = months > 0 ? Math.round(yrs * 365 / months) : 0;
    $('heroDays').innerHTML = d > 0 ? 'Each month you do this buys you about <b>' + d + ' day' + (d === 1 ? '' : 's') + '</b> of not working.' : '';
  }

  $('miniVal').textContent = gbp(u.budget);
  $('miniAge').textContent = ageTxt(sel.sc.f.age);

  // OPTIONS with built-in timeline
  const END = Math.max(u.spAge, u.access) + 3, span = END - u.age, x = a => Math.max(0, Math.min(100, (a - u.age) / span * 100));
  const bar = a => {
    if (a == null) return '<div style="left:0;width:100%;background:repeating-linear-gradient(45deg,var(--card2),var(--card2) 5px,var(--line) 5px,var(--line) 10px)"></div>';
    let s = '<div style="left:0;width:' + x(a) + '%;background:var(--work)"></div>';
    if (a < u.access) s += '<div style="left:' + x(a) + '%;width:' + (x(u.access) - x(a)) + '%;background:var(--isa)"></div>';
    const ps = Math.max(a, u.access);
    s += '<div style="left:' + x(ps) + '%;right:0;background:var(--pen)"></div>';
    return s;
  };
  const ticks = [u.age, u.access, u.spAge].filter((t,i,arr) => t >= u.age && t <= END && arr.indexOf(t) === i).sort((a,b) => a-b).filter((t,i,arr) => i === 0 || x(t)-x(arr[i-1]) >= 8);
  const axis = '<div class="axis">' + ticks.map(t => '<span style="left:' + x(t) + '%">' + t + '</span>').join('') + '</div>';
  $('opts').innerHTML = shown.map((o, i) =>
    '<button class="opt' + (o.key === 'nothing' ? ' base' : '') + (o.key === sel.key ? ' sel' : '') + '" aria-pressed="' + (o.key === sel.key) + '" data-k="' + o.key + '">' +
    '<div class="t">' + o.t + (o.key === bestKey ? ' <span class="badge">Earliest</span>' : '') + '</div>' +
    '<div class="how">' + o.how + '</div>' +
    '<div class="big">' + ageTxt(o.sc.f.age) + '<small>range ' + ageTxt(o.hi.f.age) + ' to ' + ageTxt(o.lo.f.age) + '</small></div>' +
    '<div class="bar">' + bar(o.sc.f.age) + '</div>' + (i === shown.length - 1 ? axis : '') +
    '</button>').join('');
  $('opts').querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => { userSel = b.dataset.k; render(); }));
  $('optsTitle').textContent = u.budget > 0 ? 'Where should the ' + gbp(u.budget) + ' go?' : 'Your current plan';

  // WHY
  const pA = c.allPension.f.age, iA = c.allIsa.f.age;
  let why = '';
  if (improves) {
    if (pA === nA && iA != null && (pA == null || iA < pA)) why = 'More pension buys you no time here. What holds you back is the ' + (u.access - iA) + ' years before your pension unlocks at ' + u.access + ', and only an ISA can pay for those.';
    else if (interior) why = 'Your pension gives you more for your money: each £1 you give up becomes £' + c.rate.toFixed(2) + ' in it. But it stays locked until ' + u.access + '. ' + gbp(c.best.isaMonthly) + ' a month in an ISA pays for the ' + (u.access - bA) + ' years in between.';
    else if (bestKey === 'pension') why = 'Here your pension wins. Each £1 you give up becomes £' + c.rate.toFixed(2) + ' in it, and your savings already cover the years before ' + u.access + '.';
    else why = 'Here the ISA wins. Stopping at ' + bA + ' leaves ' + (u.access - bA) + ' years before your pension unlocks, and only money you can reach can pay for them.';
  }
  $('why').style.display = why ? '' : 'none';
  $('why').textContent = why;
  if (why && u.budget > 0) {
    const extra2029 = sacrificeForCost(u, u.budget * 12, 2029, (1 + u.infl) ** 3);
    const rate2029 = (payPicture(u, extra2029, 2029, (1 + u.infl) ** 3).pensionIn - payPicture(u, 0).pensionIn) / (u.budget * 12);
    const note = document.createElement('small');
    note.className = 'ni-note';
    note.textContent = 'From April 2029, less of this is NI-free, so each £1 becomes about £' + rate2029.toFixed(2) + '.';
    $('why').appendChild(note);
  }

  // FLAGS
  const b0 = c.base, b1 = c.allPension.pic, flags = [];
  if (u.budget > 0) {
    if (b1.ani > 100000 && b1.ani < 125140) flags.push('<b>60% tax zone.</b> Each extra £1 into your pension here costs about 38p of take-home pay in 2026/27. From April 2029, amounts above the £2,000 yearly NI-free cap cost about 40p.');
    if (b0.charge - b1.charge > 1) flags.push('<b>Child Benefit.</b> All into pension also lets you keep ' + gbp(b0.charge - b1.charge) + ' a year you would otherwise pay back. Included above.');
  }
  const chosen = sel.sc.pic;
  let childcare = '';
  $('childcareHero').hidden = true;
  $('childcareHero').textContent = '';
  if (u.childcareChildren > 0) {
    if (chosen.ani > 100000 && chosen.ani <= 125140) {
      const chosenExtra = sel.sc.extra ?? 0;
      const gap = chosen.ani - 100000;
      const cost = (chosen.takeHome - payPicture(u, chosenExtra + gap).takeHome) / 12;
      childcare = '<b>Childcare support</b><p>Put another <strong>' + gbp(cost) + ' a month</strong> of take-home pay into your pension and you could get back up to <strong>' + gbp(2000 * u.childcareChildren) + ' a year</strong> in Tax-Free Childcare.</p><small>On your selected plan, your income is ' + gbp(gap) + ' above £100,000.</small>';
    } else if (chosen.ani <= 100000) childcare = '<b>Childcare support</b><p>Your income is under £100,000, so you keep childcare support, subject to the other eligibility rules.</p>';
    if (childcare) {
      $('childcareHero').innerHTML = childcare + '<small>Free childcare hours in England could be worth more, depending on your child’s age and nursery. Both parents must meet the eligibility rules. <a href="/blog/why-i-built-payday-to-pension#childcare-support">How this works →</a></small>';
      $('childcareHero').hidden = false;
    }
  }
  $('flags').innerHTML = flags.map(f => '<div class="flag">' + f + '</div>').join('');

  // LIFE AFTER (selected option)
  const a = sel.sc.f.age;
  if (a == null) { $('lifeSec').style.display = 'none'; }
  else {
    $('lifeSec').style.display = '';
    const fut = (v, at) => futureValue(v, u.infl, at - u.age);
    const yr = at => YEAR + (at - u.age);
    const ph = phases(sel.sc.s, a);
    $('lifeTitle').textContent = 'Life after ' + a + (shown.length > 1 ? ' · ' + sel.t : '');
    const col = p => p.isa ? 'var(--isa)' : 'var(--pen)';
    const src = p => p.isa ? 'Paid from your ISA and savings. No tax.'
      : p.sp ? 'State Pension, plus a smaller amount from your pension.'
      : 'Paid from your pension. Up to a quarter is tax-free until your lifetime cash cap is used.';
    $('life').innerHTML = ph.list.map(p =>
      '<div class="stage"><div class="dot" style="background:' + col(p) + '"></div>' +
      '<div><div class="when">' + p.from + ' to ' + p.to + '</div><div class="src">' + src(p) + '</div><div class="src">At ' + p.from + ': pension ' + gbpK(p.balance?.pen ?? 0) + ', ISA ' + gbpK(p.balance?.isa ?? 0) + ' in today’s money</div></div>' +
      '<div class="amt">' + gbp(p.net / 12) + '<small>a month in today’s money</small><small>' + gbp(fut(p.net, p.from) / 12) + ' in ' + yr(p.from) + ' after price rises</small></div></div>').join('');
    $('pots').innerHTML = (ph.pensionDryAge ? 'Your pension runs out around ' + ph.pensionDryAge + ', then your ISA pays. ' : '') +
      'At ' + ph.end.a + ': pension ' + gbpK(ph.end.pen) + ', ISA ' + gbpK(ph.end.isa) + ' left in today’s money.';
  }

  // MATHS
  const m = v => gbp(v / 12), p = c.allPension;
  $('maths').innerHTML = u.budget > 0 ? '<table>' +
    '<tr><td>Extra salary sacrifice if it all goes to pension</td><td>' + m(p.extra) + ' / month</td></tr>' +
    (b1.employerTopUp > 0 ? '<tr><td>Employer NI saving added to your pension</td><td>' + m(b1.employerTopUp) + ' / month</td></tr>' : '') +
    '<tr><td>Income Tax you no longer pay</td><td>−' + m(b0.tax - b1.tax) + '</td></tr>' +
    '<tr><td>National Insurance you no longer pay</td><td>−' + m(b0.ni - b1.ni) + '</td></tr>' +
    (b0.charge - b1.charge > 1 ? '<tr><td>Child Benefit you keep</td><td>−' + m(b0.charge - b1.charge) + '</td></tr>' : '') +
    '<tr><td><b>Cost to your take-home pay</b></td><td><b>' + gbp(u.budget) + ' / month</b></td></tr>' +
    '<tr><td>Pension for each £1 of take-home</td><td>£' + c.rate.toFixed(2) + '</td></tr>' +
    '<tr><td>Income for tax thresholds, before → after</td><td>' + gbp(b0.ani) + ' → ' + gbp(b1.ani) + '</td></tr></table>'
    : '<p class="potline">Move the slider to see the tax maths.</p>';
}

['pension', 'pensionInline'].forEach(id => $(id).addEventListener('input', () => { $(id === 'pension' ? 'pensionInline' : 'pension').value = $(id).value; }));
$('budget').addEventListener('input', () => { $('budget2').value = $('budget').value; });
$('budget2').addEventListener('input', () => { $('budget').value = $('budget2').value; });
$('mini').inert = true;
const io = new IntersectionObserver(es => es.forEach(e => { const show = !e.isIntersecting && e.boundingClientRect.top < 0; $('mini').classList.toggle('show', show); $('mini').inert = !show; }));
io.observe($('panel'));
let t; const schedule = () => { clearTimeout(t); t = setTimeout(render, 70); };
root.querySelectorAll('input,select').forEach(el => el.addEventListener('input', schedule));
['salary','spend','pension','pensionInline','isa'].forEach(id => $(id).addEventListener('blur', () => { $(id).value = Math.round(num(id)).toLocaleString('en-GB'); }));
root.querySelectorAll('#scen button').forEach(b => b.addEventListener('click', () => {
  root.querySelectorAll('#scen button').forEach(x => x.classList.remove('on')); b.classList.add('on'); root.querySelectorAll('#scen button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); r = parseFloat(b.dataset.r); render();
}));
const preset = inputsForExample(new URLSearchParams(window.location.search).get('example'));
for (const id of ['age', 'salary', 'spend', 'budget', 'pension', 'isa', 'isaMonthly', 'children', 'ownPct', 'employerPct', 'access', 'spAge', 'basis']) $(id).value = preset[id];
$('infl').value = preset.infl * 100;
$('budget2').value = preset.budget;
$('pensionInline').value = preset.pension;
render();
return () => { clearTimeout(t); io.disconnect(); };
}

