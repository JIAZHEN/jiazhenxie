import { useState, type ReactNode } from 'react'
import { Hint } from './Hint'

const fieldClass =
  'mt-1 w-full scroll-mb-28 rounded-xl border border-[color:var(--pension-border-strong)] bg-[color:var(--pension-input)] px-3 py-3 text-base text-[color:var(--pension-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--pension-accent)]'

function parseNumber(text: string): number | null {
  const trimmed = text.trim().replace(/,/g, '')
  if (trimmed === '' || trimmed === '-' || trimmed === '.') return null
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 100_000_000,
  step = 1,
  prefix,
  suffix,
  primary = false,
  optional = false,
}: {
  id: string
  label: string
  hint?: string
  value: number | null
  onChange: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  primary?: boolean
  optional?: boolean
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const text = draft ?? (value == null ? '' : String(value))

  return (
    <div>
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className={
            primary
              ? 'font-serif text-xl text-[color:var(--pension-accent)]'
              : 'text-sm font-medium'
          }
        >
          {label}
        </label>
        {hint ? <Hint text={hint} /> : null}
      </div>
      <div className="relative">
        {prefix ? (
          <span
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--pension-muted)] ${
              primary ? 'text-2xl' : ''
            }`}
            aria-hidden="true"
          >
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          className={`${fieldClass} ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''} ${
            primary ? 'mt-2 py-4 font-serif text-3xl' : ''
          }`}
          value={text}
          step={step}
          onFocus={() => setDraft(value == null ? '' : String(value))}
          onBlur={() => {
            if (optional && text.trim() === '') {
              onChange(null)
              setDraft(null)
              return
            }
            const parsed = parseNumber(text)
            if (parsed == null) {
              setDraft(null)
              return
            }
            const next = clamp(parsed, min, max)
            onChange(next)
            setDraft(null)
          }}
          onChange={event => {
            const nextText = event.target.value
            setDraft(nextText)
            if (nextText.trim() === '') {
              onChange(null)
              return
            }
            const parsed = parseNumber(nextText)
            if (parsed != null) onChange(clamp(parsed, min, max))
          }}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--pension-muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function Choice<T extends string>({
  name,
  label,
  hint,
  value,
  options,
  onChange,
}: {
  name: string
  label: string
  hint?: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="flex items-center gap-2 text-sm font-medium">
        {label}
        {hint ? <Hint text={hint} /> : null}
      </legend>
      <div
        className="mt-2 grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, minmax(0, 1fr))`,
        }}
      >
        {options.map(option => {
          const selected = option.value === value
          return (
            <label
              key={option.value}
              className={`flex min-h-[2.75rem] cursor-pointer items-center justify-center rounded-xl border px-2 py-2 text-center text-sm leading-snug ${
                selected
                  ? 'border-[color:var(--pension-accent)] bg-[color:var(--pension-accent)] text-[color:var(--pension-canvas)]'
                  : 'border-[color:var(--pension-border-strong)] bg-[color:var(--pension-input)] text-[color:var(--pension-ink)]'
              } focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[color:var(--pension-accent)]`}
            >
              <input
                className="sr-only"
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Section({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-3xl border border-[color:var(--pension-border)] bg-[color:var(--pension-surface)] p-4 sm:p-5">
      <h2 className="font-serif text-2xl text-[color:var(--pension-accent)]">{title}</h2>
      {intro ? (
        <p className="mt-1 text-sm leading-relaxed text-[color:var(--pension-muted)]">{intro}</p>
      ) : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}
