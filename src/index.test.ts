/**
 * Tests for the initial TypeScript + ESM project wiring.
 * @supports docs/decisions/001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 */
import { describe, it, expect } from 'vitest';
import { getServiceHealth } from '../src/index.js';

describe('Initial project wiring (REQ-TSC-BOOTSTRAP)', () => {
  it('[REQ-TSC-BOOTSTRAP] returns ok from getServiceHealth', () => {
    expect(getServiceHealth()).toBe('ok');
  });

  it('[REQ-TSC-BOOTSTRAP] returns a string status from getServiceHealth', () => {
    const result = getServiceHealth();
    expect(typeof result).toBe('string');
  });

  it('[REQ-TSC-BOOTSTRAP] does not throw when called repeatedly', () => {
    const results: string[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(getServiceHealth());
    }
    results.forEach(result => {
      expect(result).toBe('ok');
    });
  });

  it('[REQ-TSC-BOOTSTRAP] returns stable value across multiple calls', () => {
    const results: string[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(getServiceHealth());
    }

    const first = results[0];
    results.forEach(result => {
      expect(result).toBe(first);
    });
  });

  it('[REQ-TSC-BOOTSTRAP] can be used in boolean expressions without throwing', () => {
    const value = getServiceHealth();
    let evaluated = false;

    if (value) {
      evaluated = true;
    }

    expect(evaluated).toBe(true);
  });

  it('[REQ-TSC-BOOTSTRAP] can be called via a stored function reference without changing behavior', () => {
    const healthChecker = getServiceHealth;
    expect(healthChecker()).toBe('ok');
  });

  it('[REQ-TSC-BOOTSTRAP] returns JSON-serialisable status payload', () => {
    const result = getServiceHealth();

    const serialised = JSON.stringify({ status: result });

    expect(serialised).toBe(JSON.stringify({ status: 'ok' }));
    expect(() => JSON.parse(serialised)).not.toThrow();
  });

  it('[REQ-TSC-BOOTSTRAP] can be attached as an object method without changing behavior', () => {
    const wrapper = { getStatus: getServiceHealth };

    expect(wrapper.getStatus()).toBe('ok');
  });
});
