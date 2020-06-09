module.exports = {
  root: true,
  globals: {
    testContainer: true
  },
  parserOptions: {
    project: 'tsconfig.json',
  },
  extends: ['airbnb-typescript'],
  rules: {
    'no-console': 'off',
    'react/jsx-props-no-spreading': 'off',
    'default-case': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-member-accessibility': ['error', {
      accessibility: 'explicit',
      overrides: { constructors: 'no-public' }
    }]
  }
};
