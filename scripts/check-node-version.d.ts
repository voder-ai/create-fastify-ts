/** TypeScript declarations for the Node.js version check script.
 *
 * These declarations allow TypeScript-based tooling (including `tsc --noEmit`)
 * to understand the surface area exercised by tests, without changing the
 * runtime implementation in `check-node-version.mjs`.
 */

/** Parsed Node.js version components. */
export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  raw: string;
}

/** Minimum supported Node.js version string (e.g. "22.0.0"). */
export const MINIMUM_NODE_VERSION: string;

/** Parse a Node.js-style version string (e.g. `v22.17.1`) into components. */
export function parseNodeVersion(versionString: string): ParsedVersion;

/** True if `current` is greater than or equal to `minimum` in semver order. */
export function isVersionAtLeast(current: ParsedVersion, minimum: ParsedVersion): boolean;

/**
 * Result of checking the current Node.js version against a minimum.
 */
export type NodeVersionCheckResult =
  | { ok: true; current: ParsedVersion; minimum: ParsedVersion }
  | { ok: false; current: ParsedVersion; minimum: ParsedVersion; message: string };

/**
 * Compute the Node.js version check result for the given versions.
 */
export function getNodeVersionCheckResult(
  currentVersionString: string,
  minimumVersionString?: string,
): NodeVersionCheckResult;

/**
 * Enforce the minimum Node.js version at install time, exiting with a non-zero
 * code when the requirement is not met.
 */
export function enforceMinimumNodeVersionOrExit(): void;
