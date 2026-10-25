import { incomeTaxAnnual as incomeTax, employeeNiAnnual as employeeNI, employerNiAnnual } from './tax'
import { childBenefitCharge as hicbc } from './pensionInsights'
import { pensionablePay } from './contributions'
import { FULL_NEW_STATE_PENSION_WEEKLY, BENEFIT_WEEKS } from '../uk-constants'

export interface PayInputs { salary: number; ownPct: number; employerPct: number; children: number; basis: 'full' | 'qualifying'; employerNiShare?: number }
export interface Inputs extends PayInputs { age: number; spend: number; budget: number; pension: number; isa: number; isaMonthly: number; r: number; access: number; spAge: number; liveTo: number; includeSP: boolean; infl: number; childcareChildren?: number }
export interface Projection { age: number; spend: number; pension: number; isa: number; r: number; access: number; spAge: number; liveTo: number; sp: number; pensionYearly: number; isaYearly: number; infl?: number; pensionByYear?: number[] }
export const exampleInputs: Inputs = { age: 38, salary: 120000, spend: 40000, budget: 400, pension: 150000, isa: 30000, isaMonthly: 300, children: 2, childcareChildren: 0, employerNiShare: 0, ownPct: 5, employerPct: 5, basis: 'full', r: .04, access: 57, spAge: 67, liveTo: 95, includeSP: true, infl: .025 }
// Only named fictional examples are accepted from a URL.
export const blogExampleInputs: Inputs = { ...exampleInputs, age: 35, salary: 80000, spend: 24000, budget: 275, pension: 100000, isa: 20000, isaMonthly: 200, children: 0, employerPct: 3 }
export const inputsForExample = (example: string | null): Inputs => ({ ...(example === '80k' ? blogExampleInputs : exampleInputs) })
export const futureValue = (value: number, inflation: number, years: number) => value * (1 + inflation) ** years
// Tax thresholds stay constant in real terms, equivalent to rising with prices.
// TODO: model frozen nominal thresholds until 2031 by passing year-adjusted tax bands into withdrawals.
export const LUMP_SUM_ALLOWANCE = 268275
// The page starts in tax year 2026/27. Caps remain fixed nominal cash amounts.
export function payPicture(p: PayInputs, extra: number, year = 2026, inflationFactor = 1) {
  const own = pensionablePay(p.salary, p.basis) * p.ownPct / 100;
  const pay = p.salary - extra;
  const ani = pay - own;
  const tax = incomeTax(ani);
  const niFree = year >= 2029 ? Math.min(extra, 2000 / inflationFactor) : extra;
  const niPay = p.salary - niFree;
  const ni = employeeNI(niPay);
  const charge = hicbc(ani, p.children);
  const takeHome = pay - own - tax - ni - charge;
  const employerTopUp = (employerNiAnnual(p.salary) - employerNiAnnual(niPay)) * (p.employerNiShare ?? 0);
  const pensionIn = own + extra + employerTopUp + pensionablePay(p.salary, p.basis) * p.employerPct / 100;
  return { pay, ani, tax, ni, charge, takeHome, pensionIn, own, employerTopUp };
}
export function sacrificeForCost(p: PayInputs, cost: number, year = 2026, inflationFactor = 1) {
  if (cost <= 0) return 0;
  const base = payPicture(p, 0, year, inflationFactor).takeHome;
  let lo = 0, hi = Math.max(0, p.salary - pensionablePay(p.salary, p.basis) * p.ownPct / 100);
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (base - payPicture(p, mid, year, inflationFactor).takeHome < cost) lo = mid; else hi = mid;
  }
  return lo;
}
export function grossWithdrawal(need: number, sp: number, taxFreeRemaining = Infinity) {
  const net = (w: number) => w + sp - incomeTax(w - Math.min(w * .25, taxFreeRemaining) + sp);
  if (net(0) >= need) return 0;
  let lo = 0, hi = need * 3 + 100000;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (net(m) < need) lo = m; else hi = m; }
  return hi;
}
export function simulate(s: Projection, stop: number) {
  let pen = s.pension, isa = s.isa;
  let taxFreeCashTaken = 0;
  const path = [];
  for (let a = s.age; a < stop; a++) {
    path.push({ a, pen, isa, taxFreeCashTaken });
    pen = pen * (1 + s.r) + (s.pensionByYear?.[a - s.age] ?? s.pensionYearly);
    isa = isa * (1 + s.r) + s.isaYearly;
  }
  const atStop = { pen, isa };
  let ok = true, why: 'bridge' | 'total' | null = null, failAge: number | null = null;
  for (let a = stop; a < s.liveTo; a++) {
    path.push({ a, pen: Math.max(0, pen), isa: Math.max(0, isa), taxFreeCashTaken });
    const sp = a >= s.spAge ? s.sp : 0;
    const factor = (1 + (s.infl ?? 0)) ** (a - s.age);
    const remaining = Math.max(0, LUMP_SUM_ALLOWANCE - taxFreeCashTaken) / factor;
    if (a < s.access) {
      isa -= s.spend;
      if (isa < -0.5 && ok) { ok = false; why = 'bridge'; failAge = a; }
    } else {
      const w = grossWithdrawal(s.spend, sp, remaining);
      const actual = Math.min(w, Math.max(0, pen));
      const taxFree = Math.min(actual * .25, remaining);
      taxFreeCashTaken = Math.min(LUMP_SUM_ALLOWANCE, taxFreeCashTaken + taxFree * factor);
      if (w <= pen) pen -= w;
      else {
        const left = Math.max(0, pen);
        const netFromPen = left + sp - incomeTax(left - taxFree + sp);
        pen = 0;
        isa -= Math.max(0, s.spend - netFromPen);
        if (isa < -0.5 && ok) { ok = false; why = 'total'; failAge = a; }
      }
    }
    if (!ok) break;
    pen *= (1 + s.r); isa *= (1 + s.r);
  }
  return { ok, why, failAge, atStop, path, taxFreeCashTaken, end: { a: failAge ?? s.liveTo, pen: Math.max(0, pen), isa: Math.max(0, isa) } };
}
export function freedomAge(s: Projection) {
  for (let stop = s.age; stop <= 75; stop++) {
    const w = simulate(s, stop);
    if (w.ok) return { age: stop, sim: w };
  }
  return { age: null, sim: simulate(s, 75) };
}
export function compare(u: Inputs) {
  const p = { salary: u.salary, ownPct: u.ownPct, employerPct: u.employerPct, children: u.children, basis: u.basis, employerNiShare: u.employerNiShare };
  const base = payPicture(p, 0);
  const yearlyBudget = u.budget * 12;
  const common = { infl: u.infl, age: u.age, spend: u.spend, pension: u.pension, isa: u.isa, r: u.r, access: u.access, spAge: u.spAge, liveTo: u.liveTo, sp: u.includeSP ? FULL_NEW_STATE_PENSION_WEEKLY * BENEFIT_WEEKS : 0 };
  const scenario = (isaShare: number) => {
    const isaYearly = yearlyBudget * isaShare;
    const extra = sacrificeForCost(p, yearlyBudget - isaYearly);
    const pic = payPicture(p, extra);
    const pensionByYear = Array.from({ length: 75 - u.age }, (_, i) => {
      const factor = (1 + u.infl) ** i;
      const year = 2026 + i;
      return payPicture(p, sacrificeForCost(p, yearlyBudget - isaYearly, year, factor), year, factor).pensionIn;
    });
    const s = { ...common, pensionByYear, pensionYearly: pic.pensionIn, isaYearly: u.isaMonthly * 12 + isaYearly };
    const f = freedomAge(s);
    return { isaShare, isaMonthly: isaYearly / 12, pensionCostMonthly: (yearlyBudget - isaYearly) / 12, extra, pensionMonthlyExtra: (pic.pensionIn - base.pensionIn) / 12, pic, f, s };
  };
  const nothingS = { ...common, pensionYearly: base.pensionIn, isaYearly: u.isaMonthly * 12 };
  const nothing = { f: freedomAge(nothingS), s: nothingS, pic: base, isaMonthly: 0, pensionMonthlyExtra: 0 };
  const allPension = scenario(0);
  const allIsa = scenario(1);
  let best = allPension;
  for (let i = 1; i <= 20; i++) {
    const sc = scenario(i / 20);
    if ((sc.f.age ?? 999) < (best.f.age ?? 999)) best = sc;
  }
  const rate = yearlyBudget > 0 ? (allPension.pic.pensionIn - base.pensionIn) / yearlyBudget : 0;
  return { base, nothing, allPension, allIsa, best, rate, yearlyBudget, scenario };
}
// What you live on in each phase after stopping (yearly, today's money)
export function phases(s: Projection, stop: number) {
  const out = [];
  const sim = simulate(s, stop);
  const remainingAt = (age: number) => Math.max(0, LUMP_SUM_ALLOWANCE - (sim.path.find(x => x.a === age)?.taxFreeCashTaken ?? 0)) / (1 + (s.infl ?? 0)) ** (age - s.age);
  if (stop < s.access) out.push({ from: stop, to: s.access, isa: s.spend, penGross: 0, sp: 0, tax: 0, net: s.spend });
  const p1 = Math.max(stop, s.access);
  if (p1 < s.spAge) {
    const w = grossWithdrawal(s.spend, 0, remainingAt(p1));
    out.push({ from: p1, to: s.spAge, isa: 0, penGross: w, sp: 0, tax: incomeTax(w - Math.min(w * .25, remainingAt(p1))), net: s.spend });
  }
  const p2 = Math.max(stop, s.spAge);
  const w2 = grossWithdrawal(s.spend, s.sp, remainingAt(p2));
  out.push({ from: p2, to: s.liveTo, isa: 0, penGross: w2, sp: s.sp, tax: incomeTax(w2 - Math.min(w2 * .25, remainingAt(p2)) + s.sp), net: s.spend });
  // When does the pension run dry (ISA tops up after)?
  const dry = sim.path.find(x => x.a > p1 && x.pen <= 1);
  return { list: out.map(p => ({ ...p, balance: sim.path.find(x => x.a === p.from) })), end: sim.end, pensionDryAge: dry ? dry.a : null, atStop: sim.atStop };
}
