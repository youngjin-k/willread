const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    'react-hooks/rules-of-hooks': ERROR,
    'react-hooks/exhaustive-deps': WARNING,
    'import/no-unresolved': OFF,
    'import/extensions': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/jsx-filename-extension': [
      ERROR,
      {extensions: ['.js', '.jsx', '.ts', '.tsx']},
    ],
    'react/jsx-wrap-multilines': ERROR,
    '@typescript-eslint/no-inferrable-types': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/no-use-before-define': OFF,
    'react/no-array-index-key': OFF,
    quotes: [WARNING, 'single'],
    semi: [ERROR, 'always'],
    'react/jsx-max-props-per-line': [ERROR, {maximum: 1}],
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': OFF,
      },
    },
  ],
};
