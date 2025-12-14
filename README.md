# Fastify TypeScript Template

A production-ready TypeScript + Fastify template for building REST APIs and microservices. The CLI scaffolds a minimal Fastify app that responds with a Hello World JSON payload on `GET /`, exposes a simple JSON health check on `GET /health` in the generated project, and configures security headers and structured logging by default.

## Quick Start

Create a new project from this template:

```bash
npm init @voder-ai/fastify-ts my-api
cd my-api
npm install
```

The generated `package.json` includes a working `dev` script that starts the development server from TypeScript sources, plus production-ready `build` and `start` scripts:

- `npm run dev` runs the dev server with hot reload via `dev-server.mjs`
- `npm run build` compiles TypeScript to JavaScript into a `dist/` directory and emits `.d.ts` files and sourcemaps
- `npm start` runs the compiled Fastify server from `dist/src/index.js` without any watch or hot-reload behavior

In the generated project, when `src/index.ts` is compiled and run, it starts a Fastify server that listens on port `3000` (or the value of the `PORT` environment variable if set) and serves a Hello World JSON response on `GET /`.

When Git is available on your system, the new project is automatically initialized as its own Git repository. If Git is not installed or not on your PATH, the project will still be created successfully, but you may need to run `git init` manually inside the new project directory.

Requires Node.js 22 or newer (LTS recommended); attempting to install dependencies with an older Node.js version will fail fast with a clear error message due to the enforced minimum Node.js version from story 002.0 (REQ-INSTALL-NODE-VERSION).

## What's Included

### Implemented

- **TypeScript + ESM**: Modern TypeScript with ES Modules
- **Fastify**: Fast, low-overhead web framework
- **Vitest**: Lightning-fast test framework
- **ESLint + Prettier**: Code quality and formatting
- **Hello World endpoint**: `GET /` returns a simple JSON payload in the generated project
- **Dev server**: `npm run dev` starts a TypeScript-aware dev server with hot reload
- **Production build & start**: `npm run build` + `npm start` run the compiled server from `dist/`
- **Security Headers**: `@fastify/helmet` registered by default in the Fastify server generated into `src/index.ts` for new projects; the internal stub server used only for this template's own tests (`src/server.ts`) uses the same configuration.
- **Structured Logging**: Fastify's integrated Pino logger with environment-driven log levels implemented in the generated project's `src/index.ts`; the internal stub server (`src/server.ts`) uses the same pattern for template self-tests, and the dev server (`npm run dev`) pipes logs through `pino-pretty` for human-readable local output while production (`npm start`) keeps JSON log lines.

### Planned Enhancements

These features are planned and not yet implemented in the current template:

- **Environment Variable Validation**: Strict runtime configuration validation
- **CORS Configuration**: Opt-in, configurable CORS for APIs

## Development

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Type checking
npm run type-check

# Lint and format
npm run lint
npm run format

# Build for production
npm run build
```

### Testing

- `npm test` runs the Vitest test suite once.
- `npm test -- --watch` runs the suite in watch mode and is intended for local development only (not CI).
- `npm run test:coverage` runs the core test suites with coverage reporting enabled (excluding the heaviest generated-project E2E suites) and enforces global coverage thresholds.
- `npm run test:coverage:extended` is a slower, optional run that includes the generated-project production/logging E2E suites for extended coverage.
- `npm run type-check` runs TypeScript in `noEmit` mode and also validates `.test.d.ts` type-level tests.

The template includes example `.test.ts`, `.test.js`, and `.test.d.ts` files so you can see patterns for both behavior-focused tests and type-level tests. For more details, see the [Testing Guide](user-docs/testing.md).

### Generated project endpoints

A freshly generated project exposes two HTTP endpoints by default:

- `GET /` → `{ "message": "Hello World from Fastify + TypeScript!" }`
- `GET /health` → `{ "status": "ok" }`

These routes live in the generated project's `src/index.ts`. The root route provides a simple starting point for your API, and the `/health` route is a lightweight health check that is safe to call from your deployment environment or uptime monitors.

Inside this template repository there is also a small internal Fastify **stub server** (`src/server.ts`) used only for wiring and security tests. That stub server exposes a single `GET /health` endpoint and is not copied into generated projects.

## Releases and Versioning

This template uses **semantic-release** for automated versioning and publishing. The CI/CD pipeline runs semantic-release on every push to the `main` branch to produce new releases and publish them to the npm registry.

Versioning behavior:

- `feat:` → minor version bump
- `fix:` → patch version bump
- `BREAKING CHANGE:` → major version bump

For template releases, see:

- GitHub Releases: https://github.com/voder-ai/create-fastify-ts/releases
- npm registry: https://www.npmjs.com/package/@voder-ai/create-fastify-ts

## API Reference

For details on the programmatic API (including `getServiceHealth`, `initializeTemplateProject`, and `initializeTemplateProjectWithGit`), see the [API Reference](user-docs/api.md).

## Security

Currently implemented:

- Security headers via `@fastify/helmet` in the Fastify server generated into `src/index.ts` for new projects; the internal stub server (`src/server.ts`) used only for this template's tests also registers Helmet with the same defaults.
- Structured logging using Fastify's default Pino integration in generated projects (`src/index.ts`), with JSON logs when you run the compiled server directly or with `npm start`; `npm run dev` uses the same structured logs but formats them via `pino-pretty` for easier local reading. The internal stub server mirrors this logging configuration but is not part of generated projects.

Planned security-related enhancements (not yet implemented):

- Environment variable validation
- CORS configuration
- Optional additional hardening of security headers (e.g., custom CSP, stricter policies)

See [Security Overview](user-docs/SECURITY.md) for detailed security guidance and planned practices.

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
