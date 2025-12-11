/**
 * Development server entrypoint for initialized Fastify + TypeScript projects.
 *
 * This script is copied into new projects as dev-server.mjs and is invoked
 * via the `npm run dev` script to provide a fast, opinionated dev workflow.
 *
 * Responsibilities:
 * - Ensure dependencies are installed and TypeScript is present
 * - Run the TypeScript compiler in watch mode for rapid feedback
 * - Start the compiled Fastify server from dist/src/index.js
 * - Implement port auto-discovery and strict PORT semantics
 * - Provide clear, concise console output for developers
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-START-FAST REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PORT = 3000;
const HOST = '0.0.0.0';

/**
 * Structured error type for dev server failures.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS
 */
export class DevServerError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'DevServerError';
  }
}

/**
 * Resolve the project root directory for the initialized project.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-START-FAST
 * @returns {string} Absolute path to the project root.
 */
function getProjectRoot() {
  const thisFilePath = fileURLToPath(import.meta.url);
  return path.dirname(thisFilePath);
}

/**
 * Check that package.json exists in the project root.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-START-FAST
 */
async function assertPackageJsonExists(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  try {
    await fs.access(packageJsonPath);
  } catch {
    console.error(
      'dev-server: package.json not found. Did you run this from an initialized project?',
    );
    process.exitCode = 1;
    process.exit(1);
  }
}

/**
 * Check if a given port is available on HOST.
 *
 * @param {number} port
 * @returns {Promise<boolean>}
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT
 */
async function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close(() => {
        resolve(true);
      });
    });

    server.listen(port, HOST);
  });
}

/**
 * Find the first available port starting at DEFAULT_PORT.
 *
 * @param {number} startPort
 * @returns {Promise<number>}
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO
 */
async function findAvailablePort(startPort) {
  let port = startPort;
  // Upper bound is arbitrary but generous for dev usage.
  const maxPort = 65535;

  while (port <= maxPort) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    port += 1;
  }

  throw new DevServerError(
    `No available ports found in range ${startPort}-${maxPort} on host ${HOST}`,
  );
}

/**
 * Resolve the dev server port, applying strict PORT semantics and auto-discovery.
 *
 * - If env.PORT is set: validate integer range, ensure availability on HOST.
 *   Throw DevServerError if invalid or unavailable.
 * - If env.PORT is not set: find a free port starting at DEFAULT_PORT, set env.PORT.
 *
 * @param {NodeJS.ProcessEnv} env
 * @returns {Promise<{ port: number; mode: 'auto' | 'strict' }>}
 *
 * @throws {DevServerError}
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS
 */
export async function resolveDevServerPort(env) {
  const rawPort = env.PORT;

  if (rawPort != null && rawPort !== '') {
    const port = Number.parseInt(rawPort, 10);

    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
      throw new DevServerError(
        `Invalid PORT value "${rawPort}". PORT must be an integer between 1 and 65535.`,
      );
    }

    const available = await isPortAvailable(port);
    if (!available) {
      throw new DevServerError(
        `Requested PORT ${port} is already in use on host ${HOST}. Set PORT to a free port or unset it to enable auto-discovery.`,
      );
    }

    env.PORT = String(port);
    return { port, mode: 'strict' };
  }

  const port = await findAvailablePort(DEFAULT_PORT);
  env.PORT = String(port);
  return { port, mode: 'auto' };
}

/**
 * Start the TypeScript compiler in watch mode.
 *
 * This relies on the initialized project having TypeScript installed and a
 * tsconfig.json that outputs compiled code to dist/.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-ERROR-DISPLAY
 */
function startTypeScriptWatch(projectRoot) {
  const tsc = spawn('npx', ['tsc', '--watch', '--preserveWatchOutput'], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  tsc.on('error', error => {
    console.error('dev-server: Failed to start TypeScript watcher:', error);
  });

  return tsc;
}

/**
 * Start the compiled Fastify server from dist/src/index.js.
 *
 * For the initial implementation, this delegates to `node dist/src/index.js`
 * and relies on the generated server to implement / and /health routes.
 * Port selection is handled by the application itself (via PORT env). This
 * launcher ensures the relevant environment variables are set and logs the
 * effective port for clarity.
 *
 * @param {string} projectRoot
 * @param {NodeJS.ProcessEnv} env
 * @param {number} port
 * @param {'auto' | 'strict'} mode
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-START-FAST REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS
 */
function startCompiledServer(projectRoot, env, port, mode) {
  const distEntry = path.join(projectRoot, 'dist', 'src', 'index.js');

  const modeLabel =
    mode === 'auto' ? '(auto-discovered from DEFAULT_PORT)' : '(from PORT environment variable)';

  console.log(
    `dev-server: starting Fastify server on http://localhost:${port} (host ${HOST}) ${modeLabel}`,
  );

  const node = spawn('node', [distEntry], {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
  });

  node.on('error', error => {
    console.error('dev-server: Failed to start Fastify server:', error);
  });

  return node;
}

/**
 * Main dev-server workflow.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-START-FAST REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-TYPESCRIPT-WATCH
 */
async function main() {
  const projectRoot = getProjectRoot();
  await assertPackageJsonExists(projectRoot);

  const env = { ...process.env };

  let resolvedPort;
  let mode;
  try {
    const result = await resolveDevServerPort(env);
    resolvedPort = result.port;
    mode = result.mode;
  } catch (error) {
    if (error instanceof DevServerError) {
      console.error(`dev-server: ${error.message}`);
      process.exit(1);
    } else {
      console.error('dev-server: unexpected error while resolving port:', error);
      process.exit(1);
    }
  }

  console.log('dev-server: starting TypeScript compiler in watch mode...');

  const tscProcess = startTypeScriptWatch(projectRoot);

  // Give tsc a short head start before launching the server. This does not
  // guarantee compilation has completed but keeps behavior simple for now.
  setTimeout(() => {
    console.log('dev-server: launching Fastify server from dist/src/index.js...');
    startCompiledServer(projectRoot, env, resolvedPort, mode);
  }, 1000);

  function handleSignal(signal) {
    console.log(`dev-server: received ${signal}, shutting down...`);

    tscProcess.kill('SIGINT');

    process.exit(0);
  }

  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGTERM', () => handleSignal('SIGTERM'));
}

// ESM-safe entrypoint guard: run main() only when executed directly.
const thisFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === thisFilePath) {
  main().catch(error => {
    console.error('dev-server: unexpected error:', error);
    process.exit(1);
  });
}
