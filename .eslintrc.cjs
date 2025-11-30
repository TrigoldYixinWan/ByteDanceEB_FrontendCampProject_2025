module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.base.json',
      './frontend/tsconfig.json',
      './backend/tsconfig.json',
      './packages/shared/tsconfig.json',
    ],
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
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
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'import',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'property',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'property',
        modifiers: ['requiresQuotes'],
        format: null,
      },
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
    ],
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['*.cjs', '*.js'],
      parserOptions: {
        project: null,
      },
      env: { node: true },
    },
  ],
  ignorePatterns: ['dist', 'node_modules', '.next'],
};
