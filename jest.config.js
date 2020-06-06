module.exports = {
  testEnvironment: "node",
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  setupFiles: [
    './src/server/support/testing/bootstrapTestEnv.ts'
  ],
  coveragePathIgnorePatterns: [
    "/node_modules",
    "/tests"
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}'
  ],
};
