export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./jest.client.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
