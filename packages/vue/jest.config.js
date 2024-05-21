export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/packages/vue/tsconfig.json',
      },
    ],
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  coveragePathIgnorePatterns: ['/node_module/'],
  collectCoverageFrom: ["<rootDir>/packages/vue/src/**"],
  coverageReporters: ['text'],
  coverageDirectory: '<rootDir>/packages/vue/coverage',
  rootDir: '../..',
  testMatch: ['<rootDir>/packages/vue/**/*.test.ts'],
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
