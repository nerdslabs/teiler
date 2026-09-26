import { fileURLToPath } from 'node:url'

const svelteJester = fileURLToPath(import.meta.resolve('svelte-jester'))

const project = (name, testEnvironment, customExportConditions, generate) => ({
  displayName: name,
  rootDir: '../..',
  transform: {
    '^.+\\.svelte(\\.js)?$': [svelteJester, { compilerOptions: { generate } }],
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!.+\\.svelte(\\.js)?$)'],
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  extensionsToTreatAsEsm: ['.svelte', '.ts'],
  testEnvironment,
  testEnvironmentOptions: {
    customExportConditions,
  },
  testMatch: [`<rootDir>/packages/svelte/tests/**/*.${name}.test.ts`],
  moduleNameMapper: {
    '^@teiler/(.*)$': '<rootDir>/packages/$1/src',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
})

export default {
  projects: [project('client', 'jsdom', ['browser'], 'client'), project('server', 'node', ['node', 'node-addons'], 'server')],
  coveragePathIgnorePatterns: ['/node_module/'],
  collectCoverageFrom: ['<rootDir>/packages/svelte/src/**/*.ts'],
  coverageReporters: ['text'],
  coverageDirectory: '<rootDir>/packages/svelte/coverage',
  rootDir: '../..',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
