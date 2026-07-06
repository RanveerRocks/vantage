import type { Factor } from '../../lib/schemas'

interface FactorSliderProps {
  factor: Factor
  value: number // 0–5
  onChange: (value: number) => void
}

export function FactorSlider({ factor, value, onChange }: FactorSliderProps) {
  const off = value === 0
  return (
    <div className="group relative">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={`weight-${factor.id}`}
          className={`text-sm ${off ? 'text-slate' : 'text-ink'}`}
        >
          {factor.name}
        </label>
        <span
          className={`font-mono text-sm tabular-nums ${off ? 'text-slate' : 'font-medium text-ink'}`}
        >
          {off ? '0 · off' : value}
        </span>
      </div>
      <input
        id={`weight-${factor.id}`}
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-describedby={`weight-desc-${factor.id}`}
        className={`mt-1 w-full accent-ultramarine ${off ? 'opacity-50' : ''}`}
      />
      <p
        id={`weight-desc-${factor.id}`}
        className="pointer-events-none absolute left-0 top-full z-10 hidden w-full rounded-chip border border-hairline bg-white p-2 text-xs leading-relaxed text-slate group-focus-within:block group-hover:block"
      >
        {factor.description}
      </p>
    </div>
  )
}
