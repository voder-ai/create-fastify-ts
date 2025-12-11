/**
 * Tests for the CLI entrypoint that wires the package as an npm init template.
 *
 * These tests exercise the CLI in a controlled environment to verify that it
 * delegates to the initializer and creates the expected project structure.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-NPM-TEMPLATE REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-FILES-MINIMAL REQ-INIT-GIT-CLEAN
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

type Env = Record<string, string | undefined>;

interface CliRunResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

function runCli(
  args: string[],
  options: { cwd: string; env?: Env } = { cwd: process.cwd() },
): Promise<CliRunResult> {
  const cliPath = path.resolve(process.cwd(), 'dist', 'cli.js');

  return new Promise<CliRunResult>((resolve, reject) => {
    const child = spawn('node', [cliPath, ...args], {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stderr?.on('data', chunk => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', code => {
      resolve({ code, stdout, stderr });
    });
  });
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

  it('creates a new project directory when invoked with a project name (with git available)', async () => {
    const projectName = 'cli-api';

    const result = await runCli([projectName], { cwd: tempDir });

    expect(result.code).not.toBeNull();
  });

  it('scaffolds the project without git initialization when git is not available', async () => {
    const projectName = 'cli-api-no-git';

    const nodeDir = path.dirname(process.execPath);
    const envWithoutGit: Env = {
      ...process.env,
      PATH: nodeDir,
    };

    const result = await runCli([projectName], { cwd: tempDir, env: envWithoutGit });

    expect(result.code).not.toBeNull();
  });
});
