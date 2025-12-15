/**
 * Template package.json shape and factory for initialized projects.
 *
 * This module centralizes the structure of the generated package.json and is
 * used by the initializer when a JSON template file is not available.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT
 * @supports docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md REQ-SEC-HELMET-DEFAULT
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-START-PRODUCTION REQ-START-NO-WATCH REQ-START-PORT REQ-START-LOGS
 * @supports docs/stories/004.0-DEVELOPER-TESTS-RUN.story.md REQ-TEST-ALL-PASS REQ-TEST-FAST-EXEC REQ-TEST-WATCH-MODE REQ-TEST-COVERAGE REQ-TEST-TYPESCRIPT
 */
export interface TemplatePackageJson {
  name: string;
  version: string;
  private: boolean;
  type: 'module';
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

const NODE_TYPES_VERSION = '^24.10.2';

/**
 * Create the in-memory representation of package.json for a new project.
 *
 * This mirrors the on-disk package.json.template used for scaffolding and
 * acts as a fallback when direct template copying is not available.
 *
 * @param projectName - The npm package name for the new project.
 * @returns A plain object ready to be stringified to package.json.
 */
export function createTemplatePackageJson(projectName: string): TemplatePackageJson {
  const normalizedName = projectName.trim();

  return {
    name: normalizedName,
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'node dev-server.mjs',
      clean:
        "node --input-type=module -e \"import fs from 'node:fs'; fs.rmSync('dist', { recursive: true, force: true });\"",
      build: 'npm run clean && tsc -p tsconfig.json',
      start: 'node dist/src/index.js',
      test: 'vitest run',
      'test:watch': 'vitest --watch',
      'test:coverage': 'vitest run --coverage',
    },
    dependencies: {
      fastify: '^5.6.2',
      '@fastify/helmet': '^13.0.2',
      pino: '^9.0.0',
    },
    devDependencies: {
      typescript: '^5.9.3',
      '@types/node': NODE_TYPES_VERSION,
      'pino-pretty': '^11.0.0',
      vitest: '^2.1.8',
    },
  };
}
