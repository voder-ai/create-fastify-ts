import js from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {
        ...(js.configs.recommended.languageOptions?.globals || {}),
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },
    },
    rules: {},
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];