/**
 * Type declarations for the dev server template script.
 *
 * These declarations allow TypeScript tests to import the ESM dev-server
 * implementation (dev-server.mjs) while keeping the implementation itself
 * in plain JavaScript.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP REQ-DEV-TYPESCRIPT-WATCH
 */

export class DevServerError extends Error {
  constructor(message: string);
}

export interface ResolveDevServerPortResult {
  /** The effective port chosen for the dev server. */
  port: number;
  /**
   * Mode used when resolving the port:
   * - "auto"    auto-discovered from the default port upwards
   * - "strict"  taken directly from the PORT environment variable
   */
  mode: 'auto' | 'strict';
}

/**
 * Resolve the dev server port based on the provided environment.
 *
 * - When PORT is set: validates the value and ensures the port is available.
 * - When PORT is not set: finds a free port starting from the default.
 *
 * The function mutates the provided env object to persist the chosen PORT.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT
 */
export function resolveDevServerPort(
  env: Record<string, string | undefined>,
): Promise<ResolveDevServerPortResult>;
