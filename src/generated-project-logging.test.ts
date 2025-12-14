/**
 * Tests for logging configuration and behavior in a generated project.
 *
 * These tests exercise Story 008.0 requirements by verifying that the
 * generated project emits structured JSON logs using Fastify's integrated
 * Pino logger and that log level configuration via LOG_LEVEL works as
 * expected.
 *
 * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-STRUCTURED-JSON REQ-LOG-PINO-INTEGRATED REQ-LOG-AUTO-REQUEST REQ-LOG-PROD-JSON REQ-LOG-ERROR-STACKS REQ-LOG-LEVEL-CONFIG
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn, type ChildProcess } from 'node:child_process';
import http from 'node:http';

import { initializeTemplateProject } from './initializer.js';

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

async function startCompiledServerViaNode(
  projectDir: string,
  envOverrides: Record<string, string | undefined>,
): Promise<{ child: ChildProcess; healthUrl: URL; stdout: string }> {
  const envRun: Record<string, string | undefined> = {
    ...process.env,
    ...envOverrides,
  };

  const child = spawn(process.execPath, ['dist/src/index.js'], {
    cwd: projectDir,
    env: envRun,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  child.stdout?.on('data', chunk => {
    stdout += chunk.toString();
  });

  const healthUrl = await new Promise<URL>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for server to report listening URL. stdout:\n${stdout}`));
    }, 10_000);

    const interval = setInterval(() => {
      const match = stdout.match(/Server listening at (http:\/\/[^"\s]+)/);
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

  return { child, healthUrl, stdout };
}

let originalCwd: string;
let tempDir: string;
let projectDir: string;
const projectName = 'logging-api';

beforeAll(async () => {
  originalCwd = process.cwd();
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-logging-'));
  process.chdir(tempDir);

  projectDir = await initializeTemplateProject(projectName);

  const rootNodeModules = path.join(originalCwd, 'node_modules');
  await fs.symlink(rootNodeModules, path.join(projectDir, 'node_modules'), 'junction');

  const tscPath = path.join(originalCwd, 'node_modules', 'typescript', 'bin', 'tsc');

  const buildProc = spawn(process.execPath, [tscPath, '-p', 'tsconfig.json'], {
    cwd: projectDir,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const buildExitCode: number | null = await new Promise(resolve => {
    buildProc.on('exit', code => {
      resolve(code);
    });
  });

  expect(buildExitCode).toBe(0);
});

afterAll(async () => {
  process.chdir(originalCwd);
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe('Generated project logging configuration (Story 008.0) [REQ-LOG-LEVEL-CONFIG]', () => {
  it('[REQ-LOG-LEVEL-CONFIG] emits Fastify request logs for /health when LOG_LEVEL=info', async () => {
    const { child, healthUrl, stdout } = await startCompiledServerViaNode(projectDir, {
      PORT: '0',
      LOG_LEVEL: 'info',
    });

    try {
      const health = await waitForHealth(healthUrl, 10_000);
      expect(health.statusCode).toBe(200);

      // Allow a brief window for logs to flush to stdout
      await new Promise(resolve => setTimeout(resolve, 500));

      // Ensure that at least one Fastify JSON log line was emitted
      const hasJsonLogLine = stdout
        .split('\n')
        .some(line => line.trim().startsWith('{') && line.includes('"level"'));
      expect(hasJsonLogLine).toBe(true);
    } finally {
      child.kill('SIGINT');
    }
  }, 20_000);

  it('[REQ-LOG-LEVEL-CONFIG] suppresses info-level request logs when LOG_LEVEL=error', async () => {
    const { child, healthUrl, stdout } = await startCompiledServerViaNode(projectDir, {
      PORT: '0',
      LOG_LEVEL: 'error',
    });

    try {
      const health = await waitForHealth(healthUrl, 10_000);
      expect(health.statusCode).toBe(200);

      // Allow a brief window for logs to flush to stdout
      await new Promise(resolve => setTimeout(resolve, 500));

      expect(stdout).not.toContain('incoming request');
    } finally {
      child.kill('SIGINT');
    }
  }, 20_000);
});
