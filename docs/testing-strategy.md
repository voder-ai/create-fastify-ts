# Testing Strategy and Evolution

This document expands on the high-level guidance in `docs/development-setup.md` and focuses on how to evolve and maintain the test suite over time.

## Scope

- Audience: contributors and maintainers working on Fastify TypeScript microservices.
- Goal: keep tests readable, reliable, and closely aligned with requirements and architecture decisions.

## Test Types and When to Add Them

### Unit Tests

Unit tests exercise small pieces of behavior in isolation (pure functions, simple helpers, or narrow methods).

Add or update unit tests when:

- You introduce a new function or method with non-trivial logic.
- You fix a bug whose root cause is a specific edge case.

Guidelines:

- Prefer small, focused tests that assert one behavior.
- Use descriptive names that read like sentences.
- Avoid coupling tests to implementation details (private helpers, specific logging) unless they are part of the contract.

### Integration Tests

Integration tests exercise components working together, such as Fastify routes and middleware.

Add or update integration tests when:

- You add or change an HTTP endpoint.
- You modify how the server composes plugins, hooks, or shared middleware.

Guidelines:

- Use Fastify's `app.inject()` to exercise routing, validation, and error handling in generated projects.
- Assert on HTTP status codes, response headers, and JSON payloads.
- Cover both happy paths and common error cases (validation failures, unsupported methods, malformed bodies).

### End-to-End (E2E) or System Tests

E2E tests approximate real-world usage. For this project, that typically means starting the HTTP server and calling it over HTTP.

Add or update E2E-style tests when:

- You introduce behavior that depends on environment configuration or startup wiring.
- You need confidence that the service works when started the same way it will run in a container or deployment environment.

Guidelines:

- Prefer a small number of stable E2E tests over a large, slow suite.
- Reuse helpers from test-helpers modules to keep setup consistent.

### Initializer Tests

Since this project is distributed as an npm initializer (`npm init @voder-ai/fastify-ts`), it's critical to test the actual initialization and project creation process. The test strategy uses **two complementary but separate test suites** to validate the npm init flow:

**Test Execution Strategy:**

- **Integration tests** (`npm-init-e2e.test.ts`) run as part of the standard test suite (`npm test`)
  - They test against local code before publishing
  - They MUST pass before any release can happen
  - They provide fast feedback during development

- **Smoke tests** (`npm-init-smoke.test.ts`) run separately from the standard test suite
  - They are skipped by default in `npm test` (require `SMOKE_TEST=true` environment variable)
  - They run via `npm run test:smoke` or in CI/CD after a release completes
  - They MUST NOT block releases (to avoid the chicken-and-egg problem where a bad release prevents fixing itself)
  - They validate the published package on npm registry, which doesn't exist until after release

#### Integration Tests (Pre-Publish)

These tests validate the `npm init @voder-ai/fastify-ts` flow **against the local codebase** before publishing. They provide fast feedback during development.

**When to add or update:**

- You modify the template structure or file generation logic
- You change the initialization script or its dependencies
- You add or remove files from the template package
- You update package.json generation or dependency installation logic

**Implementation approach:**

- Run the CLI directly from `dist/cli.js` to simulate npm init flow
- Test against local codebase before publishing
- Verify the generated project structure and behavior
- Run the generated project's test suite to ensure template functionality

**Guidelines:**

- Always create test projects inside OS temporary directories using `fs.mkdtemp` and `os.tmpdir()`
- Never commit initializer-generated projects to the repository
- Test both successful creation and error cases (existing directory, invalid project names, etc.)
- Verify the generated project structure matches expectations (required files exist, correct content)
- Clean up test projects after test completion
- These tests run as part of the standard test suite (`npm test`)
- Use standard `.test.ts` naming convention (e.g., `npm-init-e2e.test.ts`)

#### Smoke Tests (Post-Publish)

These tests validate the `npm init @voder-ai/fastify-ts` flow **against the published npm package** after release. They verify the real end-user experience.

**When to run:**

- Automatically as part of the CI/CD pipeline after semantic-release publishes
- Manually to verify a specific published version works correctly
- As a separate monitoring/validation step, NOT as part of the release process

**Implementation approach:**

