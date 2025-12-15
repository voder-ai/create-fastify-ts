/**
 * HTTP helpers for generated-project end-to-end tests.
 *
 * These utilities focus on interacting with the generated server over HTTP
 * by polling the /health endpoint until it responds, supporting production
 * start and port-behavior requirements.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT
 */
import http from 'node:http';

/**
 * Perform a single HTTP GET request to the specified health endpoint URL and
 * return its HTTP status code and response body.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION
 */
async function fetchHealthOnce(url: URL): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(url, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk.toString();
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode ?? 0, body });
      });
    });

    req.on('error', reject);
  });
}

/**
 * Poll the given health endpoint URL until it responds with any HTTP status
 * code or the specified timeout is reached. Returns the final status code
 * and body, or throws if the timeout elapses without a response.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT
 */
export async function waitForHealth(
  url: URL,
  timeoutMs: number,
  intervalMs = 500,
): Promise<{ statusCode: number; body: string }> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    try {
      const result = await fetchHealthOnce(url);
      if (result.statusCode > 0) return result;
    } catch {
      // ignore and retry until timeout
    }

    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for health endpoint at ${url.toString()}`);
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Timed out waiting for health endpoint at ${url.toString()}`);
}
