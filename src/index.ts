/**
 * Entry point for the microservice.
 * Currently provides a minimal stub to verify TypeScript + ESM wiring.
 * @supports docs/decisions/0001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 * @returns {string} A simple health status string indicating the service is operational.
 */
export function getServiceHealth(): string {
  return 'ok';
}

/**
 * Re-export the template project initializer for external consumers.
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-NPM-TEMPLATE
 */
export { initializeTemplateProject } from './initializer.js';
