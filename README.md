# 💰 SpendWise — Personal Budget & Expense Tracker

A polished, client-side personal-finance web app for tracking income, expenses and monthly budgets — with category charts and full localStorage persistence. No backend, no sign-up, no data ever leaves your browser.

🔗 **Live demo:** https://ayinde225.github.io/spendwise-budget-tracker/

[![Deploy](https://github.com/Ayinde225/spendwise-budget-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ayinde225/spendwise-budget-tracker/actions/workflows/deploy.yml)

---

## ✨ Features

- **Add transactions** with amount, type (income/expense), category, date and an optional note — with validation that blocks zero/negative amounts and missing fields.
- **Categories** for expenses (Food, Rent, Transport, Utilities, Entertainment, Health, Other) and income (Salary, Freelance, Other), each colour-coded.
- **Transaction list** that is sortable by date or amount, filterable by type and category, with inline **edit** and **delete**.
- **Dashboard summary cards**: total income, total expenses, current balance, and savings rate (%).
- **Monthly budget**: set a budget and watch a progress bar fill up — it turns red the moment you go over budget.
- **Charts built from first principles** (hand-rolled inline SVG, no charting library):
  - a **donut chart** of spending by category, and
  - a grouped **bar chart** of income vs expense across recent months.
- **Month selector** to jump between months and view each month's data in isolation.
- **Responsive, modern UI** with cards, subtle shadows, and automatic light/dark theming.
- **localStorage persistence** — your data is restored on every visit.

## 🛠 Tech stack

- **React 18** + **Vite 5** (JavaScript)
- **Vitest** for unit-testing the pure finance logic
- Hand-rolled **SVG** charts — no chart dependencies
- Plain CSS with CSS variables for theming

Pure calculation logic lives in [`src/lib/`](src/lib) (framework-free and unit-tested); UI components live in [`src/components/`](src/components).

## 🚀 Getting started

```bash
# Clone
git clone https://github.com/Ayinde225/spendwise-budget-tracker.git
cd spendwise-budget-tracker

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## 🧪 Testing

The finance logic (totals, balance, savings rate, budget %, category aggregation, month filtering, sorting, validation) is covered by unit tests.

```bash
npm test
```

## 👤 Author

**Ayinde Abdul Aziz** — [@Ayinde225](https://github.com/Ayinde225)

## 📄 License

Released under the MIT License.
