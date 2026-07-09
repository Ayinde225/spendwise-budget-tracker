import {
  monthlyTotals,
  formatCurrency,
  formatMonthLabel,
} from '../lib/finance.js'

const WIDTH = 360
const HEIGHT = 220
const PAD = { top: 16, right: 12, bottom: 28, left: 44 }
const PLOT_W = WIDTH - PAD.left - PAD.right
const PLOT_H = HEIGHT - PAD.top - PAD.bottom

// Hand-rolled grouped bar chart of income vs expense for recent months.
// Everything is computed from the data and drawn as plain SVG rects. No library.
export default function BarChart({ transactions, referenceMonth, months = 6 }) {
  const data = monthlyTotals(transactions, referenceMonth, months)
  const max = Math.max(
    1,
    ...data.map((d) => Math.max(d.income, d.expenses))
  )

  // Round the axis maximum up to a "nice" number for readable gridlines.
  const niceMax = niceCeil(max)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * niceMax)

  const groupWidth = PLOT_W / data.length
  const barWidth = Math.min(18, groupWidth / 3)
  const gap = 4

  const y = (v) => PAD.top + PLOT_H - (v / niceMax) * PLOT_H

  return (
    <div className="card">
      <h2>Income vs expense</h2>
      <div className="table-scroll">
        <svg
          width="100%"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Bar chart of income versus expense per month"
          style={{ maxWidth: WIDTH, display: 'block', margin: '0 auto' }}
        >
          {/* Gridlines + y axis labels */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6}
                y={y(t) + 3}
                textAnchor="end"
                className="bar-axis-label"
              >
                {compact(t)}
              </text>
            </g>
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const gx = PAD.left + i * groupWidth + groupWidth / 2
            const incomeX = gx - barWidth - gap / 2
            const expenseX = gx + gap / 2
            return (
              <g key={d.month}>
                <rect
                  x={incomeX}
                  y={y(d.income)}
                  width={barWidth}
                  height={PAD.top + PLOT_H - y(d.income)}
                  rx="3"
                  fill="var(--income)"
                >
                  <title>
                    {formatMonthLabel(d.month)} income: {formatCurrency(d.income)}
                  </title>
                </rect>
                <rect
                  x={expenseX}
                  y={y(d.expenses)}
                  width={barWidth}
                  height={PAD.top + PLOT_H - y(d.expenses)}
                  rx="3"
                  fill="var(--expense)"
                >
                  <title>
                    {formatMonthLabel(d.month)} expenses: {formatCurrency(d.expenses)}
                  </title>
                </rect>
                <text
                  x={gx}
                  y={HEIGHT - 10}
                  textAnchor="middle"
                  className="bar-axis-label"
                >
                  {d.month.slice(5)}/{d.month.slice(2, 4)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="chart-legend" style={{ flexDirection: 'row', gap: 20 }}>
        <div className="legend-item">
          <span className="swatch" style={{ background: 'var(--income)' }} />
          Income
        </div>
        <div className="legend-item">
          <span className="swatch" style={{ background: 'var(--expense)' }} />
          Expense
        </div>
      </div>
    </div>
  )
}

// Round up to a readable axis maximum (1/2/5 x power of ten).
function niceCeil(value) {
  if (value <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(value)))
  const norm = value / pow
  let nice
  if (norm <= 1) nice = 1
  else if (norm <= 2) nice = 2
  else if (norm <= 5) nice = 5
  else nice = 10
  return nice * pow
}

// Compact number formatting for axis labels, e.g. 1500 -> "1.5k".
function compact(value) {
  if (value >= 1000) {
    const k = value / 1000
    return `${Number.isInteger(k) ? k : k.toFixed(1)}k`
  }
  return String(Math.round(value))
}
