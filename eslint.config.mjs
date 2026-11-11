import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules/**', '.features-gen/**', 'playwright-report/**', 'test-results/**', 'eslint.config.mjs'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn'] }],
    },
  },
  {
    files: ['src/pages/**/*.ts', 'tests/steps/**/*.ts'],
    rules: {
      'no-restricted-syntax': ['error',
        { selector: 'CallExpression[callee.name="expect"]', message: 'Put assertions in a verification class.' },
        { selector: 'MemberExpression[property.name="waitForTimeout"]', message: 'Synchronize on observable state.' },
        { selector: 'Literal[value="networkidle"]', message: 'Synchronize on observable state.' },
      ],
    },
  },
  {
    // CLI tools print to the terminal on purpose
    files: ['scripts/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
);
