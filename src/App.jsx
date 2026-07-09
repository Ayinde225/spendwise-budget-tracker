import { useEffect, useMemo, useState } from 'react'
import SummaryCards from './components/SummaryCards.jsx'
import MonthSelector from './components/MonthSelector.jsx'
import TransactionForm from './components/TransactionForm.jsx'
import TransactionList from './components/TransactionList.jsx'
import BudgetProgress from './components/BudgetProgress.jsx'
import DonutChart from './components/DonutChart.jsx'
import BarChart from './components/BarChart.jsx'
import {
  filterByMonth,
  totalExpenses,
  monthKey,
} from './lib/finance.js'
import {
  loadTransactions,
  saveTransactions,
  loadBudget,
  saveBudget,
  seedTransactions,
} from './lib/storage.js'

const currentMonthKey = () => monthKey(new Date().toISOString().slice(0, 10))
const today = () => new Date().toISOString().slice(0, 10)
const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const stored = loadTransactions()
    return stored ?? seedTransactions()
  })
  const [budget, setBudget] = useState(() => loadBudget())
  const [month, setMonth] = useState(currentMonthKey)
  const [editing, setEditing] = useState(null)

  // Persist to localStorage whenever data changes.
  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  useEffect(() => {
    saveBudget(budget)
  }, [budget])

  const monthTransactions = useMemo(
    () => filterByMonth(transactions, month),
    [transactions, month]
  )

  const availableMonths = useMemo(
    () => [...new Set(transactions.map((t) => monthKey(t.date)))].sort(),
    [transactions]
  )

  const spentThisMonth = totalExpenses(monthTransactions)

  function handleSave(tx) {
    if (tx.id) {
      setTransactions((list) =>
        list.map((t) => (t.id === tx.id ? { ...t, ...tx } : t))
      )
      setEditing(null)
    } else {
      setTransactions((list) => [{ ...tx, id: newId() }, ...list])
    }
  }

  function handleDelete(id) {
    setTransactions((list) => list.filter((t) => t.id !== id))
    if (editing && editing.id === id) setEditing(null)
  }

  function handleEdit(tx) {
    setEditing(tx)
    // Jump the viewer to the transaction's month so the edit is visible.
    setMonth(monthKey(tx.date))
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">💰</div>
          <div>
            <h1>SpendWise</h1>
            <p>Personal budget &amp; expense tracker</p>
          </div>
        </div>
        <MonthSelector
          value={month}
          onChange={setMonth}
          available={availableMonths}
        />
      </header>

      <div className="stack">
        <SummaryCards transactions={monthTransactions} />

        <div className="grid main-grid">
          <div className="stack">
            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div className="grid charts-grid">
              <DonutChart transactions={monthTransactions} />
              <BarChart transactions={transactions} referenceMonth={month} />
            </div>
          </div>

          <div className="stack">
            <div className="card">
              <h2>{editing ? 'Edit transaction' : 'Add transaction'}</h2>
              <TransactionForm
                key={editing ? editing.id : 'new'}
                defaultDate={today()}
                editing={editing}
                onSave={handleSave}
                onCancel={() => setEditing(null)}
              />
            </div>
            <BudgetProgress
              spent={spentThisMonth}
              budget={budget}
              onChange={setBudget}
            />
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>
          SpendWise — data stays in your browser (localStorage). Built by{' '}
          <a href="https://github.com/Ayinde225" target="_blank" rel="noreferrer">
            Ayinde Abdul Aziz
          </a>
          .
        </p>
      </footer>
    </div>
  )
}
