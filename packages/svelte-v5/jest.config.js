export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/packages/svelte/tsconfig.json',
      },
    ],
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: 'svelte.config.js',
      },
    ]
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  extensionsToTreatAsEsm: ['.svelte', '.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  coveragePathIgnorePatterns: ['/node_module/'],
  collectCoverageFrom: ['<rootDir>/packages/svelte/src/**/*.ts'],
  coverageReporters: ['text'],
  coverageDirectory: '<rootDir>/packages/svelte/coverage',
  rootDir: '../..',
  testMatch: ['<rootDir>/packages/svelte/**/*.test.ts'],
  moduleNameMapper: {
    '^@teiler/(.*)$': '<rootDir>/packages/$1/src',
  },
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
