/**
 * Tests for dev-server test helpers.
 *
 * These tests exercise the core behaviors of waitForDevServerMessage so that
 * dev-server E2E suites have predictable, well-covered synchronization
 * primitives for log-based process readiness and timeout handling.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-INITIAL-COMPILE REQ-DEV-HOT-RELOAD
 */
import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fsPromises from 'node:fs/promises';
import os from 'node:os';

import { waitForDevServerMessage } from './dev-server.test-helpers.js';

async function createShortLivedProcess(lines: string[], delayMs: number) {
  const tmpDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'dev-server-helper-'));
  const scriptPath = path.join(tmpDir, 'tmp-dev-server-helper-script.mjs');

  await fsPromises.writeFile(
    scriptPath,
    [
      'const lines = ',
      JSON.stringify(lines),
      ';',
      'let i = 0;',
      'const interval = setInterval(() => {',
      '  if (i >= lines.length) {',
      '    clearInterval(interval);',
      '    process.exit(0);',
      '    return;',
      '  }',
      '  console.log(lines[i++]);',
      `}, ${delayMs});`,
    ].join('\n'),
    'utf8',
  );

  const child = spawn(process.execPath, [scriptPath], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';

  child.stdout?.on('data', chunk => {
    stdout += chunk.toString('utf8');
  });

  child.stderr?.on('data', chunk => {
    stderr += chunk.toString('utf8');
  });

  return {
    child,
    getStdout: () => stdout,
    getStderr: () => stderr,
    scriptPath,
    tmpDir,
  };
}

describe('dev-server test helpers (Story 003.0)', () => {
  it('[REQ-DEV-INITIAL-COMPILE] resolves when the expected message appears before timeout', async () => {
    const target = 'ready-to-serve';
    const { child, getStdout, getStderr, scriptPath, tmpDir } = await createShortLivedProcess(
      ['one', target, 'three'],
      50,
    );

    try {
      await waitForDevServerMessage(child, getStdout, getStderr, target, 5_000);
      expect(getStdout()).toContain(target);
    } finally {
      await fsPromises.rm(scriptPath, { force: true }).catch(() => {});
      await fsPromises.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
      if (!child.killed) child.kill('SIGINT');
    }
  }, 10_000);

  it('[REQ-DEV-HOT-RELOAD] rejects with a helpful error when the message never appears', async () => {
    const target = 'never-logged';
    const { child, getStdout, getStderr, scriptPath, tmpDir } = await createShortLivedProcess(
      ['alpha', 'beta'],
      200,
    );

    try {
      const promise = waitForDevServerMessage(child, getStdout, getStderr, target, 300);

      await expect(promise).rejects.toThrow(`Timed out waiting for message: "${target}".`);
    } finally {
      await fsPromises.rm(scriptPath, { force: true }).catch(() => {});
      await fsPromises.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
      if (!child.killed) child.kill('SIGINT');
    }
  }, 10_000);
});
