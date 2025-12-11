/**
 * @file Type-level tests for getServiceHealth.
 * @supports docs/stories/004.0-DEVELOPER-TESTS-RUN.story.md REQ-TEST-EXAMPLES REQ-TEST-TYPESCRIPT
 * @supports docs/decisions/0001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 */

import type { getServiceHealth } from './index.js';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

type Expect<T extends true> = T;

/**
 * Assert that getServiceHealth returns a string.
 */
export type GetServiceHealthReturnsString = Expect<
  Equal<ReturnType<typeof getServiceHealth>, string>
>;
