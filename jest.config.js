module.exports = {
  testEnvironment: "node",
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
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