- Create a temporary directory
- Run `npm init @voder-ai/fastify-ts` without any local references (pulls from npm registry)
- Verify basic project creation succeeds
- Optionally verify the generated project can install dependencies and run tests

**Guidelines:**

- Run in a completely clean environment (no symlinks to local code)
- Test the exact command developers will use
- Keep assertions minimal but meaningful (project created, key files exist, basic structure correct)
- **CRITICAL: These tests MUST NOT be part of the regular test suite (`npm test`)**
  - Smoke tests validate the published package, which doesn't exist until after release
  - If smoke tests were in `npm test`, a bad release would prevent releasing a fix (chicken-and-egg problem)
  - Smoke tests use `.smoke.test.ts` naming convention (e.g., `npm-init.smoke.test.ts`)
  - Test script excludes `**/*.smoke.test.ts` pattern from regular test runs
  - Use `npm run test:smoke` to run them explicitly
- These tests run in CI/CD **after** semantic-release completes, not as a gate before release
- Failure indicates a publishing/distribution problem or registry propagation issue, not necessarily a code problem
- Smoke test failures should trigger alerts/notifications but should not block subsequent releases

**Example integration test structure** (tests against local codebase):

```ts
// npm-init-e2e.test.ts
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

describe('npm init @voder-ai/fastify-ts (E2E integration)', () => {
  let tmpDir: string;
  const cliPath = path.join(process.cwd(), 'dist/cli.js');

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-e2e-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('[REQ-INIT-E2E-INTEGRATION] creates a working project with all required files', async () => {
    // Run CLI directly from dist folder
    execSync(`node ${cliPath} test-app`, { cwd: tmpDir, encoding: 'utf-8' });

    const projectDir = path.join(tmpDir, 'test-app');

    // Verify structure
    await expect(fs.access(path.join(projectDir, 'package.json'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, 'tsconfig.json'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, 'src/index.ts'))).resolves.toBeUndefined();

    // Install and build
    execSync('npm install', { cwd: projectDir, encoding: 'utf-8' });
    execSync('npm run build', { cwd: projectDir, encoding: 'utf-8' });

    // Verify build output
    await expect(fs.access(path.join(projectDir, 'dist/src/index.js'))).resolves.toBeUndefined();
  });
});
```

**Example smoke test structure** (tests against published package):

```ts
// npm-init.smoke.test.ts - Note the .smoke.test.ts suffix!
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

describe('[REQ-INIT-E2E-SMOKE] npm init smoke tests (published package)', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-smoke-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('[REQ-INIT-E2E-SMOKE] creates a working project from published package', async () => {
    // Run npm init against published package - pulls from npm registry
    execSync('npm init @voder-ai/fastify-ts test-app', { cwd: tmpDir, encoding: 'utf-8' });

    const projectDir = path.join(tmpDir, 'test-app');

    // Verify basic structure
    await expect(fs.access(path.join(projectDir, 'package.json'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, 'tsconfig.json'))).resolves.toBeUndefined();
    await expect(fs.access(path.join(projectDir, 'src/index.ts'))).resolves.toBeUndefined();
  });
});
```

## Traceability and Test Organization

To keep a clear link between requirements, design, and verification:

### Story 004.0 Special Case: Generated Project Validation

**Story 004.0-DEVELOPER-TESTS-RUN** has unique traceability requirements because it describes the **generated project's** testing capabilities, not the template repository's tests.

**Traceability validation for story 004.0 must:**

1. Generate a fresh project using the template initializer
2. Install dependencies in the generated project
3. Run `npm test` in the generated project and verify:
   - All tests pass (REQ-TEST-ALL-PASS)
   - Execution completes in under 5 seconds (REQ-TEST-FAST-EXEC)
   - Output is clear and readable (REQ-TEST-CLEAR-OUTPUT)
4. Verify the generated project has:
   - A `test` script in `package.json`
   - Vitest configuration (REQ-TEST-VITEST-CONFIG)
   - Test examples in the generated code (REQ-TEST-EXAMPLES)
   - TypeScript test support (REQ-TEST-TYPESCRIPT)
