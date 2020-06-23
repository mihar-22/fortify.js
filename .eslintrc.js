module.exports = {
  root: true,
  parserOptions: {
    project: 'tsconfig.json',
  },
  extends: ['airbnb-typescript'],
  rules: {
    'no-console': 'off',
    'global-require': 'off',
    'react/jsx-props-no-spreading': 'off',
    'default-case': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-member-accessibility': ['error', {
      accessibility: 'explicit',
      overrides: { constructors: 'no-public' }
    }]
  }
};
