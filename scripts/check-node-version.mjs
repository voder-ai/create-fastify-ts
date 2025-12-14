/**
 * Enforce the minimum Node.js version for this template at install time.
 *
 * This script runs via the npm `preinstall` hook so that `npm install` and
 * `npm ci` will both fail fast with a clear, user-facing error message when
 * executed on an unsupported Node.js runtime.
 *
 * @supports docs/stories/002.0-DEVELOPER-DEPENDENCIES-INSTALL.story.md REQ-INSTALL-NODE-VERSION
 * @supports docs/decisions/0012-nodejs-22-minimum-version.accepted.md REQ-NODE-MINIMUM-VERSION
 */

/** @typedef {{ major: number; minor: number; patch: number; raw: string }} ParsedVersion */

/**
 * The minimum Node.js version required by this template.
 *
 * Kept as a string to make the error message more readable.
 * @type {string}
 */
export const MINIMUM_NODE_VERSION = '22.0.0';

/**
 * Parse a Node.js-style version string (e.g. `v22.17.1` or `22.17.1`) into
 * a simple numeric structure we can compare.
 *
 * @param {string} versionString - Raw version string (typically `process.version`).
 * @returns {ParsedVersion} Parsed version components.
 */
export function parseNodeVersion(versionString) {
  const cleaned = versionString.trim().replace(/^v/i, '').split('-')[0];
  const [majorStr = '0', minorStr = '0', patchStr = '0'] = cleaned.split('.');

  const major = Number.parseInt(majorStr, 10) || 0;
  const minor = Number.parseInt(minorStr, 10) || 0;
  const patch = Number.parseInt(patchStr, 10) || 0;

  return {
    major,
    minor,
    patch,
    raw: `${major}.${minor}.${patch}`,
  };
}

/**
 * Determine whether a given version is greater than or equal to a minimum
 * version, using standard semantic-version ordering.
 *
 * @param {ParsedVersion} current - Currently running Node.js version.
 * @param {ParsedVersion} minimum - Minimum supported Node.js version.
 * @returns {boolean} True if `current` >= `minimum`.
 */
export function isVersionAtLeast(current, minimum) {
  if (current.major > minimum.major) return true;
  if (current.major < minimum.major) return false;

  if (current.minor > minimum.minor) return true;
  if (current.minor < minimum.minor) return false;

  return current.patch >= minimum.patch;
}

/**
 * Compute the result of the Node.js version check, including the message that
 * should be shown to the user when the version is not supported.
 *
 * This function is designed to be easy to unit test without needing to stub
 * `process.version` or `process.exit`.
 *
 * @param {string} currentVersionString - The currently running Node.js version.
 * @param {string} [minimumVersionString] - The minimum required Node.js version.
 * @returns {{ ok: true; current: ParsedVersion; minimum: ParsedVersion } | { ok: false; current: ParsedVersion; minimum: ParsedVersion; message: string }}
 */
export function getNodeVersionCheckResult(
  currentVersionString,
  minimumVersionString = MINIMUM_NODE_VERSION,
) {
  const current = parseNodeVersion(currentVersionString);
  const minimum = parseNodeVersion(minimumVersionString);

  if (isVersionAtLeast(current, minimum)) {
    return { ok: true, current, minimum };
  }

  const messageLines = [
    `@voder-ai/create-fastify-ts requires Node.js >= ${minimum.raw}, but found ${current.raw}.`,
    'Please upgrade your local Node.js installation to meet this requirement before running `npm install` or `npm ci` in this repository.',
    '',
    'This requirement is part of the template\'s documented support policy for Node.js 22 and newer.',
    'For more details, see the public documentation on GitHub:',
    '  https://github.com/voder-ai/create-fastify-ts',
  ];

  return {
    ok: false,
    current,
    minimum,
    message: messageLines.join('\n'),
  };
}

/**
 * Enforce the minimum Node.js version at install time, exiting the process
 * with a non-zero status code when the requirement is not met.
 *
 * This function is intentionally side-effectful (console output + process exit)
 * because it is only invoked from the npm `preinstall` hook and should fail
 * fast in unsupported environments.
 *
 * Its behavior is currently validated indirectly via integration scripts and/or
 * manual testing; more granular unit tests may be added in the future if the
 * implementation becomes more complex.
 */
export function enforceMinimumNodeVersionOrExit() {
  const result = getNodeVersionCheckResult(process.version, MINIMUM_NODE_VERSION);

  if (!result.ok) {
    // @supports docs/stories/002.0-DEVELOPER-DEPENDENCIES-INSTALL.story.md REQ-INSTALL-NODE-VERSION
    // User-facing error explaining why installation cannot proceed.
    // Wrap the message in blank lines for readability in npm output.
    console.error(`\n${result.message}\n`);
    process.exit(1);
  }
}

// Execute the check immediately when this script is run via `node`.
// This is what makes the `npm preinstall` hook enforce the minimum version.
enforceMinimumNodeVersionOrExit();