import { useEffect, useRef, useState } from 'react'
import type { WealthPoint } from '../calc/freedom'
import { formatGbp } from '../calc/format'

/** Use the measured width as the SVG coordinate width so 12px text stays 12px.
 * Marker labels share their line's x-coordinate and use separate rows on collision.
 */
export function WealthChart({ points, stopAge, accessAge, stateAge }: {
  points: WealthPoint[]; stopAge: number | null; accessAge: number; stateAge: number
}) {
  const container = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(640)
  useEffect(() => {
    const element = container.current
    if (!element) return
    const resize = () => setWidth(Math.max(1, element.getBoundingClientRect().width))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const start = points[0].age, end = points[points.length - 1].age
  const max = Math.max(1, ...points.map(p => p.pension + p.isa))
  const x = (age: number) => 12 + (age - start) / Math.max(1, end - start) * (width - 24)
  const y = (money: number) => 200 - money / max * 160
  const area = (total: boolean) => `M${x(start)},200 ` + points.map(p => `L${x(p.age)},${y(total ? p.pension + p.isa : p.isa)}`).join(' ') + ` L${x(end)},200 Z`
  const rows: number[] = []
  const markers = [{ age: stopAge, label: 'Stop' }, { age: accessAge, label: 'Pension' }, { age: stateAge, label: 'State' }]
    .filter((mark): mark is { age: number; label: string } => mark.age != null && mark.age >= start && mark.age <= end)
    .sort((a, b) => a.age - b.age)
    .map(mark => {
      const position = x(mark.age)
      const label = `${mark.label} ${mark.age}`
      const textWidth = label.length * 7.2
      const anchor = position < textWidth / 2 ? 'start' : position + textWidth / 2 > width ? 'end' : 'middle'
      const left = anchor === 'start' ? position : anchor === 'end' ? position - textWidth : position - textWidth / 2
      let row = rows.findIndex(right => right + 10 <= left)
      if (row === -1) row = rows.length
      rows[row] = left + textWidth
      return { ...mark, label, position, anchor, row }
    })
  const height = 228 + Math.max(0, rows.length - 1) * 20
  return <figure ref={container} className="mt-4">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Middle scenario: pension and ISA wealth over age in today's money" className="block w-full">
      <text x="12" y="18" fontSize="12" fill="var(--pension-ink)" data-chart-value>{formatGbp(max)} · today’s money</text>
      <path d={area(true)} fill="var(--pension-accent)" opacity=".7" />
      <path d={area(false)} fill="var(--pension-positive)" />
      {markers.map(mark => <g key={mark.label} data-chart-marker={mark.label}>
        <line x1={mark.position} x2={mark.position} y1="35" y2="200" stroke="var(--pension-ink)" strokeDasharray="4" />
        <text x={mark.position} y={220 + mark.row * 20} textAnchor={mark.anchor as 'start' | 'end' | 'middle'} fontSize="12" fill="var(--pension-ink)">{mark.label}</text>
      </g>)}
    </svg>
    {stopAge == null && <p className="text-xs">No stopping age up to 75 in this example.</p>}
    <figcaption className="mt-2 text-xs">Middle scenario · green: ISA / savings · other area: pension. Use “Show cautious and hopeful” for the other outcomes.</figcaption>
  </figure>
}
