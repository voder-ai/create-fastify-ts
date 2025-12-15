Here’s a history-only summary of what’s been done on the project so far, grouped by area and in roughly chronological/logical order.

---

## Shared Test Infrastructure and Generated-Project Refactors

- Introduced `src/generated-project.test-helpers.ts` to centralize E2E helper logic for generated projects:
  - Temp project creation and scaffolding via the initializer.
  - Symlinking root `node_modules` into generated projects.
  - Helpers for `tsc` builds, starting compiled servers, polling `/health`, and validating JSON logs/log levels.
  - Added `@supports` tags linking helpers to specific documented requirements.
- Refactored `src/generated-project-production.test.ts` and `src/generated-project-logging.test.ts` to use the shared helpers:
  - Removed per-test temp-dir/server boilerplate.
  - Ensured tests run only against compiled `dist/` output (with `src/` removed).
  - Consolidated logging assertions and dependencies.

---

## TypeScript, Dev-Server Tests, and ESLint

- Updated `tsconfig.json` to:
  - Include `src/dev-server.test.ts` in type-checking.
  - Exclude `dist` and `node_modules`.
- Added `src/mjs-modules.d.ts` for `*.mjs` imports and removed `dev-server.mjs.d.ts`.
- Simplified `src/dev-server.test.ts` using dynamic imports compatible with the new declarations.
- Hardened ESLint configuration:
  - Enforced `complexity: 'error'`.
  - Verified no new lint issues.

---

## CI Quality Gates and Repository Review

- Verified the following commands work and align with CI:
  - `npm test`, `npm run lint`, `npm run type-check`, `npm run build`, `npm run format`, `npm run format:check`.
- Committed refactors for generated-project and dev-server tests into shared helpers.
- Confirmed CI run `20211284073` passed.
- Reviewed repository structure, ADRs, docs, templates, and helper organization.
- Ensured logging and Helmet documentation matched implementation.

---

## Documentation for Endpoints, Logging, Security, Testing

- Updated `README.md`:
  - Documented generated `GET /` and `GET /health` endpoints.
  - Expanded logging documentation (Fastify + Pino, env-based log levels, JSON vs `pino-pretty` output).
- Updated `user-docs/api.md`:
  - Clarified distinction between generated HTTP API and internal library API.
  - Reworked logging section to focus on Fastify + Pino and env-driven log levels.
- Updated `user-docs/SECURITY.md`:
  - Documented `@fastify/helmet` usage in stub and generated projects.
  - Clarified registration point and linked to `src/index.ts`.
- Updated `docs/testing-strategy.md`:
  - Described `src/dev-server.test-helpers.ts` and `src/generated-project.test-helpers.ts`.
  - Recommended using shared helpers instead of ad-hoc temp-project logic.
  - Ensured Prettier formatting.

---

## Build-Script Annotations and Traceability

- Updated `scripts/copy-template-files.mjs`:
  - Added `@supports` JSDoc for `main()` describing copying template assets into `dist/` during `npm run build`.
  - Documented support for scaffolding from `dist`-only output.
  - Linked to `REQ-BUILD-OUTPUT-DIST` and `REQ-BUILD-ESM`.

---

## Test Coverage Configuration and Docs

- Reviewed coverage configuration across:
  - `package.json`, `vitest.config.mts`, generated-project tests, `user-docs/testing.md`.
- Verified `npm run test:coverage`:
  - Uses V8 coverage.
  - Enforces 80% thresholds (statements, branches, functions, lines).
  - Excludes `src/template-files/**`.
  - Produces text and HTML coverage reports.
- Confirmed:
  - `test:coverage` runs core tests.
  - `test:coverage:extended` includes heavier generated-project E2E tests.
- Updated `user-docs/testing.md` with coverage provider, thresholds, suite separation, and example output.
- Re-ran test, coverage, type-check, lint, build, and format pipelines; all passed.

---

## Sample Exec Project Removal and Repo Hygiene

- Removed `sample-project-exec-test/` from version control and added it to `.gitignore`.
- Re-ran all quality commands.
- Committed `chore: remove committed sample exec project and enforce ignore`.
- Confirmed CI run `20212086601` succeeded.

---

## Extended Hygiene for Generated Projects

- Reviewed hygiene logic (`src/repo-hygiene.generated-projects.test.ts`, `.gitignore`, ADR 0014).
- Added known generated-project directory names (e.g., `cli-api`, `my-api`, `prod-api`, `logging-api`, `--help`, etc.) to `DISALLOWED_PROJECT_DIRS`.
- Ran `npm test` to confirm hygiene tests passed.
- Updated `docs/development-setup.md` with a “Generated Projects and Repository Hygiene” section:
  - Reinforced rule: no committed generated projects.
  - Linked to ADR 0014 and the disallowed-names list.
- Fixed ADR filename references; aligned `.gitignore` with hygiene tests.
- Re-ran tests, lint, type-check, build, formatting; pushed docs updates and confirmed CI success.

---

## Lint/Format Auto-Fix Commands and Smoke Test

- Verified `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`.
- Updated `docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md` to mark lint/format checks and auto-fix commands as complete.
- Added `scripts/lint-format-smoke.mjs` to:
  - Create a temp mini-project in `os.tmpdir()`.
  - Write minimal `package.json` with `lint:fix` and `format` scripts.
  - Add `eslint.config.js` with a simple rule (`no-extra-semi`).
  - Copy `.prettierrc.json`.
  - Create malformed JS (`const  answer = 42;;`).
  - Reuse root `node_modules` via PATH/NODE_PATH.
  - Run lint/format twice to verify auto-fix and idempotence.
- Added `"quality:lint-format-smoke"` script in `package.json`.
- Manually validated the smoke script.
- Updated docs to emphasize `lint:fix` and `format` as safe auto-fix commands.
- Updated CI workflow to run `npm run format:check` and `npm run quality:lint-format-smoke`.
- Committed script/docs updates; CI/CD passed.

---

## Alignment of Security, Logging, and Node-Version Docs

- Reviewed:
  - `README.md`, `user-docs/SECURITY.md`, `user-docs/api.md`
  - Templates, `scripts/check-node-version.mjs`, `src/initializer.ts`, related tests.
- `user-docs/SECURITY.md`:
  - Corrected stub vs generated endpoint descriptions.
- `user-docs/api.md`:
  - Reframed logging around generated `src/index.ts`.
  - Clarified env-driven log-level algorithm.
- `README.md`:
  - Clarified CLI-scaffolded project behavior (routes, security headers, structured logging).
  - Highlighted Helmet and Pino logging.
- Updated `src/template-files/README.md.template`:
  - Added “Security and Logging” section (Helmet, Fastify + Pino, `pino-pretty`, env-driven log levels).
