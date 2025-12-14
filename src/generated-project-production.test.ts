/**
 * Tests for production build and start behavior in a generated project.
 *
 * These tests exercise Story 006.0 requirements by scaffolding a new project,
 * running a TypeScript build with tsc, and then (in a fast runtime smoke test)
 * starting the compiled server from dist/ to verify the /health endpoint.
 * Additional, heavier E2E suites are provided as optional, skipped-by-default
 * tests for environments that can tolerate longer runs.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-BUILD-OUTPUT-DIST REQ-BUILD-DECLARATIONS REQ-BUILD-SOURCEMAPS REQ-BUILD-ESM REQ-START-PRODUCTION REQ-START-NO-WATCH REQ-START-PORT REQ-START-LOGS
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  initializeGeneratedProject,
  runTscBuildForProject,
  cleanupGeneratedProject,
  startCompiledServerViaNode,
  waitForHealth,
  assertNoSourceReferencesInLogs,
} from './generated-project.test-helpers.js';

let tempDir: string;
let projectDir: string;
const projectName = 'prod-api';

beforeAll(async () => {
  const init = await initializeGeneratedProject({
    projectName,
    tempDirPrefix: 'fastify-ts-prod-',
    logPrefix: '[generated-project-production]',
  });
  tempDir = init.tempDir;
  projectDir = init.projectDir;

  const { exitCode } = await runTscBuildForProject(projectDir, {
    logPrefix: '[generated-project-production]',
  });
  expect(exitCode).toBe(0);
});

afterAll(async () => {
  await cleanupGeneratedProject(tempDir);
});

describe('Generated project production build (Story 006.0) [REQ-BUILD-TSC]', () => {
  it('builds the project with tsc and outputs JS, d.ts, and sourcemaps into dist/', async () => {
    const distDir = path.join(projectDir, 'dist');
    const distIndexJs = path.join(distDir, 'src', 'index.js');
    const distIndexDts = path.join(distDir, 'src', 'index.d.ts');
    const distIndexMap = path.join(distDir, 'src', 'index.js.map');

    const distStat = await fs.stat(distDir);
    expect(distStat.isDirectory()).toBe(true);
    await expect(fs.stat(distIndexJs)).resolves.toHaveProperty('isFile');
    await expect(fs.stat(distIndexDts)).resolves.toHaveProperty('isFile');
    await expect(fs.stat(distIndexMap)).resolves.toHaveProperty('isFile');
  }, 120_000);
});

describe('Generated project production runtime smoke test (Story 006.0) [REQ-START-PRODUCTION]', () => {
  it('[REQ-START-PRODUCTION] starts compiled server from dist/src/index.js with src/ removed and responds on /health using an ephemeral port', async () => {
    // Remove the src directory to prove the production server runs purely from dist/.
    const srcDir = path.join(projectDir, 'src');
    await fs.rm(srcDir, { recursive: true, force: true });

    const { child, healthUrl, stdout } = await startCompiledServerViaNode(projectDir, {
      PORT: '0',
    });

    try {
      // 10 seconds is treated as an upper bound for a healthy response for the tiny template project,
      // aligning with the "Fast Build" / "Server Responds" expectations in Story 006.0.
      console.log(
        '[generated-project-production] waiting for health endpoint at',
        healthUrl.toString(),
      );
      const health = await waitForHealth(healthUrl, 10_000);
      console.log('[generated-project-production] received health response', health);
      expect(health.statusCode).toBe(200);
      expect(() => JSON.parse(health.body)).not.toThrow();
      expect(JSON.parse(health.body)).toEqual({ status: 'ok' });

      // Encode the "No Source References" acceptance criterion by asserting that server
      // startup logs do not reference TypeScript source files or the src/ tree.
      assertNoSourceReferencesInLogs(stdout);
    } finally {
      child.kill('SIGINT');
    }
  }, 10_000);
});

// NOTE: This node-based production start E2E is intentionally skipped by default.
// The "Generated project production runtime smoke test" above provides a fast,
// always-on verification that the compiled server can start from dist/ and
// respond on /health. You can temporarily enable this heavier E2E by changing
// `describe.skip` to `describe` in environments that tolerate longer-running tests.
describe.skip('Generated project production start via node (Story 006.0) [REQ-START-PRODUCTION]', () => {
  it('starts the compiled server from dist/src/index.js and responds on /health', async () => {
    console.log('[generated-project-production] starting production start via node test');
    const { child, healthUrl } = await startCompiledServerViaNode(projectDir, {
      PORT: '0',
    });
    console.log(
      '[generated-project-production] compiled server reported health URL',
      healthUrl.toString(),
    );

    try {
      // 10 seconds is treated as an upper bound for a healthy response for the tiny template project,
      // aligning with the "Fast Build" / "Server Responds" expectations in Story 006.0.
      console.log(
        '[generated-project-production] waiting for health endpoint at',
        healthUrl.toString(),
      );
      const health = await waitForHealth(healthUrl, 10_000);
      console.log('[generated-project-production] received health response', health);
      expect(health.statusCode).toBe(200);
      expect(() => JSON.parse(health.body)).not.toThrow();
      expect(JSON.parse(health.body)).toEqual({ status: 'ok' });
    } finally {
      child.kill('SIGINT');
    }
  }, 180_000);
});
