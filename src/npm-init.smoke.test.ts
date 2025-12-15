/**
 * @file npm-init-smoke.test.ts
 * @description Smoke tests for npm init flow against published package
 *
 * These tests validate the actual `npm init @voder-ai/fastify-ts` command
 * against the published package on npm registry. They should run in CI/CD
 * after semantic-release publishes a new version.
 *
 * Unlike integration tests (npm-init-e2e.test.ts) which test local code via npm pack,
 * these smoke tests validate the real user experience with the published package.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-SMOKE
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

// Get the published version from environment (set by CI/CD)
const PUBLISHED_VERSION = process.env.PUBLISHED_VERSION;
if (!PUBLISHED_VERSION) {
  throw new Error('PUBLISHED_VERSION environment variable must be set for smoke tests');
}

// Construct the versioned package specifier
const PACKAGE_SPEC = `@voder-ai/fastify-ts@${PUBLISHED_VERSION}`;

let tmpDir: string;

async function createTempDir(): Promise<void> {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'smoke-test-'));
}

async function cleanupTempDir(): Promise<void> {
  if (tmpDir) {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

function runNpmInitInTempDir(projectName: string): string {
  const projectDir = path.join(tmpDir, projectName);

  // Run npm init against specific published version
  execSync(`npm init ${PACKAGE_SPEC} ${projectName}`, {
    cwd: tmpDir,
    stdio: 'pipe',
    encoding: 'utf-8',
  });

  return projectDir;
}

async function pathExists(filePath: string): Promise<boolean> {
  return fs
    .stat(filePath)
    .then(() => true)
    .catch(() => false);
}

async function assertRequiredFilesExist(projectDir: string, files: string[]): Promise<void> {
  for (const file of files) {
    const filePath = path.join(projectDir, file);
    const exists = await pathExists(filePath);
    expect(exists, `Required file should exist: ${file}`).toBe(true);
  }
}

async function createsWorkingProjectFromPublishedPackage(): Promise<void> {
  const projectName = 'smoke-test-project';
  const projectDir = runNpmInitInTempDir(projectName);

  // Verify project directory exists
  const stats = await fs.stat(projectDir);
  expect(stats.isDirectory()).toBe(true);

  // Verify required files exist
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'src/index.ts',
    'README.md',
    '.gitignore',
    'dev-server.mjs',
  ];

  await assertRequiredFilesExist(projectDir, requiredFiles);

  // Verify package.json is valid JSON
  const packageJsonContent = await fs.readFile(path.join(projectDir, 'package.json'), 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  expect(packageJson.name).toBe(projectName);
}

async function generatedProjectCanInstallAndBuild(): Promise<void> {
  const projectName = 'smoke-build-test';
  const projectDir = runNpmInitInTempDir(projectName);

  // Install dependencies
  execSync('npm install', {
    cwd: projectDir,
    stdio: 'pipe',
    encoding: 'utf-8',
  });

  // Run build
  execSync('npm run build', {
    cwd: projectDir,
    stdio: 'pipe',
    encoding: 'utf-8',
  });

  // Verify dist directory exists with compiled output
  const distIndexPath = path.join(projectDir, 'dist/src/index.js');
  const distExists = await pathExists(distIndexPath);
  expect(distExists, 'Built output should exist at dist/src/index.js').toBe(true);
}

async function generatedProjectCanRunTests(): Promise<void> {
  const projectName = 'smoke-test-runner';
  const projectDir = runNpmInitInTempDir(projectName);

  // Install dependencies
  execSync('npm install', {
    cwd: projectDir,
    stdio: 'pipe',
    encoding: 'utf-8',
  });

  // Run tests - should pass without errors
  const output = execSync('npm test', {
    cwd: projectDir,
    stdio: 'pipe',
    encoding: 'utf-8',
  });

  // Verify test output indicates success
  expect(output).toContain('Test Files');
  expect(output).toContain('passed');
}

describe('[REQ-INIT-E2E-SMOKE] npm init smoke tests (published package)', () => {
  beforeEach(createTempDir);
  afterEach(cleanupTempDir);

  it(
    '[REQ-INIT-E2E-SMOKE] creates a working project from published package',
    createsWorkingProjectFromPublishedPackage,
    60_000,
  );

  it(
    '[REQ-INIT-E2E-SMOKE] generated project can install and build',
    generatedProjectCanInstallAndBuild,
    120_000,
  );

  it('[REQ-INIT-E2E-SMOKE] generated project can run tests', generatedProjectCanRunTests, 120_000);
});
