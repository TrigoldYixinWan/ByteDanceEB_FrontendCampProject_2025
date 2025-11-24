module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.base.json',
      './frontend/tsconfig.json',
      './backend/tsconfig.json',
      './packages/shared/tsconfig.json'
    ],
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  settings: {
    react: { version: 'detect' }
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  env: { node: true, browser: true, es2022: true },
  rules: {
    'react/prop-types': 'off',
    // Next.js/React 17+ JSX runtime doesn't require React in scope
    'react/react-in-jsx-scope': 'off',
    // Allow underscore-prefixed unused vars/args in placeholders
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ]
  },
  ignorePatterns: ['dist', 'node_modules']
};
