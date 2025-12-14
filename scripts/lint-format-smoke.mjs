/**
 * Lint and format auto-fix smoke test.
 * Creates a temporary mini-project that reuses this repo's ESLint and Prettier
 * configuration and asserts that the `lint:fix` and `format` commands run
 * successfully and can fix deliberately misformatted code.
 *
 * @supports docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md REQ-LINT-FIX REQ-FORMAT-WRITE REQ-QUALITY-CONSISTENT
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

async function main() {
  const rootDir = process.cwd();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lint-format-smoke-'));
  const sampleFile = path.join(tmpDir, 'sample.js');

  try {
    const nodeExec = process.execPath;
    const eslintCli = path.join(rootDir, 'node_modules', 'eslint', 'bin', 'eslint.js');
    const prettierCli = path.join(rootDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs');

    try {
      await fs.access(eslintCli);
    } catch {
      throw new Error(
        `ESLint CLI not found at ${eslintCli}. Make sure eslint is installed in this repository.`,
      );
    }

    try {
      await fs.access(prettierCli);
    } catch {
      throw new Error(
        `Prettier CLI not found at ${prettierCli}. Make sure prettier is installed in this repository.`,
      );
    }

    const pkgJson = {
      name: 'lint-format-smoke',
      version: '0.0.0',
      type: 'module',
      scripts: {
        'lint:fix': `"${nodeExec}" "${eslintCli}" . --fix`,
        format: `"${nodeExec}" "${prettierCli}" --write .`,
      },
    };

    await fs.writeFile(
      path.join(tmpDir, 'package.json'),
      `${JSON.stringify(pkgJson, null, 2)}\n`,
      'utf8',
    );

    await fs.writeFile(
      path.join(tmpDir, 'eslint.config.js'),
      "export default [{ languageOptions: { ecmaVersion: 2024, sourceType: 'module' }, rules: { 'no-extra-semi': 'error' } }];\n",
      'utf8',
    );

    await fs.copyFile(
      path.join(rootDir, '.prettierrc.json'),
      path.join(tmpDir, '.prettierrc.json'),
    );

    const beforeContent = 'const  answer = 42;;\n';
    await fs.writeFile(sampleFile, beforeContent, 'utf8');

    const env = {
      ...process.env,
      PATH: `${path.join(rootDir, 'node_modules', '.bin')}${path.delimiter}${
        process.env.PATH || ''
      }`,
      NODE_PATH: `${path.join(rootDir, 'node_modules')}${path.delimiter}${
        process.env.NODE_PATH || ''
      }`,
    };

    const eslintResult = spawnSync('npm', ['run', 'lint:fix'], {
      cwd: tmpDir,
      env,
      encoding: 'utf8',
      stdio: 'pipe',
    });

    if (eslintResult.status !== 0) {
      console.error('lint:fix smoke test failed');
      process.stdout.write(eslintResult.stdout || '');
      process.stderr.write(eslintResult.stderr || '');
      process.exit(eslintResult.status ?? 1);
    }

    const afterLint = await fs.readFile(sampleFile, 'utf8');

    if (afterLint === beforeContent) {
      console.error('lint:fix smoke test did not change the deliberately misformatted sample file');
      process.exit(1);
    }

    const prettierResult = spawnSync('npm', ['run', 'format'], {
      cwd: tmpDir,
      env,
      encoding: 'utf8',
      stdio: 'pipe',
    });

    if (prettierResult.status !== 0) {
      console.error('format smoke test failed');
      process.stdout.write(prettierResult.stdout || '');
      process.stderr.write(prettierResult.stderr || '');
      process.exit(prettierResult.status ?? 1);
    }

    const afterFormat = await fs.readFile(sampleFile, 'utf8');

    if (afterFormat === afterLint) {
      console.error('format smoke test did not change the sample file after linting');
      process.exit(1);
    }

    // idempotence: running format again should not change the file
    const prettierSecond = spawnSync('npm', ['run', 'format'], {
      cwd: tmpDir,
      env,
      encoding: 'utf8',
      stdio: 'pipe',
    });

    if (prettierSecond.status !== 0) {
      console.error('second format run in smoke test failed');
      process.stdout.write(prettierSecond.stdout || '');
      process.stderr.write(prettierSecond.stderr || '');
      process.exit(prettierSecond.status ?? 1);
    }

    const afterSecondFormat = await fs.readFile(sampleFile, 'utf8');

    if (afterSecondFormat !== afterFormat) {
      console.error('format smoke test is not idempotent between runs');
      process.exit(1);
    }

    console.log('Lint/format auto-fix smoke test passed');
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
