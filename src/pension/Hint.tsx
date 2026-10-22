import { useId, useState } from 'react'

export function Hint({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#a34832] text-xs font-semibold text-[#a34832] hover:bg-[#a34832] hover:text-[#faf8f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a34832]"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen(value => !value)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <span aria-hidden="true">?</span>
        <span className="sr-only">Explain</span>
      </button>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="absolute left-0 top-8 z-30 w-64 max-w-[min(18rem,calc(100vw-2.5rem))] rounded-xl bg-[#262626] px-3 py-2 text-left text-sm font-normal leading-snug text-[#faf8f5] shadow-lg"
        >
          {text}
        </span>
      ) : null}
    </span>
  )
}