- Simplified `scripts/check-node-version.mjs` error output to refer to Node requirements via a GitHub URL; updated `src/check-node-version.test.js`.
- Ran full quality suite; committed docs alignment; CI passed.

---

## Configuration Guide and README Integration

- Added `user-docs/configuration.md`:
  - Documented Node.js requirement and the `preinstall` Node-version check.
  - Described `PORT` behavior for generated projects and dev server.
  - Documented shared `LOG_LEVEL` / `NODE_ENV` behavior, JSON vs pretty logs, and `DEV_SERVER_SKIP_TSC_WATCH`.
  - Clarified that CORS env vars in docs are illustrative.
- Added a **Configuration** section to `README.md` linking to the new guide.
- Ran quality commands and committed `docs: add configuration guide for environment-driven behavior`. CI passed.

---

## Stub Server Removal

- Identified `src/server.ts` and `src/server.test.ts` as obsolete internal stubs.
- Removed both files.
- Updated coverage configuration in `package.json` to exclude `server.test.ts`.
- Updated multiple docs to remove stub-server references and focus on generated projects:
  - `README.md`
  - `docs/development-setup.md`
  - `docs/testing-strategy.md`
  - `user-docs/configuration.md`
  - `user-docs/api.md`
  - `user-docs/testing.md`
  - `user-docs/SECURITY.md`
- Ran tests, lint, type-check, format, build.

---

## Type-Level Tests for Public API

- Reviewed public API in `src/index.ts`, TS config, and test docs.
- Added `src/index.test.d.ts` with type-level assertion tests:
  - `initializeTemplateProject` returns `Promise<string>`.
  - `initializeTemplateProjectWithGit` returns `Promise<{ projectDir: string; git: GitInitResult }>` using the exported type.
  - `GitInitResult` shape (fields: `projectDir`, `initialized`, optional `stdout`, `stderr`, `errorMessage`).
  - Used `Equal` / `Expect` helpers and `@supports` tags.
- Ensured `tsconfig.json` includes `"src"` so `.test.d.ts` is type-checked.
- Ran type-check, tests, lint, build, format; committed `test: add type-level tests for public API exports`. CI passed.

---

## Security Headers Test for Generated Projects

- Added `src/generated-project-security-headers.test.ts`:
  - Uses `initializeGeneratedProject('security-api')`.
  - Builds with `runTscBuildForProject`, deletes `src/`, and starts compiled server via `startCompiledServerViaNode`.
  - Calls `/health` and asserts:
    - 200 status and `{ status: 'ok' }` body.
    - Presence of key Helmet headers:
      - `x-dns-prefetch-control`, `x-frame-options`, `x-download-options`,
      - `x-content-type-options`, `x-permitted-cross-domain-policies`, `referrer-policy`.
    - No expectation for `Strict-Transport-Security`.
  - Ensures child process terminates cleanly via `SIGINT` and a 60s timeout.
- Updated:
  - `docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md`
  - ADR `0006-fastify-helmet-security-headers.accepted.md` to reference the integration test.
- Ran full quality suite; committed `test: add security headers verification for generated projects`. CI passed.

---

## Hardened Lint/Format Smoke Test and Story Docs

- Updated `scripts/lint-format-smoke.mjs` to:
  - Resolve explicit paths to Node, ESLint CLI, and Prettier CLI.
  - Validate these paths with `fs.access`.
  - Wire temp-project scripts to call those explicit CLIs.
- Retained behavior: create malformed JS, auto-fix via lint, verify idempotent formatting.
- Validated via `npm run quality:lint-format-smoke`; ran full quality suite; formatted the script.
- Committed:
  - `test: harden lint/format smoke test to use explicit CLIs`
  - `style: format lint/format smoke test script`
- Updated `docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md` with an “Automated Smoke Test” section describing the mini-project, explicit CLI wiring, and idempotent checks.
- Pushed docs updates; CI passed.

---

## Smoke Test Hardening Progress and Repo Cleanup

- Reviewed repo (`package.json`, `README.md`, `.gitignore`, hygiene tests, smoke script, story docs, git history).
- Found and removed an untracked generated project directory `--help/`.
- Ran full local quality suite including smoke tests.
- Staged `.voder/*` metadata and related changes.
- Committed `chore: record lint/format smoke test hardening progress`.
- Pushed to `main` and confirmed CI run `20214598066` succeeded.

---

## Stabilizing Dev Server Hot-Reload Tests

- Analyzed dev-server configuration and tests:
  - `package.json`, `src/dev-server.test.ts`, `src/template-files/dev-server.mjs`, Story 003.0.
- Refactored `src/dev-server.test.ts`:
  - Stabilized hot-reload tests to reliably confirm:
    - Restart on compiled output change.
    - Correct restart log messages.
    - Clean shutdown.
  - Increased timeout to 30 seconds per hot-reload test.
  - Extracted `runSkipTscWatchScenario()` and `runHotReloadScenario()` helpers to comply with `max-lines-per-function`.
- Updated `docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md` to mark documentation alignment complete.
- Verified targeted and full test runs; committed `test: stabilize dev server hot-reload behavior test`. CI passed.

---

## npm init End-to-End Testing (Integration + Smoke)

### Integration Tests Against Local Codebase

- Added `src/npm-init-e2e.test.ts` with `[REQ-INIT-E2E-INTEGRATION]` tests that:
  - Run the CLI from `dist/cli.js` to simulate `npm init @voder-ai/fastify-ts`.
  - Validate:
    - Presence of required files in generated projects:
      - `package.json`, `tsconfig.json`, `src/index.ts`, `README.md`, `.gitignore`, `dev-server.mjs`.
    - Successful dependency resolution and build via TypeScript compile and `dist` checks.
    - Correct handling of requested directory names.
    - Exclusion of template-only files from generated output (`src/initializer.ts`, `src/cli.ts`, `src/template-files`, `scripts`).
  - Use temp directories with cleanup and requirement tags.

### Smoke Tests Against Published Package

- Added npm-init smoke tests (later standardized as `.smoke.test.ts`) to validate:
  - Running `npm init @voder-ai/fastify-ts` against the registry.
  - Project creation, install + build, and ability to run tests in generated projects.
- Introduced `npm run test:smoke` for manual and CI post-release smoke execution.
- Updated `docs/testing-strategy.md` (“Initializer Tests”) and `docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md` to document `REQ-INIT-E2E-INTEGRATION` and `REQ-INIT-E2E-SMOKE`.
- Ensured test counts (non-smoke vs smoke) were understood and tracked.

---

## Smoke Test Isolation via `.smoke.test.ts` (ADR 0016)

