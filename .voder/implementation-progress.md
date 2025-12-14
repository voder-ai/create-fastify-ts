# Implementation Progress Assessment

**Generated:** 2025-12-14T11:26:26.306Z

![Progress Chart](./progress-chart.png)

Projection: flat (no recent upward trend)

## IMPLEMENTATION STATUS: INCOMPLETE (87% ± 18% COMPLETE)

## OVERALL ASSESSMENT
Overall support-system quality is strong but not yet at the standard required to assess functionality. Code quality, testing, and execution are all in the low-to-mid 90s, with a well-structured TypeScript codebase, solid Vitest coverage (including temp-dir-based integration tests), and reliable build/lint/type-check pipelines. Documentation is mostly accurate but has some stale or incomplete areas; dependencies and security are generally healthy but miss automated security scanning in CI and a small safe dev-dependency update. The dominant blocker is version control and CI/CD governance: while trunk-based development and a unified semantic-release workflow are in place, the absence of CI-integrated security scanning keeps VERSION_CONTROL at 72%, below the required 90% threshold. Because of this, FUNCTIONALITY remains intentionally unscored and the project is considered incomplete until foundational version-control/security automation is strengthened.



## CODE_QUALITY ASSESSMENT (93% ± 18% COMPLETE)
- The project has a strong, well-enforced quality toolchain (ESLint, Prettier, TypeScript, jscpd, Husky) that all pass cleanly. Complexity, file size, and duplication are actively controlled, there are no disabled quality checks or obvious AI slop, and CI/CD plus git hooks enforce these checks. Only minor configuration simplifications and small stylistic improvements remain.
- npm-based quality tools are correctly configured and passing:
  - `npm run lint -- --max-warnings=0` passes using eslint 9 with a flat config (`eslint.config.js`).
  - `npm run format:check` passes; Prettier reports "All matched files use Prettier code style!".
  - `npm run type-check` (`tsc --noEmit`) passes under a strict TypeScript configuration.
  - `npm run duplication` passes with jscpd reporting only ~1.6% duplicated lines, all in tests and helper typings, not core production logic.
- ESLint configuration is appropriate and not overly relaxed:
  - Based on `@eslint/js` recommended configuration.
  - Uses `@typescript-eslint/parser` for `**/*.ts`.
  - Enforces key maintainability rules on TypeScript files:
    - `complexity: ['error', { max: 20 }]` – matches the desired default target; since lint passes, no function exceeds complexity 20.
    - `max-lines-per-function: ['error', { max: 80 }]` – ensures functions stay manageable; all current code satisfies this.
    - `max-lines: ['error', { max: 300 }]` – prevents oversized modules; all current files are under this limit.
  - Ignores only build artifacts and declarations (`dist/**`, `node_modules/**`, `**/*.d.ts`, `vitest.config.mts`), which is appropriate.
- There are **no disabled quality checks** in the main code paths:
  - `grep -R 'eslint-disable' src scripts` → no matches.
  - `grep -R '@ts-nocheck' src scripts` → no matches.
  - `grep -R '@ts-ignore' src scripts` → no matches.
  - This means ESLint and TypeScript rules are fully enforced across the codebase with no file-level or rule-level bypasses, avoiding hidden technical debt.
- TypeScript configuration is strict and covers the relevant code:
  - `tsconfig.json` uses strict mode (`"strict": true`), `forceConsistentCasingInFileNames: true`, `esModuleInterop: true`, and generates declarations.
  - `include`: `"src"` ensures both production and most test code are type-checked.
  - `exclude`: `dist`, `node_modules`, and a single Node `--test` file (`src/dev-server.test.ts`) – a reasonable carve-out for a runtime test script.
  - `skipLibCheck: true` trades some library type checking for performance, a common and acceptable compromise in many TypeScript projects.
- Code complexity, file size, and function size are under control:
  - Because ESLint passes with `complexity` set to 20, no function reaches the high-complexity range that would hurt maintainability.
  - `max-lines-per-function: 80` and `max-lines: 300` both pass, showing that functions and modules remain reasonably small and focused.
  - Key production files (`src/index.ts`, `src/cli.ts`, `src/server.ts`, `src/initializer.ts`) show good decomposition into small, well-named helpers rather than single large procedures.
- Duplication is low and localized:
  - jscpd (`npm run duplication`) reports:
    - 3 clones across TypeScript files, totaling 39 duplicated lines (1.61%) and 359 duplicated tokens (2.06%).
    - All clones are in tests or typings: `src/server.test.ts`, `src/dev-server-test-types.d.ts` ↔ `src/dev-server.test-helpers.ts`, and repeated test blocks in `src/cli.test.ts`.
  - There is **no notable duplication in core production modules**, so DRY is well maintained where it matters most.
- Production code is free of test-specific imports and logic:
  - `grep -R 'vitest' src` shows imports only in test files (`*.test.ts`, `*.test.js`), not in `index.ts`, `cli.ts`, `server.ts`, or `initializer.ts`.
  - `grep -R 'jest' src`, `grep -R 'mocha' src`, `grep -R 'sinon' src` all return no matches.
  - This confirms that production modules do not pull in testing frameworks or mocks, preserving production purity.
- Build and quality tooling are well configured and decoupled from unnecessary steps:
  - `package.json` scripts:
    - `build`: `tsc -p tsconfig.json && node ./scripts/copy-template-files.mjs`.
    - `test`: `vitest run`.
    - `lint`: `eslint .`.
    - `type-check`: `tsc --noEmit`.
    - `format`: `prettier --write .` and `format:check`: `prettier --check .`.
    - `duplication`: `jscpd --threshold 20 src scripts`.
  - No `prelint`, `preformat`, or other quality scripts depend on a prior build; lint/format/type-check all run directly on source files, avoiding unnecessary coupling and delays.
  - `preinstall` script conditionally runs `scripts/check-node-version.mjs` for consumers of the package, which is orthogonal to internal quality tooling.
- Git hooks enforce local quality gates in line with best practices:
  - `.husky/pre-commit` runs:
    - `npm run format`
    - `npm run lint`
    - This ensures formatting and linting issues are caught (and formatting auto-fixed) before each commit.
  - `.husky/pre-push` runs:
    - `npm run build`
    - `npm test`
    - `npm run lint`
    - `npm run type-check`
    - `npm run format:check`
  - These hooks match the guidance for fast pre-commit checks and comprehensive pre-push checks, helping keep the main branch clean and preventing CI failures.
