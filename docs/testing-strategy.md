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

- Use Fastify's `app.inject()` (as in `src/server.test.ts`) to exercise routing, validation, and error handling.
- Assert on HTTP status codes, response headers, and JSON payloads.
- Cover both happy paths and common error cases (validation failures, unsupported methods, malformed bodies).

### End-to-End (E2E) or System Tests

E2E tests approximate real-world usage. For this project, that typically means starting the HTTP server and calling it over HTTP.

Add or update E2E-style tests when:

- You introduce behavior that depends on environment configuration or startup wiring.
- You need confidence that the service works when started the same way it will run in a container or deployment environment.

Guidelines:

- Prefer a small number of stable E2E tests over a large, slow suite.
- Reuse helpers like `startServer()` to keep setup consistent.

### Initializer Tests

Since this project is distributed as an npm initializer (`npm init @voder-ai/fastify-ts`), it's critical to test the actual initialization and project creation process.

Add or update initializer tests when:

- You modify the template structure or file generation logic.
- You change the initialization script or its dependencies.
- You add or remove files from the template package.
- You update package.json generation or dependency installation logic.

Guidelines:

- Create automated tests that run the full initialization process:
  ```bash
  npm init @voder-ai/fastify-ts test-project
  cd test-project
  npm install
  npm run lint
  npm test
  npm run build
  ```
- Test both successful creation and error cases (existing directory, invalid project names, etc.).
- Verify the generated project structure matches expectations (required files exist, correct content).
- Run the generated project's own test suite to ensure the template is functional.
- Test with different options/templates if your initializer supports them.
- Clean up test projects after test completion to avoid filesystem clutter.
- Consider using a temporary directory for each test run to ensure isolation.

Example test structure:

````ts
describe('npm init @voder-ai/fastify-ts', () => {
  const tmpDir = path.join(__dirname, '../tmp-init-tests');

  beforeEach(() => {
    fs.ensureDirSync(tmpDir);
  });

  afterEach(() => {
    fs.removeSync(tmpDir);
  });

  it('creates a working project with all required files', () => {
    // Run initializer
    execSync('npm init @voder-ai/fastify-ts test-app', { cwd: tmpDir });

    const projectDir = path.join(tmpDir, 'test-app');

    // Verify structure
    expect(fs.existsSync(path.join(projectDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, 'tsconfig.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, 'src/index.ts'))).toBe(true);

    // Install and test
    execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
    execSync('npm test', { cwd: projectDir, stdio: 'inherit' });
    execSync('npm run build', { cwd: projectDir, stdio: 'inherit' });

    // Verify build output
    expect(fs.existsSync(path.join(projectDir, 'dist'))).toBe(true);
  });

  it('fails gracefully when directory already exists', () => {
    const projectDir = path.join(tmpDir, 'existing-app');
    fs.ensureDirSync(projectDir);

    expect(() => {
      execSync('npm init @voder-ai/fastify-ts existing-app', { cwd: tmpDir });
    }).toThrow();
  });
});

## Traceability and Test Organization

To keep a clear link between requirements, design, and verification:

- Use file-level comments to reference the stories or ADRs a test file supports. For example:

  ```ts
  /**
   * Tests for the Fastify server stub.
   * @supports docs/decisions/002-fastify-web-framework.accepted.md REQ-FASTIFY-SERVER-STUB
   */
````

- In `describe` blocks and test names, include requirement identifiers from the corresponding story or ADR when they exist. For example:

  ```ts
  describe('Image upload endpoint (Story 001.1-FE-UPLOAD-IMAGE)', () => {
    it('[REQ-MULTIPART] accepts multipart/form-data PNG upload', async () => {
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

## Evolving Coverage

The project does not enforce a strict numeric coverage target. Instead:

- Treat coverage reports (if/when enabled) as a guide for finding untested critical logic.
- Prioritize tests around:
  - Public APIs and endpoints.
  - Error handling and edge cases.
  - Security-sensitive code paths (validation, authentication/authorization when introduced).

When adding a new feature or fixing a bug, ensure that the relevant behavior is covered by tests before considering the work complete.
