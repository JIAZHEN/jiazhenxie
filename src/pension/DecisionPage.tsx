import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { SchemeSwitch } from './SchemeSwitch'

export function PaydayToPension() {
  return <main className="pension-tool mt-16 bg-[color:var(--pension-canvas)] p-4 text-[color:var(--pension-ink)] sm:mt-20 sm:p-6">
    <SEO title="UK Pension Contribution Calculator" description="See how salary sacrifice changes your monthly take-home pay and pension contributions." canonicalUrl="https://jiazhenxie.com/payday-to-pension" />
    <header className="mx-auto max-w-6xl py-5">
      <p className="pension-eyebrow">PAYDAY TO PENSION · 2026/27</p>
      <h1 className="font-serif text-3xl leading-tight text-[color:var(--pension-accent)] sm:text-4xl">More pension. How much less take-home pay?</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--pension-muted)]">Enter your current contributions. Choose how much salary to sacrifice. See the monthly difference.</p>
    </header>
    <SchemeSwitch />
    <footer className="mx-auto mt-8 max-w-6xl space-y-3 text-xs leading-relaxed text-[color:var(--pension-muted)]">
      <p>2026/27 estimate for England, Wales & Northern Ireland. Annual amounts divided by 12; actual payroll and tax codes can differ. Assumes your current pension uses net pay, before Income Tax. Excludes bonuses, other income, benefits, student loans and reduced pension allowances.</p>
      <p>Pension money is generally locked until pension access age; withdrawals may be taxed. This calculator is not financial advice. Confirm your scheme’s rules with payroll.</p>
      <Link to="/blog/why-i-built-payday-to-pension" className="inline-block underline">Why I built this →</Link>
    </footer>
  </main>
}