- CI/CD pipeline is active and enforces quality checks:
  - GitHub Actions summary (`get_github_pipeline_status`) shows a unified "CI/CD Pipeline" on the `main` branch with recent successful runs.
  - Occasional failures followed by corrections indicate that issues are addressed rather than ignored.
  - Although the workflow file isn’t visible due to ignore filters, the presence of this unified pipeline aligns with a single, automated quality and deployment workflow.
- Scripts directory follows the centralized contract pattern and contains no dead scripts:
  - `scripts/` contains:
    - `check-node-version.mjs` (+ `.d.ts`)
    - `copy-template-files.mjs`
  - `package.json` references both via npm scripts:
    - `preinstall` uses `check-node-version.mjs`.
    - `build` uses `copy-template-files.mjs`.
  - There are no orphaned or unused dev scripts; everything is discoverable through `npm run` as required.
- No temporary or stray files pollute the repository:
  - `find . -name "*.patch" -o -name "*.diff" -o -name "*.rej" -o -name "*.bak" -o -name "*.tmp" -o -name "*~"` finds no results.
  - `.husky/.gitkeep` is the only intentionally empty-ish file for directory tracking.
  - No generated test projects or one-off fix scripts are committed, avoiding version-control noise.
- Naming, structure, and error handling contribute positively to code quality:
  - Functions and files have clear, intention-revealing names (`initializeTemplateProjectWithGit`, `scaffoldProject`, `buildServer`, `startServer`).
  - Code is modular: initializer logic, server setup, CLI entrypoint, and index exports are all separated and focused.
  - Error handling is explicit and consistent:
    - CLI surfaces user-facing usage and error messages and uses `process.exitCode` instead of `process.exit` in the common path.
    - `initializeGitRepository` captures success/failure details in a structured `GitInitResult` rather than throwing, matching documented behavior.
  - Only small, acceptable "magic" values remain (e.g., default port 3000), with no pervasive magic numbers in the core logic.
- Traceability annotations and comments are specific and non-sloppy:
  - Production modules use `@supports` annotations linking directly to concrete story/ADR markdown files in `docs/`.
  - Comments explain intent and future work in a targeted way (e.g., TODOs referencing specific future stories for build and dev-server behavior), instead of generic AI-style boilerplate.
  - There is no evidence of meaningless or contradictory documentation or placeholder comments.
- Minor potential areas for fine-tuning (not currently hurting score):
  - ESLint’s `complexity` rule is explicitly set to `{ max: 20 }`; since this matches the recommended default and code already passes, the config could be simplified to `complexity: 'error'` when convenient.
  - `max-lines` and `max-lines-per-function` thresholds are reasonable but could be gradually tightened as the project evolves if you want to enforce even smaller units.
  - `skipLibCheck: true` in `tsconfig.json` is a conscious performance choice but does mean some library typing issues could slip through. This is an acceptable compromise rather than a defect.

**Next Steps:**
- Optionally simplify ESLint’s complexity configuration once you are comfortable with the current state:
  - Since the codebase already passes `complexity: ['error', { max: 20 }]`, you can change this to `complexity: 'error'` to rely on the default while preserving the same behavior.
  - This reduces configuration noise without affecting quality.
- Consider gradual tightening of function and file length limits as the project grows:
  - Current limits (`max-lines: 300`, `max-lines-per-function: 80`) are healthy, but you may later choose to ratchet them down (e.g., 250/70, then 200/60) to maintain small, focused modules.
  - Use the incremental approach: lower the threshold, run `npm run lint` to see any new violations, and refactor those specific locations in small steps.
- Re-evaluate `skipLibCheck: true` when performance budget allows:
  - Try setting `"skipLibCheck": false` and running `npm run type-check` to see if performance remains acceptable and whether any library typing problems surface.
  - If there are only a few noisy dependencies, prefer targeted workarounds (e.g., excluding certain paths or adding local type shims) over a blanket skip.
- Minor cleanup of implicit constants in server configuration:
  - In `src/server.ts`, consider extracting `3000` and `'0.0.0.0'` into named constants like `DEFAULT_PORT` and `DEFAULT_HOST` for clearer intent and easier future configuration.
  - This is low priority but slightly improves readability and maintainability.
- Optionally reduce small pockets of test duplication reported by jscpd:
  - Review duplicated blocks in `src/server.test.ts` and `src/cli.test.ts`.
  - If duplication grows as more tests are added, extract shared helpers or fixtures (e.g., request helpers, CLI invocation helpers) to keep tests DRY and easier to maintain.
- Ensure CI continues to use the same npm scripts as local hooks for consistency:
  - Confirm your CI workflow uses `npm run build`, `npm test`, `npm run lint`, `npm run type-check`, `npm run format:check`, and `npm run duplication` instead of calling tools directly.
  - This prevents divergence between local and CI behavior and keeps the "scripts" contract as the single source of truth.

