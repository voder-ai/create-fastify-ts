/**
 * Tests for security headers in a generated project.
 *
 * These tests exercise Story 005.0 requirements by scaffolding a new project,
 * running a TypeScript build with tsc, starting the compiled server from dist/,
 * and asserting that HTTP responses include security headers configured by
 * @fastify/helmet.
 *
 * @supports docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md REQ-SEC-HEADERS-TEST REQ-SEC-HEADERS-PRESENT REQ-SEC-HELMET-DEFAULT
 */
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  initializeGeneratedProject,
  runTscBuildForProject,
  cleanupGeneratedProject,
  startCompiledServerViaNode,
} from './generated-project.test-helpers.js';

let tempDir: string | undefined;
let projectDir: string;
const projectName = 'security-api';

interface HealthResponse {
  statusCode: number;
  body: string;
  headers: http.IncomingHttpHeaders;
}

async function fetchHealthWithHeaders(url: URL): Promise<HealthResponse> {
  return new Promise((resolve, reject) => {
    const req = http.get(url, res => {
      const { headers, statusCode = 0 } = res;
      let body = '';

      res.on('data', chunk => {
        body += chunk.toString();
      });

      res.on('end', () => {
        resolve({ statusCode, body, headers });
      });
    });

    req.on('error', reject);
  });
}

beforeAll(async () => {
  const init = await initializeGeneratedProject({
    projectName,
    tempDirPrefix: 'fastify-ts-security-',
    logPrefix: '[generated-project-security-headers]',
  });
  tempDir = init.tempDir;
  projectDir = init.projectDir;

  const { exitCode } = await runTscBuildForProject(projectDir, {
    logPrefix: '[generated-project-security-headers]',
  });
  expect(exitCode).toBe(0);

  // Ensure we are running purely from the compiled output, matching production usage.
  const srcDir = path.join(projectDir, 'src');
  await fs.rm(srcDir, { recursive: true, force: true });
});

afterAll(async () => {
  await cleanupGeneratedProject(tempDir);
});

describe('Generated project security headers (Story 005.0) [REQ-SEC-HEADERS-TEST]', () => {
  it('[REQ-SEC-HEADERS-TEST] responds on /health with Helmet security headers set', async () => {
    const { child, healthUrl } = await startCompiledServerViaNode(projectDir, {
      PORT: '0',
    });

    try {
      const health = await fetchHealthWithHeaders(healthUrl);

      expect(health.statusCode).toBe(200);
      expect(() => JSON.parse(health.body)).not.toThrow();
      expect(JSON.parse(health.body)).toEqual({ status: 'ok' });

      const headerNames = Object.keys(health.headers).map(name => name.toLowerCase());

      // Representative subset of security headers that @fastify/helmet is expected to set
      // for HTTP responses. We intentionally avoid asserting Strict-Transport-Security here
      // because HSTS is only applicable over HTTPS.
      const expectedHelmetHeaders = [
        'x-dns-prefetch-control',
        'x-frame-options',
        'x-download-options',
        'x-content-type-options',
        'x-permitted-cross-domain-policies',
        'referrer-policy',
      ];

      for (const headerName of expectedHelmetHeaders) {
        expect(headerNames).toContain(headerName);
      }
    } finally {
      child.kill('SIGINT');
    }
  }, 60_000);
});
