// Pure finance calculation helpers. No React, no DOM, no side effects.
// A transaction has shape:
//   { id, amount (number > 0), type ('income'|'expense'), category, date (ISO 'YYYY-MM-DD'), note }

export function isIncome(tx) {
  return tx.type === 'income'
}

export function isExpense(tx) {
  return tx.type === 'expense'
}

// Sum of all income amounts.
export function totalIncome(transactions) {
  return transactions
    .filter(isIncome)
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
}

// Sum of all expense amounts.
export function totalExpenses(transactions) {
  return transactions
    .filter(isExpense)
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
}

// Balance = income - expenses.
export function balance(transactions) {
  return totalIncome(transactions) - totalExpenses(transactions)
}

// Savings rate as a percentage of income kept: (income - expenses) / income * 100.
// Returns 0 when there is no income to avoid division by zero.
export function savingsRate(transactions) {
  const income = totalIncome(transactions)
  if (income <= 0) return 0
  const saved = income - totalExpenses(transactions)
  return (saved / income) * 100
}

// Percentage of the monthly budget that has been spent.
// Returns 0 when the budget is not a positive number.
export function budgetUsedPercent(spent, budget) {
  if (!budget || budget <= 0) return 0
  return (spent / budget) * 100
}

export function isOverBudget(spent, budget) {
  if (!budget || budget <= 0) return false
  return spent > budget
}

// Extract 'YYYY-MM' from an ISO date string.
export function monthKey(dateStr) {
  return String(dateStr).slice(0, 7)
}

// All transactions whose date falls within the given 'YYYY-MM' month.
export function filterByMonth(transactions, month) {
  return transactions.filter((tx) => monthKey(tx.date) === month)
}

// Aggregate expense totals per category for the supplied transactions.
// Returns an array of { category, total } sorted by total descending.
export function spendingByCategory(transactions) {
  const totals = {}
  for (const tx of transactions) {
    if (!isExpense(tx)) continue
    totals[tx.category] = (totals[tx.category] || 0) + Number(tx.amount)
  }
  return Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

// Income vs expense totals for the most recent `count` months present in the data
// (plus the reference month), oldest first. `reference` is a 'YYYY-MM' string.
export function monthlyTotals(transactions, reference, count = 6) {
  const months = recentMonths(reference, count)
  return months.map((month) => {
    const scoped = filterByMonth(transactions, month)
    return {
      month,
      income: totalIncome(scoped),
      expenses: totalExpenses(scoped),
    }
  })
}

// Produce `count` consecutive 'YYYY-MM' keys ending at `reference` (inclusive),
// oldest first.
export function recentMonths(reference, count = 6) {
  const [year, month] = reference.split('-').map(Number)
  const result = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(year, month - 1 - i, 1))
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    result.push(`${y}-${m}`)
  }
  return result
}

// Sort transactions by a key ('date' | 'amount') in a direction ('asc' | 'desc').
// Returns a new array; does not mutate the input.
export function sortTransactions(transactions, key = 'date', direction = 'desc') {
  const dir = direction === 'asc' ? 1 : -1
  const copy = [...transactions]
  copy.sort((a, b) => {
    if (key === 'amount') {
      return (Number(a.amount) - Number(b.amount)) * dir
    }
    // date compare, fall back to id for stability
    if (a.date === b.date) return String(a.id).localeCompare(String(b.id)) * dir
    return (a.date < b.date ? -1 : 1) * dir
  })
  return copy
}

// Apply type + category filters. `type` is 'all'|'income'|'expense',
// `category` is 'all' or a category name.
export function filterTransactions(transactions, { type = 'all', category = 'all' } = {}) {
  return transactions.filter((tx) => {
    if (type !== 'all' && tx.type !== type) return false
    if (category !== 'all' && tx.category !== category) return false
    return true
  })
}

// Validate a transaction draft. Returns { valid, errors } where errors is a map.
export function validateTransaction(draft) {
  const errors = {}
  const amount = Number(draft.amount)
  if (draft.amount === '' || draft.amount === null || draft.amount === undefined) {
    errors.amount = 'Amount is required'
  } else if (Number.isNaN(amount)) {
    errors.amount = 'Amount must be a number'
  } else if (amount <= 0) {
    errors.amount = 'Amount must be greater than zero'
  }
  if (draft.type !== 'income' && draft.type !== 'expense') {
    errors.type = 'Type is required'
  }
  if (!draft.category) {
    errors.category = 'Category is required'
  }
  if (!draft.date) {
    errors.date = 'Date is required'
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

// Format a number as a currency string.
export function formatCurrency(value, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

// Human-readable label for a 'YYYY-MM' month key, e.g. 'Jul 2026'.
export function formatMonthLabel(month) {
  const [year, m] = month.split('-').map(Number)
  const d = new Date(Date.UTC(year, m - 1, 1))
  return d.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
