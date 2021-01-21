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
    'no-unused-expressions': OFF,
    quotes: [ERROR, 'single'],
    semi: [ERROR, 'always'],
    'no-use-before-define': OFF,
    camelcase: OFF,
    'no-shadow': OFF,

    'import/no-unresolved': OFF,
    'import/extensions': OFF,

    'react-hooks/rules-of-hooks': ERROR,
    'react-hooks/exhaustive-deps': WARNING,

    'react/jsx-props-no-spreading': OFF,
    'react/jsx-filename-extension': [
      ERROR,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/jsx-wrap-multilines': ERROR,
    'react/no-array-index-key': OFF,
    'react/require-default-props': OFF,
    'react/jsx-max-props-per-line': [
      ERROR,
      {
        maximum: 1,
      },
    ],

    '@typescript-eslint/no-inferrable-types': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-unused-expressions': ERROR,
    '@typescript-eslint/ban-ts-ignore': OFF,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/no-shadow': ERROR,
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