- Created ADR 0016 to formalize using `.smoke.test.ts` naming for post-publish smoke tests.
- Renamed `src/npm-init-smoke.test.ts` to `src/npm-init.smoke.test.ts`.
- Removed `SMOKE_TEST` env gating so smoke tests run only when explicitly invoked.
- Updated `package.json`:
  - `test`: `vitest run --exclude '**/*.smoke.test.ts'`
  - `test:smoke`: `vitest run src/npm-init.smoke.test.ts`
- Updated `vitest.config.mts` to recognize `.smoke.test.ts`.
- Updated CI to run `npm run test:smoke` after release.
- Documented the convention in `docs/testing-strategy.md`.
- Added `docs/decisions/README.md` as an ADR index (MADR 4.0-style).
- Verified separation:
  - `npm test` runs 38 non-smoke tests.
  - `npm run test:smoke` runs 3 smoke tests.
- Confirmed post-release smoke tests in CI remained green.

---

## Aligning Local Hooks and Docs with CI Quality Gates

- Removed tracked duplication report `report/jscpd-report.json`.
- Updated `.gitignore` to ignore `ci/`, `report/`, `jscpd-report/` under “CI artifact reports”.
- Centralized scripts in `package.json`:
  - `"duplication": "jscpd --threshold 20 src scripts"`
  - `"audit:ci": "npm audit --audit-level=moderate"`
  - `"quality:lint-format-smoke": "node ./scripts/lint-format-smoke.mjs"`
- Extended Husky `.husky/pre-push` hook to run:
  - Build, test, lint, type-check, format:check, `audit:ci`, and `quality:lint-format-smoke`.
- Updated `docs/development-setup.md` to:
  - Document `audit:ci`.
  - Align local pre-push checks with CI gates.
- Ran full quality suite including `audit:ci`; committed `chore: align local hooks and docs with ci quality gates`. CI run `20215254626` succeeded.

---

## Ready-to-Run Vitest in Generated Projects (Story 004.0)

### Template and Initializer Enhancements

- Refactored server entrypoint template `src/template-files/src/index.ts.template`:
  - Exported `buildServer()` to configure Fastify + Helmet and routes.
  - Exported `startServer()` to call `buildServer()`, listen, log, and return the instance.
  - Added an entrypoint guard to auto-start when executed directly.
- Added example tests:
  - `src/template-files/src/index.test.ts.template` using Vitest and `buildServer().inject('/health')`.
  - `src/template-files/src/index.test.js.template` as a JS Vitest example mirroring the TS test.
  - `src/template-files/src/index.test.d.ts.template` as a type-level test asserting `buildServer` returns `Promise<FastifyInstance>` with NodeNext-friendly imports.
- Updated `tsconfig.json` template:
  - Added `"types": ["node", "vitest/globals"]`.
- Centralized `package.json` template via `src/template-package-json.ts`:
  - `createTemplatePackageJson(projectName)` producing:
    - Scripts: `"test"`, `"test:watch"`, `"test:coverage"`.
    - DevDependencies: `vitest`, TypeScript, `@types/node`, `pino-pretty`, etc.
  - Documented with `@supports` tags.
- Refactored `src/initializer.ts` into smaller functions:
  - `writePackageJson()`
  - `scaffoldSourceFiles()` (copies index and test files).
  - `scaffoldConfigFiles()` (tsconfig, README, `.gitignore`, dev-server, Vitest config).
- Added `src/template-files/vitest.config.mts.template`:
  - Test file patterns, excluding `dist` and `node_modules`.
  - Coverage thresholds at 80%; described that `.test.d.ts` are type-checked by `tsc`, not run.
- Extended `src/template-files/README.md.template` with a **Testing** section describing:
  - `npm test`, `npm run test:watch`, `npm run test:coverage`.
  - Example test files (TS, JS, `.test.d.ts`).

### E2E Tests for Story 004.0

- Added `src/run-command-in-project.test-helpers.ts` with:
  - `runCommandInProject(projectDir, command, args, options?)` using `child_process.spawn` (capturing output and exit codes).
- Added `src/generated-project-tests.story-004.test.ts`:
  - Uses `initializeGeneratedProject` / `cleanupGeneratedProject` with `tests-run-api`.
  - Verifies:
    - Example test files exist in `src/`.
    - `npm test` runs and references `src/index.test`.
    - `npm run test:watch -- --run` works non-interactively.
    - `npm run test:coverage` runs and references `src/index.test`.
  - Uses `makeEnvWithVitestOnPath()` so generated projects find Vitest via the root `node_modules/.bin`.
  - Uses relaxed stdout checks to reduce brittleness.
- Updated `user-docs/testing.md`:
  - Specified that generated projects now include:
    - Vitest config.
    - Example tests (TS, JS, type-level).
    - `test` / `test:watch` / `test:coverage` scripts.
- Ran targeted and full quality commands; committed:
  - `feat: add ready-to-run vitest setup to generated projects`
  - Follow-up style/test commits.
- CI pipelines passed.

### NodeNext / Smoke Test Fixes

- Investigated failing CI smoke tests (e.g., `20220307169`) for `npm init @voder-ai/fastify-ts@1.7.0`.
- Identified causes:
  - Vitest attempted to execute `.test.d.ts` files in generated projects.
  - JS tests used incorrect `./index.js` / `./index.ts` imports for NodeNext.
  - TypeScript errors due to NodeNext module resolution.
- Fixes:
  - Updated root `vitest.config.mts` to ensure standard `npm test` does not run `.smoke.test.ts` files.
  - Adjusted template tests (`index.test.ts.template`, `index.test.d.ts.template`) to import `'./index.js'` consistently under NodeNext semantics.
- Rebuilt and validated newly generated projects under Node 22 + TS 5.9 + NodeNext.
- Ran full quality suite; committed:
  - `fix: ensure generated projects build and test correctly with NodeNext`
  - `test: align vitest config and examples for generated projects`
- Confirmed CI and post-release smoke tests passed.

---

## Hardening npm init E2E Integration Workflow

- Enhanced `src/generated-project.test-helpers.ts`:
  - Added `linkRootNodeModulesToProject(projectDir, options?)` to encapsulate node_modules symlinking so tests can reuse root dependencies without per-project `npm install`.
  - Updated `initializeGeneratedProject` to call this helper instead of inlining symlink logic.
