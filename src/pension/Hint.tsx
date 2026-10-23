import { useId, useRef, useState } from 'react'

export function Hint({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const anchor = useRef<HTMLSpanElement>(null)
  const [tooltipLeft, setTooltipLeft] = useState(0)
  const openHint = () => {
    const rect = anchor.current?.getBoundingClientRect()
    if (rect) {
      const width = Math.min(256, window.innerWidth - 40)
      setTooltipLeft(Math.max(20, Math.min(rect.left, window.innerWidth - width - 20)) - rect.left)
    }
    setOpen(true)
  }
  return (
    <span ref={anchor} className="relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--pension-accent)] text-xs font-semibold text-[color:var(--pension-accent)] hover:bg-[color:var(--pension-accent)] hover:text-[color:var(--pension-canvas)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--pension-accent)]"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => { if (open) setOpen(false); else openHint() }}
        onMouseEnter={openHint}
        onMouseLeave={() => setOpen(false)}
        onFocus={openHint}
        onBlur={() => setOpen(false)}
      >
        <span aria-hidden="true">?</span>
        <span className="sr-only">Explain</span>
      </button>
      {open ? (
        <span
          style={{ left: tooltipLeft }}
          role="tooltip"
          id={id}
          className="absolute left-0 top-8 z-30 w-64 max-w-[min(18rem,calc(100vw-2.5rem))] rounded-xl bg-[color:var(--pension-ink)] px-3 py-2 text-left text-sm font-normal leading-snug text-[color:var(--pension-canvas)] shadow-lg"
        >
          {text}
        </span>
      ) : null}
    </span>
  )
}
