# Fastify TypeScript Template

A production-ready TypeScript + Fastify template for building REST APIs and microservices. Includes health check endpoint, testing framework, code quality tools, security headers, structured logging, and automated release workflow.

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

- **TypeScript + ESM**: Modern TypeScript with ES Modules
- **Fastify**: Fast, low-overhead web framework
- **Vitest**: Lightning-fast test framework
- **ESLint + Prettier**: Code quality and formatting
- **Security Headers**: Production-ready security via @fastify/helmet
- **Structured Logging**: Pino for JSON logs
- **Automated Releases**: Semantic-release with trunk-based development
- **Health Check**: `/health` endpoint for monitoring

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

This template uses **semantic-release** for automated versioning. Projects created from this template inherit this CI/CD setup.

Version numbers are derived from Conventional Commit messages:

- `feat:` → minor version bump
- `fix:` → patch version bump
- `BREAKING CHANGE:` → major version bump

For template releases, see:

- GitHub Releases: https://github.com/voder-ai/create-fastify-ts/releases
- npm registry: https://www.npmjs.com/package/@voder-ai/create-fastify-ts

## Security

The template includes security best practices:

- Security headers via @fastify/helmet
- Environment variable validation
- CORS opt-in configuration (see docs)
- No sensitive data in logs

See `user-docs/SECURITY.md` for detailed security guidance.

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
