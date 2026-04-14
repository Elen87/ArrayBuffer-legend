module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'linebreak-style': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
  },
};
