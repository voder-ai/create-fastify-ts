/**
 * Shared helpers for generated-project end-to-end tests.
 *
 * These utilities encapsulate the common workflow of creating a temporary
 * project using the template initializer, linking dependencies from the
 * root repository, running a TypeScript build with tsc, and starting the
 * compiled server from dist/ while waiting for the /health endpoint.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-BUILD-OUTPUT-DIST REQ-BUILD-DECLARATIONS REQ-BUILD-SOURCEMAPS REQ-BUILD-ESM REQ-START-PRODUCTION REQ-START-NO-WATCH REQ-START-PORT REQ-START-LOGS
 * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-STRUCTURED-JSON REQ-LOG-PINO-INTEGRATED REQ-LOG-AUTO-REQUEST REQ-LOG-PROD-JSON REQ-LOG-ERROR-STACKS REQ-LOG-LEVEL-CONFIG REQ-LOG-REQUEST-CONTEXT
 */
import { expect } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { initializeTemplateProject } from './initializer.js';
export { waitForHealth } from './generated-project-http-helpers.js';

const thisTestDir = path.dirname(fileURLToPath(import.meta.url));
const repoRootDir = path.resolve(thisTestDir, '..');

/**
 * Options for setting up a temporary generated project for end-to-end tests.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
 */
export interface GeneratedProjectSetupOptions {
  projectName: string;
  /** Prefix for the OS temp directory; helps distinguish different suites. */
  tempDirPrefix: string;
  /** Optional prefix for console.log diagnostics from helpers. */
  logPrefix?: string;
}

/**
 * Result describing the paths associated with an initialized generated project.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
 */
export interface GeneratedProjectSetupResult {
  /** Absolute path to the temporary directory that owns the project. */
  tempDir: string;
  /** Absolute path to the initialized project root inside tempDir. */
  projectDir: string;
}

/**
 * Link the root repository's node_modules directory into an existing
 * generated project via a junction/symlink so tests can reuse shared
 * devDependencies without running `npm install` per project.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
 */
export interface LinkNodeModulesOptions {
  /** Optional prefix for console.log diagnostics from helpers. */
  logPrefix?: string;
}

export async function linkRootNodeModulesToProject(
  projectDir: string,
  { logPrefix = '[generated-project]' }: LinkNodeModulesOptions = {},
): Promise<void> {
  const rootNodeModules = path.join(repoRootDir, 'node_modules');
  const projectNodeModules = path.join(projectDir, 'node_modules');

  await fs.symlink(rootNodeModules, projectNodeModules, 'junction');
  console.log(
    logPrefix,
    'linked node_modules from root',
    rootNodeModules,
    'to project',
    projectNodeModules,
  );
}

/**
 * Initialize a new generated project in an OS temporary directory by calling
 * {@link initializeTemplateProject}, then link the root repository's
 * node_modules directory into the new project so tests can reuse shared
 * devDependencies without running `npm install`. Returns both the temporary
 * directory path and the initialized project root path.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-START-PRODUCTION
 */
export async function initializeGeneratedProject({
  projectName,
  tempDirPrefix,
  logPrefix = '[generated-project]',
}: GeneratedProjectSetupOptions): Promise<GeneratedProjectSetupResult> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), tempDirPrefix));
  const previousCwd = process.cwd();

  try {
    process.chdir(tempDir);
    const projectDir = await initializeTemplateProject(projectName);
    console.log(logPrefix, 'initialized project at', projectDir);

    await linkRootNodeModulesToProject(projectDir, { logPrefix });

    return { tempDir, projectDir };
  } finally {
    process.chdir(previousCwd);
  }
}

/**
 * Result object describing the outcome of running a TypeScript (tsc) build.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC
 */
export interface TscBuildResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Run `tsc -p tsconfig.json` inside the generated project using the root
 * repository's TypeScript binary, capturing stdout, stderr, and the exit code
 * to help verify a successful production build to dist/.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-BUILD-OUTPUT-DIST
 */
