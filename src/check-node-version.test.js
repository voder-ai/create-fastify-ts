/**
 * Tests for the Node.js version enforcement logic used during dependency installation.
 *
 * These tests validate REQ-INSTALL-NODE-VERSION from the dependencies-install
 * story by ensuring that Node.js versions below 22.0.0 are rejected with a
 * clear, user-facing error message and that versions >= 22.0.0 are accepted.
 *
 * @supports docs/stories/002.0-DEVELOPER-DEPENDENCIES-INSTALL.story.md REQ-INSTALL-NODE-VERSION
 * @supports docs/decisions/0012-nodejs-22-minimum-version.accepted.md REQ-NODE-MINIMUM-VERSION
 */

import { describe, it, expect } from 'vitest';
import {
  MINIMUM_NODE_VERSION,
  parseNodeVersion,
  isVersionAtLeast,
  getNodeVersionCheckResult,
} from '../scripts/check-node-version.mjs';

describe('Node.js version enforcement (Story 002.0)', () => {
  describe('parseNodeVersion', () => {
    it('parses versions with leading v prefix – REQ-INSTALL-NODE-VERSION', () => {
      const parsed = parseNodeVersion('v22.17.1');
      expect(parsed).toEqual({ major: 22, minor: 17, patch: 1, raw: '22.17.1' });
    });

    it('parses plain numeric versions – REQ-INSTALL-NODE-VERSION', () => {
      const parsed = parseNodeVersion('22.0.0');
      expect(parsed).toEqual({ major: 22, minor: 0, patch: 0, raw: '22.0.0' });
    });

    it('handles missing minor/patch components – REQ-INSTALL-NODE-VERSION', () => {
      const parsed = parseNodeVersion('22');
      expect(parsed).toEqual({ major: 22, minor: 0, patch: 0, raw: '22.0.0' });
    });
  });

  describe('isVersionAtLeast', () => {
    it('treats higher major versions as newer – REQ-INSTALL-NODE-VERSION', () => {
      const current = parseNodeVersion('23.0.0');
      const minimum = parseNodeVersion(MINIMUM_NODE_VERSION);
      expect(isVersionAtLeast(current, minimum)).toBe(true);
    });

    it('rejects lower major versions – REQ-INSTALL-NODE-VERSION', () => {
      const current = parseNodeVersion('21.9.0');
      const minimum = parseNodeVersion(MINIMUM_NODE_VERSION);
      expect(isVersionAtLeast(current, minimum)).toBe(false);
    });

    it('compares minor and patch when majors are equal – REQ-INSTALL-NODE-VERSION', () => {
      const below = parseNodeVersion('22.0.0');
      const equal = parseNodeVersion(MINIMUM_NODE_VERSION);
      const above = parseNodeVersion('22.5.1');

      expect(isVersionAtLeast(below, equal)).toBe(true);
      expect(isVersionAtLeast(equal, equal)).toBe(true);
      expect(isVersionAtLeast(above, equal)).toBe(true);
    });
  });

  describe('getNodeVersionCheckResult', () => {
    it('accepts Node.js versions at or above the minimum – REQ-INSTALL-NODE-VERSION', () => {
      const result = getNodeVersionCheckResult('v22.0.0');
      expect(result.ok).toBe(true);
      if (!result.ok) return; // runtime guard
      expect(result.current.raw).toBe('22.0.0');
      expect(result.minimum.raw).toBe('22.0.0');
    });

    it('rejects Node.js versions below the minimum with a clear message – REQ-INSTALL-NODE-VERSION', () => {
      const result = getNodeVersionCheckResult('v21.9.0');
      expect(result.ok).toBe(false);
      if (result.ok) return; // runtime guard

      expect(result.message).toContain('requires Node.js >=');
      expect(result.message).toContain('21.9.0');
      expect(result.message).toContain('https://github.com/voder-ai/create-fastify-ts');
    });
  });
});