5. Verify watch mode works: `npm test -- --watch` (REQ-TEST-WATCH-MODE)
6. Verify coverage works: `npm run test:coverage` or equivalent (REQ-TEST-COVERAGE)

**Common mistake**: Running `npm test` in the template repository validates the template's own tests, but does NOT validate that generated projects meet story 004.0 requirements.

**Implementation notes:**

- The `src/initializer.test.ts` file should verify that generated `package.json` includes a `test` script
- Integration tests (`npm-init-e2e.test.ts`) should include at least one test that runs `npm test` in a generated project
- The generated project's test files are in `src/template-files/` and should include examples demonstrating test patterns

### General Traceability Practices

- Use file-level comments to reference the stories or ADRs a test file supports. For example:

  ```ts
  /**
   * Tests for the initializer and project scaffolding.
   * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-PROJECT
   */
  ```

- In `describe` blocks and test names, include requirement identifiers from the corresponding story or ADR when they exist. For example:

  ```ts
  describe('Generated project production runtime smoke test (Story 006.0) [REQ-START-PRODUCTION]', () => {
    it('[REQ-START-PRODUCTION] starts compiled server from dist/src/index.js with src/ removed', async () => {
      // ...
    });
  });
  ```

- Group related tests by story or requirement area rather than by framework feature. This makes it easier to see which parts of the system validate which requirements.

## Behavior-Focused Testing

Good tests describe and assert **what** the system does, not **how** it is implemented.

- Prefer assertions on return values, HTTP responses, and observable side effects.
- Avoid asserting on private state, specific log messages, or exact internal call counts unless those are part of an explicit contract.
- When refactoring, tests should continue to pass if external behavior is unchanged.

If you find yourself changing many tests during a pure refactor (with no behavior changes), consider whether the tests are too tightly coupled to implementation details.

## Adding New Tests Safely

When evolving the test suite:

1. Start by writing or updating tests to describe the desired behavior (RED).
2. Implement the minimal code changes to make the tests pass (GREEN).
3. Refactor the implementation and tests to remove duplication and improve clarity (REFACTOR).

Keep tests fast:

- Avoid real network calls; use `app.inject()` or in-process helpers instead.
- Prefer in-memory test doubles for external dependencies.
- Do not introduce sleeps or timing-based assertions.

## Test Data and Helpers

As endpoints and payloads become more complex, extract reusable test helpers:

- Use factory functions or builders to create common request payloads.
- Hide boilerplate (e.g., server startup/teardown) in shared utilities.
- Keep helpers small and focused; avoid over-abstracting at the cost of clarity.

For example, a helper to create a test Fastify instance with all plugins registered can keep individual tests focused on behavior, not setup.

### Shared helpers for dev server and generated projects

This repository already includes several shared helpers that you should prefer over re-implementing similar logic inside new tests:

- `src/dev-server.test-helpers.ts` – encapsulates creating temporary project directories and starting the `dev-server.mjs` script under different environments. Use these helpers when you need to exercise:
  - Port auto‑discovery and strict `PORT` semantics for the dev server.
  - `DEV_SERVER_SKIP_TSC_WATCH` behavior in test mode.
  - Hot‑reload behavior when compiled files in `dist/src/` change.
  - **Initial TypeScript compilation scenario** – testing that `npm run dev` works correctly when starting from a fresh project without a pre-built `dist/` folder.

- `src/generated-project.test-helpers.ts` – encapsulates creating full generated projects in OS temp directories, linking `node_modules` from the repo, running `tsc` builds, and starting the compiled server from `dist/src/index.js`. Use these helpers when you need to:
  - Verify production builds and runtime behavior of generated projects (for example, `/health` responses and absence of `src/` in logs).
  - Assert logging behavior and log‑level configuration in compiled servers.

When adding new tests that touch the dev server or generated projects:

- **Do not** shell out directly to `npm init @voder-ai/fastify-ts` or re‑create temp‑project logic unless there is a strong reason.
- Prefer extending these helpers or adding small, focused utilities next to them so that future tests can share the same behavior.
- Keep helper APIs small and intention‑revealing (for example, `initializeGeneratedProject`, `runTscBuildForProject`, `startCompiledServerViaNode`). This keeps tests readable and reduces duplication across suites.

#### Testing Dev Server Initial Compilation

