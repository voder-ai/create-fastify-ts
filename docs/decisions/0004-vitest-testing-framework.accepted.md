---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Use Vitest as Testing Framework

## Context and Problem Statement

The Fastify TypeScript template requires a testing framework for unit tests, integration tests, and test coverage reporting. We need a testing solution that works seamlessly with TypeScript, ESM, and modern async patterns while providing excellent developer experience and fast test execution.

## Decision Drivers

- **TypeScript Support**: Must work natively with TypeScript without compilation workarounds
- **ESM Compatibility**: Must support ES Modules as per ADR-0001
- **Performance**: Fast test execution to support TDD workflow (<1s for unit tests)
- **Developer Experience**: Modern API, good error messages, watch mode for development
- **Coverage Reporting**: Built-in or easy-to-configure coverage reporting
- **Fastify Integration**: Should work well with Fastify server testing patterns
- **Async/Await Support**: First-class support for testing async code
- **Maintenance**: Active development and community support
- **Familiarity**: API similar to established testing frameworks to reduce learning curve

## Considered Options

- Vitest
- Jest
- Node.js built-in test runner
- Mocha + Chai

## Decision Outcome

Chosen option: "Vitest", because it provides native TypeScript and ESM support, extremely fast execution through Vite's transformation pipeline, modern API compatible with Jest, and excellent developer experience with watch mode and coverage reporting built-in.

### Consequences

- Good, because native TypeScript support without additional configuration
- Good, because native ESM support aligns with ADR-0001
- Good, because extremely fast test execution (leverages Vite's caching and transformation)
- Good, because Jest-compatible API reduces learning curve for developers familiar with Jest
- Good, because built-in coverage reporting with c8/v8
- Good, because excellent watch mode with smart re-run based on changed files
- Good, because modern async/await patterns work naturally
- Good, because good integration with TypeScript type checking
- Bad, because smaller ecosystem than Jest (fewer plugins and extensions)
- Bad, because relatively newer framework (less battle-tested than Jest)
- Neutral, because requires Vite internally but this is abstracted away

### Confirmation

This decision is confirmed through:

- **package.json**: Contains `vitest` as a devDependency
- **Test scripts**: `npm test` runs `vitest run` command
- **Test files**: Tests use `.test.ts` extension and Vitest API (`describe`, `it`, `expect`)
- **Coverage**: Coverage reports generated with `vitest run --coverage`
- **CI/CD**: Tests run successfully in CI pipeline (GitHub Actions)
- **Watch mode**: `vitest` command provides interactive watch mode during development

## Pros and Cons of the Options

### Vitest

Modern, fast testing framework designed for Vite projects.

- Good, because native TypeScript support with no configuration
- Good, because native ESM support (no CommonJS transformation needed)
- Good, because extremely fast execution through Vite's transformation pipeline
- Good, because Jest-compatible API (easy migration, familiar to most developers)
- Good, because built-in coverage with c8 (V8 coverage)
- Good, because excellent watch mode with HMR-like experience
- Good, because TypeScript types included
- Good, because works well with modern async patterns
- Good, because active development and growing community
- Bad, because smaller plugin ecosystem than Jest
- Bad, because newer framework (first stable release 2022)
- Neutral, because Vite-based (brings Vite as transitive dependency)

### Jest

Most popular JavaScript testing framework.

- Good, because largest ecosystem and community
- Good, because extensive documentation and examples
- Good, because familiar to most JavaScript developers
- Good, because comprehensive feature set (snapshot testing, mocking, etc.)
- Bad, because poor ESM support (requires experimental flags and configuration)
- Bad, because requires additional configuration for TypeScript (ts-jest)
- Bad, because slower execution compared to Vitest
- Bad, because configuration complexity for modern TypeScript + ESM setup
- Bad, because CommonJS-first design doesn't align with ADR-0001

### Node.js built-in test runner

Native test runner included in Node.js 18+.

- Good, because no additional dependencies
- Good, because native ESM and TypeScript support (with --loader)
- Good, because minimal configuration
- Bad, because very basic assertion library
- Bad, because limited features compared to dedicated frameworks
- Bad, because no built-in coverage reporting
- Bad, because minimal ecosystem and tooling
- Bad, because still experimental/evolving API
- Bad, because poor developer experience compared to Vitest/Jest

### Mocha + Chai

Traditional, flexible testing framework with assertion library.

- Good, because very flexible and unopinionated
- Good, because mature and stable
- Good, because works with ESM (with some configuration)
- Bad, because requires multiple packages (test runner + assertions)
- Bad, because no built-in TypeScript support (requires ts-node)
- Bad, because manual configuration for coverage (nyc/c8)
- Bad, because slower than modern alternatives
- Bad, because less developer-friendly API than Vitest/Jest

## More Information

**Related Decisions:**

- ADR-0001: TypeScript + ESM - Vitest's native support for both was a key factor
- ADR-0002: Fastify framework - Vitest works well with Fastify's async patterns

**Testing Strategy:**
The testing strategy document in `docs/testing-strategy.md` provides guidance on how to structure tests, test coverage expectations, and testing best practices for this template.

**Performance Benchmarks:**
Initial benchmarks show Vitest executes the template's test suite 3-5x faster than Jest would with equivalent TypeScript + ESM configuration.
