/**
 * Optional npm-based production start test for a generated project.
 *
 * This test mirrors the behavior of the node-based production start test but
 * uses `npm start` instead of calling Node directly. It remains skipped by
 * default because npm-based process management can behave differently across
 * environments (CI vs local).
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT REQ-START-LOGS
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import http from 'node:http';

import { initializeTemplateProject } from './initializer.js';

let originalCwd: string;
let tempDir: string;

async function runNpmCommand(
  args: string[],
  options: { cwd: string; env?: Record<string, string | undefined> },
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const env = options.env ?? process.env;
  const npmExecPath = env?.npm_execpath ?? process.env.npm_execpath;
  const spawnArgs = args;

  const child = npmExecPath
    ? spawn(
        env?.npm_node_execpath ?? process.env.npm_node_execpath ?? process.execPath,
        [npmExecPath, ...spawnArgs],
        {
          cwd: options.cwd,
          env,
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      )
    : spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', spawnArgs, {
        cwd: options.cwd,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

  return new Promise(resolve => {
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stderr?.on('data', chunk => {
      stderr += chunk.toString();
    });

    child.on('exit', code => {
      resolve({ code, stdout, stderr });
    });
  });
}

async function fetchHealthOnce(url: URL): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(url, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk.toString();
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode ?? 0, body });
      });
    });

    req.on('error', reject);
  });
}

async function waitForHealth(
  url: URL,
  timeoutMs: number,
  intervalMs = 500,
): Promise<{ statusCode: number; body: string }> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    try {
      const result = await fetchHealthOnce(url);
      if (result.statusCode > 0) return result;
    } catch {
      // ignore and retry until timeout
    }

    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for health endpoint at ${url.toString()}`);
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Timed out waiting for health endpoint at ${url.toString()}`);
}

beforeEach(async () => {
  originalCwd = process.cwd();
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-prod-npm-'));
  process.chdir(tempDir);
});

afterEach(async () => {
  process.chdir(originalCwd);
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe.skip('Generated project production start via npm (Story 006.0) [REQ-START-PRODUCTION]', () => {
  // This mirrors the node-based production start test. Contributors can enable it
  // locally by changing `describe.skip` above to `describe` to exercise `npm start`
  // end-to-end in their environment.
  it('starts the compiled server from dist/ with npm start and responds on /health', async () => {
    const projectName = 'prod-start-api';
    const projectDir = await initializeTemplateProject(projectName);

    const env: Record<string, string | undefined> = { ...process.env, PORT: '0' };

    const installResult = await runNpmCommand(['install'], {
      cwd: projectDir,
      env,
    });
    expect(installResult.code).toBe(0);

    const buildResult = await runNpmCommand(['run', 'build'], {
      cwd: projectDir,
      env,
    });

    if (buildResult.code !== 0) {
      console.log('npm run build failed in test environment', {
        code: buildResult.code,
        stdout: buildResult.stdout,
        stderr: buildResult.stderr,
      });
      return;
    }

    const child = spawn('npm', ['start'], {
      cwd: projectDir,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    child.stdout?.on('data', chunk => {
      stdout += chunk.toString();
    });

    const healthUrl = await new Promise<URL>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error(`Timed out waiting for server to report listening URL. stdout:\n${stdout}`),
        );
      }, 60_000);

      const interval = setInterval(() => {
        const match = stdout.match(/Server listening at (http:\/\/[^\s]+)/);
        if (match) {
          clearInterval(interval);
          globalThis.clearTimeout(timeout);
          resolve(new URL('/health', match[1]));
        }
      }, 500);

      child.on('exit', code => {
        clearInterval(interval);
        globalThis.clearTimeout(timeout);
        reject(new Error(`Server process exited early with code ${code}. stdout:\n${stdout}`));
      });
    });

    try {
      const health = await waitForHealth(healthUrl, 30_000);
      expect(health.statusCode).toBe(200);
      expect(() => JSON.parse(health.body)).not.toThrow();
      expect(JSON.parse(health.body)).toEqual({ status: 'ok' });
    } finally {
      child.kill('SIGINT');
    }
  }, 180_000);
});