- Refactored `src/npm-init-e2e.test.ts` to:
  - Use `initializeGeneratedProject`, `cleanupGeneratedProject`, and `runTscBuildForProject` instead of bespoke temp project logic.
  - Use `runCommandInProject` for `node dist/cli.js` invocations rather than `execSync`.
  - Add a `beforeAll` that:
    - Runs `npm run build` via `runCommandInProject(process.cwd(), 'npm', ['run', 'build'])` and asserts `exitCode === 0`.
    - Creates a single shared `tempDir` and sets `cliPath = dist/cli.js`.
  - Add an `afterAll` to remove the shared `tempDir`.
  - Keep one test that:
    - Runs `node dist/cli.js test-app` in the shared temp dir.
    - Verifies required files, expected `package.json` fields, and `dev-server.mjs`.
  - Convert install/build and “start server” tests to use helper-based flows:
    - Use `initializeGeneratedProject` per test (`build-test-e2e`, `server-test-e2e`).
    - Run `runTscBuildForProject` with `exitCode === 0`.
    - Assert `dist/` and `dist/src/index.js` exist and contain non-empty output.
    - Clean up via `cleanupGeneratedProject`.
  - Keep directory-name and template-specific-file tests, but run them via `runCommandInProject(tempDir, 'node', [cliPath, ...])` and check `exitCode === 0` and file expectations.
  - Removed redundant manual `linkRootNodeModulesToProject` calls once `initializeGeneratedProject` handled linking.
- Updated `docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md`:
  - Clarified `REQ-INIT-E2E-INTEGRATION` as the integration suite that validates `npm init @voder-ai/fastify-ts` against local code (backed by `src/npm-init-e2e.test.ts`).
- Ran focused commands:
  - `npm test -- src/npm-init-e2e.test.ts --reporter=verbose`
  - `npm test -- src/initializer.test.ts src/cli.test.ts src/npm-init-e2e.test.ts --reporter=verbose`
- Ran full quality suite:
  - `npm run build`, `npm test`, `npm run lint`, `npm run type-check`, `npm run format`, `npm run format:check`, `npm run audit:ci`.
- Committed and pushed as `test: harden npm init e2e integration workflow`; confirmed GitHub Actions CI/CD pipeline succeeded.

---

## npm init Smoke/E2E Refactor and Health Helper Sharing (Most Recent Work)

- Completely refactored `src/npm-init.smoke.test.ts`:
  - Introduced helpers for temp-dir lifecycle, `npm init` invocation, file-existence checks, and each scenario (project creation, install+build, and test execution).
  - Removed `max-lines-per-function` ESLint suppression while preserving behavior and assertions.
  - Documented story requirement `REQ-INIT-E2E-SMOKE` via `@supports`.
- Refactored `src/npm-init-e2e.test.ts` again for ESLint:
  - Retained helper functions (`ensureTempDir`, `createProjectViaCli`, `assertCoreFilesExist`).
  - Moved `beforeAll` and `afterAll` hooks to top level.
  - Split tests into two `describe` blocks:
    - Basic project creation and directory behavior.
    - Build and start behavior.
  - Ensured each describe callback and test function stays under `max-lines-per-function` while keeping names, timeouts, and expectations unchanged.
- Reduced duplicated health-check logic:
  - Updated `src/generated-project-production-npm-start.test.ts` to reuse `waitForHealth` from `generated-project.test-helpers.js`.
  - Removed local `fetchHealthOnce` / `waitForHealth` implementations and an unused `http` import.
  - Kept production `npm start` test behavior identical (including health checks and assertions).
- Ran full local quality gates:
  - `npm run build`, `npm run type-check`, `npm run lint`, `npm run format`, `npm run format:check`, `npm test`.
- Committed as `test: refactor npm init e2e and smoke tests and share health helper`, pushed to `main`, and confirmed the **CI/CD Pipeline** run completed successfully.

**Most recently we've executed the following action:**