## TESTING ASSESSMENT (96% ± 19% COMPLETE)
- The project’s testing is in excellent shape: it uses Vitest with non-interactive commands, all tests pass, coverage is high with meaningful scenarios (including error paths), tests are isolated via temp directories and proper cleanup, and traceability to stories/ADRs is consistently implemented. Only minor improvements remain around a few uncovered branches and small amounts of logic in some tests.
- Framework & configuration: The project uses Vitest (v4.0.15) as the established testing framework, configured via vitest.config.mts. Tests are discovered under src/**/*.test.{ts,js}, with dist and node_modules excluded. Coverage thresholds (80% for lines/statements/branches/functions) are configured and enforced.
- Execution & pass rate: Running `npm test` executes `vitest run` (non-interactive). All 8 test files run with 48 passing tests and 1 skipped; no failures. `npm run test:coverage` also passes, confirming the test suite is stable and CI-ready.
- Coverage quality: Coverage is high overall (≈92% statements/lines, ≈83% branches, ≈92% functions). Core modules (src/index.ts and src/server.ts) have 100% coverage. initializer.ts is at ~97% with one uncovered branch, and dev-server.test-helpers.ts plus the node version script have minor uncovered paths. Thresholds are met and exceeded, and uncovered areas are non-critical helpers or rare branches.
- Test isolation & repo cleanliness: All tests that create files or projects use OS temp directories (fs.mkdtemp with os.tmpdir). initializer and CLI tests change cwd into temp dirs and restore it, then recursively delete the temp tree in afterEach/finally. Dev-server tests create temp project dirs and clean them up in finally blocks, even on errors. A dedicated hygiene test (repo-hygiene.generated-projects.test.ts) enforces that no known generated-project directories exist at repo root. This satisfies the strict requirement that tests not modify repository contents.
- Non-interactive, non-polluting commands: `npm test` and `npm run test:coverage` both run Vitest in non-watch mode. Husky hooks run format, lint, build, test, type-check, and format:check without any interactive prompts. Child processes spawned by tests (dev server, npm runs) are controlled and terminated programmatically with timeouts, avoiding hanging or interactive behavior.
- Traceability to stories & ADRs: Every major test file includes `@supports` annotations mapping to docs/stories/*.story.md or docs/decisions/*.accepted.md with requirement IDs (e.g., REQ-INIT-DIRECTORY, REQ-DEV-PORT-STRICT, REQ-TSC-BOOTSTRAP). Describe blocks often include story IDs and REQ IDs, and many test names embed requirement IDs. This gives strong bidirectional traceability between requirements/decisions and tests.
- Test structure & readability: Test file names match the functionality under test (e.g., initializer.test.ts, cli.test.ts, dev-server.test.ts, server.test.ts) and avoid coverage terminology. Tests are well-organized with clear Arrange–Act–Assert flow, descriptive names (e.g., "creates package.json with basic fields and dependencies for Fastify + TypeScript"), and focused assertions. There is some light control flow (loops) in a few tests (index.test.ts/js) but it remains straightforward and readable.
- Behavior-focused testing & error coverage: Tests exercise both happy paths and rich error conditions: HTTP 404/400 paths, malformed JSON, invalid and in-use ports, invalid project names, absence of git, and invalid Node.js versions. Dev-server integration tests validate port semantics, TypeScript watch skipping in test mode, hot-reload behavior, and graceful shutdown via SIGINT. Node version enforcement tests validate parsing, comparison logic, and clear error messaging that references the relevant ADR and story.
- Independence, speed & determinism: Each test sets up and tears down its own context; there is no reliance on ordering or shared state across files. The full suite runs in under 2 seconds, with only the process-spawning dev-server tests running in the hundreds of milliseconds range, which is acceptable for their level. No randomness is used; port allocation is controlled (either ephemeral via net.createServer().listen(0) or explicit port numbers), and all long waits are guarded by timeouts to avoid flakiness.
- Minor improvement areas: A small number of branches in initializer.ts and dev-server.test-helpers.ts remain uncovered and could be exercised with a couple of targeted negative-path tests. Some tests contain simple loops that could be made even clearer by removing control flow, but they are already understandable and not problematic. Overall, these issues are minor and do not materially affect test reliability or coverage of implemented functionality.

**Next Steps:**
- Add a small number of targeted tests to cover the remaining uncovered branches, particularly the uncovered path in initializer.ts (around the reported line ~268) and any untested error/timeout branches in dev-server.test-helpers.ts to move branch coverage closer to 100% for critical modules.
- Consider simplifying the few tests that use loops (e.g., in src/index.test.ts and src/index.test.js) by replacing loops with straightforward repeated expectations or table-driven tests, further aligning with the “no logic in tests” guideline while keeping behavior coverage the same.
- If additional edge behavior exists in the initializer or dev server (e.g., handling of already-existing project directories, unusual project names, or more complex git failure modes), add explicit tests for those scenarios to further harden error handling.
- Keep the test suite aligned with any future changes to logging messages in template-files/dev-server.mjs by centralizing key log phrases as constants or focusing assertions on stable aspects of behavior (e.g., restart counts or state) to reduce coupling to log wording while still validating hot-reload and watcher behavior.

## EXECUTION ASSESSMENT (93% ± 18% COMPLETE)
- Runtime execution for this project is strong and well-validated. The build, tests, linting, and type-checking all run successfully via project scripts. Core runtime behaviors for the Fastify server, dev server, initializer, CLI, and Node version enforcement are exercised with realistic integration tests. Error handling and input validation are present and tested. The main gap is that the full "init → npm install → npm run dev → /health" path for a freshly generated project is only covered by a skipped E2E test, so it’s not validated in routine runs.
- Build process is sound and reproducible:
  - `npm run build` succeeds, running `tsc -p tsconfig.json` and `node ./scripts/copy-template-files.mjs`.
  - TypeScript compilation passes without emitting errors, and template assets are copied into `dist`, ensuring published packages include runnable templates.
  - Build is invoked through the canonical `build` script in package.json, not ad‑hoc commands.
- Local execution environment and core checks are all green:
  - `npm test` (Vitest) passes: 8 test files, 48 tests passed, 1 skipped, total duration ≈1.8s.
  - `npm run lint` (ESLint 9) passes with the current configuration.
  - `npm run type-check` (`tsc --noEmit`) passes, confirming type-level consistency.
  - Tests cover real runtime behavior: Fastify server, dev-server child processes and fs watchers, CLI, initializer, and Node version check logic.
- Fastify API server runtime is correct and well-tested:
  - `src/server.ts` defines `buildServer()` and `startServer()` using Fastify with logging and `@fastify/helmet`.
  - `src/server.test.ts` validates:
    - `GET /health` and `HEAD /health` return 200 with JSON and `{ status: 'ok' }` payload.
    - Unknown routes (`/not-found`, `HEAD /not-found-head`) return 404 with proper JSON error bodies.
    - Unsupported `POST /health` returns 404 JSON error.
    - Malformed JSON on POST returns 400 with a clear message mentioning invalid JSON.
    - `startServer(0)` and repeated start/stop on ephemeral ports work and `startServer(-1)` rejects with an Error.
    - Security headers from Helmet (CSP, HSTS, X-Frame-Options, etc.) are present and asserted in tests.
- Dev server for generated projects behaves robustly at runtime:
  - `src/template-files/dev-server.mjs` implements:
    - Port resolution (`resolveDevServerPort`), validating `PORT`, enforcing 1–65535, checking availability with `net`, and auto-discovering a free port when unset.
    - Main workflow that asserts `package.json` exists, resolves port, optionally starts `npx tsc --watch`, launches `node dist/src/index.js`, and sets up `fs.watch` for hot-reload on `dist/src/index.js` changes.
    - Graceful shutdown on SIGINT/SIGTERM, terminating watcher, tsc, and server child processes before exiting.
  - `src/dev-server.test.ts` and `src/dev-server.test-helpers.ts` verify:
    - Auto and strict port modes, invalid `PORT`, and port-in-use errors via `DevServerError`.
    - `DEV_SERVER_SKIP_TSC_WATCH=1` behavior in test mode, ensuring the process stays alive and exits cleanly after SIGINT.
    - Hot-reload: modifying `dist/src/index.js` triggers the watcher, logs restart messages, and allows graceful SIGINT termination.
    - All temporary project directories are created via `fs.mkdtemp` and cleaned up with recursive `fs.rm`.
- Initializer and CLI workflows are executed and validated using compiled output:
  - `src/initializer.ts` scaffolds new projects:
    - Creates a directory under `process.cwd()` and writes `package.json`, `tsconfig.json`, `README.md`, `.gitignore`, `src/index.ts`, and `dev-server.mjs` from `src/template-files`.
    - `initializeTemplateProject` trims and validates the project name, throwing on empty names.
    - `initializeGitRepository` runs `git init` and returns a structured result without throwing on failure.
    - `initializeTemplateProjectWithGit` combines scaffolding+git and returns `{ projectDir, git }`.
  - `src/initializer.test.ts` checks:
    - All expected files exist and have reasonable content (dependencies, scripts, README “Next Steps”, .gitignore patterns, Fastify-based `src/index.ts`).
    - Name validation (empty vs trimmed names).
    - Git initialization both when git is available and when simulated absent (by clearing PATH), ensuring graceful failure.
  - `src/cli.ts` uses `initializeTemplateProjectWithGit` and handles:
    - Missing project name by printing usage and setting `process.exitCode = 1`.
    - Successful initialization by logging paths and git status.
    - Errors by logging and setting a non-zero exitCode.
  - `src/cli.test.ts` runs the built CLI (`dist/cli.js`) via `spawn` to:
    - Confirm a project directory is created for a given name in a temp cwd.
    - Confirm scaffolding succeeds even when git is hidden from PATH.
- Node version enforcement and runtime environment validation are explicitly implemented and tested:
  - `scripts/check-node-version.mjs` exports `MINIMUM_NODE_VERSION = '22.0.0'`, parsing/comparison helpers, and `enforceMinimumNodeVersionOrExit()`.
  - `package.json` defines `"engines": { "node": ">=22.0.0" }` and a `preinstall` hook that runs the version check.
  - `src/check-node-version.test.js` verifies parsing, semantic comparisons, and that error messages for unsupported versions contain specific guidance and documentation references.
  - This ensures attempts to run the project on unsupported Node versions fail fast with clear, user-facing diagnostics.
- Input validation, error handling, and non-silent failures are in good shape:
  - CLI validates presence of a project name and uses exit codes appropriately.
  - Initializer validates non-empty trimmed project names and throws on invalid input.
  - Dev server validates `PORT` and project structure, logging descriptive errors and exiting when conditions are not met.
  - Fastify server relies on framework behavior for error responses, which tests confirm are well-formed JSON with correct status codes.
  - Version check and preinstall script handle unsupported Node versions with verbose messages, not silent failures.
  - Tests explicitly cover both happy paths and several failure paths (invalid ports, no git, invalid project names).
- Resource management and performance are appropriate for the current scope:
  - No database or remote services are present; N+1 query concerns do not apply.
  - Dev server manages child processes and fs watchers carefully, with explicit shutdown paths and tests verifying graceful SIGINT handling and time-bounded exits.
  - Temporary directories and generated files for tests are created under OS temp dirs and cleaned up, enforced by `repo-hygiene.generated-projects.test.ts`.
  - Workflows are light and fast; no obvious excessive allocations or hot-path inefficiencies for this template/CLI use case.
- End-to-end workflow coverage is strong but not yet complete by default:
  - Most critical flows (project scaffolding, git init behavior, server runtime, dev-server runtime, port resolution, Node version enforcement) are tested in realistic conditions.
  - There is a full E2E CLI test in `src/cli.test.ts` that initializes a project, runs `npm install`, starts the dev server via `npm run dev`, and hits `/health`; however, this test is currently `it.skip` because it depends on environment-specific npm paths.
  - As a result, the most realistic "init → install → dev → hit /health" scenario is not exercised in regular local test runs, representing the main gap in runtime verification for a top-tier score.

**Next Steps:**
- Make the full CLI E2E test opt-in rather than permanently skipped:
  - Replace `it.skip` in `src/cli.test.ts` with a conditional (e.g. `it(process.env.RUN_CLI_E2E ? '...' : '... skipped', function ...)`), running the test only when an environment flag is set.
  - Document in the repo (developer docs) how to run this full-path test locally (`RUN_CLI_E2E=1 npm test`). This will allow deeper runtime validation when desired, without slowing normal runs.
- Add a small, scripted smoke test for generated projects:
  - Introduce a script (e.g. `npm run smoke:generated`) that, in a temp directory, uses the library API or CLI to scaffold a project, installs dependencies, and runs a basic command (like `npm run dev -- --help` or a future `npm test`).
  - This provides an explicit, runnable demonstration that a generated project is coherent and runnable end-to-end beyond unit/integration tests.
- Extend dev-server tests to cover error logging paths:
  - Add targeted tests that invoke `resolveDevServerPort` under failing conditions (invalid `PORT`, ports in use) via the dev-server entry module and assert the console error format and non-zero exit code.
  - This strengthens guarantees that misuse is always surfaced with helpful messages at runtime, not just through thrown errors.
- Once the generated template’s runtime contract is fully defined, add a real Fastify-based dev-server integration test:
  - In a temp directory, scaffold a full project, run `tsc` to produce `dist`, then start `dev-server.mjs` and hit `/health`.
  - This would validate the interplay between the generated Fastify app, its build output, and the dev server in one test, closing the remaining gap in E2E coverage.
- Keep an eye on the longer-running dev-server tests and isolate them if needed:
  - If hot-reload or SIGINT tests ever become flaky or slow (due to timing, environment load, or platform differences), consider marking them as a separate test group (e.g. `dev-server.e2e` or using Vitest’s `test.concurrent`/`test.runIf`) so developers can run fast vs full suites explicitly while still having the deeper runtime checks available.

## DOCUMENTATION ASSESSMENT (82% ± 18% COMPLETE)
- User-facing documentation is well-structured, mostly accurate, and clearly separated from internal project docs. Links are correctly formatted and all linked user docs are published with the package. Versioning and CI/CD behavior are documented and match the semantic-release setup. However, parts of README and user-docs are now stale relative to the actual implementation (especially security behavior and generated project test scripts), and some named helper/script functions are missing required traceability annotations, preventing a top-tier score.
- README.md is present at the root, clearly structured (Quick Start, What’s Included, Development, Testing, Generated project endpoint, Releases and Versioning, API Reference, Security, Attribution) and accurately describes the CLI usage and basic behavior of the template initializer (`npm init @voder-ai/fastify-ts my-api` with `dev` script implemented and `build`/`start` as TODO placeholders).
- README attribution requirement is fully met: there is an explicit "Attribution" section with the text `Created autonomously by [voder.ai](https://voder.ai).`. All user-docs (`user-docs/api.md`, `testing.md`, `SECURITY.md`) also include the same attribution line.
- User-facing documentation is correctly separated from internal project docs: user-facing files are `README.md`, `CHANGELOG.md`, `LICENSE`, and everything under `user-docs/`. Internal development docs live under `docs/` (including stories and decisions) and are not referenced from README or user-docs, nor included in `package.json`'s `files` array.
- Link formatting and integrity are very good: README uses proper markdown links to user-docs (`[Testing Guide](user-docs/testing.md)`, `[API Reference](user-docs/api.md)`, `[Security Overview](user-docs/SECURITY.md)`), all of which exist and are published (since `user-docs` is in `files`). There are no user-facing links to `docs/`, `prompts/`, or `.voder/`, and code references (filenames, CLI commands, functions) are formatted with backticks rather than links.
- `CHANGELOG.md` correctly documents that semantic-release manages versions and that `package.json`'s `version` is intentionally not authoritative. It directs users to GitHub Releases and npm for actual version information, which matches the presence of `.releaserc.json` and the CI/CD workflow invoking `npx semantic-release`. This aligns documentation with the actual release strategy.
- The CI/CD workflow `.github/workflows/ci-cd.yml` is a single unified pipeline triggered on `push` to `main`; it runs lint, type-check, build, tests, format-check, then semantic-release, followed by a post-release smoke test that installs the just-published package and asserts `getServiceHealth() === 'ok'`. This matches the intended "automatic publishing on main" strategy described in docs, although README still phrases semantic-release as a "planned enhancement" rather than a fully wired workflow.
- API documentation in `user-docs/api.md` accurately reflects the actual exported public API from `src/index.ts`: `getServiceHealth()`, `initializeTemplateProject()`, `initializeTemplateProjectWithGit()`, and the `GitInitResult` type. The signatures, behavior narratives, and examples match the implementation in `src/index.ts` and `src/initializer.ts`, including best-effort Git initialization semantics and error modes for filesystem/template-creation errors.
- Security documentation is partly out of date: README lists "Security headers via @fastify/helmet" as a planned, not-yet-implemented enhancement, and `user-docs/SECURITY.md` explicitly claims that freshly generated projects do not install or register `@fastify/helmet`. In reality, both the internal stub server (`src/server.ts`) and generated project template (`src/template-files/src/index.ts.template`) import and register `@fastify/helmet`, and the initializer adds `@fastify/helmet` to the generated project's `dependencies`. Tests in `src/server.test.ts` also assert the presence of security headers. This mismatch is a notable accuracy issue.
- Endpoint documentation for generated projects is slightly inaccurate: README’s "Generated project endpoint" section only mentions `GET /` returning Hello World JSON, and `user-docs/SECURITY.md` states that `GET /` is the only application endpoint. The template index (`src/template-files/src/index.ts.template`) actually defines both `GET /` and `GET /health`, so user-facing docs should mention `/health` as well.
- Testing documentation in `user-docs/testing.md` currently says "From the root of the generated project:" and describes commands `npm test`, `npm run test:coverage`, and `npm run type-check`. These commands exist for this template repository (in the root `package.json`) but are not presently scaffolded into generated projects, which only receive `dev`, `build`, and `start` scripts from `createTemplatePackageJson()`. This is misleading for end users of the CLI who look at user-docs expecting those scripts in their generated app.
- `CHANGELOG.md`'s "Current feature set" description (simple `getServiceHealth()` and a Fastify server helper providing `GET /health`) matches the actual implementation and does not overstate implemented features. It complements the more detailed README and API docs without contradiction.
- License information is consistent: `package.json` declares `
- next_steps

**Next Steps:**
- Update the README Security section to reflect that `@fastify/helmet`-based security headers are already implemented for both the stub server and generated projects. Move helmet from the "Planned Enhancements" list into "Currently Implemented" (or equivalent) and clarify which additional security items (structured logging, env validation, CORS) are still future work.
- Revise `user-docs/SECURITY.md` so it no longer claims that freshly generated projects do not install or register `@fastify/helmet`. Document instead that new projects include `@fastify/helmet` as a dependency and that the generated `src/index.ts` registers it by default, while keeping the CSP and CORS configuration guidance (which is still valid).
- Adjust both README and `user-docs/SECURITY.md` to accurately describe endpoints in a generated project: explicitly document both `GET /` (Hello World JSON) and `GET /health` (status JSON), and clearly distinguish these from the internal stub server’s `GET /health` endpoint described in CHANGELOG and server tests.
- Clarify the audience and behavior in `user-docs/testing.md`: either (a) rewrite it to explicitly describe testing this template repository (and consider moving it under `docs/` as a contributor guide), or (b) extend the initializer so generated projects include test/type-check scripts and example tests matching the guide. Until such scripts exist in the scaffolded app, avoid language like "From the root of the generated project" for commands that don’t exist there.
- Tighten the `initializeTemplateProject()` documentation in `user-docs/api.md` to match real behavior around existing directories. Either explicitly state that it may overwrite files in an existing directory (with `fs.mkdir(..., { recursive: true })`), or adjust the implementation if the intended behavior is to fail when the target directory already exists in a non-empty/non-overwritable way.
- Add missing `@supports` traceability annotations for named functions in `scripts/check-node-version.mjs` (`parseNodeVersion`, `isVersionAtLeast`, `getNodeVersionCheckResult`, `enforceMinimumNodeVersionOrExit`), referencing the appropriate story/decision (`docs/stories/002.0-DEVELOPER-DEPENDENCIES-INSTALL.story.md`, `docs/decisions/0012-nodejs-22-minimum-version.accepted.md`). This aligns the script with the stated traceability requirement that all named functions have parseable annotations.
- Add function-level `@supports` annotations to the named helpers in `src/dev-server.test-helpers.ts` (e.g., `createServerOnRandomPort`, `createDevServerProcess`, `waitForDevServerMessage`, `sendSigintAndWait`, `createMinimalProjectDir`, `createFakeProjectForHotReload`), mapping each to the relevant dev-server requirements (port handling, hot reload, graceful stop, TS watch) already cited at the file level.
- Update the "Releases and Versioning" section in README to remove wording that semantic-release is only a "planned enhancement". Instead, describe the current, working setup: every push to `main` runs the unified CI/CD pipeline, and when semantic-release determines a new version is needed, it publishes to npm and GitHub automatically, with a post-release smoke test.
- Optionally align `src/template-files/README.md.template` and root README phrasing so that a user who opens the generated project’s README sees wording consistent with what’s described in the template’s main README (e.g., explicitly mentioning that `build` and `start` scripts are placeholders and that `dev` runs `dev-server.mjs`). This improves coherence between package-level docs and generated-app docs.

## DEPENDENCIES ASSESSMENT (88% ± 18% COMPLETE)
- Dependencies are generally in very good shape: installs and audits are clean, the lockfile is tracked, and the toolchain works end-to-end. However, `npx dry-aged-deps` shows one mature, safe update (`jscpd`) that has not yet been applied, so the project is slightly short of the optimal state where all eligible dependencies are on their latest safe versions.
- `npx dry-aged-deps --format=xml` was executed and returned 4 outdated packages, with `<safe-updates>1</safe-updates>` and `<filtered-by-age>3</filtered-by-age>`, confirming that some newer versions exist but only one is currently considered a safe, mature update.
- The XML output shows three packages with newer versions that are filtered out by age: `@eslint/js` (9.39.1 → 9.39.2, age 1, `filtered>true</filtered>`), `@types/node` (24.10.2 → 25.0.2, age 0, `filtered>true</filtered>`), and `eslint` (9.39.1 → 9.39.2, age 1, `filtered>true</filtered>`). These are correctly held back due to being < 7 days old, and therefore do not count against dependency health.
- The same `dry-aged-deps` run reports `jscpd` with `<current>4.0.4</current>`, `<latest>4.0.5</latest>`, `<age>529</age>`, and `<filtered>false</filtered>`. Under the project’s strict policy, this means `jscpd` is out of date and must be upgraded to 4.0.5, since it is an actively used dev dependency (invoked via the `duplication` script) and the newer version is safely mature.
- `package.json` is well-structured and aligned with the tooling in use: it defines `fastify` and `@fastify/helmet` as runtime dependencies and uses modern dev tooling (`typescript`, `vitest`, `eslint` 9, `prettier` 3, `husky` 9, `semantic-release` 25, `jscpd`, etc.) with appropriate scripts (`build`, `test`, `lint`, `type-check`, `format`, `release`, `duplication`). This indicates good package management practices.
- `package-lock.json` exists and is confirmed to be tracked in git via `git ls-files package-lock.json` (which outputs `package-lock.json`), satisfying the requirement for a committed lockfile and ensuring reproducible installs.
- `npm install` completes successfully, runs the `preinstall` and `prepare` (husky) scripts, and reports `up to date, audited 744 packages` with `found 0 vulnerabilities` and no `npm WARN deprecated` messages, demonstrating that dependencies are installable, free from reported deprecations, and have a clean basic security audit.
- `npm audit --audit-level=low` reports `found 0 vulnerabilities`, confirming there are currently no known vulnerabilities at or above the lowest severity threshold in the installed dependency tree. While audit results don’t override the dry-aged policy, they reinforce that the present versions are safe from known issues.
- `npm ls` runs successfully (exit code 0) and lists all top-level dependencies without any errors about unmet peer dependencies, invalid ranges, or cycles, indicating a healthy and compatible dependency tree.
- Toolchain commands that exercise dependencies (`npm test` with Vitest, TypeScript compilation via `build`/`type-check`, and linting/formatting via `eslint` and `prettier`) run successfully, showing that the current dependency versions are mutually compatible and support the implemented functionality.
- The project uses semantic-release (confirmed by `semantic-release` in devDependencies, a `release` script, and `.releaserc.json`), so the `version` field in `package.json` being `0.0.0` is intentional and not a dependency management problem; releases are governed by git tags rather than manual version bumps in the manifest.

**Next Steps:**
- Update the `jscpd` devDependency to the latest safe version indicated by `dry-aged-deps` (4.0.5): edit `package.json` to set `"jscpd": "4.0.5"` and then run `npm install` to update `package-lock.json`, bringing `<current>` in line with `<latest>` for this unfiltered package.
- After updating `jscpd`, run the full local quality suite to confirm compatibility and preserve working software: `npm run build`, `npm test`, `npm run lint`, `npm run type-check`, and `npm run format:check`. Fix any issues that arise, though a minor `jscpd` bump is unlikely to affect runtime code.
- Commit the dependency update using a Conventional Commit message appropriate for dependency changes (e.g., `build: update jscpd to 4.0.5`), push the commit, and verify that the CI/CD pipeline passes end-to-end, ensuring the new dependency version is stable in your automated environment.
- Re-run `npx dry-aged-deps --format=xml` after the upgrade and confirm that no packages appear with `<filtered>false</filtered>` where `<current> < <latest>`. At that point, all dependencies will be on their latest safe versions according to the maturity filter, which will move the dependencies aspect into the 90–100% range.

## SECURITY ASSESSMENT (88% ± 18% COMPLETE)
- Dependencies are currently vulnerability-free, secrets handling is solid (including generated projects), the HTTP surface is very small and protected by security headers, and CI/CD uses proper secrets handling. The main gaps are the absence of automated dependency security checks in CI and a minor outdated dev dependency flagged by dry-aged-deps.
- Existing security incidents
- Status: none
- Evidence:
  - docs/security-incidents/ directory does not exist (no historical incident records).
  - No *.disputed.md, *.resolved.md, *.proposed.md, or *.known-error.md files found.
- Impact: No prior vulnerabilities to re-verify; no audit-filtering configuration required.
- Dependency vulnerabilities (runtime & dev)
- Status: pass
- Evidence:
  - npm install completed successfully, then `npm audit --json` reported 0 vulnerabilities across all severities.
  - Dependencies in package.json: runtime: fastify@5.6.2, @fastify/helmet@13.0.2; dev tooling for linting, formatting, tests, release, duplication checks only.
  - No unusual overrides beyond `overrides.semver-diff: 4.0.0`.
- Impact: No known CVEs or advisories currently affecting installed dependencies according to npm’s database.
- Safe upgrade options (dry-aged-deps)
- Status: minor issue
- Evidence:
  - `npx dry-aged-deps` output: Outdated dev package jscpd 4.0.4 → 4.0.5 (age ~529 days, clearly mature).
  - Command exited with code 1 solely due to the outdated package listing, not vulnerabilities.
- Impact: Only a dev-time duplication detector is outdated; risk is very low and limited to development tooling. No blocking vulnerabilities, but policy expects using dry-aged-deps recommendations when feasible.
- Conflicting dependency automation tools
- Status: pass
- Evidence:
  - No .github/dependabot.yml or .github/dependabot.yaml.
  - No renovate.json or .github/renovate.json.
  - .github/workflows/ci-cd.yml has no Dependabot/Renovate steps; only quality checks + semantic-release.
- Impact: Single source of truth for dependency and release automation; no operational confusion from overlapping bots.
- Secrets management in this repo
- Status: pass
- Evidence:
  - .gitignore explicitly ignores: .env, .env.local, .env.development.local, .env.test.local, .env.production.local, while allowing .env.example.
  - find for '*.env' and '.env*' returned no tracked env files.
  - `git ls-files .env` → empty; `.env` is not tracked.
  - `git log --all --full-history -- .env` → empty; `.env` has never been committed.
  - Grep for 'API_KEY', 'SECRET', 'TOKEN' across source (excluding lockfiles, node_modules, dist) found no matches.
- Impact: No secrets appear in version control; standard .env pattern is correctly configured and not abused. This is compliant with the policy; no key rotation or .env changes needed.
- Secrets handling in generated projects
- Status: pass
- Evidence:
  - Initializer copies src/template-files/.gitignore.template into new projects, which contains `.env` and `.env.local` ignores by default.
  - ADR 0010-fastify-env-configuration.accepted.md mandates `.env` in .gitignore and .env.example usage; although @fastify/env isn’t wired yet, generated .gitignore behavior already matches that decision.
- Impact: Newly scaffolded projects will not accidentally commit .env files, aligning with secure local secret handling out of the box.
- Code security – HTTP surface and headers
- Status: pass
- Evidence:
  - src/server.ts uses Fastify and registers @fastify/helmet with defaults: `app.register(helmet);`.
  - Only implemented route in library server is `GET /health` returning static JSON `{ status: 'ok' }`.
  - Generated project template src/template-files/src/index.ts.template uses Fastify with `await fastify.register(helmet);` and only defines `GET /` and `GET /health` returning static JSON.
  - docs/decisions/0006-fastify-helmet-security-headers.accepted.md mandates helmet usage; implementation matches ADR.
- Impact: Attack surface is minimal (simple JSON-only endpoints), and responses include robust security headers via helmet. No dynamic HTML output, so XSS risk is effectively nil in current scope.
- Input validation, injection risks, and data handling
- Status: pass (given current scope)
- Evidence:
  - No database, ORM, or raw SQL present; no DB configuration or external storage implemented.
  - HTTP endpoints currently accept no user-controlled parameters besides HTTP metadata; responses are static JSON, not templated HTML or JS.
  - CLI (src/cli.ts) takes a single argument (projectName) and passes it into filesystem operations after a trim; it creates directories and writes files but doesn’t execute dynamic code derived from that input.
- Impact:
  - SQL injection: not applicable (no DB or query construction).
  - XSS: not applicable with current pure-JSON, static responses.
  - Path traversal via CLI: this is a local developer scaffolding tool; anyone running it already has write access, so additional risk is negligible.
- Configuration & environment handling
- Status: mostly pass
- Evidence:
  - Root tsconfig.json uses NodeNext module + strict options, with no obvious security-relevant misconfigurations.
  - Template tsconfig.json.template is similar, with strict mode and focused include/exclude.
  - ADR 0010-fastify-env-configuration.accepted.md defines a plan to use @fastify/env for validated config and .env handling, but the implementation is not yet wired in (no @fastify/env dependency or plugin usage in code).
  - Template server uses `const port = Number(process.env.PORT ?? 3000);` without specific validation; port value is inherently low-risk.
- Impact: Current configuration is simple and does not yet manage sensitive data like DB URLs or API keys. Lack of @fastify/env wiring is a missing feature rather than a vulnerability at this stage.
- Build, deployment & CI/CD security
- Status: good, with a small gap
- Evidence:
  - .github/workflows/ci-cd.yml runs on push to main only; it performs lint, type-check, build, tests, and format:check, then runs semantic-release, then an npm-based smoke test using the published package and `getServiceHealth()`.
  - NPM_TOKEN and GITHUB_TOKEN are sourced from GitHub Actions secrets and used only by semantic-release and npm auth; they are not printed to logs.
  - Post-release job installs the just-published package in a temp directory and imports it without exposing secrets.
  - docs/development-setup.md and docs/security-practices.md both note that dedicated security scanning (beyond dependency health) is not yet integrated into the pipeline.
  - The CI pipeline does not currently run `npm audit` or `npx dry-aged-deps` as part of its steps.
- Impact:
  - Release process and token handling are sound and automated (true continuous deployment).
  - Dependency vulnerability checks rely on developers running npm audit locally; there is no automated dependency security gate in CI, which is a minor gap relative to the stated security policy.
- Pre-commit and pre-push hooks
- Status: pass
- Evidence:
  - .husky/pre-commit runs `npm run format` and `npm run lint`.
  - .husky/pre-push runs `npm run build`, `npm test`, `npm run lint`, `npm run type-check`, `npm run format:check`.
  - These hooks match the documented expectations in docs/development-setup.md.
- Impact: Hooks prevent most low-level quality issues and type/lint regressions from reaching CI, indirectly supporting security by reducing configuration and logic mistakes.
- Hardcoded secrets and logging
- Status: pass
- Evidence:
  - No API keys, tokens, passwords, or connection strings found in src/, scripts/, or template-files/ based on targeted greps and manual inspection of key modules.
  - Logging uses Fastify’s built-in logger (Pino) with default configuration, only logging request metadata in tests. There is currently no logging of sensitive payloads because no such payloads are handled.
- Impact: No secret leakage through source or obvious log sinks in current scope.
- Security documentation and practices
- Status: strong
- Evidence:
  - docs/security-practices.md documents current security posture, contributor practices, and expectations for dependency vigilance and input validation.
  - ADRs (0002, 0006, 0009, 0010) tie architectural choices directly to security properties (framework, helmet, CORS strategy, env management).
  - docs/development-setup.md includes a section on security posture and contributor responsibilities (no secrets in git, dependency vigilance, input validation, treatment of security warnings).
- Impact: Security intent is well-articulated and aligned with implementation for the minimal feature set. This reduces the risk of accidental insecure patterns as the project grows.

**Next Steps:**
- Integrate automated dependency vulnerability checks into CI/CD:
- Add a step in .github/workflows/ci-cd.yml to run a non-interactive dependency audit (e.g. `npm audit --production` or a filtered tool like `better-npm-audit`/`audit-ci`) after `npm ci` and before the main quality gates.
- Configure it to fail on moderate-or-higher vulnerabilities, in line with the security policy.
- Adopt dry-aged-deps in CI for safe upgrade visibility:
- Add a non-blocking step that runs `npx dry-aged-deps` (or a dedicated workflow) so mature upgrade opportunities are visible in CI logs.
- Use its output as the authoritative source when deciding dependency bumps, especially for security patches.
- Apply the safe upgrade for jscpd:
- Bump `jscpd` from 4.0.4 to 4.0.5 as recommended by `dry-aged-deps`.
- Run `npm test`, `npm run lint`, `npm run type-check`, and `npm run build` to verify there are no regressions.
- Commit this as an internal tooling change (e.g. `chore: update jscpd`).
- When implementing environment management per ADR 0010, ensure security aspects are fully realized:
- Keep `.env` and `.env.*.local` gitignored in generated projects.
- Generate a `.env.example` in new projects with placeholder values and comments marking sensitive entries (DB URLs, API keys, JWT secrets, etc.).
- Register @fastify/env early in server startup with a strict JSON Schema so misconfiguration fails fast at startup, not at runtime.
- As new HTTP endpoints and features are added, preserve current good practices:
- Use Fastify’s schema-based validation for all request bodies, query parameters, and headers.
- Avoid logging sensitive request data; configure Pino redaction when you start handling credentials or PII.
- For any future database or command execution, use parameterized APIs and avoid building queries/commands by string concatenation with untrusted input.

## VERSION_CONTROL ASSESSMENT (72% ± 19% COMPLETE)
- The repository’s version control and CI/CD setup are generally excellent: trunk-based development on main, a single unified CI/CD workflow with automated semantic-release publishing and post-release smoke tests, clean .gitignore rules (including correct .voder handling), and well-configured Husky pre-commit/pre-push hooks that mirror CI. The only high-penalty gap is the absence of security scanning in the CI pipeline.
- PENALTY CALCULATION:
- Baseline: 90%
- Missing security scanning in CI: -18%
- Total penalties: 18% → Final score: 72%
- CI/CD: Single unified workflow .github/workflows/ci-cd.yml runs on push to main and executes lint, type-check, build, test, format:check, then npx semantic-release in one job (quality-and-deploy).
- Continuous deployment: semantic-release runs on every main push, using Conventional Commits to decide when to publish; no manual triggers, tags, or approvals are required; releases are fully automated when quality gates pass.
- Post-release verification: conditional smoke test installs the just-published package from npm and asserts getServiceHealth() === 'ok', providing real post-deployment validation.
- Actions and syntax health: uses actions/checkout@v4 and actions/setup-node@v4 with no deprecation warnings or deprecated syntax observed in the latest workflow logs.
- Security scanning: no npm audit, SAST, or dependency-scanning step is present in the CI workflow, hence the explicit high-penalty deduction.
- Repository status: git status is clean except for .voder/* files (explicitly to be ignored for this assessment); current branch is main and matches the latest successful CI run, so all non-.voder changes are committed and pushed.
- .gitignore and .voder policy: .gitignore ignores build outputs (lib/, build/, dist/), logs, coverage, and adds .voder/traceability/ only (not the entire .voder/ directory); tracked .voder files include history and progress documents as intended.
- Built artifacts & generated files: git ls-files shows no committed dist/, lib/, build/, or out/ directories and no CI artifact reports (*-report.md, *-output.*, *-results.*); only source-level .d.ts files are present, not compiled artifacts, so no built-artifact penalties apply.
- Generated test projects: no committed generated test project directories are present; a dedicated test (src/repo-hygiene.generated-projects.test.ts) enforces this policy.
- Commit history & trunk-based development: recent commits are direct to main, small, and use strict Conventional Commits (style/docs/chore/test), matching the documented trunk-based, semantic-release-friendly workflow.
- Pre-commit hook: .husky/pre-commit runs npm run format (auto-fix) and npm run lint, providing fast, basic local quality gates with formatting and lint as required.
- Pre-push hook: .husky/pre-push runs npm run build, npm test, npm run lint, npm run type-check, and npm run format:check, mirroring the CI’s checks and ensuring push-time parity with the pipeline without blocking commits on slow checks.
- Hook/tool health: Husky 9.x is installed via the prepare script ("prepare": "husky"); logs show no Husky deprecation warnings, and hook configuration follows modern Husky patterns.
- Release strategy: .releaserc.json and semantic-release devDependency confirm automated versioning; package.json version 0.0.0 is intentionally stale and not used as the source of truth, which is correct for this strategy.

**Next Steps:**
- Add a security scanning step to the CI workflow to close the only high-penalty gap—for example, after npm ci in .github/workflows/ci-cd.yml add a step such as `npm audit --production --audit-level=high` or integrate a dedicated scanner (CodeQL, osv-scanner, Snyk) that runs on every push to main and fails on high-severity issues.
- Once security scanning is added and passing, rerun CI and this assessment; with that change the VERSION_CONTROL score would increase from 72% to 90% (baseline 90% with no remaining high-penalty deductions).
- Optionally, capture the choice of security scanning tool and configuration in a new ADR under docs/decisions/ to document why the tool was chosen and how its failures affect releases.

## FUNCTIONALITY ASSESSMENT (undefined% ± 95% COMPLETE)
- Functionality assessment skipped - fix 1 deficient support area(s) first
- Support areas must meet thresholds before assessing feature completion
- Deficient areas: VERSION_CONTROL (72%)
- Principle: "Improvement of daily work is higher priority than daily work" - fix foundation before building features

**Next Steps:**
- VERSION_CONTROL: Add a security scanning step to the CI workflow to close the only high-penalty gap—for example, after npm ci in .github/workflows/ci-cd.yml add a step such as `npm audit --production --audit-level=high` or integrate a dedicated scanner (CodeQL, osv-scanner, Snyk) that runs on every push to main and fails on high-severity issues.
- VERSION_CONTROL: Once security scanning is added and passing, rerun CI and this assessment; with that change the VERSION_CONTROL score would increase from 72% to 90% (baseline 90% with no remaining high-penalty deductions).
