# Fastify TypeScript Template

A production-ready TypeScript + Fastify template for building REST APIs and microservices. The CLI scaffolds a minimal Fastify app that responds with a Hello World JSON payload on `GET /` in the generated project. Additional production features (security headers, structured logging, and more) are planned as future enhancements.

## Quick Start

Create a new project from this template:

```bash
npm init @voder-ai/fastify-ts my-api
cd my-api
npm install
```

The generated `package.json` includes a working `dev` script that starts the development server, while the `build` and `start` scripts remain placeholders that currently print TODO messages and exit with a non-zero status; real build and start workflows will be implemented in future stories/versions of this template.

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

### Planned Enhancements

These features are planned and not yet implemented in the current template:

- **Security Headers**: Production-ready security via @fastify/helmet
- **Structured Logging**: Pino for JSON logs
- **Environment Variable Validation**: Strict runtime configuration validation
- **CORS Configuration**: Opt-in, configurable CORS for APIs
- **Automated Releases**: Semantic-release with trunk-based development

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

### Generated project endpoint

A freshly generated project exposes a single primary endpoint at this stage:

- `GET /` → `{ "message": "Hello World from Fastify + TypeScript!" }`

This Hello World JSON response is the main endpoint in the generated template and serves as a starting point for building out your API.

## Releases and Versioning

This template is designed to use **semantic-release** for automated versioning, but the automated release workflow is a planned enhancement and may not be fully wired up in the current state of the template.

Intended versioning behavior (planned):

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

- Basic Fastify server with a Hello World endpoint

Planned security-related enhancements (not yet implemented):

- Security headers via @fastify/helmet
- Environment variable validation
- CORS opt-in configuration
- Structured logging with Pino (ensuring no sensitive data in logs)

See [Security Overview](user-docs/SECURITY.md) for detailed security guidance and planned practices.

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
