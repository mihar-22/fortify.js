module.exports = {
  root: true,
  parserOptions: {
    project: 'tsconfig.json',
  },
  extends: ['airbnb-typescript'],
  rules: {
    'no-console': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/camelcase': 'off'
  }
};
