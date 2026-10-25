import SEO from "../components/SEO";

export default function Advisory() {
  return (
    <div className="advisory mx-auto max-w-[960px] pt-16 sm:pt-20">
      <SEO title="Advisory · Jiazhen Xie" description="Part-time engineering leadership for seed and Series A teams without a technical leader." canonicalUrl="https://jiazhenxie.com/advisory" />

<section><div className="wrap">
  <p className="eyebrow">Advisory</p>
  <h1>Part-time engineering leadership for early-stage teams</h1>
  <p className="lead">For seed and Series A companies that don't have a technical leader yet. I help you hire your first engineers, set up how the team ships, and check the architecture before it gets expensive.</p>
  <a className="btn-primary" href="#contact">Book a 30-minute call</a><a className="btn-ghost" href="#packages">See packages</a>
</div></section>


<section><div className="wrap">
  <h2>Is this for you?</h2>
  <div className="advisory-grid g2">
    <div className="card card-editorial">
      <h3>A good fit</h3>
      <ul className="fit">
        <li>You have 0 to 10 engineers and no CTO or engineering lead</li>
        <li>You're about to hire your first engineers and don't know what good looks like</li>
        <li>Delivery is slipping and you can't tell why</li>
        <li>A founder or investor wants a second opinion on the tech</li>
      </ul>
    </div>
    <div className="card card-editorial">
      <h3>Not a good fit</h3>
      <ul className="unfit">
        <li>You need someone to write the code full time</li>
        <li>You need a full-time CTO starting next week</li>
        <li>You want a long report and no follow-up</li>
      </ul>
    </div>
  </div>
</div></section>


<section id="packages"><div className="wrap">
  <h2>Packages</h2>
  <div className="advisory-grid g3">
    <div className="card card-editorial featured">
      <span className="tag">Start here</span>
      <h3>Diagnostic</h3>
      <div className="price">from £3,000</div>
      <div className="unit">Fixed price · 2 weeks</div>
      <ul>
        <li>Review of code, delivery process and team</li>
        <li>Interviews with founders and engineers</li>
        <li>Written report with a 90-day plan</li>
        <li>One follow-up call a month later</li>
      </ul>
    </div>
    <div className="card card-editorial">
      <h3>Monthly advisory</h3>
      <div className="price">Price on the call</div>
      <div className="unit">Per month · 2 to 4 days · 3-month minimum</div>
      <ul>
        <li>Weekly check-in with the founders</li>
        <li>Monthly architecture review</li>
        <li>Coaching for your senior engineer or first lead</li>
        <li>Async help on Slack between sessions</li>
      </ul>
    </div>
    <div className="card card-editorial">
      <h3>Hiring support</h3>
      <div className="price">Price on the call</div>
      <div className="unit">Per role</div>
      <ul>
        <li>Job description and scorecard</li>
        <li>Interview process design</li>
        <li>I sit in on final rounds</li>
        <li>Offer and onboarding plan</li>
      </ul>
    </div>
  </div>
</div></section>


<section><div className="wrap">
  <h2>What I've done</h2>
  <div className="advisory-grid g3">
    <div className="card card-editorial case">
      <div className="num">0 → 1</div>
      <h3 style={{ marginTop: 12 }}>Built a team and a product from scratch</h3>
      <p>Built the engineering team for a new subscription SaaS business and led the build of the platform, which grew to multi-million pound ARR.</p>
    </div>
    <div className="card card-editorial case">
      <div className="num">3 months</div>
      <h3 style={{ marginTop: 12 }}>Turned around a late programme</h3>
      <p>Took over a delayed ten-person programme, changed how it ran, and delivered it in three months on budget.</p>
    </div>
    <div className="card card-editorial case">
      <div className="num">$10M</div>
      <h3 style={{ marginTop: 12 }}>Cut AI infrastructure cost</h3>
      <p>Lead the team at a global tech company that delivered around $10M a year in GPU savings across every production deployment.</p>
    </div>
  </div>
  
</div></section>


<section><div className="wrap">
  <h2>How it works</h2>
  <ol className="steps">
    <li><h3>Intro call</h3><p>30 minutes, free. You tell me where things are. I tell you honestly whether I can help.</p></li>
    <li><h3>Diagnostic</h3><p>Two weeks. You get a clear picture of the team and the tech, and a plan you can act on with or without me.</p></li>
    <li><h3>Decide</h3><p>If it makes sense, we move to monthly advisory. If not, you keep the plan.</p></li>
  </ol>
</div></section>


<section><div className="wrap">
  <h2>About me</h2>
  <div className="about">
    <img className="photo" src="/images/jiazhen-xie.jpeg" alt="Jiazhen Xie" width={160} height={160} loading="lazy" />
    <div>
      <p style={{ marginTop: 0 }}>I've worked in engineering for 14 years, the last five leading product, data, platform and AI teams in London. I've built teams from scratch, hired and coached engineers, and I'm still hands-on in Python, AWS and Kubernetes.</p>
      <p>I have an MSc in Software Engineering from the University of Oxford, and I write about engineering leadership and AI infrastructure on this site.</p>    </div>
  </div>
</div></section>


<section id="contact" className="cta"><div className="wrap">
  <h2>Let's talk</h2>
  <p className="lead">Send me two lines about your company and where you're stuck. I reply within two working days.</p>
  <a className="btn-primary" href="mailto:jiazhenxie515@gmail.com?subject=Advisory%20enquiry">Email me</a><a className="btn-ghost" href="https://www.linkedin.com/in/jiazhen-xie">LinkedIn</a>
  
</div></section>

    </div>
  );
}
