import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatGbp } from '../calc/format'
import { pensionIllustration } from './illustration'

export function PensionIntro() {
  const [extra, setExtra] = useState(500)
  const example = useMemo(() => pensionIllustration(extra), [extra])
  return (
    <section className="pension-intro pension-intro-compact" aria-labelledby="pension-intro-title">
      <p className="pension-eyebrow">PAYDAY TO PENSION</p>
      <h1 id="pension-intro-title">A little less now.<br /><em>How much more later?</em></h1>
      <p className="pension-intro-copy">See what a change to this month’s payslip could mean for your future pension.</p>
      <div className="pension-quick-example">
        <p className="pension-eyebrow">AN EXAMPLE, NOT YOUR FORECAST</p>
        <p className="pension-intro-small mb-3">£80k salary · age 35 → 67 · salary sacrifice</p>
        <label className="pension-extra-label" htmlFor="extra-pension">Extra going into the pension <strong>{formatGbp(extra)} / month</strong></label>
        <input id="extra-pension" className="pension-salary-slider" type="range" min="100" max="1000" step="50" value={extra} aria-valuetext={`${formatGbp(extra)} more into the pension per month`} onChange={event => setExtra(Number(event.target.value))} />
        <dl className="pension-tradeoff" aria-live="polite" aria-atomic="true">
          <div><dt>Less take-home / month</dt><dd>−{formatGbp(example.cashCostMonthly)}</dd><small>on this month’s payslip</small></div>
          <div><dt>Extra pension pot at 67</dt><dd>+{formatGbp(example.extraPot)}</dd><small>total, in today’s money</small></div>
        </dl>
        <p className="pension-income-note">That pot could provide around <strong>{formatGbp(example.extraIncomeMonthly)} extra a month</strong> in retirement under this model.</p>
        <details className="pension-example-details"><summary>What’s behind these numbers?</summary><p>Age 35 to 67. £80,000 salary. Salary sacrifice; whole-salary contributions rising from 5%, with employer contributions held at 3%. 3% annual real growth, no fees or pay rises; 4% withdrawal rate with simplified retirement tax. The take-home cost shown is today’s; NI savings change from April 2029 in this model. Growth and income are estimates, not guaranteed. Real results depend on your scheme and tax position.</p></details>
      </div>
      <div className="pension-intro-actions">
        <a href="#your-numbers" className="pension-primary-link">Calculate with my numbers <span aria-hidden="true">↓</span></a>
        <Link to="/blog/why-i-built-payday-to-pension" className="pension-text-link">See the explanation & charts →</Link>
      </div>
      <p className="pension-intro-small">No signup. Inputs stay in your browser. Estimates, not financial advice.</p>
    </section>
  )
}
