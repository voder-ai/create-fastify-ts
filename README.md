# Fastify TypeScript Template

A production-ready TypeScript + Fastify template for building REST APIs and microservices. Currently includes a basic Fastify server with a health check endpoint. Additional production features (security headers, structured logging, and more) are planned as future enhancements.

## Quick Start

Create a new project from this template:

```bash
npm init @voder-ai/fastify-ts my-api
cd my-api
npm install
npm run dev
```

Requires Node.js 22 or newer (LTS recommended).

## What's Included

### Implemented

- **TypeScript + ESM**: Modern TypeScript with ES Modules
- **Fastify**: Fast, low-overhead web framework
- **Vitest**: Lightning-fast test framework
- **ESLint + Prettier**: Code quality and formatting
- **Health Check**: `/health` endpoint for monitoring

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

### Health Endpoint

The template includes a basic health check endpoint:

- `GET /health` → `{"status": "ok"}`

Use this for liveness probes, smoke tests, and deployment verification.

## Releases and Versioning

This template is designed to use **semantic-release** for automated versioning, but the automated release workflow is a planned enhancement and may not be fully wired up in the current state of the template.

Intended versioning behavior (planned):

- `feat:` → minor version bump
- `fix:` → patch version bump
- `BREAKING CHANGE:` → major version bump

For template releases, see:

- GitHub Releases: https://github.com/voder-ai/create-fastify-ts/releases
- npm registry: https://www.npmjs.com/package/@voder-ai/create-fastify-ts

## Security

Currently implemented:

- Basic Fastify server with a health endpoint

Planned security-related enhancements (not yet implemented):

- Security headers via @fastify/helmet
- Environment variable validation
- CORS opt-in configuration
- Structured logging with Pino (ensuring no sensitive data in logs)

See [Security Overview](user-docs/SECURITY.md) for detailed security guidance and planned practices.

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
