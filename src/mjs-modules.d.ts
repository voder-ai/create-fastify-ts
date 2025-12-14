/**
 * Generic module declarations for .mjs files used in tests.
 *
 * These declarations intentionally type .mjs imports as `any` so that
 * TypeScript can type-check test code that exercises runtime-only
 * dev-server behavior without requiring full type information for the
 * underlying script.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP REQ-DEV-TYPESCRIPT-WATCH
 */

declare module '*.mjs' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tests intentionally treat dev-server runtime module as any.
  const mod: any;
  export = mod;
}
