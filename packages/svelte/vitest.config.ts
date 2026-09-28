import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { playwright } from '@vitest/browser-playwright'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'

const alias = {
  '@teiler/core': path.resolve(import.meta.dirname, '../core/src'),
}

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,svelte}'],
      exclude: ['src/**/*.fixture.svelte'],
      reporter: ['text'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    projects: [
      {
        extends: true,
        plugins: [svelte(), svelteTesting()],
        resolve: { alias },
        test: {
          name: 'client',
          environment: 'jsdom',
          include: ['src/**/*.client.test.ts'],
        },
      },
      {
        extends: true,
        plugins: [svelte()],
        resolve: { alias },
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.server.test.ts'],
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
