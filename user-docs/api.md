# API Reference

This document describes the public API surface of the `@voder-ai/create-fastify-ts` package as currently implemented.

## Module entry point

Import from the package root using standard ES module syntax:

```ts
import { getServiceHealth } from '@voder-ai/create-fastify-ts';
```

or in JavaScript:

```js
import { getServiceHealth } from '@voder-ai/create-fastify-ts';
```

## Functions

### `getServiceHealth(): string`

Returns a simple string representing the current health of the service wiring.

- **Returns**: the string `"ok"`.
- **Errors**: does not throw under normal conditions.

Example:

```ts
import { getServiceHealth } from '@voder-ai/create-fastify-ts';

if (getServiceHealth() === 'ok') {
  console.log('Service wiring looks good');
}
```

### `buildServer()`

Creates and configures a Fastify application instance with a single health endpoint.

- **Returns**: a Fastify instance with the following route registered:
  - `GET /health` → responds with HTTP 200 and JSON body `{ status: 'ok' }`.

This function does **not** start listening on a network port; it just builds the in-memory server. This is useful for tests and advanced integration scenarios where you manage the HTTP listener separately.

Example (TypeScript):

```ts
import { buildServer } from '@voder-ai/create-fastify-ts';

const app = buildServer();

// Use app.inject(...) in tests, or call app.listen(...) manually if needed.
```

### `startServer(port?: number)`

Builds the Fastify server and starts listening on the specified port.

- **Parameters**:
  - `port` (optional, `number`): TCP port to listen on. Defaults to `3000`.
- **Returns**: a Promise that resolves to the Fastify instance once the server is listening.
- **Host binding**: the server listens on all interfaces, binding to host `0.0.0.0`.
- **Errors**: the returned Promise may reject if the server fails to start (for example, when given an invalid port or when the port is already in use), matching the behavior tested in `src/server.test.ts`.

Example (TypeScript):

```ts
import { startServer } from '@voder-ai/create-fastify-ts';

async function main() {
  const port = Number(process.env.PORT ?? 3000);
  const app = await startServer(port);
  console.log(`Health endpoint listening on http://localhost:${port}/health`);

  // To stop the server later:
  // await app.close();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
```

Example (JavaScript):

```js
import { startServer } from '@voder-ai/create-fastify-ts';

async function main() {
  const port = Number(process.env.PORT ?? 3000);
  const app = await startServer(port);
  console.log(`Health endpoint listening on http://localhost:${port}/health`);

  // To stop the server later:
  // await app.close();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
```

## HTTP interface

When `startServer` is used, the service exposes the following HTTP behavior:

- `GET /health`
  - **Status**: `200 OK`
  - **Response body**: JSON object `{ "status": "ok" }`.

No other routes or HTTP methods are currently implemented. There is no authentication, authorization, image upload, or persistence at this stage.

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
