import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@teiler/core': fileURLToPath(new URL('../core/src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    coverage: {
      include: ['src/**/*.ts'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
})
