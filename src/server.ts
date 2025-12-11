/**
 * Fastify server stub for the API.
 * This does not yet implement business logic, only a health endpoint.
 * @supports docs/decisions/001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 * @supports docs/decisions/002-fastify-web-framework.accepted.md REQ-FASTIFY-SERVER-STUB
 */
import fastify from 'fastify';

export function buildServer() {
  const app = fastify({ logger: true });

  app.get('/health', async () => {
    return { status: 'ok' } as const;
  });

  return app;
}

export async function startServer(port = 3000) {
  const app = buildServer();
  await app.listen({ port, host: '0.0.0.0' });
  return app;
}
