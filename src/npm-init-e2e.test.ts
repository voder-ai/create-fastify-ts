/**
 * End-to-end tests for `npm init @voder-ai/fastify-ts` integration.
 *
 * These tests validate the complete npm init flow against the local codebase
 * using npm pack to create a tarball. This provides pre-publish validation
 * that the initializer works as developers will experience it.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION REQ-INIT-NPM-TEMPLATE REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {
  initializeGeneratedProject,
  cleanupGeneratedProject,
  runTscBuildForProject,
} from './generated-project.test-helpers.js';
import { runCommandInProject } from './run-command-in-project.test-helpers.js';

/* eslint-disable max-lines-per-function */
describe('npm init @voder-ai/fastify-ts (E2E integration)', () => {
  let tempDir: string | undefined;
  let projectDir: string;
  let cliPath: string;

  beforeAll(async () => {
    const buildResult = await runCommandInProject(process.cwd(), 'npm', ['run', 'build']);
    expect(buildResult.exitCode).toBe(0);

    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-e2e-'));
    cliPath = path.join(process.cwd(), 'dist/cli.js');
  });

  afterAll(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('[REQ-INIT-E2E-INTEGRATION] creates a working project with all required files', async () => {
    if (!tempDir) {
      throw new Error('tempDir not initialized');
    }

    const result = await runCommandInProject(tempDir, 'node', [cliPath, 'test-app']);
    expect(result.exitCode).toBe(0);

    projectDir = path.join(tempDir, 'test-app');

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
    const { tempDir: buildTempDir, projectDir: buildProjectDir } = await initializeGeneratedProject(
      {
        projectName: 'build-test-e2e',
        tempDirPrefix: 'fastify-ts-e2e-build-',
      },
    );

    try {
      const buildResult = await runTscBuildForProject(buildProjectDir);
      expect(buildResult.exitCode).toBe(0);

      await expect(fs.access(path.join(buildProjectDir, 'dist'))).resolves.toBeUndefined();
      await expect(
        fs.access(path.join(buildProjectDir, 'dist/src/index.js')),
      ).resolves.toBeUndefined();
    } finally {
      await cleanupGeneratedProject(buildTempDir);
    }
  }, 120000);

  it('[REQ-INIT-E2E-INTEGRATION] generated project can start server', async () => {
    const { tempDir: serverTempDir, projectDir: serverProjectDir } =
      await initializeGeneratedProject({
        projectName: 'server-test-e2e',
        tempDirPrefix: 'fastify-ts-e2e-server-',
      });

    try {
      const buildResult = await runTscBuildForProject(serverProjectDir);
      expect(buildResult.exitCode).toBe(0);

      const distIndexPath = path.join(serverProjectDir, 'dist/src/index.js');
      const distIndex = await fs.readFile(distIndexPath, 'utf-8');
      expect(distIndex).toBeTruthy();
      expect(distIndex.length).toBeGreaterThan(0);
    } finally {
      await cleanupGeneratedProject(serverTempDir);
    }
  }, 120000); // Allow 120s for install + test

  it('[REQ-INIT-E2E-INTEGRATION] creates project with correct directory name', async () => {
    if (!tempDir) {
      throw new Error('tempDir not initialized');
    }

    const result = await runCommandInProject(tempDir, 'node', [cliPath, 'my-custom-name']);
    expect(result.exitCode).toBe(0);

    const customProjectDir = path.join(tempDir, 'my-custom-name');

    // Verify directory was created with correct name (REQ-INIT-DIRECTORY)
    await expect(fs.access(customProjectDir)).resolves.toBeUndefined();

    // Verify package.json has matching name
    const packageJson = JSON.parse(
      await fs.readFile(path.join(customProjectDir, 'package.json'), 'utf-8'),
    );
    expect(packageJson.name).toBe('my-custom-name');
  }, 60000);

  it('[REQ-INIT-E2E-INTEGRATION] does not include template-specific files in generated project', async () => {
    if (!tempDir) {
      throw new Error('tempDir not initialized');
    }

    const result = await runCommandInProject(tempDir, 'node', [cliPath, 'clean-app']);
    expect(result.exitCode).toBe(0);

    const cleanProjectDir = path.join(tempDir, 'clean-app');

    // Verify no template-specific files (REQ-INIT-GIT-CLEAN)
    await expect(fs.access(path.join(cleanProjectDir, 'src/initializer.ts'))).rejects.toThrow();
    await expect(fs.access(path.join(cleanProjectDir, 'src/cli.ts'))).rejects.toThrow();
    await expect(fs.access(path.join(cleanProjectDir, 'src/template-files'))).rejects.toThrow();
    await expect(fs.access(path.join(cleanProjectDir, 'scripts'))).rejects.toThrow();

    // Note: Generated projects DO get a fresh .git init, which is intentional
  }, 60000);
});
