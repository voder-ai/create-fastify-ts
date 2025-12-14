# Configuration and Environment Variables

Created autonomously by [voder.ai](https://voder.ai).

This guide summarizes the runtime configuration knobs that are **implemented today** in the Fastify TypeScript template and in the projects it generates.

There are two main contexts to keep in mind:

- The **internal stub server** used only inside this repository (`src/server.ts`). It exists to validate security and logging behavior but is not shipped as part of generated projects.
- The **generated project server** (`src/index.ts` in a new project created via `npm init @voder-ai/fastify-ts`). This is the server you actually run in your own application.

Unless explicitly noted otherwise, configuration options in this guide apply to **generated projects**. Where the internal stub server behaves the same way, that is called out for completeness.

---

## Node.js version

- The template and generated projects require **Node.js >= 22.0.0**.
- Installing dependencies (`npm install` / `npm ci`) on an older Node.js version will fail fast via the `preinstall` hook, which runs `scripts/check-node-version.mjs`.
- When the requirement is not met, the script prints a clear error message and exits with a non‑zero status code.

You do not configure this requirement via environment variables; instead, you should upgrade your local or CI Node.js runtime to 22 or newer.

---

## PORT

### Generated project server (`src/index.ts`)

When you run the compiled server in a generated project (for example via `npm start`):

- The code reads `process.env.PORT` and falls back to `3000` if it is not set:

  ```ts
  const port = Number(process.env.PORT ?? 3000);
  ```

- Practical implications:
  - If `PORT` is **unset**, the server listens on port **3000**.
  - If `PORT` is set to a valid integer (for example `4000`), the server listens on that port.
  - If `PORT` is set to `0`, Node.js and Fastify treat this as “pick an ephemeral free port”. This is useful in tests (for example, the generated-project production tests) but is rarely used in normal development.

There is intentionally **no additional range validation** in `src/index.ts`; invalid values will fail in the underlying Fastify/Node listen call.

### Dev server (`npm run dev` / `dev-server.mjs`)

The dev server script copied into generated projects (`dev-server.mjs`) implements **stricter semantics** for `PORT` while still supporting auto-discovery:

- If `PORT` is **set** in the environment when you run `npm run dev`:
  - It must be an integer between **1 and 65535**.
  - The dev server checks that the port is **available** on the host.
  - If the value is invalid or the port is already in use, the dev server throws a `DevServerError` with a clear message and exits.
- If `PORT` is **not set**:
  - The dev server searches for a free port, starting at `3000`, and sets `PORT` in its child process environment to that value.
  - It logs which port was chosen so you can see where the server is listening.

These behaviors are implemented in `src/template-files/dev-server.mjs` and apply only when you use `npm run dev` in a generated project.

### Internal stub server (`src/server.ts`)

The internal Fastify stub server used by this template’s own tests does **not** read `PORT` itself. Instead, tests call `startServer(port)` with an explicit port number. This stub server is not part of generated projects.

---

## LOG_LEVEL and NODE_ENV

Both the generated project server (`src/index.ts`) and the internal stub server (`src/server.ts`) use the same algorithm to determine the log level for Fastify’s integrated Pino logger.

### Log level selection

The log level is chosen based on `NODE_ENV` and `LOG_LEVEL`:

1. Compute the current environment:

   ```ts
   const nodeEnv = process.env.NODE_ENV ?? 'development';
   ```

2. Pick a default log level from the environment:

   ```ts
   const defaultLogLevel = nodeEnv === 'production' ? 'info' : 'debug';
   ```

3. Allow explicit override via `LOG_LEVEL`:

   ```ts
   const logLevel = process.env.LOG_LEVEL ?? defaultLogLevel;
   ```

4. Pass this level to Fastify’s logger:

   ```ts
   const app = Fastify({
     logger: {
       level: logLevel,
     },
   });
   ```

### Practical behavior

- If `NODE_ENV` is **not** `"production"` and `LOG_LEVEL` is **unset**:
  - Default level is **`debug`**.
- If `NODE_ENV=production` and `LOG_LEVEL` is **unset**:
  - Default level is **`info`**.
- If `LOG_LEVEL` is set to any supported Pino level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`):
  - That value is used regardless of `NODE_ENV`.

Example configurations:

```bash
# Local development with verbose logs
npm run dev

# Local development with explicit level
LOG_LEVEL=debug npm run dev

# Production-like start with standard informational logs
NODE_ENV=production npm start

# Temporary deep troubleshooting in production (use sparingly)
NODE_ENV=production LOG_LEVEL=trace npm start
```

The generated-project logging tests (`src/generated-project-logging.test.ts`) verify that these environment settings affect the behavior of request logs as expected.

---

## Log format (JSON vs pretty-printed)

The **format** of the logs depends on how you start the server rather than on additional environment variables:

- **Generated projects – production / compiled:**
  - When you run `npm start` (which executes `node dist/src/index.js`) or invoke the compiled server directly, logs are emitted as **structured JSON** lines from Pino.
  - This format is ideal for log aggregation tools and production monitoring.
- **Generated projects – development (`npm run dev`):**
  - The dev server (`dev-server.mjs`) starts the compiled server with Node’s `-r pino-pretty` flag in non‑production environments.
  - The underlying log data is the same, but output is formatted into **human-readable text** for easier local debugging.
- **Internal stub server:**
  - Uses the same Pino logger configuration as the generated project server and emits JSON logs; it is only used inside this repository’s tests.

There is currently no separate environment variable to switch between JSON and pretty-printed logs; the choice is driven by which script you run (`npm start` vs `npm run dev`) and `NODE_ENV`.

---

## DEV_SERVER_SKIP_TSC_WATCH

The dev server supports an additional environment variable primarily intended for tests and advanced scenarios:

- `DEV_SERVER_SKIP_TSC_WATCH`
  - When set to `1` before running `npm run dev`, the dev server **skips starting the TypeScript compiler in watch mode**.
  - The compiled server process (`node dist/src/index.js`) is still launched and hot-reload for `dist/src/index.js` remains in place.
  - This is useful when the TypeScript watcher would be redundant (for example, in certain CI or test environments where compilation is handled separately).

For normal day‑to‑day development, you can ignore this variable and rely on the default behavior (TypeScript watch enabled).

---

## Future / example configuration variables

Some of the security documentation (for example, in `user-docs/SECURITY.md`) shows **example** environment variables such as `CORS_ALLOWED_ORIGINS` and `CORS_ALLOW_CREDENTIALS` in the context of **custom CORS configuration**. Those examples are provided as guidance for how you might configure your own application when you deliberately add `@fastify/cors`.

Important:

- The template and generated projects **do not** currently read or enforce these CORS-related environment variables.
- They become relevant only if you add your own CORS configuration using the patterns shown in the security guide.

Always treat the code in generated projects (`src/index.ts`, `dev-server.mjs`, etc.) as the source of truth for which configuration options are implemented. This guide summarizes those behaviors and will be updated if new environment-driven features are added.
