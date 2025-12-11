/**
 * Entry point for the microservice.
 * Currently provides a minimal stub to verify TypeScript + ESM wiring.
 * @supports docs/decisions/001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 */
export function getServiceHealth(): string {
  return 'ok';
}
