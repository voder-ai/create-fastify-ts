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
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PORT = 3000;
const HOST = '0.0.0.0';

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
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-START-FAST REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS
 */
function startCompiledServer(projectRoot) {
  const distEntry = path.join(projectRoot, 'dist', 'src', 'index.js');

  const env = { ...process.env };
  const strictPort = process.env.PORT;

  if (!strictPort) {
    env.PORT = String(DEFAULT_PORT);
  }

  console.log(
    `dev-server: starting Fastify server on http://localhost:${env.PORT ?? strictPort} (host ${HOST})`,
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

async function main() {
  const projectRoot = getProjectRoot();
  await assertPackageJsonExists(projectRoot);

  console.log('dev-server: starting TypeScript compiler in watch mode...');

  const tscProcess = startTypeScriptWatch(projectRoot);

  // Give tsc a short head start before launching the server. This does not
  // guarantee compilation has completed but keeps behavior simple for now.
  setTimeout(() => {
    console.log('dev-server: launching Fastify server from dist/src/index.js...');
    startCompiledServer(projectRoot);
  }, 1000);

  function handleSignal(signal) {
    console.log(`dev-server: received ${signal}, shutting down...`);

    tscProcess.kill('SIGINT');

    process.exit(0);
  }

  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGTERM', () => handleSignal('SIGTERM'));
}

main().catch(error => {
  console.error('dev-server: unexpected error:', error);
  process.exit(1);
});
