/**
 * Tests for the Fastify server stub.
 * @supports docs/decisions/0002-fastify-web-framework.accepted.md REQ-FASTIFY-SERVER-STUB
 * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-STRUCTURED-JSON REQ-LOG-AUTO-REQUEST REQ-LOG-ERROR-STACKS REQ-LOG-LEVEL-CONFIG
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildServer, startServer } from '../src/server.js';

async function withStartedServer(port: number, callback: any): Promise<void> {
  const app = await startServer(port);
  try {
    await callback(app);
  } finally {
    await app.close();
  }
}

async function expectHealthOk(app: any): Promise<void> {
  const response = await app.inject({
    method: 'GET',
    url: '/health',
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toContain('application/json');
  const payload = response.json();
  expect(payload).toEqual({ status: 'ok' });
}

describe('Fastify server stub (REQ-FASTIFY-SERVER-STUB) [/health endpoint]', () => {
  it('[REQ-FASTIFY-SERVER-STUB] responds with ok status on /health', async () => {
    const app = buildServer();
    await expectHealthOk(app);
  });

  it('[REQ-FASTIFY-SERVER-STUB] responds with ok status on HEAD /health', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'HEAD',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
  });
});

describe('Fastify server stub (REQ-FASTIFY-SERVER-STUB) [unknown routes]', () => {
  it('[REQ-FASTIFY-SERVER-STUB] returns 404 for an unknown route', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'GET',
      url: '/not-found',
    });

    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toContain('application/json');
    const payload = response.json();
    expect(payload.statusCode).toBe(404);
    expect(payload.error).toBe('Not Found');
    expect(typeof payload.message).toBe('string');
    expect(payload.message.length).toBeGreaterThan(0);
  });

  it('[REQ-FASTIFY-SERVER-STUB] returns 404 for HEAD request to an unknown route', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'HEAD',
      url: '/not-found-head',
    });

    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toContain('application/json');
  });
});

describe('Fastify server stub (REQ-FASTIFY-SERVER-STUB) [invalid methods and payloads]', () => {
  it('[REQ-FASTIFY-SERVER-STUB] returns 404 for an unsupported method on /health', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'POST',
      url: '/health',
    });

    expect(response.statusCode).toBe(404);
    expect(response.headers['content-type']).toContain('application/json');
    const payload = response.json();
    expect(payload.statusCode).toBe(404);
    expect(payload.error).toBe('Not Found');
    expect(typeof payload.message).toBe('string');
    expect(payload.message.length).toBeGreaterThan(0);
  });

  it('[REQ-FASTIFY-SERVER-STUB] returns 400 with JSON error for malformed JSON body on unknown route', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'POST',
      url: '/not-json',
      headers: {
        'content-type': 'application/json',
      },
      payload: '{ invalid json',
    });

    expect(response.statusCode).toBe(400);
    expect(response.headers['content-type']).toContain('application/json');
    const payload = response.json();
    expect(payload.statusCode).toBe(400);
    expect(payload.error).toBe('Bad Request');
    expect(typeof payload.message).toBe('string');
    expect(payload.message.length).toBeGreaterThan(0);
    expect(payload.message).toContain('not valid JSON');
  });
});

describe('Fastify server stub (REQ-FASTIFY-SERVER-STUB) [startServer helper]', () => {
  it('[REQ-FASTIFY-SERVER-STUB] starts server on ephemeral port and responds on /health', async () => {
    await withStartedServer(0, async (app: any) => {
      await expectHealthOk(app);
    });
  });

  it('[REQ-FASTIFY-SERVER-STUB] can start and stop server multiple times on ephemeral ports', async () => {
    await withStartedServer(0, async (app: any) => {
      await expectHealthOk(app);
    });

    await withStartedServer(0, async (app: any) => {
      await expectHealthOk(app);
    });
  });

  it('[REQ-FASTIFY-SERVER-STUB] propagates errors when server fails to start with an invalid port', async () => {
    await expect(startServer(-1 as number)).rejects.toBeInstanceOf(Error);
  });
});

describe('Fastify server stub security headers (REQ-SEC-HEADERS-TEST, REQ-SEC-HEADERS-PRESENT)' /**
 * @supports docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md REQ-SEC-HEADERS-TEST REQ-SEC-HEADERS-PRESENT
 */, () => {
  it('[REQ-SEC-HEADERS-TEST][REQ-SEC-HEADERS-PRESENT] sets expected security headers on /health', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);

    const headers = response.headers;

    expect(headers['content-security-policy']).toBeDefined();
    expect(headers['x-frame-options']).toBeDefined();
    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['x-content-type-options']).toBeDefined();
    expect(headers['referrer-policy']).toBeDefined();
  });
});

describe('Fastify server logging configuration (Story 008.0) [REQ-LOG-LEVEL-CONFIG]', () => {
  let originalNodeEnv: string | undefined;
  let originalLogLevel: string | undefined;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    originalLogLevel = process.env.LOG_LEVEL;
  });

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalLogLevel === undefined) {
      delete process.env.LOG_LEVEL;
    } else {
      process.env.LOG_LEVEL = originalLogLevel;
    }
  });

  it('[REQ-LOG-LEVEL-CONFIG] defaults to debug level when NODE_ENV is not production and LOG_LEVEL is not set', () => {
    delete process.env.NODE_ENV;
    delete process.env.LOG_LEVEL;

    const app: any = buildServer();

    expect(app.log.level).toBe('debug');
  });

  it("[REQ-LOG-LEVEL-CONFIG] defaults to info level when NODE_ENV='production' and LOG_LEVEL is not set", () => {
    process.env.NODE_ENV = 'production';
    delete process.env.LOG_LEVEL;

    const app: any = buildServer();

    expect(app.log.level).toBe('info');
  });

  it('[REQ-LOG-LEVEL-CONFIG] uses LOG_LEVEL environment variable when provided', () => {
    process.env.NODE_ENV = 'development';
    process.env.LOG_LEVEL = 'trace';

    const app: any = buildServer();

    expect(app.log.level).toBe('trace');
  });
});
