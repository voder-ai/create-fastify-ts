/**
 * Shared helpers for dev server tests.
 *
 * These utilities provide test-only abstractions around spawning the
 * dev-server script, waiting for log messages, managing temporary
 * project directories, and simulating compiled output changes.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP REQ-DEV-TYPESCRIPT-WATCH
 */
/* global NodeJS */
import net from 'node:net';
import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisTestDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Creates a TCP server bound to a random free port, used for dev-server
 * port-collision and strict-port-behavior tests.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-STRICT
 */
export function createServerOnRandomPort(): Promise<{ server: net.Server; port: number }> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '0.0.0.0', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Unexpected address type'));
        return;
      }

      resolve({ server, port: address.port });
    });
  });
}

/**
 * Resolves the path to the dev-server script that is executed by tests.
 * This centralizes the location of the test-only dev-server entrypoint.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD
 */
function getDevServerPath(): string {
  return path.resolve(thisTestDir, 'template-files/dev-server.mjs');
}

/**
 * Spawns the dev-server Node.js process and captures stdout/stderr streams
 * for later assertions in tests.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP
 */
export function createDevServerProcess(
  env: Record<string, string | undefined>,
  options?: { cwd?: string; devServerPath?: string },
): {
  child: ChildProcess;
  getStdout: () => string;
  getStderr: () => string;
} {
  const devServerPath = options?.devServerPath ?? getDevServerPath();

  const child: ChildProcess = spawn(process.execPath, [devServerPath], {
    env: env as unknown as NodeJS.ProcessEnv,
    cwd: options?.cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';

  child.stdout?.on('data', chunk => {
    stdout += chunk.toString('utf8');
  });

  child.stderr?.on('data', chunk => {
    stderr += chunk.toString('utf8');
  });

  return {
    child,
    getStdout: () => stdout,
    getStderr: () => stderr,
  };
}

/**
 * Waits until the dev-server process emits a specific log message on stdout,
 * with a timeout, and fails early if the process exits before the message
 * appears.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-HOT-RELOAD REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-INITIAL-COMPILE
 */
export async function waitForDevServerMessage(
  child: ChildProcess,
  getStdout: () => string,
  getStderr: () => string,
  message: string,
  timeoutMs: number,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          `Timed out waiting for message: "${message}".\nStdout:\n${getStdout()}\nStderr:\n${getStderr()}`,
        ),
      );
    }, timeoutMs);

    const interval = setInterval(() => {
      if (getStdout().includes(message)) {
        globalThis.clearTimeout(timeout);
        clearInterval(interval);
        resolve();
      }
    }, 100);

    child.once('exit', (code, signal) => {
      globalThis.clearTimeout(timeout);
      clearInterval(interval);
      reject(
        new Error(
          `Dev server exited before emitting message "${message}". code=${code}, signal=${signal}\nStdout:\n${getStdout()}\nStderr:\n${getStderr()}`,
        ),
      );
    });
  });
}

/**
 * Sends SIGINT to the dev-server process and waits for it to exit,
 * asserting that it performs a clean and timely shutdown.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-GRACEFUL-STOP
 */
export async function sendSigintAndWait(
  child: ChildProcess,
  timeoutMs: number,
): Promise<{ code: number | null; signal: string | null }> {
  const exitPromise = new Promise<{ code: number | null; signal: string | null }>(resolve => {
    child.once('exit', (code, signal) => {
      resolve({ code, signal: (signal as string | null) ?? null });
    });
  });

  child.kill('SIGINT');

  const result = await Promise.race<{ code: number | null; signal: string | null } | never>([
    exitPromise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Dev server did not exit within timeout after SIGINT'));
      }, timeoutMs);
    }),
  ]);

  return result as { code: number | null; signal: string | null };
}

/**
 * Scaffolds a minimal temporary project directory containing a package.json
 * and a copied dev-server script, used for end-to-end runtime dev-server tests.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP
 */
export async function createMinimalProjectDir(): Promise<{
  projectDir: string;
  devServerPath: string;
}> {
  const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dev-server-project-'));

  const pkgJsonPath = path.join(projectDir, 'package.json');
  await fs.writeFile(
    pkgJsonPath,
    JSON.stringify(
      {
        name: 'dev-server-project-test',
        version: '1.0.0',
        main: 'dist/src/index.js',
      },
      null,
      2,
    ),
    'utf8',
  );

  const sourceDevServerPath = getDevServerPath();
  const devServerPath = path.join(projectDir, 'dev-server.mjs');
  await fs.copyFile(sourceDevServerPath, devServerPath);

  return { projectDir, devServerPath };
}

/**
 * Creates a fake project that includes a compiled `dist/src/index.js`
 * HTTP server, allowing hot-reload behavior to be tested without running
 * a TypeScript compiler in watch mode.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-HOT-RELOAD
 */
export async function createFakeProjectForHotReload(): Promise<{
  projectDir: string;
  indexJsPath: string;
  devServerPath: string;
}> {
  const { projectDir, devServerPath } = await createMinimalProjectDir();

  const distDir = path.join(projectDir, 'dist', 'src');
  await fs.mkdir(distDir, { recursive: true });

  const indexJsPath = path.join(distDir, 'index.js');
  await fs.writeFile(
    indexJsPath,
    [
      "import http from 'node:http';",
      '',
      'const server = http.createServer((req, res) => {',
      '  res.statusCode = 200;',
      "  res.setHeader('Content-Type', 'text/plain');",
      "  res.end('ok');",
      '});',
      '',
      'const port = process.env.PORT || 0;',
      'server.listen(port, () => {',
      "  console.log('fake compiled server listening on', port);",
      '});',
    ].join('\n'),
    'utf8',
  );

  return { projectDir, indexJsPath, devServerPath };
}
