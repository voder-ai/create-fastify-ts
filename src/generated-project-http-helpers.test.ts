/**
 * Tests for HTTP helpers used by generated-project end-to-end suites.
 *
 * These tests exercise the success and timeout/error behaviors of the
 * waitForHealth helper so that production-start workflows depending on
 * it are reliable and well-covered.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT
 */
import { describe, it, expect } from 'vitest';
import http from 'node:http';

import { waitForHealth } from './generated-project-http-helpers.js';

describe('Generated project HTTP helpers (Story 006.0)', () => {
  it('[REQ-START-PRODUCTION] resolves with status and body once /health becomes available', async () => {
    // GIVEN a server that starts listening shortly after the helper begins polling
    const port = 41238;
    const server = http.createServer((req, res) => {
      if (req.url === '/health') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ok' }));
      } else {
        res.statusCode = 404;
        res.end('not found');
      }
    });

    // Start the server a little after polling begins to validate retry behavior
    setTimeout(() => {
      server.listen(port, '127.0.0.1');
    }, 100);

    const url = new URL(`http://127.0.0.1:${port}/health`);

    try {
      // WHEN we wait for the health endpoint with a reasonable timeout
      const result = await waitForHealth(url, 5_000, 100);

      // THEN we observe a successful 200 response with a JSON body
      expect(result.statusCode).toBe(200);
      expect(() => JSON.parse(result.body)).not.toThrow();
      expect(JSON.parse(result.body)).toEqual({ status: 'ok' });
    } finally {
      server.close();
    }
  }, 10_000);

  it('[REQ-START-PRODUCTION] rejects with a timeout error when /health never responds', async () => {
    // GIVEN a URL that cannot be reached (port 0 is never bound for incoming HTTP traffic)
    const url = new URL('http://127.0.0.1:0/health');

    // WHEN we wait for the health endpoint with a short timeout
    const promise = waitForHealth(url, 300, 50);

    // THEN we receive a descriptive timeout error that includes the target URL
    await expect(promise).rejects.toThrow(
      `Timed out waiting for health endpoint at ${url.toString()}`,
    );
  }, 5_000);
});
