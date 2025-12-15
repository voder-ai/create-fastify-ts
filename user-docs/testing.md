# Testing Guide

This guide explains how to run and understand the test suite provided by the `@voder-ai/create-fastify-ts` template.

The template uses **Vitest** for fast, modern testing with native TypeScript and ESM support, and TypeScript itself for type-level tests.

## Test commands

From the root of this template repository (not a generated project):

Generated projects now include a **minimal, ready-to-use Vitest setup**: a basic Vitest configuration file, example tests in TypeScript, JavaScript, and `.test.d.ts` formats, and npm scripts for `test`, `test:watch`, and `test:coverage`. The rest of this guide focuses on how the **template repository itself** is tested and can serve as a reference if you want to extend or customize the testing setup in projects you generate with it.

For information about how generated projects configure structured logging and how to change log levels in development and production, see the **Logging and Log Levels** section in the [API Reference](api.md#logging-and-log-levels).

```bash
# Run the Vitest suite once (JavaScript + TypeScript tests)
npm test

# Run tests in watch mode (local development only)
npm test -- --watch

# Run tests with coverage reporting
npm run test:coverage

# Run TypeScript type-checking, including .test.d.ts type-level tests
npm run type-check
```

### What each command does

- **`npm test`**
  - Runs `vitest run` once in non-watch mode.
  - Executes both `.test.ts` and `.test.js` files under `src/`.
  - Suitable for CI pipelines and pre-push checks.

- **`npm test -- --watch`**
  - Runs Vitest in watch mode, re-running affected tests when you change source or test files.
  - Intended for local development only; do **not** use in CI.

- **`npm run test:coverage`**
  - Runs the **core repository** Vitest suites (unit tests and primary integration tests) with coverage reporting enabled (using the `v8` coverage provider).
  - Intentionally **excludes** the heaviest generated-project E2E suites so that core coverage stays **fast and stable** enough for regular CI and pre-push use.
  - Prints a summary table showing coverage for **statements**, **branches**, **functions**, and **lines**.
  - Enforces global coverage thresholds (around 80% for each metric). If coverage drops below these thresholds, the command will fail.
  - Extended coverage, including generated-project E2E suites, is provided by the separate `npm run test:coverage:extended` command; see **Extended coverage for generated projects** below.

- **`npm run type-check`**
  - Runs `tsc --noEmit` to type-check your project without generating build output.
  - Validates both your implementation files and any `.test.d.ts` files that contain type-level tests.

## Test file formats

The template includes examples of three complementary test file formats:

- **Behavior tests in TypeScript (`.test.ts`)**
  - Example: `src/initializer.test.ts`, `src/cli.test.ts`.
  - Use Vitest to exercise runtime behavior: CLI flows, project initialization, and dev server behavior.

- **Behavior tests in JavaScript (`.test.js`)**
  - Example: `src/index.test.js`, `src/check-node-version.test.js`.
  - Demonstrate how to write tests in plain JavaScript while still using Vitest and ESM.

- **Type-level tests (`.test.d.ts`)**
  - Example: `src/index.test.d.ts`.
  - Contain only type-level declarations and assertions, validated by the TypeScript compiler.
  - These files do **not** run at runtime; instead, `npm run type-check` ensures that their compile-time expectations hold.

### How type-level tests work

Type-level tests use conditional types to assert constraints about your public API. For example, you might create a type-level test to verify that `initializeTemplateProject` returns a `Promise<string>`:

```ts
import type { initializeTemplateProject } from './index.js';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

type Expect<T extends true> = T;

export type InitializeReturnsPromiseString = Expect<
  Equal<ReturnType<typeof initializeTemplateProject>, Promise<string>>
>;
```

If you later change the return type to something incompatible, `npm run type-check` will fail, alerting you that the public API has changed in a way that may break consumers.

## Interpreting coverage reports

When you run:

```bash
npm run test:coverage
```

Vitest prints a coverage summary similar to:

```text
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   93.12 |    82.97 |   94.59 |    93.70|
src                |   94.23 |    80.00 |   93.93 |    94.23|
scripts            |   88.88 |    86.36 |  100.00 |    91.30|
```

Key points:

- **All files**: Overall coverage across the codebase (excluding any files ignored by coverage config).
- **Per-directory rows**: Coverage for groups such as `src` and `scripts`.
- **Columns**:
  - `% Stmts`: Statement coverage.
  - `% Branch`: Conditional branches (e.g. `if`, ternaries).
  - `% Funcs`: Functions and methods.
  - `% Lines`: Line coverage.

The template configures global thresholds (in `vitest.config.mts`) so that coverage must stay around or above 80% for each metric. You can adjust these thresholds over time if you add new code with appropriate tests.

## Recommended workflow

- During development of a feature:
  - Run `npm test -- --watch` to get fast feedback on behavior tests.
  - Run `npm run type-check` when you change public types or `.d.ts` files.

- Before committing or pushing:
  - Run `npm test` to ensure all behavior tests pass.
  - Optionally run `npm run test:coverage` to confirm coverage remains healthy.

- When refactoring public APIs:
  - Add or update `.test.d.ts` files to capture the expected types.
  - Use `npm run type-check` to validate those expectations.

## Extended coverage for generated projects

The template’s coverage strategy is intentionally split into:

- **Fast core coverage** (`npm run test:coverage`): Focuses on the template repository itself (unit tests and primary integration tests), keeping CI runs and local checks fast and reliable.
- **Optional extended coverage** (`npm run test:coverage:extended`): Runs the heaviest generated-project E2E suites, including the production/logging E2E suites and related tests, providing coverage data for the full generator experience without slowing down the default pipeline.

This separation ensures that Story **004.0-DEVELOPER-TESTS-RUN** is satisfied: developers have a fast, always-on coverage check for the core template, plus an explicit, opt-in extended coverage path that verifies generated-project behavior when needed.

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
