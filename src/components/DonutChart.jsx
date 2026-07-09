import { spendingByCategory, formatCurrency } from '../lib/finance.js'
import { categoryColor } from '../lib/categories.js'

const SIZE = 180
const STROKE = 30
const RADIUS = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * RADIUS
const CENTER = SIZE / 2

// Hand-rolled donut chart of spending by category, drawn as SVG arcs using
// stroke-dasharray offsets. No charting library.
export default function DonutChart({ transactions }) {
  const data = spendingByCategory(transactions)
  const total = data.reduce((sum, d) => sum + d.total, 0)

  let offset = 0
  const segments = data.map((d, i) => {
    const fraction = total > 0 ? d.total / total : 0
    const length = fraction * CIRC
    const seg = {
      ...d,
      color: categoryColor(d.category, i),
      dash: length,
      gap: CIRC - length,
      // Negative offset makes arcs run clockwise from the top (after rotation).
      offset: -offset,
      percent: fraction * 100,
    }
    offset += length
    return seg
  })

  return (
    <div className="card">
      <h2>Spending by category</h2>
      {total === 0 ? (
        <div className="empty">No expenses recorded this month.</div>
      ) : (
        <>
          <div className="donut-wrap">
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label="Donut chart of spending by category"
            >
              {/* Track */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="var(--border)"
                strokeWidth={STROKE}
              />
              <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
                {segments.map((s) => (
                  <circle
                    key={s.category}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={STROKE}
                    strokeDasharray={`${s.dash} ${s.gap}`}
                    strokeDashoffset={s.offset}
                  >
                    <title>
                      {s.category}: {formatCurrency(s.total)} ({s.percent.toFixed(1)}%)
                    </title>
                  </circle>
                ))}
              </g>
            </svg>
            <div className="donut-center">
              <div className="dc-label">Total spent</div>
              <div className="dc-value">{formatCurrency(total)}</div>
            </div>
          </div>

          <div className="chart-legend">
            {segments.map((s) => (
              <div className="legend-item" key={s.category}>
                <span className="swatch" style={{ background: s.color }} />
                {s.category}
                <span className="legend-value">
                  {formatCurrency(s.total)} · {s.percent.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
