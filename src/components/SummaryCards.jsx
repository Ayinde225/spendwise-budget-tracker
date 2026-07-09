import {
  totalIncome,
  totalExpenses,
  balance,
  savingsRate,
  formatCurrency,
} from '../lib/finance.js'

function Card({ label, icon, value, tone }) {
  return (
    <div className="card summary-card">
      <div className="label">
        <span className="chip">{icon}</span>
        {label}
      </div>
      <div className={`value ${tone || ''}`}>{value}</div>
    </div>
  )
}

// The four headline metrics for the selected month.
export default function SummaryCards({ transactions }) {
  const income = totalIncome(transactions)
  const expenses = totalExpenses(transactions)
  const bal = balance(transactions)
  const rate = savingsRate(transactions)

  return (
    <div className="grid summary-grid">
      <Card label="Income" icon="💵" tone="income" value={formatCurrency(income)} />
      <Card label="Expenses" icon="🧾" tone="expense" value={formatCurrency(expenses)} />
      <Card
        label="Balance"
        icon="⚖️"
        tone={bal < 0 ? 'expense' : ''}
        value={formatCurrency(bal)}
      />
      <Card label="Savings rate" icon="📈" value={`${rate.toFixed(1)}%`} />
    </div>
  )
}
