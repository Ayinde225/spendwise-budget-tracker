import { describe, it, expect } from 'vitest'
import {
  totalIncome,
  totalExpenses,
  balance,
  savingsRate,
  budgetUsedPercent,
  isOverBudget,
  filterByMonth,
  monthKey,
  spendingByCategory,
  monthlyTotals,
  recentMonths,
  sortTransactions,
  filterTransactions,
  validateTransaction,
} from './finance.js'

const sample = [
  { id: '1', amount: 3000, type: 'income', category: 'Salary', date: '2026-07-01', note: '' },
  { id: '2', amount: 500, type: 'income', category: 'Freelance', date: '2026-07-10', note: '' },
  { id: '3', amount: 200, type: 'expense', category: 'Food', date: '2026-07-05', note: '' },
  { id: '4', amount: 800, type: 'expense', category: 'Rent', date: '2026-07-02', note: '' },
  { id: '5', amount: 100, type: 'expense', category: 'Food', date: '2026-06-20', note: '' },
  { id: '6', amount: 1200, type: 'income', category: 'Salary', date: '2026-06-01', note: '' },
]

describe('totals and balance', () => {
  it('sums income across all months', () => {
    expect(totalIncome(sample)).toBe(4700)
  })

  it('sums expenses across all months', () => {
    expect(totalExpenses(sample)).toBe(1100)
  })

  it('computes balance as income minus expenses', () => {
    expect(balance(sample)).toBe(3600)
  })

  it('returns 0 balance for an empty ledger', () => {
    expect(balance([])).toBe(0)
    expect(totalIncome([])).toBe(0)
    expect(totalExpenses([])).toBe(0)
  })
})

describe('savingsRate', () => {
  it('computes savings rate as a percentage of income', () => {
    // income 4700, expenses 1100 -> saved 3600 -> 76.5957...%
    expect(savingsRate(sample)).toBeCloseTo((3600 / 4700) * 100, 5)
  })

  it('returns 0 when there is no income', () => {
    const onlyExpense = [{ id: 'a', amount: 50, type: 'expense', category: 'Food', date: '2026-07-01' }]
    expect(savingsRate(onlyExpense)).toBe(0)
  })

  it('can be negative when expenses exceed income', () => {
    const txs = [
      { id: 'a', amount: 100, type: 'income', category: 'Salary', date: '2026-07-01' },
      { id: 'b', amount: 300, type: 'expense', category: 'Food', date: '2026-07-01' },
    ]
    expect(savingsRate(txs)).toBeCloseTo(-200, 5)
  })
})

describe('budget helpers', () => {
  it('computes percentage of budget used', () => {
    expect(budgetUsedPercent(500, 1000)).toBe(50)
    expect(budgetUsedPercent(1500, 1000)).toBe(150)
  })

  it('returns 0 percent for a non-positive budget', () => {
    expect(budgetUsedPercent(500, 0)).toBe(0)
    expect(budgetUsedPercent(500, null)).toBe(0)
  })

  it('detects when spending is over budget', () => {
    expect(isOverBudget(1200, 1000)).toBe(true)
    expect(isOverBudget(800, 1000)).toBe(false)
    expect(isOverBudget(800, 0)).toBe(false)
  })
})

describe('month filtering', () => {
  it('extracts the month key from an ISO date', () => {
    expect(monthKey('2026-07-05')).toBe('2026-07')
  })

  it('filters transactions to a given month', () => {
    const july = filterByMonth(sample, '2026-07')
    expect(july).toHaveLength(4)
    expect(july.every((t) => t.date.startsWith('2026-07'))).toBe(true)
  })

  it('income and expenses are month-scoped', () => {
    const july = filterByMonth(sample, '2026-07')
    expect(totalIncome(july)).toBe(3500)
    expect(totalExpenses(july)).toBe(1000)
  })
})

describe('spendingByCategory', () => {
  it('aggregates expense totals per category, sorted descending', () => {
    const july = filterByMonth(sample, '2026-07')
    const agg = spendingByCategory(july)
    expect(agg).toEqual([
      { category: 'Rent', total: 800 },
      { category: 'Food', total: 200 },
    ])
  })

  it('ignores income transactions', () => {
    const agg = spendingByCategory(sample.filter((t) => t.type === 'income'))
    expect(agg).toEqual([])
  })
})

describe('recentMonths and monthlyTotals', () => {
  it('produces consecutive month keys ending at the reference', () => {
    expect(recentMonths('2026-07', 3)).toEqual(['2026-05', '2026-06', '2026-07'])
  })

  it('rolls over the year boundary correctly', () => {
    expect(recentMonths('2026-01', 3)).toEqual(['2025-11', '2025-12', '2026-01'])
  })

  it('reports income vs expenses per month', () => {
    const totals = monthlyTotals(sample, '2026-07', 2)
    expect(totals).toEqual([
      { month: '2026-06', income: 1200, expenses: 100 },
      { month: '2026-07', income: 3500, expenses: 1000 },
    ])
  })
})

describe('sortTransactions', () => {
  it('sorts by amount ascending without mutating input', () => {
    const input = [...sample]
    const sorted = sortTransactions(sample, 'amount', 'asc')
    expect(sorted.map((t) => t.amount)).toEqual([100, 200, 500, 800, 1200, 3000])
    expect(input).toEqual(sample) // original untouched
  })

  it('sorts by date descending', () => {
    const sorted = sortTransactions(sample, 'date', 'desc')
    expect(sorted[0].date >= sorted[sorted.length - 1].date).toBe(true)
    expect(sorted[0].date).toBe('2026-07-10')
  })
})

describe('filterTransactions', () => {
  it('filters by type', () => {
    expect(filterTransactions(sample, { type: 'income' })).toHaveLength(3)
    expect(filterTransactions(sample, { type: 'expense' })).toHaveLength(3)
  })

  it('filters by category', () => {
    expect(filterTransactions(sample, { category: 'Food' })).toHaveLength(2)
  })

  it('combines type and category filters', () => {
    const r = filterTransactions(sample, { type: 'expense', category: 'Food' })
    expect(r).toHaveLength(2)
    expect(r.every((t) => t.type === 'expense' && t.category === 'Food')).toBe(true)
  })
})

describe('validateTransaction', () => {
  it('accepts a valid draft', () => {
    const { valid, errors } = validateTransaction({
      amount: '50', type: 'expense', category: 'Food', date: '2026-07-01',
    })
    expect(valid).toBe(true)
    expect(errors).toEqual({})
  })

  it('rejects zero or negative amounts', () => {
    expect(validateTransaction({ amount: '0', type: 'expense', category: 'Food', date: '2026-07-01' }).valid).toBe(false)
    expect(validateTransaction({ amount: '-5', type: 'expense', category: 'Food', date: '2026-07-01' }).valid).toBe(false)
  })

  it('flags each missing required field', () => {
    const { valid, errors } = validateTransaction({ amount: '', type: '', category: '', date: '' })
    expect(valid).toBe(false)
    expect(errors.amount).toBeDefined()
    expect(errors.type).toBeDefined()
    expect(errors.category).toBeDefined()
    expect(errors.date).toBeDefined()
  })
})
