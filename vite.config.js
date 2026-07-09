import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/spendwise-budget-tracker/',
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
  },
})