---
Used tool: list_directory with input: {"dirPath":"."}
Used tool: get_git_status with input: {}
Used tool: read_file with input: {"filePath":"src/dev-server.test.ts"}
Used tool: read_file with input: {"filePath":"eslint.config.js"}
Used tool: read_file with input: {"filePath":"src/dev-server.test-helpers.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project.test-helpers.ts"}
Used tool: find_files with input: {"pattern":"generated-project*.test.ts","directory":"src"}
Used tool: read_file with input: {"filePath":"src/generated-project-production.test.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project-logging.test.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project-security-headers.test.ts"}
Used tool: modify_file with input: {"filePath":"src/dev-server.test.ts","instruction":"Refactor the 'Dev server initial compilation (Story 003.0)' test suite to remove the max-lines-per-function ESLint suppressions by extracting the long test body into a separate helper function. Specifically:\n\n1. Above the final `describe('Dev server initial compilation (Story 003.0)'` block, add a new `async function runInitialCompilationScenario(): Promise<void>` that contains the entire body of the existing `it('waits for initial TypeScript compilation before starting server...` test, preserving all logic, imports, and assertions, but localized within the new helper.\n\n2. Give the new helper a JSDoc block that includes a brief description and a `@supports` annotation referencing `docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md` and `REQ-DEV-INITIAL-COMPILE`.\n\n3. Update the `describe('Dev server initial compilation (Story 003.0)'` block so that:\n   - The `describe` callback body only contains the `it` declaration(s) and is short enough to satisfy the max-lines-per-function rule.\n   - The `it('waits for initial TypeScript compilation before starting server...` test body simply calls `await runInitialCompilationScenario();` and passes the same 60_000 timeout as the third argument.\n\n4. Remove both existing `// eslint-disable-next-line max-lines-per-function` comments from this file.\n\nDo not modify any other tests or behaviors; ensure the new helper function reproduces the original test logic exactly, including temp directory cleanup, child process handling, and log message expectations."}
Used tool: modify_file with input: {"filePath":"src/dev-server.test-helpers.ts","instruction":"Add per-function JSDoc `@supports` annotations to all named exported helper functions.\n\n1. Above `export function createServerOnRandomPort`, add a JSDoc block describing that it creates a TCP server on a random free port for dev-server port-collision tests, and include `@supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-STRICT`.\n\n2. Above `function getDevServerPath`, add a JSDoc block explaining that it resolves the dev-server script path used by tests, and include `@supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD`.\n\n3. Above `export function createDevServerProcess`, add a JSDoc block explaining it spawns the dev-server process and captures stdout/stderr for assertions, and include `@supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP`.\n\n4. Above `export async function waitForDevServerMessage`, add a JSDoc block describing that it waits for a given log message with a timeout, failing fast if the dev server exits, and include `@supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-HOT-RELOAD REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-INITIAL-COMPILE`.\n\n5. Above `export async function sendSigintAndWait`, add a JSDoc block stating that it sends SIGINT to the dev-server process and waits for clean shutdown, and include `@supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-GRACEFUL-STOP`.\n\n6. Above `export async function createMinimalProjectDir`, add a JSDoc block describing that it scaffolds a minimal project directory with package.json and a copied dev-server script for runtime tests, and include `@supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP`.\n\n7. Above `export async function createFakeProjectForHotReload`, add a JSDoc block describing that it creates a fake compiled dist/src/index.js to simulate hot reload without TypeScript, and include `@supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-HOT-RELOAD`.\n\nEnsure each new JSDoc uses standard `/** ... */` format and sits immediately above the corresponding function declaration. Do not alter existing logic."}
Used tool: modify_file with input: {"filePath":"src/generated-project.test-helpers.ts","instruction":"Add per-function `@supports` JSDoc annotations to all named helpers that currently lack them, aligning with existing story coverage in the file header.\n\n1. Above `export interface GeneratedProjectSetupOptions`, add a short JSDoc describing the options for setting up a generated project and include `@supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION`.\n\n2. Above `export interface GeneratedProjectSetupResult`, add a JSDoc describing the shape of the result and include `@supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION`.\n\n3. Above `export async function initializeGeneratedProject`, add a detailed JSDoc that explains it initializes a project via `initializeTemplateProject`, links node_modules, and returns paths, and include both:\n   - `@supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION`\n   - `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-START-PRODUCTION`\n\n4. Above `export interface TscBuildResult`, add a JSDoc summarizing it as the result of a tsc build and include `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC`.\n\n5. Above `export async function runTscBuildForProject`, add a JSDoc describing that it runs `tsc -p tsconfig.json` in the generated project using the repo TypeScript binary and returns stdout/stderr and exit code, and include `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-BUILD-OUTPUT-DIST`.\n\n6. Above `export async function cleanupGeneratedProject`, add a JSDoc explaining it removes the temporary directory for a generated project and is tolerant of missing directories, and include `@supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION`.\n\n7. Above `async function fetchHealthOnce`, add a JSDoc describing that it performs a single HTTP GET to the health endpoint and returns status and body, and include `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION`.\n\n8. Above `export async function waitForHealth`, add a JSDoc describing that it polls the health endpoint until it responds or a timeout is reached, and include `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT`.\n\n9. Above `export interface StartCompiledServerResult`, add a JSDoc describing the structure of the result from starting the compiled server, and include `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION`.\n\n10. Above `export function assertNoSourceReferencesInLogs`, add a JSDoc explaining that it asserts logs do not reference TypeScript source paths, and include `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-OUTPUT-DIST`.\n\n11. Above `export function assertHasJsonLogLine`, add a JSDoc explaining that it checks stdout for a JSON log line with a `level` field, and include `@supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-PROD-JSON REQ-LOG-STRUCTURED-JSON`.\n\n12. Above `export function assertNoInfoLevelRequestLogs`, add a JSDoc describing that it asserts no info-level request logs are present in stdout, and include `@supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-LEVEL-CONFIG`.\n\n13. Above `export async function startCompiledServerViaNode`, add a detailed JSDoc explaining that it starts the compiled server from dist/src/index.js, waits for the listening URL, and returns the child process, /health URL, and accumulated stdout, and include both:\n   - `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT REQ-START-LOGS`\n   - `@supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-STRUCTURED-JSON REQ-LOG-PROD-JSON`\n\nEnsure each new JSDoc uses standard `/** ... */` syntax and is placed immediately above the corresponding declaration, preserving all existing logic."}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: modify_file with input: {"filePath":"src/dev-server.test.ts","instruction":"Shorten the body of `runInitialCompilationScenario` slightly to satisfy the `max-lines-per-function` rule without changing behavior. Specifically:\n\n1. Replace the inline arrow function passed to `waitForDevServerMessage` for the first call with a named constant callback function declared once near the top of `runInitialCompilationScenario` to reduce repeated code lines.\n\n2. Where you currently assign `const stdout = getStdout();` and then have three separate `expect(stdout).toContain(...)` calls, collapse the three expectations into a small helper inside the function that iterates over an array of expected substrings. For example, define `const expectedMessages = [ ... ];` and then loop over them, calling `expect(stdout).toContain(message);` inside the loop.\n\n3. Keep all semantics identical: same messages, same timeouts, same child-process handling, same cleanup. Only reduce superficial duplication/line count to get under the configured 80-line limit.\n\nAfter this change, ensure `runInitialCompilationScenario` is no longer reported by ESLint as exceeding `max-lines-per-function`."}
Used tool: modify_file with input: {"filePath":"src/generated-project.test-helpers.ts","instruction":"Split `src/generated-project.test-helpers.ts` into two smaller modules to satisfy the `max-lines` rule while preserving behavior.\n\n1. Create a new file `src/generated-project-http-helpers.ts` that will contain the HTTP/health-check-related helpers and associated types:\n   - Move the `http` import from `node:http` into this new file.\n   - Move the `fetchHealthOnce` function into this new file.\n   - Move the `waitForHealth` function into this new file.\n   - Ensure this new file has an appropriate top-level JSDoc with `@supports` annotations mirroring the health-related requirements from the original header, e.g. referencing Story 006.0 and `REQ-START-PRODUCTION`/`REQ-START-PORT`.\n\n2. In `src/generated-project-http-helpers.ts`, re-create any minimal shared imports needed (e.g., `expect` is not needed here; only `http` and standard libraries). Keep the functions' implementations the same as before.\n\n3. Update `src/generated-project.test-helpers.ts` to:\n   - Remove the `http` import, and the local `fetchHealthOnce` and `waitForHealth` implementations.\n   - Import and re-export `waitForHealth` from `./generated-project-http-helpers.js` so that existing test files can continue importing `waitForHealth` from `generated-project.test-helpers` without change. For example:\n     ```ts\n     export { waitForHealth } from './generated-project-http-helpers.js';\n     ```\n   - Keep all other helpers and types unchanged.\n\n4. Add `@supports` JSDoc annotations in the new `generated-project-http-helpers.ts` for `waitForHealth` and `fetchHealthOnce` consistent with those added earlier.\n\nThis refactor should bring `src/generated-project.test-helpers.ts` under the 300-line limit while maintaining backward-compatible exports for existing tests."}
Used tool: generate_file with input: {"filePath":"src/generated-project-http-helpers.ts","content":"/**\n * HTTP helpers for generated-project end-to-end tests.\n *\n * These utilities focus on interacting with the generated server over HTTP\n * by polling the /health endpoint until it responds, supporting production\n * start and port-behavior requirements.\n *\n * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT\n */\nimport http from 'node:http';\n\n/**\n * Perform a single HTTP GET request to the specified health endpoint URL and\n * return its HTTP status code and response body.\n *\n * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION\n */\nasync function fetchHealthOnce(url: URL): Promise<{ statusCode: number; body: string }> {\n  return new Promise((resolve, reject) => {\n    const req = http.get(url, res => {\n      let body = '';\n      res.on('data', chunk => {\n        body += chunk.toString();\n      });\n      res.on('end', () => {\n        resolve({ statusCode: res.statusCode ?? 0, body });\n      });\n    });\n\n    req.on('error', reject);\n  });\n}\n\n/**\n * Poll the given health endpoint URL until it responds with any HTTP status\n * code or the specified timeout is reached. Returns the final status code\n * and body, or throws if the timeout elapses without a response.\n *\n * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT\n */\nexport async function waitForHealth(\n  url: URL,\n  timeoutMs: number,\n  intervalMs = 500,\n): Promise<{ statusCode: number; body: string }> {\n  const deadline = Date.now() + timeoutMs;\n  while (Date.now() <= deadline) {\n    try {\n      const result = await fetchHealthOnce(url);\n      if (result.statusCode > 0) return result;\n    } catch {\n      // ignore and retry until timeout\n    }\n\n    if (Date.now() > deadline) {\n      throw new Error(`Timed out waiting for health endpoint at ${url.toString()}`);\n    }\n\n    await new Promise(resolve => setTimeout(resolve, intervalMs));\n  }\n\n  throw new Error(`Timed out waiting for health endpoint at ${url.toString()}`);\n}\n"}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: read_file with input: {"filePath":"tsconfig.json"}
Used tool: modify_file with input: {"filePath":"src/dev-server.test.ts","instruction":"Refactor `runInitialCompilationScenario` into two smaller helpers to satisfy both `max-lines-per-function` and `max-lines` for the file.\n\n1. Extract the initial project setup and filesystem assertions into a new helper above `runInitialCompilationScenario`:\n   ```ts\n   /**\n    * Prepare a fresh generated project and verify dist/ and dev-server.mjs state.\n    *\n    * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-INITIAL-COMPILE\n    */\n   async function prepareInitialCompileProject() {\n     // contains the logic up to and including verifying dev-server.mjs existence\n   }\n   ```\n   This helper should return `{ tempDir, projectDir, devServerPath }` and encapsulate:\n   - calling `initializeGeneratedProject`\n   - asserting dist does not exist\n   - asserting dev-server.mjs exists\n\n2. Simplify `runInitialCompilationScenario` so it:\n   - calls `prepareInitialCompileProject()` to get `{ tempDir, projectDir, devServerPath }`;\n   - defines the small `waitForInitialCompilationComplete` callback as currently done;\n   - performs the process spawn, `waitForDevServerMessage` calls, log assertions, and SIGINT behavior;\n   - handles cleanup of `tempDir` in its final `finally`.\n\n3. While refactoring, remove any now-unused local imports or variables.\n\n4. Ensure the combined line count of `runInitialCompilationScenario` falls under 80 and the overall file stays at or below 300 lines, without changing test behavior.\n"}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: modify_file with input: {"filePath":"src/dev-server.test.ts","instruction":"Reduce the total lines in this file to comply with the `max-lines` rule (300) without changing behavior.\n\n1. Shorten multi-line comments slightly where safe, for example the JSDoc summaries, by removing redundant wording while keeping `@supports` annotations intact.\n2. Prefer single-line `await rm(...).catch(() => {});` where possible, instead of spreading across two lines.\n3. Convert the `expectedMessages` array definition in `runInitialCompilationScenario` to a more compact single-line or two-line form if it reduces line count.\n4. Do not remove any assertions or logic; only minimize whitespace and comment verbosity to bring the file to 300 lines or fewer.\n"}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: git_add_all with input: {}
Used tool: git_commit with input: {"message":"test: refactor dev server and generated-project helpers for lint and traceability"}
Used tool: git_push with input: {}
Used tool: wait_for_github_workflow with input: {"workflowName":"CI/CD Pipeline","timeout":600000}
Used tool: read_file with input: {"filePath":"package.json"}
Used tool: read_file with input: {"filePath":"src/generated-project-production.test.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project-logging.test.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project-security-headers.test.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project-tests.story-004.test.ts"}
Used tool: modify_file with input: {"filePath":"package.json","instruction":"Add the devDependency \"@typescript-eslint/eslint-plugin\" with version \"8.49.0\" to the devDependencies object, keeping entries sorted alphabetically by package name."}
Used tool: modify_file with input: {"filePath":"eslint.config.js","instruction":"Integrate the @typescript-eslint ESLint plugin and enable a single TypeScript-focused rule.\n\n1. Add an import at the top: `import tseslintPlugin from '@typescript-eslint/eslint-plugin';` just below the existing imports.\n2. In the TypeScript-specific config block (the one with `files: ['**/*.ts']`), add a `plugins` property with the plugin instance keyed by name:\n   ```ts\n   plugins: {\n     '@typescript-eslint': tseslintPlugin,\n   },\n   ```\n3. In the same block's `rules` object, add a single new rule:\n   ```ts\n   '@typescript-eslint/no-unused-vars': 'error',\n   ```\n   leaving the existing `complexity`, `max-lines-per-function`, and `max-lines` rules unchanged.\n\nDo not add any other rules or modify the ignores section."}
Used tool: run_command with input: {"command":"npm","args":["install"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: search_file_content with input: {"filePath":".","pattern":"no-unused-vars","isRegex":false}
Used tool: run_command with input: {"command":"npx","args":["eslint","--print-config","src/index.ts"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: git_add_all with input: {}
Used tool: git_commit with input: {"message":"chore: enable @typescript-eslint/no-unused-vars with plugin integration"}
Used tool: git_push with input: {}
Used tool: wait_for_github_workflow with input: {"workflowName":"CI/CD Pipeline","timeout":600000}
Used tool: get_github_pipeline_status with input: {}
Used tool: get_github_run_details with input: {"runId":20224675973}
Used tool: get_github_workflow_logs with input: {"runId":20224675973}
Used tool: get_github_pipeline_status with input: {}
Used tool: run_command with input: {"command":"npx","args":["prettier","--write","eslint.config.js","package.json"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: git_add_all with input: {}
Used tool: git_commit with input: {"message":"style: align eslint and package.json formatting after CI failure"}
Used tool: git_push with input: {}
Used tool: wait_for_github_workflow with input: {"workflowName":"CI/CD Pipeline","timeout":600000}
---

**This was the result:**
---
Here’s what I implemented for the ##NOW and ##NEXT items, plus the updated plan with checkboxes.

---

## What I changed

### 1) Refactor dev server test file to remove `max-lines-per-function` suppressions (**NOW**)

**File:** `src/dev-server.test.ts`

Goals:
- Remove the two `// eslint-disable-next-line max-lines-per-function` comments.
- Keep behavior identical.
- Stay within `max-lines-per-function: 80` and `max-lines: 300`.

**Changes:**

- Extracted the long “initial compilation” test logic into helpers:

  ```ts
  /**
   * Prepare a fresh generated project and verify dist/ and dev-server.mjs state.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-INITIAL-COMPILE
   */
  async function prepareInitialCompileProject() {
    const { initializeGeneratedProject } = await import('./generated-project.test-helpers.js');

    const { tempDir, projectDir } = await initializeGeneratedProject({
      projectName: 'dev-initial-compile-test',
      tempDirPrefix: 'dev-initial-compile-',
      logPrefix: '[dev-initial-compile-test]',
    });

    const path = await import('node:path');
    const fs = await import('node:fs/promises');
    const distPath = path.join(projectDir, 'dist');
    const distExists = await fs
      .access(distPath)
      .then(() => true)
      .catch(() => false);
    expect(distExists).toBe(false);

    const devServerPath = path.join(projectDir, 'dev-server.mjs');
    const devServerExists = await fs
      .access(devServerPath)
      .then(() => true)
      .catch(() => false);
    expect(devServerExists).toBe(true);

    return { tempDir, projectDir, devServerPath };
  }
  ```

  ```ts
  /**
   * Runs the end-to-end scenario for initial TypeScript compilation.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-INITIAL-COMPILE
   */
  async function runInitialCompilationScenario(): Promise<void> {
    const { tempDir, projectDir, devServerPath } = await prepareInitialCompileProject();

    const waitForInitialCompilationComplete = async (
      child: ReturnType<typeof createDevServerProcess>['child'],
      getStdout: () => string,
      getStderr: () => string,
    ) =>
      waitForDevServerMessage(
        child,
        getStdout,
        getStderr,
        'dev-server: initial TypeScript compilation complete.',
        30_000,
      );

    try {
      const env: Record<string, string | undefined> = {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '41238',
      };

      const { child, getStdout, getStderr } = createDevServerProcess(env, {
        cwd: projectDir,
        devServerPath,
      });

      try {
        await waitForInitialCompilationComplete(child, getStdout, getStderr);

        await waitForDevServerMessage(
          child,
          getStdout,
          getStderr,
          'dev-server: launching Fastify server from dist/src/index.js...',
          10_000,
        );

        await waitForDevServerMessage(
          child,
          getStdout,
          getStderr,
          'Server listening at',
          10_000,
        );

        const stdout = getStdout();
        const expectedMessages = [
          'dev-server: initial TypeScript compilation complete.',
          'dev-server: launching Fastify server from dist/src/index.js...',
          'Server listening at',
        ];
        for (const message of expectedMessages) {
          expect(stdout).toContain(message);
        }

        const { code, signal } = await sendSigintAndWait(child, 10_000);
        expect(signal === 'SIGINT' || code === 0).toBe(true);
      } finally {
        if (!child.killed) {
          child.kill('SIGINT');
        }
      }
    } finally {
      const { rm } = await import('node:fs/promises');
      await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
  ```

- The actual test now just calls the helper:

  ```ts
  describe('Dev server initial compilation (Story 003.0)', () => {
    it(
      'waits for initial TypeScript compilation before starting server (no pre-built dist/) [REQ-DEV-INITIAL-COMPILE]',
      async () => {
        await runInitialCompilationScenario();
      },
      60_000,
    );
  });
  ```

- Slightly condensed some comments and cleanup lines to bring the file under the `max-lines: 300` rule, without touching behavior. For example:

  ```ts
  const { rm } = await import('node:fs/promises'); await rm(projectDir, { recursive: true, force: true }).catch(() => {});
  ```

**Result:**

- `src/dev-server.test.ts` has no `eslint-disable` comments.
- All functions and the file as a whole satisfy `max-lines-per-function` and `max-lines`.
- Test behavior is unchanged (`npm test` still passes, including the initial compile scenario).

---

### 2) Add per-function traceability in dev server test helpers (**NEXT #1**)

**File:** `src/dev-server.test-helpers.ts`

Added `@supports` JSDoc to each helper:

- `createServerOnRandomPort`:

  ```ts
  /**
   * Creates a TCP server bound to a random free port, used for dev-server
   * port-collision and strict-port-behavior tests.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-STRICT
   */
  ```

- `getDevServerPath`:

  ```ts
  /**
   * Resolves the path to the dev-server script that is executed by tests.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-PORT-AUTO REQ-DEV-PORT-STRICT REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD
   */
  ```

- `createDevServerProcess`:

  ```ts
  /**
   * Spawns the dev-server Node.js process and captures stdout/stderr streams
   * for later assertions in tests.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP
   */
  ```

- `waitForDevServerMessage`:

  ```ts
  /**
   * Waits until the dev-server process emits a specific log message on stdout,
   * with a timeout, and fails early if the process exits before the message.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-HOT-RELOAD REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-INITIAL-COMPILE
   */
  ```

- `sendSigintAndWait`:

  ```ts
  /**
   * Sends SIGINT to the dev-server process and waits for it to exit,
   * asserting that it performs a clean and timely shutdown.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-GRACEFUL-STOP
   */
  ```

- `createMinimalProjectDir`:

  ```ts
  /**
   * Scaffolds a minimal temporary project directory containing a package.json
   * and a copied dev-server script, used for end-to-end runtime dev-server tests.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-TYPESCRIPT-WATCH REQ-DEV-HOT-RELOAD REQ-DEV-GRACEFUL-STOP
   */
  ```

- `createFakeProjectForHotReload`:

  ```ts
  /**
   * Creates a fake project that includes a compiled `dist/src/index.js`
   * HTTP server, allowing hot-reload behavior to be tested without running
   * a TypeScript compiler in watch mode.
   *
   * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-HOT-RELOAD
   */
  ```

All helpers now have explicit story/requirement traceability.

---

### 3) Add per-function traceability in generated-project test helpers (**NEXT #2**)

**File:** `src/generated-project.test-helpers.ts`

Per-function (and per-interface) JSDoc `@supports` added, aligned with existing stories:

- `GeneratedProjectSetupOptions` and `GeneratedProjectSetupResult`:

  ```ts
  /**
   * Options for setting up a temporary generated project for end-to-end tests.
   *
   * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
   */
  ```

  ```ts
  /**
   * Result describing the paths associated with an initialized generated project.
   *
   * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
   */
  ```

- `LinkNodeModulesOptions`:

  ```ts
  /**
   * Link the root repository's node_modules directory into an existing
   * generated project ...
   *
   * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
   */
  ```

- `initializeGeneratedProject`:

  ```ts
  /**
   * Initialize a new generated project in an OS temporary directory by calling
   * {@link initializeTemplateProject}, then link the root repository's
   * node_modules directory into the new project ...
   *
   * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-START-PRODUCTION
   */
  ```

- `TscBuildResult` + `runTscBuildForProject`:

  ```ts
  /**
   * Result object describing the outcome of running a TypeScript (tsc) build.
   *
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC
   */
  ```

  ```ts
  /**
   * Run `tsc -p tsconfig.json` inside the generated project ...
   *
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-BUILD-OUTPUT-DIST
   */
  ```

- `cleanupGeneratedProject`:

  ```ts
  /**
   * Remove the temporary directory that owns a generated project used in tests.
   *
   * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-E2E-INTEGRATION
   */
  ```

- `StartCompiledServerResult`:

  ```ts
  /**
   * Structure of the result returned when starting the compiled server ...
   *
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION
   */
  ```

- `assertNoSourceReferencesInLogs`:

  ```ts
  /**
   * Assert that stdout does not contain references to TypeScript .ts or src/ paths.
   *
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-OUTPUT-DIST
   */
  ```

- `assertHasJsonLogLine`:

  ```ts
  /**
   * Assert that stdout contains at least one structured JSON log line with \"level\".
   *
   * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-PROD-JSON REQ-LOG-STRUCTURED-JSON
   */
  ```

- `assertNoInfoLevelRequestLogs`:

  ```ts
  /**
   * Assert that stdout does not contain info-level request logs.
   *
   * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-LEVEL-CONFIG
   */
  ```

- `startCompiledServerViaNode`:

  ```ts
  /**
   * Start the compiled server by invoking `node dist/src/index.js` ..., returning child, health URL and stdout.
   *
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT REQ-START-LOGS
   * @supports docs/stories/008.0-DEVELOPER-LOGS-MONITOR.story.md REQ-LOG-STRUCTURED-JSON REQ-LOG-PROD-JSON
   */
  ```

Together with the existing file-level `@supports`, every named helper now has explicit traceability.

---

### 4) Reduce duplication in generated-project tests by centralizing HTTP/health polling (**NEXT #3**)

To keep tests focused on assertions and centralize runtime behavior:

**New file:** `src/generated-project-http-helpers.ts`

- Introduced dedicated HTTP helpers:

  ```ts
  /**
   * HTTP helpers for generated-project end-to-end tests.
   *
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT
   */
  import http from 'node:http';

  /**
   * Perform a single HTTP GET request to the health endpoint.
   *
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION
   */
  async function fetchHealthOnce(url: URL): Promise<{ statusCode: number; body: string }> { ... }

  /**
   * Poll the health endpoint until it responds or times out.
   *
   * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT
   */
  export async function waitForHealth(...) { ... }
  ```

**Updated file:** `src/generated-project.test-helpers.ts`

- Removed the local `http` import and the inline `fetchHealthOnce`/`waitForHealth` functions.
- Re-exported `waitForHealth` from the new helper module:

  ```ts
  import { initializeTemplateProject } from './initializer.js';
  export { waitForHealth } from './generated-project-http-helpers.js';
  ```

**Effect:**

- All generated-project tests that use `waitForHealth` (production and logging tests) now rely on a dedicated shared HTTP helper module, making the main helper module focus on project setup/build/runtime, and keeping tests themselves focused purely on their assertions and stories.
- There was no additional duplication in tests around server start beyond use of `startCompiledServerViaNode`, so no test code changes were required; the refactor is internal but meaningfully separates responsibilities and centralizes health polling.

---

### 5) Introduce `@typescript-eslint/no-unused-vars` ESLint rule (**NEXT #4**)

**Files:**

- `package.json`
- `eslint.config.js`

**Changes:**

1. **Add plugin dependency** in `package.json`:

   ```json
   "devDependencies": {
     "@eslint/js": "9.39.1",
     "@semantic-release/exec": "^7.1.0",
     "@types/node": "24.10.2",
     "@typescript-eslint/eslint-plugin": "8.49.0",
     "@typescript-eslint/parser": "8.49.0",
     ...
   }
   ```

2. **Integrate plugin and rule** in `eslint.config.js`:

   ```ts
   import js from '@eslint/js';
   import typescriptParser from '@typescript-eslint/parser';
   import tseslintPlugin from '@typescript-eslint/eslint-plugin';

   export default [
     { ...js.configs.recommended, ... },
     {
       files: ['**/*.ts'],
       languageOptions: {
         parser: typescriptParser,
         parserOptions: { ecmaVersion: 2024, sourceType: 'module' },
       },
       plugins: {
         '@typescript-eslint': tseslintPlugin,
       },
       rules: {
         complexity: 'error',
         'max-lines-per-function': ['error', { max: 80 }],
         'max-lines': ['error', { max: 300 }],
         '@typescript-eslint/no-unused-vars': 'error',
       },
     },
     { ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'vitest.config.mts'] },
   ];
   ```

3. Installed the new dev dependency:

   ```bash
   npm install
   ```

4. Verified configuration via:

   ```bash
   npx eslint --print-config src/index.ts
   ```

   Confirmed that `@typescript-eslint/no-unused-vars` is present as an `error` rule and that the `@typescript-eslint` plugin is active.

5. **No violations were reported**, so no suppressions were needed. This matches the incremental rule-enablement process: one new rule, run lints, and only add suppressions if there are failures.

---

### 6) Quality checks and CI

Locally executed (and passing):

- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm test`
- `npm run format:check`

CI/CD:

- Initial push with the ESLint plugin caused CI to fail on `format:check` (Prettier differences in `eslint.config.js` and `package.json`).
- I aligned formatting locally (Prettier `--write`), recommitted (`style: align eslint and package.json formatting after CI failure`), and pushed.
- The GitHub Actions “CI/CD Pipeline” workflow (`quality-and-deploy` job) is now **green**:
  - All quality gates (audit, lint, type-check, build, test, format:check, lint/format smoke) passed.
  - Semantic-release and smoke tests ran as before.

---

## Updated Plan with Status

### NOW

- [x] Refactor the dev server test file so that all test and describe callbacks comply with the configured maximum function length, removing every max-lines-per-function lint suppression in that file while keeping the existing dev server hot-reload and skip-watch test behaviors and assertions unchanged.

### NEXT

- [x] Add per-function traceability annotations to all named helpers in the dev server test helpers module so each helper clearly declares which dev-server story requirements it implements.
- [x] Add per-function traceability annotations to all named helpers in the generated-project test helpers module so each helper is linked to its corresponding initializer, build, logging, or security story requirements.
- [x] Reduce any remaining duplicated health-check or server-start logic across generated-project tests by routing those behaviors through the existing shared helpers, keeping each test file focused on its unique assertions.
- [x] Introduce one additional TypeScript-focused ESLint rule from the recommended set (for example, unused variables) into the lint configuration and add targeted suppressions where necessary so that the project’s lint baseline becomes slightly stricter without introducing failing checks. *(No suppressions were needed because the codebase already complied.)*

If you’d like, I can next tackle raising coverage toward the configured thresholds or further incremental ESLint rule enablement using the same process.
---
