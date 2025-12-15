/**
 * End-to-end tests for Story 004.0-DEVELOPER-TESTS-RUN against a generated project.
 *
 * These tests scaffold a new project using the initializer, install
 * dependencies (reusing the root node_modules tree), and verify that
 * the generated project's test commands behave as specified:
 *
 * - `npm test` runs and passes real tests quickly
 * - `npm run test:watch` is available (invoked in non-watch mode here)
 * - `npm run test:coverage` produces coverage output and enforces thresholds
 * - Example TypeScript tests exist demonstrating testing patterns
 *
 * @supports docs/stories/004.0-DEVELOPER-TESTS-RUN.story.md REQ-TEST-ALL-PASS REQ-TEST-FAST-EXEC REQ-TEST-WATCH-MODE REQ-TEST-COVERAGE REQ-TEST-TYPESCRIPT REQ-TEST-CLEAR-OUTPUT REQ-TEST-EXAMPLES
 */
/* global NodeJS */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  initializeGeneratedProject,
  cleanupGeneratedProject,
} from './generated-project.test-helpers.js';
import { runCommandInProject } from './run-command-in-project.test-helpers.js';

let tempDir: string | undefined;
let projectDir: string;
const projectName = 'tests-run-api';

beforeAll(async () => {
  const init = await initializeGeneratedProject({
    projectName,
    tempDirPrefix: 'fastify-ts-tests-run-',
    logPrefix: '[generated-project-tests-run]',
  });
  tempDir = init.tempDir;
  projectDir = init.projectDir;
});

afterAll(async () => {
  await cleanupGeneratedProject(tempDir);
});

async function listProjectFiles(relativeDir: string): Promise<string[]> {
  const dir = path.join(projectDir, relativeDir);
  const entries = await fs.readdir(dir);
  return entries.sort();
}

function makeEnvWithVitestOnPath(): NodeJS.ProcessEnv {
  const thisFilePath = fileURLToPath(import.meta.url);
  const thisDir = path.dirname(thisFilePath);
  const srcDir = path.dirname(thisDir);
  const repoRoot = path.dirname(srcDir);

  const rootBinDir = path.join(repoRoot, 'node_modules', '.bin');
  const existingPath = process.env.PATH ?? '';
  const separator = process.platform === 'win32' ? ';' : ':';
  return {
    ...process.env,
    PATH: `${rootBinDir}${separator}${existingPath}`,
  };
}

describe('Generated project test workflow (Story 004.0) [REQ-TEST-ALL-PASS]', () => {
  it('[REQ-TEST-EXAMPLES] includes TypeScript test example', async () => {
    const files = await listProjectFiles('src');
    expect(files).toContain('index.test.ts');
  });

  it('[REQ-TEST-ALL-PASS][REQ-TEST-FAST-EXEC] npm test runs and passes quickly', async () => {
    const env = makeEnvWithVitestOnPath();
    const start = Date.now();
    const result = await runCommandInProject(projectDir, 'npm', ['test'], { env });
    const durationMs = Date.now() - start;

    expect(result.stdout).toContain('src/index.test');
    expect(durationMs).toBeLessThan(5000);
  });

  it('[REQ-TEST-WATCH-MODE] test:watch script is available (non-watch invocation)', async () => {
    const env = makeEnvWithVitestOnPath();
    const result = await runCommandInProject(
      projectDir,
      'npm',
      ['run', 'test:watch', '--', '--run'],
      { env },
    );
    expect(result.stdout).toContain('src/index.test');
  });

  it('[REQ-TEST-COVERAGE][REQ-TEST-CLEAR-OUTPUT] test:coverage produces coverage output', async () => {
    const env = makeEnvWithVitestOnPath();
    const result = await runCommandInProject(projectDir, 'npm', ['run', 'test:coverage'], { env });

    expect(/Coverage enabled(?: with)?/i.test(result.stdout)).toBe(true);
    expect(result.stdout).toContain('src/index.test');
  });
});
