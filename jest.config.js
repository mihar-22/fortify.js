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
    '@abraham/reflection',
    'dotenv/config'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules',
    '/packages/*/node_modules'
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
    '/packages/*/src/**/*.{js,ts}'
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
