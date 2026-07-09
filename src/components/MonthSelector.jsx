import { formatMonthLabel, recentMonths } from '../lib/finance.js'

// Lets the user pick which month's data to view. `months` is a sorted list of
// available 'YYYY-MM' keys; we always include a window around the current one.
export default function MonthSelector({ value, onChange, available }) {
  // Build a superset of months: 12 around the selected value plus any with data.
  const window = recentMonths(value, 12)
  const set = new Set([...window, ...available, value])
  const options = [...set].sort() // ascending

  function shift(delta) {
    const idx = options.indexOf(value)
    const next = options[idx + delta]
    if (next) onChange(next)
  }

  const idx = options.indexOf(value)

  return (
    <div className="month-selector">
      <button
        type="button"
        onClick={() => shift(-1)}
        disabled={idx <= 0}
        aria-label="Previous month"
      >
        ‹
      </button>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Select month">
        {options.map((m) => (
          <option key={m} value={m}>
            {formatMonthLabel(m)}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => shift(1)}
        disabled={idx >= options.length - 1}
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  )
}
