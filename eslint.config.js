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
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
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
    rules: {
      complexity: ['error', { max: 20 }],
      'max-lines-per-function': ['error', { max: 100 }],
      'max-lines': ['error', { max: 300 }],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'vitest.config.mts'],
  },
];
