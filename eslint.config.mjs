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
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn'] }],
    },
  },
  {
    // CLI tools print to the terminal on purpose
    files: ['scripts/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
);
