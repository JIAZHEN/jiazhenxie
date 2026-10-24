import { useEffect, useRef } from 'react'
import SEO from '../components/SEO'
import markup from './payday.html?raw'
import { mountPayday } from './payday-view'
import './payday.css'

// Trusted, checked-in markup from the supplied prototype. No user HTML is inserted.
export function PaydayToPension() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (root.current) {
      root.current.innerHTML = markup
      return mountPayday(root.current)
    }
  }, [])
  return <div>
    <SEO title="What could a little less take-home pay buy you?" description="See when you could stop working by giving up a little take-home pay, and compare pension, ISA or both. Live UK 2026/27 illustration. Inputs stay in the page." canonicalUrl="https://jiazhenxie.com/payday-to-pension" />
    <div ref={root} className="pension-tool payday-live" dangerouslySetInnerHTML={{ __html: markup }} />
  </div>
}
