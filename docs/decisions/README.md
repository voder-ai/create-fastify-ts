# Architectural Decision Records

This directory contains Architectural Decision Records (ADRs) for the Fastify TypeScript template project, following the MADR 4.0 format.

## Active Decisions

- [0001 - TypeScript ESM](./0001-typescript-esm.accepted.md)
- [0002 - Fastify Web Framework](./0002-fastify-web-framework.accepted.md)
- [0003 - Continuous Deployment with Semantic Release and Trunk-Based Development](./0003-continuous-deployment-semantic-release-trunk-based.accepted.md)
- [0004 - Vitest Testing Framework](./0004-vitest-testing-framework.accepted.md)
- [0005 - ESLint and Prettier for Code Quality](./0005-eslint-prettier-code-quality.accepted.md)
- [0006 - Fastify Helmet for Security Headers](./0006-fastify-helmet-security-headers.accepted.md)
- [0007 - Pino Structured Logging](./0007-pino-structured-logging.accepted.md)
- [0008 - Fastify CLI Server Management](./0008-fastify-cli-server-management.accepted.md)
- [0009 - CORS Opt-In Configuration](./0009-cors-opt-in-configuration.accepted.md)
- [0010 - Fastify Env Configuration](./0010-fastify-env-configuration.accepted.md)
- [0011 - NPM Package Manager](./0011-npm-package-manager.accepted.md)
- [0012 - Node.js 22 Minimum Version](./0012-nodejs-22-minimum-version.accepted.md)
- [0014 - Generated Test Projects Not Committed](./0014-generated-test-projects-not-committed.accepted.md)
- [0015 - Dependency Security Scanning in CI](./0015-dependency-security-scanning-in-ci.accepted.md)

## Proposed Decisions

- [0013 - NPM Init Template Distribution](./0013-npm-init-template-distribution.proposed.md)
- [0016 - Smoke Test Isolation via Naming Convention](./0016-smoke-test-isolation-naming-convention.proposed.md)

## About ADRs

An Architectural Decision Record (ADR) captures an important architectural decision made along with its context and consequences.

### When to Create an ADR

Create an ADR when making decisions about:

- Technology choices (languages, frameworks, libraries, tools)
- Architectural patterns and system structure
- Development processes and workflows
- Cross-cutting quality or security standards
- Infrastructure and deployment strategies

### ADR Lifecycle

1. **Proposed** - New decision awaiting production validation
2. **Accepted** - Decision validated through production use
3. **Rejected** - Decision evaluated and determined not suitable
4. **Deprecated** - Decision no longer recommended but not yet superseded
5. **Superseded** - Decision replaced by a newer decision

### Format

We use [MADR (Markdown Any Decision Records) 4.0](https://adr.github.io/madr/) format for all ADRs.

### More Information

See [Decision Management Process](../../.github/prompts/processes/DECISION-MANAGEMENT.md) for the complete decision management framework.
