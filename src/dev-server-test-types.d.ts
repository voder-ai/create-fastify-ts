/**
 * Type-only declarations for the dev-server test modules.
 *
 * These declarations allow strict TypeScript checking of the dev-server
 * integration tests without changing the underlying JavaScript/TypeScript
 * implementation files.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP REQ-DEV-TYPESCRIPT-WATCH
 */

declare module './template-files/dev-server.mjs' {
  export class DevServerError extends Error {
    constructor(message: string);
  }

  export interface ResolveDevServerPortResult {
    port: number;
    mode: 'auto' | 'strict';
  }

  export function resolveDevServerPort(
    env: Record<string, string | undefined>,
  ): Promise<ResolveDevServerPortResult>;
}

declare module './dev-server.test-helpers' {
  import type net from 'node:net';
  import type { ChildProcess } from 'node:child_process';

  export function createServerOnRandomPort(): Promise<{ server: net.Server; port: number }>;

  export function createDevServerProcess(
    env: Record<string, string | undefined>,
    options?: { cwd?: string; devServerPath?: string },
  ): {
    child: ChildProcess;
    getStdout: () => string;
    getStderr: () => string;
  };

  export function waitForDevServerMessage(
    child: ChildProcess,
    getStdout: () => string,
    getStderr: () => string,
    message: string,
    timeoutMs: number,
  ): Promise<void>;

  export function sendSigintAndWait(
    child: ChildProcess,
    timeoutMs: number,
  ): Promise<{ code: number | null; signal: string | null }>;

  export function createMinimalProjectDir(): Promise<{
    projectDir: string;
    devServerPath: string;
  }>;

  export function createFakeProjectForHotReload(): Promise<{
    projectDir: string;
    indexJsPath: string;
    devServerPath: string;
  }>;
}
