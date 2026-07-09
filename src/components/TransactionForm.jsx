import { useEffect, useState } from 'react'
import { validateTransaction } from '../lib/finance.js'
import { categoriesForType } from '../lib/categories.js'

const emptyDraft = (defaultDate) => ({
  amount: '',
  type: 'expense',
  category: 'Food',
  date: defaultDate,
  note: '',
})

// Form for creating and editing transactions. When `editing` is provided the
// form is pre-filled and submitting calls onSave with the merged transaction.
export default function TransactionForm({ defaultDate, editing, onSave, onCancel }) {
  const [draft, setDraft] = useState(() =>
    editing ? { ...editing } : emptyDraft(defaultDate)
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editing) setDraft({ ...editing })
  }, [editing])

  function setField(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  function setType(type) {
    const cats = categoriesForType(type)
    setDraft((d) => ({
      ...d,
      type,
      // Keep the chosen category if it still exists, else pick the first.
      category: cats.some((c) => c.name === d.category) ? d.category : cats[0].name,
    }))
  }

  function submit(e) {
    e.preventDefault()
    const result = validateTransaction(draft)
    if (!result.valid) {
      setErrors(result.errors)
      return
    }
    onSave({
      ...draft,
      id: editing ? editing.id : undefined,
      amount: Number(draft.amount),
    })
    if (!editing) setDraft(emptyDraft(defaultDate))
    setErrors({})
  }

  const cats = categoriesForType(draft.type)

  return (
    <form className="tx-form" onSubmit={submit} noValidate>
      <div className="type-toggle">
        <button
          type="button"
          className={draft.type === 'expense' ? 'active-expense' : ''}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
        <button
          type="button"
          className={draft.type === 'income' ? 'active-income' : ''}
          onClick={() => setType('income')}
        >
          Income
        </button>
      </div>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          className={errors.amount ? 'invalid' : ''}
          value={draft.amount}
          onChange={(e) => setField('amount', e.target.value)}
        />
        {errors.amount && <span className="error">{errors.amount}</span>}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className={errors.category ? 'invalid' : ''}
            value={draft.category}
            onChange={(e) => setField('category', e.target.value)}
          >
            {cats.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            className={errors.date ? 'invalid' : ''}
            value={draft.date}
            onChange={(e) => setField('date', e.target.value)}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="note">Note (optional)</label>
        <input
          id="note"
          type="text"
          maxLength={80}
          placeholder="e.g. Groceries at the market"
          value={draft.note}
          onChange={(e) => setField('note', e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="btn">
          {editing ? 'Save changes' : 'Add transaction'}
        </button>
        {editing && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