A critical scenario that must be tested is **running `npm run dev` without a pre-built `dist/` folder**. This tests the real-world experience of a developer who:

1. Runs `npm init @voder-ai/fastify-ts my-project`
2. Runs `npm install`
3. Immediately runs `npm run dev` (without running `npm run build` first)

This scenario is different from the existing dev server tests because:

- **Existing tests use `DEV_SERVER_SKIP_TSC_WATCH: '1'`** which bypasses TypeScript compilation entirely
- **Existing hot-reload tests pre-create `dist/src/index.js`** before starting the dev server
- **Neither approach exercises the initial compilation delay** that occurs when starting from scratch

**When to add tests for initial compilation:**

- When modifying `dev-server.mjs` startup logic or timing
- When changing how TypeScript watch mode initialization works
- When fixing bugs related to "file not found" errors on first `npm run dev`
- When adjusting the delay/wait logic before starting the compiled server

**Implementation guidelines:**

- Create a generated project with TypeScript source files but **no `dist/` folder**
- Run `npm run dev` (or equivalent) **without `DEV_SERVER_SKIP_TSC_WATCH`**
- Wait for TypeScript compilation to complete (watch for "Found 0 errors" message)
- Verify the server starts successfully after compilation completes
- Assert the server responds to requests (e.g., `/health` endpoint)
- These tests will be slower (3-10 seconds) than tests using `DEV_SERVER_SKIP_TSC_WATCH`
- Consider running them in a separate test suite or with longer timeouts
- Clean up test projects in `afterEach` to avoid polluting the repository

## Evolving Coverage

Coverage in this project is measured at two levels:

1. **Fast core coverage (`npm run test:coverage`)**
2. **Extended coverage (generated-project E2E suites, via `npm run test:coverage:extended`)**

### Core coverage: `npm run test:coverage`

The primary coverage command is optimized for day‑to‑day development:

- It runs **only the core test suites in this repository**:
  - Unit tests for shared utilities and helpers.
  - Integration and E2E-style tests for the Fastify server, plugins, and initializer/CLI logic.
- It **does not** run tests inside any projects generated by the initializer.
- The goal is to keep feedback **fast and reliable** so contributors can iterate quickly.
- The template configures global coverage thresholds **around 90%** for statements, lines, and functions, and the **high 70s for branches**. Aim to keep coverage comfortably above these thresholds so that small changes do not cause flaky failures.

Use `npm run test:coverage` when:

- You are working on core logic (server, plugins, CLI, initializer, templates).
- You want to see how well the core repository code paths are exercised.
- You are running pre-commit or pre-push checks locally.

When interpreting core coverage:

- Treat the percentage as a **signal**, not a hard gate.
- Prioritize coverage of:
  - Public APIs and endpoints.
  - Error handling and edge cases.
  - Security- and correctness-critical logic.

### Extended coverage: generated-project E2E suites

In addition to core coverage, there is an **extended coverage script**, `npm run test:coverage:extended`, that:

- Uses the initializer to **generate one or more full projects** in temporary directories.
- Runs the generated projects’ own test suites, including:
  - Production‑mode server tests.
  - Logging/observability and startup behavior tests.
  - Any other E2E or system tests shipped in the template.
- Runs these heavier tests with coverage enabled and reports that coverage separately from the core run.

The extended coverage run is:

- **Slower and more resource-intensive** than `npm run test:coverage`.
- Typically run **manually** or in **non-gating CI contexts** (for example, nightly jobs or pre-release pipelines), rather than as part of the fastest feedback loop.

When considering extended coverage:

- Use it to validate that:
  - Template defaults (logging, production config, error handling) are properly exercised.
  - Generated projects are self-consistent and testable out of the box.
- Keep generated-project coverage **conceptually separate** from core coverage:
  - Core coverage answers: “Is the initializer and server skeleton well tested?”
  - Extended coverage answers: “Do projects created from this initializer behave correctly and have usable tests of their own?”

As you add new features or fix bugs:

- Ensure the **core change** is covered by `npm run test:coverage`.
- When relevant to template behavior (production mode, logging, scaffolding), also extend the **generated-project tests** that participate in the extended coverage run.
