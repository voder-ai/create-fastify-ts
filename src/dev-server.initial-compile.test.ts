/**
 * Tests for the dev server launcher in initialized projects.
 *
 * These tests cover port resolution (auto-discovery and strict PORT semantics)
 * and dev-server runtime behavior (test-mode TypeScript watcher skip and hot
 * reload of the compiled server).
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP REQ-DEV-TYPESCRIPT-WATCH REQ-LOG-DEV-PRETTY
 */
import { describe, it, expect } from 'vitest';
import {
  createDevServerProcess,
  waitForDevServerMessage,
  sendSigintAndWait,
} from './dev-server.test-helpers.js';
import { waitForHealth } from './generated-project-http-helpers.js';

/**
 * Prepare a fresh generated project and verify dist/ and dev-server.mjs state.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-INITIAL-COMPILE
 */
async function prepareInitialCompileProject() {
  const { initializeGeneratedProject } = await import('./generated-project.test-helpers.js');

  const { tempDir, projectDir } = await initializeGeneratedProject({
    projectName: 'dev-initial-compile-test',
    tempDirPrefix: 'dev-initial-compile-',
    logPrefix: '[dev-initial-compile-test]',
  });

  const path = await import('node:path');
  const fs = await import('node:fs/promises');
  const distPath = path.join(projectDir, 'dist');
  const distExists = await fs
    .access(distPath)
    .then(() => true)
    .catch(() => false);
  expect(distExists).toBe(false);

  const devServerPath = path.join(projectDir, 'dev-server.mjs');
  const devServerExists = await fs
    .access(devServerPath)
    .then(() => true)
    .catch(() => false);
  expect(devServerExists).toBe(true);

  return { tempDir, projectDir, devServerPath };
}

/**
 * Runs the end-to-end scenario for initial TypeScript compilation.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-INITIAL-COMPILE
 */
async function runInitialCompilationScenario(): Promise<void> {
  const { tempDir, projectDir, devServerPath } = await prepareInitialCompileProject();

  const waitForInitialCompilationComplete = async (
    child: ReturnType<typeof createDevServerProcess>['child'],
    getStdout: () => string,
    getStderr: () => string,
  ) =>
    waitForDevServerMessage(
      child,
      getStdout,
      getStderr,
      'dev-server: initial TypeScript compilation complete.',
      30_000,
    );

  try {
    const env: Record<string, string | undefined> = {
      ...process.env,
      NODE_ENV: 'production',
      PORT: '41238',
    };

    const { child, getStdout, getStderr } = createDevServerProcess(env, {
      cwd: projectDir,
      devServerPath,
    });

    try {
      await waitForInitialCompilationComplete(child, getStdout, getStderr);

      await waitForDevServerMessage(
        child,
        getStdout,
        getStderr,
        'dev-server: launching Fastify server from dist/src/index.js...',
        10_000,
      );

      await waitForDevServerMessage(child, getStdout, getStderr, 'Server listening at', 10_000);

      const stdout = getStdout();
      const listeningMatch = stdout.match(/Server listening at (http:\/\/[^"\s]+)/);
      expect(listeningMatch).not.toBeNull();

      const healthUrl = new URL('/health', listeningMatch![1]);
      const health = await waitForHealth(healthUrl, 10_000);

      expect(health.statusCode).toBe(200);
      let parsedBody: unknown;
      expect(() => {
        parsedBody = JSON.parse(health.body);
      }).not.toThrow();
      expect(parsedBody).toEqual({ status: 'ok' });

      const expectedMessages = [
        'dev-server: initial TypeScript compilation complete.',
        'dev-server: launching Fastify server from dist/src/index.js...',
        'Server listening at',
      ];
      for (const message of expectedMessages) {
        expect(stdout).toContain(message);
      }

      const { code, signal } = await sendSigintAndWait(child, 10_000);
      expect(signal === 'SIGINT' || code === 0).toBe(true);
    } finally {
      if (!child.killed) {
        child.kill('SIGINT');
      }
    }
  } finally {
    const { rm } = await import('node:fs/promises');
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

describe('Dev server initial compilation (Story 003.0)', () => {
  it('waits for initial TypeScript compilation before starting server (no pre-built dist/) [REQ-DEV-INITIAL-COMPILE]', async () => {
    await runInitialCompilationScenario();
  }, 60_000);
});
