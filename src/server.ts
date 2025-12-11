/**
 * Fastify server stub for the API.
 * This does not yet implement business logic, only a health endpoint.
 * @supports docs/decisions/0001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 * @supports docs/decisions/0002-fastify-web-framework.accepted.md REQ-FASTIFY-SERVER-STUB
 */
import fastify from 'fastify';
import helmet from '@fastify/helmet';

/**
 * Build and configure a Fastify server instance.
 *
 * @supports docs/decisions/0002-fastify-web-framework.accepted.md REQ-FASTIFY-SERVER-STUB
 * @supports docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md REQ-SEC-HELMET-DEFAULT
 * @supports docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md REQ-SEC-HEADERS-PRESENT
 * @returns {import('fastify').FastifyInstance} A configured Fastify server instance.
 */
export function buildServer() {
  const app = fastify({ logger: true });

  // @supports docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md REQ-SEC-HELMET-DEFAULT REQ-SEC-HEADERS-PRESENT
  app.register(helmet);

  app.get('/health', async () => {
    return { status: 'ok' } as const;
  });

  return app;
}

/**
 * Start the Fastify server listening on the given port.
 *
 * @supports docs/decisions/0002-fastify-web-framework.accepted.md REQ-FASTIFY-SERVER-STUB
 * @param {number} [port=3000] - The port on which the server should listen.
 * @returns {Promise<import('fastify').FastifyInstance>} A promise that resolves with the running Fastify instance, or rejects if the server fails to start.
 */
export async function startServer(port = 3000) {
  const app = buildServer();
  await app.listen({ port, host: '0.0.0.0' });
  return app;
}
