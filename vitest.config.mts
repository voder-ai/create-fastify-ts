import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.js', 'src/**/*.smoke.test.ts'],
    exclude: ['dist/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'html'],
      exclude: ['src/template-files/**'],
      lines: 80,
      statements: 80,
      branches: 80,
      functions: 80,
    },
  },
});
