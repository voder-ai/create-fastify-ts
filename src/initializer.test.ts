/**
 * Tests for the Fastify TypeScript project initializer.
 *
 * These tests verify that the initializer can create a new project directory
 * with a minimal but valid package.json file that satisfies the initial
 * requirements from the template-init story.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { initializeTemplateProject } from './initializer.js';

let originalCwd: string;
let tempDir: string;

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

describe('Template initializer (Story 001.0)', () => {
  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-init-'));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    // Clean up the temporary directory recursively.
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('[REQ-INIT-DIRECTORY] creates project directory from project name', () => {
    it('creates a new directory for the project name when it does not exist', async () => {
      const projectName = 'my-api';

      const projectDir = await initializeTemplateProject(projectName);

      expect(path.basename(projectDir)).toBe(projectName);
      expect(await directoryExists(projectDir)).toBe(true);
    });
  });

  describe('[REQ-INIT-FILES-MINIMAL] writes minimal package.json file', () => {
    it('creates package.json with basic fields and dependencies for Fastify + TypeScript', async () => {
      const projectName = 'my-api';
      const projectDir = await initializeTemplateProject(projectName);
      const packageJsonPath = path.join(projectDir, 'package.json');

      expect(await fileExists(packageJsonPath)).toBe(true);

      const contents = await fs.readFile(packageJsonPath, 'utf8');
      const pkg = JSON.parse(contents);

      // Basic identity fields.
      expect(pkg.name).toBe(projectName);
      expect(pkg.version).toBe('0.0.0');
      expect(pkg.private).toBe(true);

      // ES modules configuration.
      // [REQ-INIT-ESMODULES]
      expect(pkg.type).toBe('module');

      // Placeholder scripts that will be implemented in later stories.
      // [REQ-INIT-NO-SCRIPTS-YET]
      expect(typeof pkg.scripts.dev).toBe('string');
      expect(typeof pkg.scripts.build).toBe('string');
      expect(typeof pkg.scripts.start).toBe('string');

      // Fastify runtime dependency and TypeScript dev dependency.
      // [REQ-INIT-TYPESCRIPT]
      expect(pkg.dependencies.fastify).toBeDefined();
      expect(pkg.devDependencies.typescript).toBeDefined();
    });
  });

  describe('[REQ-INIT-DIRECTORY] validates project name input', () => {
    it('throws an error when project name is an empty string', async () => {
      await expect(initializeTemplateProject('')).rejects.toBeInstanceOf(Error);
    });

    it('trims whitespace from project name before using it', async () => {
      const projectDir = await initializeTemplateProject('  spaced-name  ');
      expect(projectDir.endsWith(path.join('spaced-name'))).toBe(true);
    });
  });
});