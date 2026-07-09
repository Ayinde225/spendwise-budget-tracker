// Category definitions for income and expenses, each with a colour used by charts.

export const EXPENSE_CATEGORIES = [
  { name: 'Food', color: '#ef4444' },
  { name: 'Rent', color: '#8b5cf6' },
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Utilities', color: '#06b6d4' },
  { name: 'Entertainment', color: '#ec4899' },
  { name: 'Health', color: '#10b981' },
  { name: 'Other', color: '#f59e0b' },
]

export const INCOME_CATEGORIES = [
  { name: 'Salary', color: '#22c55e' },
  { name: 'Freelance', color: '#14b8a6' },
  { name: 'Other', color: '#84cc16' },
]

export const EXPENSE_CATEGORY_NAMES = EXPENSE_CATEGORIES.map((c) => c.name)
export const INCOME_CATEGORY_NAMES = INCOME_CATEGORIES.map((c) => c.name)

const FALLBACK_COLORS = [
  '#ef4444', '#8b5cf6', '#3b82f6', '#06b6d4',
  '#ec4899', '#10b981', '#f59e0b', '#84cc16',
]

// Return a stable colour for a category name (defaults to a palette fallback).
export function categoryColor(name, index = 0) {
  const match = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find(
    (c) => c.name === name
  )
  if (match) return match.color
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

export function categoriesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}
