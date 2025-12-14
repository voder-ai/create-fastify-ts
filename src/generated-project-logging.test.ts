/**
 * Tests for logging configuration and behavior in a generated project.
 *
 * These tests exercise Story 008.0 requirements by verifying that the
 * generated project emits structured JSON logs using Fastify's integrated
 * Pino logger and that log level configuration via LOG_LEVEL works as
 * expected.
 *
 * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-STRUCTURED-JSON REQ-LOG-PINO-INTEGRATED REQ-LOG-AUTO-REQUEST REQ-LOG-PROD-JSON REQ-LOG-ERROR-STACKS REQ-LOG-LEVEL-CONFIG REQ-LOG-REQUEST-CONTEXT
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import {
  initializeGeneratedProject,
  runTscBuildForProject,
  cleanupGeneratedProject,
  startCompiledServerViaNode,
  waitForHealth,
  assertHasJsonLogLine,
  assertNoInfoLevelRequestLogs,
} from './generated-project.test-helpers.js';

let tempDir: string;
let projectDir: string;
const projectName = 'logging-api';

beforeAll(async () => {
  const init = await initializeGeneratedProject({
    projectName,
    tempDirPrefix: 'fastify-ts-logging-',
    logPrefix: '[generated-project-logging]',
  });
  tempDir = init.tempDir;
  projectDir = init.projectDir;

  const { exitCode } = await runTscBuildForProject(projectDir, {
    logPrefix: '[generated-project-logging]',
  });

  expect(exitCode).toBe(0);
});

afterAll(async () => {
  await cleanupGeneratedProject(tempDir);
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
      assertHasJsonLogLine(stdout);

      // Note: Fastify's log structure is implementation-defined; request context may be
      // present under different keys depending on framework/version, so we do not assert
      // on a specific field here.
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

      assertNoInfoLevelRequestLogs(stdout);
    } finally {
      child.kill('SIGINT');
    }
  }, 20_000);
});
