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
- **Security Headers**: `@fastify/helmet` registered by default in the Fastify server generated into `src/index.ts` for new projects.
- **Structured Logging**: Fastify's integrated Pino logger with environment-driven log levels implemented in the generated project's `src/index.ts`; the dev server (`npm run dev`) pipes logs through `pino-pretty` for human-readable local output while production (`npm start`) keeps JSON log lines.

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

## Configuration

For details on how environment variables such as `PORT`, `NODE_ENV`, and `LOG_LEVEL` affect servers in generated projects, see the [Configuration Guide](user-docs/configuration.md).

### Generated project endpoints

A freshly generated project exposes two HTTP endpoints by default:

- `GET /` → `{ "message": "Hello World from Fastify + TypeScript!" }`
- `GET /health` → `{ "status": "ok" }`

These routes live in the generated project's `src/index.ts`. The root route provides a simple starting point for your API, and the `/health` route is a lightweight health check that is safe to call from your deployment environment or uptime monitors.

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

For details on the programmatic API (including `initializeTemplateProject` and `initializeTemplateProjectWithGit`), see the [API Reference](user-docs/api.md).

## Security

Currently implemented:

- Security headers via `@fastify/helmet` in the Fastify server generated into `src/index.ts` for new projects.
- Structured logging using Fastify's default Pino integration in generated projects (`src/index.ts`), with JSON logs when you run the compiled server directly or with `npm start`; `npm run dev` uses the same structured logs but formats them via `pino-pretty` for easier local reading.

Planned security-related enhancements (not yet implemented):

- Environment variable validation
- CORS configuration
- Optional additional hardening of security headers (e.g., custom CSP, stricter policies)

See [Security Overview](user-docs/SECURITY.md) for detailed security guidance and planned practices.

## Contributing

### Git workflow and commit style

- Work is based on trunk-style development:
  - `main` is the long-lived trunk branch.
  - Prefer short-lived, focused branches that are merged quickly.
  - Avoid long-running feature branches that drift far from `main`.
- Commit frequently and keep changes small and reviewable.
- Do **not**:
  - Create manual release tags.
  - Manually bump versions in `package.json` or related files (semantic-release owns versioning and tagging).
- All commits **must** follow the Conventional Commits format:
  - Examples:
    - `docs: update development guide`
    - `chore: update dependencies`
    - `test: add coverage for health endpoint`
  - Reserve `feat:` for user-visible behavioral changes only (e.g., new CLI options, new endpoints, or notable behavior that affects template users).
  - Use other types like `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, etc., as appropriate.

### Git hooks and local quality gates

This repository uses Git hooks to keep quality checks aligned between local development and CI:

- **Pre-commit hook**:
  - Runs before each commit:
    - `npm run format`
    - `npm run lint`
  - Purpose: ensure consistent formatting and linting for everything you commit.

- **Pre-push hook**:
  - Runs before each push:
    - `npm run build`
    - `npm test`
    - `npm run lint`
    - `npm run type-check`
    - `npm run format:check`
    - `npm run audit:ci`
    - `npm run quality:lint-format-smoke`
  - Purpose: give contributors the same quality gate locally that the CI pipeline enforces, reducing “works on my machine” issues.

### Alignment with CI/CD

- On every push to `main`, a single **CI/CD Pipeline** workflow:
  - Re-runs the same quality checks used in the pre-push hook (build, tests, lint, format checks, type-checking, audit, and smoke quality checks).
  - Runs `semantic-release` to:
    - Analyze Conventional Commit messages.
    - Determine if a release is needed.
    - Publish a new version to npm and create Git tags as appropriate.
- Contributors should **never**:
  - Create or edit release tags manually.
  - Manually bump versions for this template; semantic-release manages version numbers and changelogs.

### Repository hygiene

To keep the repository clean and predictable:

- Do **not** commit projects generated for manual testing:
  - For example, folders created with `npm init @voder-ai/fastify-ts my-api` must stay out of version control.
  - Use a temporary directory (e.g., inside `tmp/` ignored by Git) for manual CLI testing.
- Do **not** commit build artifacts or transient outputs:
  - `dist/` contents
  - Coverage reports (e.g., `coverage/`)
  - Other temporary or cache directories already covered by `.gitignore`
- Automated tests and repository-hygiene checks will fail if:
  - Generated projects or other transient artifacts are added to version control.
  - Ignored paths are accidentally committed.

For details on day-to-day development commands, tests, and how continuous deployment works, see the **Development**, **Testing**, and **Releases and Versioning** sections in this README.

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
