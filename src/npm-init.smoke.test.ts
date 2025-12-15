/**
 * @file npm-init-smoke.test.ts
 * @description Smoke tests for npm init flow against published package
 * @requirements REQ-INIT-E2E-SMOKE from 001.0-DEVELOPER-TEMPLATE-INIT
 *
 * These tests validate the actual `npm init @voder-ai/fastify-ts` command
 * against the published package on npm registry. They should run in CI/CD
 * after semantic-release publishes a new version.
 *
 * Unlike integration tests (npm-init-e2e.test.ts) which test local code via npm pack,
 * these smoke tests validate the real user experience with the published package.
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

/* eslint-disable max-lines-per-function */
describe('[REQ-INIT-E2E-SMOKE] npm init smoke tests (published package)', () => {
  let tmpDir: string;

  beforeEach(async () => {
    // Create temporary directory for each test
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'smoke-test-'));
  });

  afterEach(async () => {
    // Clean up temporary directory
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('[REQ-INIT-E2E-SMOKE] creates a working project from published package', async () => {
    const projectName = 'smoke-test-project';
    const projectDir = path.join(tmpDir, projectName);

    // Run npm init against specific published version
    execSync(`npm init ${PACKAGE_SPEC} ${projectName}`, {
      cwd: tmpDir,
      stdio: 'pipe',
      encoding: 'utf-8',
    });

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

    for (const file of requiredFiles) {
      const filePath = path.join(projectDir, file);
      const fileExists = await fs
        .stat(filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists, `Required file should exist: ${file}`).toBe(true);
    }

    // Verify package.json is valid JSON
    const packageJsonContent = await fs.readFile(path.join(projectDir, 'package.json'), 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    expect(packageJson.name).toBe(projectName);
  }, 60000); // 60s timeout for npm operations

  it('[REQ-INIT-E2E-SMOKE] generated project can install and build', async () => {
    const projectName = 'smoke-build-test';
    const projectDir = path.join(tmpDir, projectName);

    // Initialize project with specific version
    execSync(`npm init ${PACKAGE_SPEC} ${projectName}`, {
      cwd: tmpDir,
      stdio: 'pipe',
      encoding: 'utf-8',
    });

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
    const distExists = await fs
      .stat(distIndexPath)
      .then(() => true)
      .catch(() => false);
    expect(distExists, 'Built output should exist at dist/src/index.js').toBe(true);
  }, 120000); // 120s timeout for install + build

  it('[REQ-INIT-E2E-SMOKE] generated project can run tests', async () => {
    const projectName = 'smoke-test-runner';
    const projectDir = path.join(tmpDir, projectName);

    // Initialize project with specific version
    execSync(`npm init ${PACKAGE_SPEC} ${projectName}`, {
      cwd: tmpDir,
      stdio: 'pipe',
      encoding: 'utf-8',
    });

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
  }, 120000); // 120s timeout for install + test
});
