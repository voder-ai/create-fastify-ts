/**
 * Tests for the CLI entrypoint that wires the package as an npm init template.
 *
 * These tests exercise the CLI in a controlled environment to verify that it
 * delegates to the initializer and creates the expected project structure.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-NPM-TEMPLATE REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-FILES-MINIMAL
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

describe('CLI initializer (Story 001.0)', () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-cli-'));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('creates a new project directory when invoked with a project name', async () => {
    const projectName = 'cli-api';

    await new Promise<void>((resolve, reject) => {
      const child = spawn('node', ['dist/cli.js', projectName], {
        cwd: originalCwd,
        stdio: 'ignore',
      });

      child.on('error', reject);
      child.on('exit', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`CLI exited with code ${code}`));
        }
      });
    });

    const projectDir = path.join(tempDir, projectName);
    expect(await directoryExists(projectDir)).toBe(true);
  });
});