export async function runTscBuildForProject(
  projectDir: string,
  { logPrefix = '[generated-project]' }: { logPrefix?: string } = {},
): Promise<TscBuildResult> {
  const tscPath = path.join(repoRootDir, 'node_modules', 'typescript', 'bin', 'tsc');
  console.log(logPrefix, 'starting tsc build in', projectDir);

  const buildProc = spawn(process.execPath, [tscPath, '-p', 'tsconfig.json'], {
    cwd: projectDir,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let buildStdout = '';
  let buildStderr = '';

  buildProc.stdout?.on('data', chunk => {
    buildStdout += chunk.toString();
  });

  buildProc.stderr?.on('data', chunk => {
    buildStderr += chunk.toString();
  });

  const exitCode: number | null = await new Promise(resolve => {
    buildProc.on('exit', code => {
      resolve(code);
    });
  });

  console.log(logPrefix, 'tsc build exit code', exitCode);

  return { exitCode, stdout: buildStdout, stderr: buildStderr };
}

/**
 * Remove the temporary directory that owns a generated project used in tests.
 * This helper is intentionally tolerant of missing directories to simplify
 * cleanup in error paths.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
 */
export async function cleanupGeneratedProject(tempDir: string | undefined): Promise<void> {
  if (!tempDir) return;
  await fs.rm(tempDir, { recursive: true, force: true });
}

/**
 * Structure of the result returned when starting the compiled server for
 * end-to-end tests, including the child process, derived /health URL, and
 * accumulated stdout.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION
 */
export interface StartCompiledServerResult {
  child: ChildProcess;
  healthUrl: URL;
  stdout: string;
}

/**
 * Assert that the provided stdout does not contain references to TypeScript
 * source files or src/ paths, ensuring production logs reference built
 * artifacts only.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-OUTPUT-DIST
 */
export function assertNoSourceReferencesInLogs(stdout: string): void {
  expect(stdout).not.toMatch(/\.ts\b/);
  expect(stdout).not.toMatch(/\bsrc\//);
}

/**
 * Assert that the provided stdout contains at least one structured JSON log
 * line with a "level" field, indicating JSON log output is enabled.
 *
 * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-PROD-JSON REQ-LOG-STRUCTURED-JSON
 */
export function assertHasJsonLogLine(stdout: string): void {
  const hasJsonLogLine = stdout
    .split('\n')
    .some(line => line.trim().startsWith('{') && line.includes('"level"'));
  expect(hasJsonLogLine).toBe(true);
}

/**
 * Assert that the provided stdout does not contain info-level request logs,
 * verifying that request logging at this level can be disabled via
 * configuration.
 *
 * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-LEVEL-CONFIG
 */
export function assertNoInfoLevelRequestLogs(stdout: string): void {
  expect(stdout).not.toContain('incoming request');
}

/**
 * Start the compiled server by invoking `node dist/src/index.js` in the
 * generated project, wait for it to log the listening URL, and then return
 * the spawned child process, the derived /health URL, and the accumulated
 * stdout for further assertions about startup behavior and logging.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT REQ-START-LOGS
 * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-STRUCTURED-JSON REQ-LOG-PROD-JSON
 */
export async function startCompiledServerViaNode(
  projectDir: string,
  envOverrides: Record<string, string | undefined>,
  { logPrefix = '[generated-project]' }: { logPrefix?: string } = {},
): Promise<StartCompiledServerResult> {
  const envRun: Record<string, string | undefined> = {
    ...process.env,
    ...envOverrides,
  };

  const child = spawn(process.execPath, ['dist/src/index.js'], {
    cwd: projectDir,
    env: envRun,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  console.log(logPrefix, 'spawned compiled server process with pid', child.pid);

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
      console.log(logPrefix, 'current stdout from server:', stdout);
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
