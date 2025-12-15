/**
 * Helper to run commands inside a generated project directory.
 *
 * This utility is used by end-to-end tests that validate generated
 * project behaviors (e.g., Story 004.0 test workflow).
 *
 * @supports docs/stories/004.0-DEVELOPER-TESTS-RUN.story.md REQ-TEST-ALL-PASS REQ-TEST-CLEAR-OUTPUT
 */
/* global NodeJS */
import { spawn } from 'node:child_process';
import path from 'node:path';

export interface RunCommandResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

export interface RunCommandOptions {
  env?: NodeJS.ProcessEnv;
}

export async function runCommandInProject(
  projectDir: string,
  command: string,
  args: string[],
  options?: RunCommandOptions,
): Promise<RunCommandResult> {
  const cwd = path.resolve(projectDir);

  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...(options?.env ?? {}) },
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

  const exitCode: number | null = await new Promise(resolve => {
    child.on('exit', code => {
      resolve(code);
    });
  });

  return { exitCode, stdout, stderr };
}