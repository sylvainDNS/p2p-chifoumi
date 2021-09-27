module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'react-app',
    'react-app/jest',
  ],
  plugins: ['prettier'],
  rules: {
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    eqeqeq: ['error'],
    'eol-last': ['error', 'always'],
    'keyword-spacing': ['error'],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', 120],
    'no-duplicate-imports': 'error',
    'no-tabs': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        trailingComma: 'es5',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
      },
    ],
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
}
