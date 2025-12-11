import js from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
      },
    },
    rules: {},
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];