/**
 * Tests for the initial TypeScript + ESM project wiring (JavaScript consumer).
 * @supports docs/decisions/0001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 */
import { describe, it, expect } from 'vitest';
import { getServiceHealth } from '../src/index.js';

describe('Initial project wiring (REQ-TSC-BOOTSTRAP)', () => {
  it('[REQ-TSC-BOOTSTRAP] returns ok from getServiceHealth for JS consumer', () => {
    expect(getServiceHealth()).toBe('ok');
  });

  it('[REQ-TSC-BOOTSTRAP] returns a string status from getServiceHealth for JS consumer', () => {
    const result = getServiceHealth();
    expect(typeof result).toBe('string');
  });

  it('[REQ-TSC-BOOTSTRAP] does not throw when called repeatedly for JS consumer', () => {
    const results = [];
    for (let i = 0; i < 10; i += 1) {
      results.push(getServiceHealth());
    }
    results.forEach(result => {
      expect(result).toBe('ok');
    });
  });
});
