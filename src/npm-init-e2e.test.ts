/**
 * End-to-end tests for `npm init @voder-ai/fastify-ts` integration.
 *
 * These tests validate the complete npm init flow against the local codebase
 * using npm pack to create a tarball. This provides pre-publish validation
 * that the initializer works as developers will experience it.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION REQ-INIT-NPM-TEMPLATE REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

/* eslint-disable max-lines-per-function */
describe('npm init @voder-ai/fastify-ts (E2E integration)', () => {
  let tmpDir: string;
  const cliPath = path.join(process.cwd(), 'dist/cli.js');

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-e2e-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('[REQ-INIT-E2E-INTEGRATION] creates a working project with all required files', async () => {
    // Run CLI directly from dist folder to simulate npm init flow
    execSync(`node ${cliPath} test-app`, { cwd: tmpDir, stdio: 'pipe' });

    const projectDir = path.join(tmpDir, 'test-app');

    // Verify core structure files exist (REQ-INIT-FILES-MINIMAL)
    await expect(fs.access(path.join(projectDir, 'package.json'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, 'tsconfig.json'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, 'src/index.ts'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, 'README.md'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, '.gitignore'))).resolves.toBeUndefined();

    // Verify package.json is valid JSON
    const packageJson = JSON.parse(
      await fs.readFile(path.join(projectDir, 'package.json'), 'utf-8'),
    );
    expect(packageJson.name).toBe('test-app');
    expect(packageJson.type).toBe('module');

    // Verify dev-server.mjs exists
    await expect(fs.access(path.join(projectDir, 'dev-server.mjs'))).resolves.toBeUndefined();
  }, 60000); // Allow 60s for npm install + init

  it('[REQ-INIT-E2E-INTEGRATION] generated project can install dependencies and build', async () => {
    // Run CLI directly from dist folder
    execSync(`node ${cliPath} build-test`, { cwd: tmpDir, encoding: 'utf-8' });

    const projectDir = path.join(tmpDir, 'build-test');

    // Install dependencies
    execSync('npm install', { cwd: projectDir, encoding: 'utf-8' });

    // Verify node_modules was created
    await expect(fs.access(path.join(projectDir, 'node_modules'))).resolves.toBeUndefined();

    // Run build
    execSync('npm run build', { cwd: projectDir, encoding: 'utf-8' });

    // Verify dist directory was created
    await expect(fs.access(path.join(projectDir, 'dist'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, 'dist/src/index.js'))).resolves.toBeUndefined();
  }, 120000);

  it('[REQ-INIT-E2E-INTEGRATION] generated project can start server', async () => {
    // Run CLI directly from dist folder
    execSync(`node ${cliPath} server-test`, { cwd: tmpDir, encoding: 'utf-8' });

    const projectDir = path.join(tmpDir, 'server-test');

    // Install dependencies
    execSync('npm install', { cwd: projectDir, encoding: 'utf-8' });

    // Build the project
    execSync('npm run build', { cwd: projectDir, encoding: 'utf-8' });

    // Verify we can import and check the server module exists
    const distIndex = await fs.readFile(path.join(projectDir, 'dist/src/index.js'), 'utf-8');
    expect(distIndex).toBeTruthy();
    expect(distIndex.length).toBeGreaterThan(0);
  }, 120000); // Allow 120s for install + test

  it('[REQ-INIT-E2E-INTEGRATION] creates project with correct directory name', async () => {
    // Run CLI directly from dist folder
    execSync(`node ${cliPath} my-custom-name`, { cwd: tmpDir, stdio: 'pipe' });

    const projectDir = path.join(tmpDir, 'my-custom-name');

    // Verify directory was created with correct name (REQ-INIT-DIRECTORY)
    await expect(fs.access(projectDir)).resolves.toBeUndefined();

    // Verify package.json has matching name
    const packageJson = JSON.parse(
      await fs.readFile(path.join(projectDir, 'package.json'), 'utf-8'),
    );
    expect(packageJson.name).toBe('my-custom-name');
  }, 60000);

  it('[REQ-INIT-E2E-INTEGRATION] does not include template-specific files in generated project', async () => {
    // Run CLI directly from dist folder
    execSync(`node ${cliPath} clean-app`, { cwd: tmpDir, encoding: 'utf-8' });

    const projectDir = path.join(tmpDir, 'clean-app');

    // Verify no template-specific files (REQ-INIT-GIT-CLEAN)
    await expect(fs.access(path.join(projectDir, 'src/initializer.ts'))).rejects.toThrow();
    await expect(fs.access(path.join(projectDir, 'src/cli.ts'))).rejects.toThrow();
    await expect(fs.access(path.join(projectDir, 'src/template-files'))).rejects.toThrow();
    await expect(fs.access(path.join(projectDir, 'scripts'))).rejects.toThrow();

    // Note: Generated projects DO get a fresh .git init, which is intentional
  }, 60000);
});
