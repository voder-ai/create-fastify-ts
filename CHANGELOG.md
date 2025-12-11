# Changelog

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to manage versions and publish releases automatically from Conventional Commit messages.

Because of this, the `version` field in `package.json` is not updated manually and may not reflect the latest published version.

For the authoritative list of released versions and detailed release notes, please refer to:

- GitHub Releases: https://github.com/voder-ai/create-fastify-ts/releases
- npm registry: https://www.npmjs.com/package/@voder-ai/create-fastify-ts

## Current feature set

The current published versions provide a minimal service skeleton with:

- A `getServiceHealth()` function that returns the string `"ok"` for simple wiring checks.
- A Fastify server helper that exposes a single `GET /health` endpoint returning `{ "status": "ok" }`.
