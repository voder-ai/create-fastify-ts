/**
 * Tests for the Fastify TypeScript project initializer.
 *
 * These tests verify that the initializer can create a new project directory
 * with a minimal but valid package.json file that satisfies the initial
 * requirements from the template-init story.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT REQ-INIT-GIT-CLEAN
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-START-FAST REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import {
  initializeTemplateProject,
  initializeTemplateProjectWithGit,
  type GitInitResult,
} from './initializer.js';

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

// eslint-disable-next-line max-lines-per-function -- Template initializer tests intentionally grouped in a single block for readability
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

      // Dev server script is wired up for story 003.0 (dev server).
      // [REQ-DEV-START-FAST]
      expect(pkg.scripts.dev).toBe('node dev-server.mjs');
      // Dev server entrypoint file exists in the scaffolded project (Story 003.0, REQ-DEV-START-FAST)
      expect(await fileExists(path.join(projectDir, 'dev-server.mjs'))).toBe(true);
    });

    it('creates tsconfig.json with basic TypeScript configuration', async () => {
      const projectName = 'my-api';
      const projectDir = await initializeTemplateProject(projectName);
      const tsconfigPath = path.join(projectDir, 'tsconfig.json');

      expect(await fileExists(tsconfigPath)).toBe(true);

      const contents = await fs.readFile(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(contents);

      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.module).toBeDefined();
      expect(tsconfig.compilerOptions.moduleResolution).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBeDefined();
      expect(tsconfig.include).toBeInstanceOf(Array);
    });

    it('creates README.md with a Next Steps section and npm install command', async () => {
      const projectName = 'my-api';
      const projectDir = await initializeTemplateProject(projectName);
      const readmePath = path.join(projectDir, 'README.md');

      expect(await fileExists(readmePath)).toBe(true);

      const contents = await fs.readFile(readmePath, 'utf8');
      expect(contents).toMatch(/Next Steps/i);
      expect(contents).toMatch(/npm install/);
    });

    it('creates .gitignore with node_modules, dist, and .env entries', async () => {
      const projectName = 'my-api';
      const projectDir = await initializeTemplateProject(projectName);
      const gitignorePath = path.join(projectDir, '.gitignore');

      expect(await fileExists(gitignorePath)).toBe(true);

      const contents = await fs.readFile(gitignorePath, 'utf8');
      expect(contents).toMatch(/node_modules\/?/);
      expect(contents).toMatch(/dist\/?/);
      expect(contents).toMatch(/\.env/);
    });
  });

  describe('[REQ-INIT-FASTIFY-HELLO] creates Fastify Hello World entrypoint', () => {
    it('creates src/index.ts with Fastify import and GET / route', async () => {
      const projectName = 'my-api';
      const projectDir = await initializeTemplateProject(projectName);
      const srcDir = path.join(projectDir, 'src');
      const indexPath = path.join(srcDir, 'index.ts');

      expect(await directoryExists(srcDir)).toBe(true);
      expect(await fileExists(indexPath)).toBe(true);

      const contents = await fs.readFile(indexPath, 'utf8');

      expect(contents).toContain("from 'fastify'");
      expect(contents).toMatch(/fastify\.get\(['"`]\//);
      expect(contents.toLowerCase()).toContain('hello world');
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

  describe('[REQ-INIT-GIT-CLEAN] initializes a standalone Git repository when git is available', () => {
    it('initializes git repo, returns matching projectDir, and scaffolds project files when git is available', async () => {
      const projectName = 'git-api';

      const { projectDir, git }: { projectDir: string; git: GitInitResult } =
        await initializeTemplateProjectWithGit(projectName);

      // git.projectDir should match projectDir from initializer
      expect(git.projectDir).toBe(projectDir);

      // Project directory exists
      expect(await directoryExists(projectDir)).toBe(true);

      // Project scaffolding still occurs
      const packageJsonPath = path.join(projectDir, 'package.json');
      const tsconfigPath = path.join(projectDir, 'tsconfig.json');
      const readmePath = path.join(projectDir, 'README.md');
      const gitignorePath = path.join(projectDir, '.gitignore');

      expect(await fileExists(packageJsonPath)).toBe(true);
      expect(await fileExists(tsconfigPath)).toBe(true);
      expect(await fileExists(readmePath)).toBe(true);
      expect(await fileExists(gitignorePath)).toBe(true);

      // When git is available, initializer should have created a .git directory
      const gitDirPath = path.join(projectDir, '.git');
      const hasGitDir = await directoryExists(gitDirPath);

      if (hasGitDir) {
        expect(git.initialized).toBe(true);
      } else {
        // In environments without git, still ensure the API is consistent
        expect(git.initialized).toBe(false);
        expect(typeof git.errorMessage).toBe('string');
      }
    });

    it('handles absence of git gracefully, keeping scaffolding and reporting failure in git result', async () => {
      const projectName = 'no-git-api';

      const originalPath = process.env.PATH;
      try {
        // Simulate absence of git by clearing PATH
        process.env.PATH = '';

        const { projectDir, git }: { projectDir: string; git: GitInitResult } =
          await initializeTemplateProjectWithGit(projectName);

        // Project directory and scaffolding still occur
        expect(await directoryExists(projectDir)).toBe(true);

        const packageJsonPath = path.join(projectDir, 'package.json');
        const tsconfigPath = path.join(projectDir, 'tsconfig.json');
        const readmePath = path.join(projectDir, 'README.md');
        const gitignorePath = path.join(projectDir, '.gitignore');

        expect(await fileExists(packageJsonPath)).toBe(true);
        expect(await fileExists(tsconfigPath)).toBe(true);
        expect(await fileExists(readmePath)).toBe(true);
        expect(await fileExists(gitignorePath)).toBe(true);

        // git initialization should report failure
        expect(git.projectDir).toBe(projectDir);
        expect(git.initialized).toBe(false);
        expect(typeof git.errorMessage).toBe('string');
        expect(git.errorMessage).not.toBe('');
      } finally {
        process.env.PATH = originalPath;
      }
    });
  });
});
