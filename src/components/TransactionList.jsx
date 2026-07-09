import { useMemo, useState } from 'react'
import {
  sortTransactions,
  filterTransactions,
  formatCurrency,
} from '../lib/finance.js'
import {
  categoryColor,
  EXPENSE_CATEGORY_NAMES,
  INCOME_CATEGORY_NAMES,
} from '../lib/categories.js'

const allCategories = [
  ...new Set([...EXPENSE_CATEGORY_NAMES, ...INCOME_CATEGORY_NAMES]),
]

// Sortable, filterable table of transactions with edit/delete actions.
export default function TransactionList({ transactions, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const rows = useMemo(() => {
    const filtered = filterTransactions(transactions, {
      type: typeFilter,
      category: categoryFilter,
    })
    return sortTransactions(filtered, sortKey, sortDir)
  }, [transactions, typeFilter, categoryFilter, sortKey, sortDir])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const arrow = (key) => (sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '')

  return (
    <div className="card">
      <h2>Transactions</h2>

      <div className="controls">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by type">
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {rows.length === 0 ? (
        <div className="empty">No transactions match — add one to get started.</div>
      ) : (
        <div className="table-scroll">
          <table className="tx-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('date')}>
                  Date{arrow('date')}
                </th>
                <th>Category</th>
                <th>Note</th>
                <th
                  className="sortable"
                  onClick={() => toggleSort('amount')}
                  style={{ textAlign: 'right' }}
                >
                  Amount{arrow('amount')}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>
                    <span className="cat-tag">
                      <span
                        className="cat-dot"
                        style={{ background: categoryColor(tx.category) }}
                      />
                      {tx.category}
                    </span>
                  </td>
                  <td className="note-cell" title={tx.note}>
                    {tx.note || '—'}
                  </td>
                  <td className={`amount-cell ${tx.type}`} style={{ textAlign: 'right' }}>
                    {tx.type === 'expense' ? '−' : '+'}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                    <button className="btn small ghost" onClick={() => onEdit(tx)}>
                      Edit
                    </button>{' '}
                    <button className="btn danger" onClick={() => onDelete(tx.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
