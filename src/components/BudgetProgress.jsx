import { useState } from 'react'
import {
  budgetUsedPercent,
  isOverBudget,
  formatCurrency,
} from '../lib/finance.js'

// Shows monthly budget vs actual spend with a progress bar that turns red when
// the user is over budget. Also lets the user edit the budget amount.
export default function BudgetProgress({ spent, budget, onChange }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(budget || '')

  const percent = budgetUsedPercent(spent, budget)
  const over = isOverBudget(spent, budget)
  const remaining = budget - spent

  function save(e) {
    e.preventDefault()
    onChange(Number(value) || 0)
    setEditing(false)
  }

  return (
    <div className="card">
      <h2>Monthly budget</h2>

      {budget > 0 ? (
        <>
          <div className="budget-head">
            <span className="spent">{formatCurrency(spent)}</span>
            <span style={{ color: 'var(--text-muted)' }}>
              of {formatCurrency(budget)}
            </span>
          </div>
          <div className={`budget-bar ${over ? 'over' : ''}`}>
            <span style={{ width: `${Math.min(percent, 100)}%` }} />
          </div>
          <div className="budget-meta">
            <span>{percent.toFixed(0)}% used</span>
            {over ? (
              <span className="over">
                Over by {formatCurrency(Math.abs(remaining))}
              </span>
            ) : (
              <span>{formatCurrency(remaining)} left</span>
            )}
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--text-muted)', margin: '0 0 4px' }}>
          No budget set for this view. Set one to track your spending.
        </p>
      )}

      {editing ? (
        <form className="budget-edit" onSubmit={save}>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Enter budget"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn small">
            Save
          </button>
          <button
            type="button"
            className="btn small ghost"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="budget-edit">
          <button
            className="btn small ghost"
            onClick={() => {
              setValue(budget || '')
              setEditing(true)
            }}
          >
            {budget > 0 ? 'Edit budget' : 'Set budget'}
          </button>
        </div>
      )}
    </div>
  )
}
