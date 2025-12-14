# Changelog

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to manage versions and publish releases automatically from Conventional Commit messages.

Because of this, the `version` field in `package.json` is not updated manually and may not reflect the latest published version.

For the authoritative list of released versions and detailed release notes, please refer to:

- GitHub Releases: https://github.com/voder-ai/create-fastify-ts/releases
- npm registry: https://www.npmjs.com/package/@voder-ai/create-fastify-ts

## Current feature set

The current published versions provide:

- An npm initializer (`npm init @voder-ai/fastify-ts`) that scaffolds new Fastify + TypeScript projects.
- Template files for a minimal Fastify server with security headers, structured logging, and TypeScript + ESM configuration.
- CLI tooling for project initialization with optional Git repository setup.
