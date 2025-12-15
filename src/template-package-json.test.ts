/**
 * Tests for the in-memory template package.json factory.
 *
 * These tests ensure that createTemplatePackageJson produces a consistent
 * shape and contents aligned with the on-disk package.json.template used for
 * scaffolding, and that it behaves predictably for valid and edge-case
 * project names.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT
 * @supports docs/stories/004.0-DEVELOPER-TESTS-RUN.story.md REQ-TEST-ALL-PASS REQ-TEST-FAST-EXEC
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-START-PRODUCTION REQ-START-NO-WATCH REQ-START-PORT REQ-START-LOGS
 */
import { describe, it, expect } from 'vitest';

import { createTemplatePackageJson } from './template-package-json.js';

describe('createTemplatePackageJson (Story 001.0)', () => {
  it('[REQ-INIT-FILES-MINIMAL] produces a minimal, private ESM package.json for a valid project name', () => {
    const pkg = createTemplatePackageJson('my-api');

    expect(pkg).toMatchObject({
      name: 'my-api',
      private: true,
      type: 'module',
    });

    // Scripts should include the core dev/build/test commands expected by the stories
    expect(pkg.scripts).toMatchObject({
      dev: 'node dev-server.mjs',
      build: 'npm run clean && tsc -p tsconfig.json',
      start: 'node dist/src/index.js',
      test: 'vitest run',
      'test:watch': 'vitest --watch',
      'test:coverage': 'vitest run --coverage',
    });

    // Dependencies and devDependencies should include the documented runtime and tooling packages
    expect(Object.keys(pkg.dependencies)).toEqual(
      expect.arrayContaining(['fastify', '@fastify/helmet', 'pino']),
    );
    expect(Object.keys(pkg.devDependencies)).toEqual(
      expect.arrayContaining(['typescript', '@types/node', 'pino-pretty', 'vitest']),
    );
  });

  it('[REQ-INIT-FILES-MINIMAL] trims whitespace from the provided project name', () => {
    const pkg = createTemplatePackageJson('  spaced-name  ');
    expect(pkg.name).toBe('spaced-name');
  });
});
