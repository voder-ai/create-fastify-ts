/**
 * Tests for the dev server launcher used in initialized projects.
 *
 * These tests focus on the port resolution behavior (auto-discovery and
 * strict PORT semantics) implemented in dev-server.mjs, without starting
 * real HTTP servers or TypeScript watchers.
 *
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-CLEAN-LOGS
 */
import { describe, it, expect } from 'vitest';
import net from 'node:net';

// Import the dev server module from template-files so tests exercise the
// same logic that will be copied into initialized projects.
function createServerOnRandomPort(): Promise<{ server: net.Server; port: number }> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '0.0.0.0', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Unexpected address type'));
        return;
      }

      resolve({ server, port: address.port });
    });
  });
}

describe('Dev server port resolution (Story 003.0)', () => {
  it('auto-discovers a free port starting at the default when PORT is not set [REQ-DEV-PORT-AUTO]', async () => {
    const env: Record<string, string> = {};
    const { resolveDevServerPort } = await import('./template-files/dev-server.mjs');

    const { port, mode } = await resolveDevServerPort(env);

    expect(mode).toBe('auto');
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThanOrEqual(65535);
    expect(env.PORT).toBe(String(port));
  });

  it('uses the explicit PORT value when available and free [REQ-DEV-PORT-STRICT]', async () => {
    const env: Record<string, string> = { PORT: '41234' };
    const { resolveDevServerPort } = await import('./template-files/dev-server.mjs');

    const { port, mode } = await resolveDevServerPort(env);

    expect(mode).toBe('strict');
    expect(port).toBe(41234);
    expect(env.PORT).toBe('41234');
  });

  it('throws a DevServerError when PORT is invalid [REQ-DEV-PORT-STRICT]', async () => {
    const env: Record<string, string> = { PORT: 'not-a-number' };
    const { resolveDevServerPort, DevServerError } =
      await import('./template-files/dev-server.mjs');

    await expect(resolveDevServerPort(env)).rejects.toBeInstanceOf(DevServerError);
  });

  it('throws a DevServerError when the requested PORT is already in use [REQ-DEV-PORT-STRICT]', async () => {
    const { server, port } = await createServerOnRandomPort();

    try {
      const env: Record<string, string> = { PORT: String(port) };
      const { resolveDevServerPort, DevServerError } =
        await import('./template-files/dev-server.mjs');

      await expect(resolveDevServerPort(env)).rejects.toBeInstanceOf(DevServerError);
    } finally {
      server.close();
    }
  });
});
