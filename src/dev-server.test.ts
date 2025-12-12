/**
 * Tests for the dev server launcher used in initialized projects.
 *
 * These tests cover both the port resolution behavior (auto-discovery and
 * strict PORT semantics) and the dev-server runtime behavior (test-mode
 * TypeScript watcher skip and hot-reload of the compiled server).
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP REQ-DEV-TYPESCRIPT-WATCH
 */
import { describe, it, expect } from 'vitest';
import {
  createServerOnRandomPort,
  createDevServerProcess,
  waitForDevServerMessage,
  sendSigintAndWait,
  createMinimalProjectDir,
  createFakeProjectForHotReload,
} from './dev-server.test-helpers.js';

describe('Dev server port resolution (Story 003.0)', () => {
  it('auto-discovers a free port starting at the default when PORT is not set [REQ-DEV-PORT-AUTO]', async () => {
    const env: Record<string, string> = {};
    const { resolveDevServerPort } = await import('./template-files/dev-server.mjs');

    const { port, mode } = await resolveDevServerPort(env);

    expect(mode).toBe('auto');
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThanOrEqual(65535);
    expect(env.PORT).toBe(String(port));
  });

  it('uses the explicit PORT value when available and free [REQ-DEV-PORT-STRICT]', async () => {
    const env: Record<string, string> = { PORT: '41234' };
    const { resolveDevServerPort } = await import('./template-files/dev-server.mjs');

    const { port, mode } = await resolveDevServerPort(env);

    expect(mode).toBe('strict');
    expect(port).toBe(41234);
    expect(env.PORT).toBe('41234');
  });

  it('throws a DevServerError when PORT is invalid [REQ-DEV-PORT-STRICT]', async () => {
    const env: Record<string, string> = { PORT: 'not-a-number' };
    const { resolveDevServerPort, DevServerError } =
      await import('./template-files/dev-server.mjs');

    await expect(resolveDevServerPort(env)).rejects.toBeInstanceOf(DevServerError);
  });

  it('throws a DevServerError when the requested PORT is already in use [REQ-DEV-PORT-STRICT]', async () => {
    const { server, port } = await createServerOnRandomPort();

    try {
      const env: Record<string, string> = { PORT: String(port) };
      const { resolveDevServerPort, DevServerError } =
        await import('./template-files/dev-server.mjs');

      await expect(resolveDevServerPort(env)).rejects.toBeInstanceOf(DevServerError);
    } finally {
      server.close();
    }
  });
});

describe('Dev server runtime behavior (Story 003.0)', () => {
  it('honors DEV_SERVER_SKIP_TSC_WATCH in test mode and keeps process running until SIGINT [REQ-DEV-TYPESCRIPT-WATCH] [REQ-DEV-GRACEFUL-STOP]', async () => {
    const { projectDir, devServerPath } = await createMinimalProjectDir();

    const env: Record<string, string | undefined> = {
      ...process.env,
      NODE_ENV: 'test',
      DEV_SERVER_SKIP_TSC_WATCH: '1',
      PORT: '41235',
    };

    const { child, getStdout, getStderr } = createDevServerProcess(env, {
      cwd: projectDir,
      devServerPath,
    });

    try {
      const targetLine = 'DEV_SERVER_SKIP_TSC_WATCH=1, skipping TypeScript watcher (test mode).';

      await waitForDevServerMessage(child, getStdout, getStderr, targetLine, 15_000);

      // At this point, the process should still be running
      expect(child.killed).toBe(false);

      const { code, signal } = await sendSigintAndWait(child, 10_000);

      expect(signal === 'SIGINT' || code === 0).toBe(true);
    } finally {
      const { rm } = await import('node:fs/promises');
      await rm(projectDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it('restarts the compiled server on dist changes (hot-reload watcher) [REQ-DEV-HOT-RELOAD] [REQ-DEV-GRACEFUL-STOP]', async () => {
    const { projectDir, indexJsPath, devServerPath } = await createFakeProjectForHotReload();

    try {
      const env: Record<string, string | undefined> = {
        ...process.env,
        NODE_ENV: 'test',
        DEV_SERVER_SKIP_TSC_WATCH: '1',
        PORT: '41236',
      };

      const { child, getStdout, getStderr } = createDevServerProcess(env, {
        cwd: projectDir,
        devServerPath,
      });

      const launchMessage = 'dev-server: launching Fastify server from dist/src/index.js...';
      const hotReloadMessage =
        'dev-server: detected change in compiled output, restarting server...';

      // Wait for initial launch
      await waitForDevServerMessage(child, getStdout, getStderr, launchMessage, 20_000);

      const { appendFile, rm } = await import('node:fs/promises');

      // Modify compiled output to trigger watcher
      await appendFile(indexJsPath, '\n// hot reload trigger\n', 'utf8');

      // Wait for hot-reload log
      await waitForDevServerMessage(child, getStdout, getStderr, hotReloadMessage, 20_000);

      const { code, signal } = await sendSigintAndWait(child, 10_000);

      expect(signal === 'SIGINT' || code === 0).toBe(true);
      expect(getStdout()).toContain(hotReloadMessage);

      await rm(projectDir, { recursive: true, force: true }).catch(() => {});
    } catch (error) {
      const { rm } = await import('node:fs/promises');
      await rm(projectDir, { recursive: true, force: true }).catch(() => {});
      throw error;
    }
  });
});
