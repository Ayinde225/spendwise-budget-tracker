// Thin localStorage wrapper with JSON serialisation and safe fallbacks.

const TX_KEY = 'spendwise.transactions'
const BUDGET_KEY = 'spendwise.budget'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write failures (e.g. private mode / quota)
  }
}

export function loadTransactions() {
  const data = read(TX_KEY, null)
  return Array.isArray(data) ? data : null
}

export function saveTransactions(transactions) {
  write(TX_KEY, transactions)
}

export function loadBudget() {
  const data = read(BUDGET_KEY, 0)
  return Number(data) || 0
}

export function saveBudget(budget) {
  write(BUDGET_KEY, Number(budget) || 0)
}

// A small set of seed transactions so a first-time visitor sees a populated app.
export function seedTransactions() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const pm = new Date(now.getFullYear(), now.getMonth() - 1, 15)
  const pmY = pm.getFullYear()
  const pmM = String(pm.getMonth() + 1).padStart(2, '0')
  const id = () => Math.random().toString(36).slice(2, 10)
  return [
    { id: id(), amount: 3200, type: 'income', category: 'Salary', date: `${y}-${m}-01`, note: 'Monthly salary' },
    { id: id(), amount: 450, type: 'income', category: 'Freelance', date: `${y}-${m}-12`, note: 'Side project' },
    { id: id(), amount: 1100, type: 'expense', category: 'Rent', date: `${y}-${m}-03`, note: 'Apartment' },
    { id: id(), amount: 320, type: 'expense', category: 'Food', date: `${y}-${m}-08`, note: 'Groceries' },
    { id: id(), amount: 90, type: 'expense', category: 'Transport', date: `${y}-${m}-09`, note: 'Fuel' },
    { id: id(), amount: 140, type: 'expense', category: 'Utilities', date: `${y}-${m}-11`, note: 'Electricity' },
    { id: id(), amount: 60, type: 'expense', category: 'Entertainment', date: `${y}-${m}-14`, note: 'Cinema' },
    { id: id(), amount: 2800, type: 'income', category: 'Salary', date: `${pmY}-${pmM}-01`, note: 'Monthly salary' },
    { id: id(), amount: 1100, type: 'expense', category: 'Rent', date: `${pmY}-${pmM}-03`, note: 'Apartment' },
    { id: id(), amount: 410, type: 'expense', category: 'Food', date: `${pmY}-${pmM}-18`, note: 'Groceries' },
  ]
}
