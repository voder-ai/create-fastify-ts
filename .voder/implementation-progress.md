# Implementation Progress Assessment

**Generated:** 2025-12-14T18:43:36.331Z

![Progress Chart](./progress-chart.png)

Projected completion (from current rate): cycle 53.4

## IMPLEMENTATION STATUS: INCOMPLETE (93% ± 18% COMPLETE)

## OVERALL ASSESSMENT
Overall implementation is close to production-ready but currently marked INCOMPLETE because the aggregate score is below the 95% threshold and two key areas—SECURITY and FUNCTIONALITY—are under their required targets. Code quality, testing, execution behavior, documentation, and dependency management are all strong: the project builds, lints, type-checks, and tests cleanly with robust coverage and clear story-level traceability, and the CI/CD plus version control practices are solid. However, security has process-oriented gaps (e.g., missing dedicated audit scripting and slightly narrower CI audit coverage) and functionality traceability shows at least one story (lint/format developer story 007.0) not yet fully realized or validated. Addressing these specific shortfalls—tightening security workflows and completing/validating outstanding story requirements—should be enough to move the system from high-quality-but-incomplete to fully complete under the defined assessment criteria.



## CODE_QUALITY ASSESSMENT (94% ± 18% COMPLETE)
- Code quality is high and production-ready. Linting, formatting, type-checking, duplication checks, hooks, and CI/CD are all properly configured and passing. Complexity and file-size limits are already at (or better than) recommended targets. Minor duplication in tests and one justified lint suppression are the only notable areas for refinement.
- Linting:
- ESLint is configured via modern flat config (`eslint.config.js`) using `@eslint/js` recommended rules.
- TypeScript files use `@typescript-eslint/parser` with appropriate `parserOptions`.
- Additional rules enforced for TS files:
  - `complexity: 'error'` (ESLint default max=20 – at target, not relaxed).
  - `max-lines-per-function: ['error', { max: 80 }]`.
  - `max-lines: ['error', { max: 300 }]`.
- `npm run lint` passes with exit code 0, confirming all active rules are satisfied and thresholds are respected.
- No file-level `eslint-disable` comments detected; only a single, localized rule suppression in a test-support `.d.ts` file.

- Formatting:
- Prettier is configured via `.prettierrc.json` and `.prettierignore`.
- Scripts:
  - `npm run format` → `prettier --write .`.
  - `npm run format:check` → `prettier --check .`.
- `npm run format:check` passes, reporting all matched files are formatted.
- `.husky/pre-commit` runs `npm run format` then `npm run lint`, ensuring consistent formatting on every commit.
- CI also runs `npm run format:check` as part of the pipeline.
- Type checking:
- `tsconfig.json` is set up with:
  - `strict: true`.
  - `module` / `moduleResolution`: `NodeNext`.
  - `rootDir: 'src'`, `outDir: 'dist'`.
  - `declaration: true`, `skipLibCheck: true` (pragmatic choice).
- `npm run type-check` uses `tsc --noEmit` and passes with exit code 0.
- CI runs the same `npm run type-check`, so type safety is enforced before release.
- No `@ts-nocheck`, `@ts-ignore`, or `@ts-expect-error` usages were found in `src/` or `scripts/`.

- Complexity, function size, and file size:
- Complexity:
  - ESLint `complexity` rule is enabled as `'error'` without an explicit max, so the default max=20 applies (the documented target).
  - Lint passes, so no function exceeds cyclomatic complexity 20.
- Function length:
  - `max-lines-per-function: ['error', { max: 80 }]` is active.
  - Lint passing implies all functions are ≤ 80 lines.
- File length:
  - `max-lines: ['error', { max: 300 }]` is active.
  - Lint passing implies no file exceeds 300 lines.
- Manual inspection of key modules (`src/index.ts`, `src/server.ts`, `src/cli.ts`, `src/initializer.ts`) shows:
  - Single-responsibility functions.
  - Shallow nesting and clear control flow.
  - No god objects or overly long functions.

- Duplication (DRY):
- `npm run duplication` → `jscpd --threshold 20 src scripts` passes with exit code 0.
- Report summary (across JS/TS):
  - Total duplicated lines: 157 / 3187 ≈ 4.93%.
  - Total duplicated tokens: 1537 / 23872 ≈ 6.44%.
  - 12 clone groups found, all in tests or test helpers:
    - `src/server.test.ts`.
    - `src/generated-project-production.test.ts`.
    - `src/generated-project-production-npm-start.test.ts`.
    - `src/generated-project.test-helpers.ts`.
    - `src/dev-server.test.ts`, `src/dev-server-test-types.d.ts`, `src/dev-server.test-helpers.ts`.
    - `src/cli.test.ts`.
- No significant duplication in core production modules or build scripts.
- A stricter run with `--threshold 0` confirms that duplication remains low and is test-focused.

- Disabled quality checks:
- No file-level disables:
  - No `/* eslint-disable */` or `// eslint-disable-file` found.
  - No `@ts-nocheck` present.
- One targeted suppression in `src/mjs-modules.d.ts`:
  - `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tests intentionally treat dev-server runtime module as any.`
  - This is in a declaration file used only to allow `.mjs` imports in tests.
  - The suppression is local, well-justified, and documented — low risk.
- No evidence of widespread suppression to hide technical debt.

- Production code purity and structure:
- Production modules (`src/index.ts`, `src/server.ts`, `src/cli.ts`, `src/initializer.ts`):
  - Import only Node core modules, Fastify, and other runtime dependencies.
  - Do not import test frameworks (no `vitest` imports in production code).
- Test-specific assets are clearly separated into `*.test.ts` / `*.test.js` and helper `.d.ts` files.
- The codebase follows clear modular structure:
  - `index.ts` exposes a minimal health check and initializer exports.
  - `server.ts` encapsulates Fastify server creation and startup.
  - `cli.ts` is a small CLI layer delegating to the initializer.
  - `initializer.ts` handles project scaffolding and Git initialization via well-factored helpers.

- Naming, clarity, and comments:
- Descriptive names for files and functions (e.g., `buildServer`, `startServer`, `initializeTemplateProjectWithGit`, `scaffoldProject`, `copyTextTemplate`).
- JSDoc comments explain intent and link to requirements via `@supports` annotations, aiding traceability.
- Error handling is consistent and informative:
  - CLI gives clear usage and error messages; sets `process.exitCode` instead of immediate exit inside async code.
  - Initializer validates inputs and uses a `GitInitResult` type to represent best-effort Git initialization.
- Limited and purposeful use of comments; they describe “why” more than “how”.

- Magic numbers and parameters:
- A few embedded literals exist but are reasonable and self-explanatory:
  - Default port `3000` in `startServer`.
  - Environment defaults (e.g., `NODE_ENV ?? 'development'`).
  - Template dependency versions/semver ranges inside `createTemplatePackageJson`.
- No pervasive magic numbers controlling complex behavior.
- Function parameter lists are short (mostly ≤ 4 parameters) and well-named; no signs of long parameter lists or primitive obsession.

- Scripts, hooks, and tooling configuration:
- `package.json` scripts centralize all dev tooling:
  - Quality: `lint`, `lint:fix`, `type-check`, `duplication`, `format`, `format:check`, `test`.
  - Build: `build` (TypeScript compile + template-file copying).
  - Preinstall: Node-version check script (via `scripts/check-node-version.mjs`).
  - Release: `semantic-release`.
- `scripts/` directory contents:
  - `check-node-version.mjs` used by `preinstall`.
  - `copy-template-files.mjs` used by `build`.
  - `check-node-version.d.ts` supports typings for the check script.
  - All scripts are referenced via `package.json`; no orphan dev scripts detected.
- Husky hooks:
  - `pre-commit`: `npm run format` → `npm run lint` (fast checks and auto-fix formatting).
  - `pre-push`: `npm run build`, `npm test`, `npm run lint`, `npm run type-check`, `npm run format:check` (full quality gate).
- No anti-patterns like running `build` before lint/format; tools operate directly on source code.

- CI/CD and quality gates:
- `.github/workflows/ci-cd.yml` defines a single unified pipeline triggered on push to `main`:
  - `npm ci` (clean install).
  - `npm audit --omit=dev --audit-level=high` (security audit for production deps).
  - `npm run lint`.
  - `npm run type-check`.
  - `npm run build`.
  - `npm test`.
  - `npm run format:check`.
  - Non-blocking `npx dry-aged-deps --format=table` for dependency freshness.
  - `npx semantic-release` for automated versioning and publishing.
  - Post-release smoke test that installs the just-published package and verifies `getServiceHealth() === 'ok'`.
- This aligns with continuous deployment best practices and ensures all quality tools gate releases.

- AI slop and temporary files:
- No `.patch`, `.diff`, `.rej`, `.bak`, `.tmp`, or editor backup (`~`) files detected in the explored tree.
- No signs of AI-generated filler such as meaningless abstractions, obviously dead code, or generic placeholder comments.
- Comments and structure are tightly coupled to documented stories/ADRs via `@supports`, indicating deliberate design rather than generic templates.


**Next Steps:**
- Optionally refactor some test duplication:
- jscpd reports ~4.9% overall duplication entirely in tests and test helpers.
- If test maintenance becomes harder, consider extracting additional shared helpers into dedicated modules (e.g., more helpers in `generated-project.test-helpers.ts`) to consolidate repeated setup and assertions.
- This is not urgent since current duplication is below any penalty thresholds and confined to tests.

- Revisit the single `@typescript-eslint/no-explicit-any` suppression when feasible:
- In `src/mjs-modules.d.ts`, you intentionally type `.mjs` imports as `any` for dev-server tests.
- If you later formalize the dev-server interface or wrap it with a TS module, you can replace `any` with a concrete type and remove the suppression, further tightening TS lint coverage.

- Consider gradually introducing `@typescript-eslint` rules (if you want stricter TS style checks):
- Currently you use `@typescript-eslint/parser` but not the full plugin rules.
- If you decide to increase strictness:
  1. Add `@typescript-eslint/eslint-plugin` to devDependencies.
  2. In `eslint.config.js`, extend a minimal `recommended` config for TS files.
  3. Enable new rules *one at a time* following the required workflow:
     - Turn on a rule, run `npm run lint`, add `eslint-disable-next-line <rule>` where needed.
     - Commit as `chore: enable <rule-name> with suppressions`.
     - In future passes, replace suppressions with actual code fixes.
- This keeps the codebase always lint-clean while you ratchet up standards.

- Maintain current complexity and size thresholds without relaxing them:
- You are already at the recommended targets:
  - `complexity` default max=20.
  - `max-lines-per-function: 80` (reasonably strict).
  - `max-lines: 300` (keeps files small).
- As the project grows, treat new lint violations as prompts to refactor rather than bumping thresholds; this keeps long-term maintainability high.

- Keep CI/hook alignment up-to-date as you add tools:
- If you introduce additional quality tooling (e.g., advanced security scanners, license checks), ensure they are:
  - Exposed via `package.json` scripts.
  - Added to pre-push hooks and the CI workflow in a consistent way.
- Preserve the fast/slow split:
  - Pre-commit: fast, mostly-auto-fixing checks.
  - Pre-push + CI: full, potentially slower quality gates.
- This will maintain your current strong balance between developer velocity and code quality guarantees.

## TESTING ASSESSMENT (96% ± 19% COMPLETE)
- Testing is excellent and production-ready. The project uses Vitest with strong configuration, all tests pass, coverage exceeds thresholds, tests are well-structured and traceable to stories/requirements, they use temp directories for all generated projects, and they run non-interactively. Remaining concerns are minor and mostly about robustness of a few long-running integration tests that rely on specific ports and timing.
- Established testing framework: Vitest is configured via vitest.config.mts and invoked through npm scripts (`npm test`, `npm run test:coverage`), satisfying the requirement to use a standard, non-interactive test runner.
- All tests pass: running `npm test` completes successfully (10 passed, 1 skipped files; 56 passed, 3 skipped tests) and `npm run test:coverage` also passes, with no failing tests and only intentionally skipped heavy E2E suites.
- Coverage is configured and enforced: vitest is set up with v8 coverage and 80% thresholds for lines/statements/branches/functions; `npm run test:coverage` reports ~91–92% overall line/statement coverage and ~85% branches, comfortably above thresholds.
- Tests are isolated and use temp directories: project-initialization and generated-project tests systematically use `fs.mkdtemp(os.tmpdir() + prefix)` and clean up with `fs.rm(..., { recursive: true, force: true })`, preventing pollution of the repository.
- Repository hygiene is actively enforced: `src/repo-hygiene.generated-projects.test.ts` asserts that known generated project directories do not exist at repo root, ensuring tests do not accidentally commit generated artifacts.
- Tests do not modify repository files: all writes and deletions are confined to OS temp directories or within those temp project trees; repository content is only read (e.g., template files, scripts).
- Test quality and behavior coverage are high: tests cover server behavior (2xx/4xx/400 paths), CLI behavior, initializer scaffolding, dev server orchestration (ports, hot reload, graceful SIGINT), production builds, runtime logging, and Node version enforcement, including numerous error and edge cases.
- Integration/E2E behavior is realistically exercised: helpers like `createDevServerProcess`, `initializeGeneratedProject`, and `startCompiledServerViaNode` run real child processes and HTTP checks, validating actual runtime behavior rather than just unit-level internals.
- Tests are structured and readable: they follow a clear Arrange–Act–Assert pattern, have descriptive names (often including requirement IDs), and test files are named consistently with the functionality they cover; internal helper modules act as test data/builders for complex scenarios.
- Traceability requirements are fully met: test files and helpers include `@supports` annotations linking to specific stories/ADRs and requirement IDs; describe blocks and test names reference the relevant stories and `[REQ-*]` identifiers, enabling strong bidirectional traceability.
- Tests are non-interactive and wired into workflow: `npm test` uses `vitest run` (no watch mode); Husky pre-push hook runs build, tests, lint, type-check, and format checks, ensuring the test suite is part of the standard quality gate.
- Tests are generally fast and deterministic: unit tests run in milliseconds; heavier integration tests complete in a few seconds with explicit timeouts and clear failure messages, though a few use fixed ports (e.g., 41234–41237) which could, in rare environments, cause port-collision-related flakiness.

**Next Steps:**
- Reduce the risk of port conflicts in dev-server and generated-project tests by using ephemeral ports (PORT=0) or a helper to discover a free port instead of hard-coded values like 41234–41237, especially for long-running child-process tests.
- Optionally refactor tests with small loops or repeated patterns (e.g., multiple calls to `getServiceHealth`) into helper functions or parameterized tests to further minimize logic inside test bodies, keeping specifications as linear as possible.
- If desired, tighten coverage on specific branches in `initializer.ts` (currently slightly below 80% branch coverage) by adding focused tests for the uncovered lines reported by the coverage report (e.g., around lines 75–77, 171, 288).
- Document in development docs which heavy E2E suites are intentionally skipped by default (e.g., npm-based production start and CLI dev-server tests) and under which conditions they should be temporarily enabled for deeper validation.
- Maintain the current testing discipline as new stories are implemented: for each new feature, add tests with `@supports` annotations, use temp directories for any file-generating behavior, keep coverage in line with existing thresholds, and ensure new tests remain non-interactive and part of the standard `npm test` run.

## EXECUTION ASSESSMENT (94% ± 18% COMPLETE)
- Execution quality is very high. The project builds, type-checks, lints, and runs its test suite cleanly. There is extensive end-to-end testing that exercises the initializer, CLI, dev server, and generated Fastify projects under realistic conditions (TypeScript build + running compiled servers + HTTP-level verification). Runtime validation of Node version, port resolution, logging, and error handling is implemented with clear user-facing messages and verified in tests. There are no databases or heavy computations, so many performance pitfalls don’t apply; process and filesystem resources are managed carefully in both code and tests. The main gap is that the heaviest full CLI + npm + dev-server E2E test is intentionally skipped by default, so complete CLI-path coverage isn’t always-on.
- Build & type-check: `npm run build` (tsc + template copy), `npm run type-check` (tsc --noEmit), and `npm run lint` (eslint .) all succeed locally with no reported issues. TypeScript and ESLint configs are aligned with the ESM setup.
- Test execution: `npm test` (Vitest) and `npm run test:coverage` both pass. Coverage report shows ~92% line coverage and ~85% branch coverage overall, with 100% coverage for critical runtime modules like `src/index.ts` and `src/server.ts`.
- Runtime environment validation: A `preinstall` script (`scripts/check-node-version.mjs`) enforces Node >= 22.0.0, with `src/check-node-version.test.js` verifying parsing, comparison, and error messaging. `package.json` also declares `engines.node >= 22.0.0`, keeping runtime and metadata consistent.
- Initializer behavior: `initializeTemplateProject` and `initializeTemplateProjectWithGit` create full project scaffolds in temp directories (package.json, tsconfig, README, .gitignore, dev-server.mjs, src/index.ts) and optionally run `git init`. `src/initializer.test.ts` covers directory creation, file presence, package.json structure, Fastify/TypeScript dependencies, README content, .gitignore entries, Fastify hello-world route, validation of empty/trimmed names, and both git-available and git-missing scenarios.
- CLI behavior: `src/cli.ts` delegates to `initializeTemplateProjectWithGit`, handling missing project names with a usage message and non-zero exit, and reporting git initialization status. `src/cli.test.ts` runs the compiled CLI (`dist/cli.js`) under different PATH setups, ensuring it exits cleanly whether git is available or not. A more exhaustive CLI+npm+dev-server path exists but is skipped by default, demonstrating the capability without slowing normal runs.
- Fastify server runtime: `src/server.ts` builds a Fastify app with @fastify/helmet and a `/health` endpoint, plus structured logging driven by NODE_ENV/LOG_LEVEL. `src/server.test.ts` uses `buildServer` and `startServer` to validate /health success, unknown routes (404), invalid methods, malformed JSON (400 with clear error), security headers from helmet, ephemeral-port startup, repeated start/stop, and behavior for invalid ports. Logging level behavior is tested against environment variables.
- Dev server runtime: `src/template-files/dev-server.mjs` implements a robust dev workflow: package.json presence check, port resolution with strict/auto modes, optional tsc --watch, running the compiled server via Node or Node + pino-pretty, hot-reload on dist/src/index.js changes, and graceful shutdown on SIGINT/SIGTERM. `src/dev-server.test.ts` and helpers exercise port auto-discovery, strict port validation (including ports in use), DEV_SERVER_SKIP_TSC_WATCH behavior, hot-reload restart logs, and pino-pretty-based logging in development, all via real child processes and time-bounded waits.
- Generated project E2E behavior: `src/generated-project.test-helpers.ts` plus `src/generated-project-production.test.ts` and `src/generated-project-logging.test.ts` create full projects in OS temp dirs using the initializer, symlink root node_modules, run `tsc -p tsconfig.json`, start compiled servers from dist/src/index.js, and hit `/health` over HTTP. Tests assert presence of JS/d.ts/map outputs in dist, successful 200/"{status:'ok'}" health responses even after deleting src/, no TypeScript/source references in production logs, structured JSON logs at LOG_LEVEL=info, and suppression of info-level request logs at LOG_LEVEL=error.
- Error handling & input validation: CLI validates required project name with clear usage/error. Initializer rejects empty names and trims whitespace. Dev server guards against missing package.json, invalid/busy ports, and handles DevServerError versus unexpected errors with distinct console outputs and non-zero exits. HTTP server surfaces Fastify’s JSON error bodies for malformed input. Node version checker builds explicit multi-line error messages referencing stories/decisions; tests assert on this message content.
- Resource management & performance: Temp directories for generated projects and dev-server tests are created with `fs.mkdtemp` and cleaned up with `fs.rm(..., { recursive: true, force: true })` in afterEach/afterAll/finally blocks. Child processes (tsc, dev server, compiled servers, npm) are killed with SIGINT and awaited with timeouts to avoid hanging tests. FS watchers are closed on shutdown. No database access or heavy computations are present, so N+1 query or caching concerns don’t apply; runtime logic is light and event-driven.
- End-to-end realism: Tests simulate real workflows—creating projects via the initializer, building with tsc, running compiled Fastify servers, resolving ports, and calling `/health`. Logging, security headers, and config-driven behavior are validated using actual network and process interactions instead of mocks, providing strong evidence that the code behaves correctly in realistic local usage scenarios.

**Next Steps:**
- Promote at least one non-skipped, end-to-end CLI test that covers a full flow without relying directly on `npm run dev`: e.g., use the compiled CLI to scaffold a project in a temp dir, symlink repo node_modules, then run `node dev-server.mjs` directly and verify `/health` and graceful SIGINT shutdown. This would give always-on coverage of the full CLI path with fewer external dependencies.
- Add a focused test (via a child process) that exercises the side-effectful `enforceMinimumNodeVersionOrExit()` path: run the preinstall script under a simulated lower Node version and assert it exits with code 1 and prints the expected error message. This would fully cover the runtime behavior of the install-time guard.
- Improve observability for dev-server hot reload failure: currently, FS watcher setup errors are swallowed silently. Logging a one-time warning like `dev-server: hot reload disabled (could not start file watcher)` would help developers understand why changes aren’t triggering restarts, without affecting core behavior.
- Add one or two negative-path tests for `startCompiledServerViaNode` (e.g., missing dist/src/index.js or compiled script that exits immediately) to ensure the helper’s error messages and timeouts surface clear diagnostics and to guard against regressions in failure handling.
- If startup performance becomes important, extend the generated-project production smoke test with a loose upper bound on time-to-first-200 `/health` response, to act as a guardrail against accidental regressions in build or server initialization time.

## DOCUMENTATION ASSESSMENT (95% ± 18% COMPLETE)
- User-facing documentation for this project is accurate, up-to-date, and closely aligned with the implemented functionality and release process. README, CHANGELOG, and user-docs are well-structured, correctly separated from internal docs, and all links and published files are consistent with the npm package configuration. Licensing and code/story traceability are also implemented cleanly. Remaining opportunities are minor improvements to discoverability and high-level summaries rather than correctness issues.
- User vs project documentation separation is correct:
  - User-facing docs: `README.md`, `CHANGELOG.md`, `LICENSE`, and `user-docs/` (api, testing, security). All of these are included in `package.json` `files` and so are published.
  - Internal docs: `docs/` (ADRs, stories, dev setup, testing strategy, security practices). These are *not* in `files` and therefore not published with the npm package, as required.
  - User-facing docs do not link to `docs/`, `prompts/`, or `.voder/`; searches across `README.md` and `user-docs/*.md` for `docs/`/`prompts/` show no such links. Internal paths only appear in code comments and runtime error messages, which are not part of the published documentation set.

- README.md quality and accuracy:
  - Contains required Attribution section: “Created autonomously by [voder.ai](https://voder.ai).”
  - Quick Start instructions (`npm init @voder-ai/fastify-ts my-api`, followed by `npm install`) correctly reflect the actual package name and `bin` entry in `package.json`.
  - Describes generated project scripts (`dev`, `build`, `start`) and behavior in a way that matches `src/initializer.ts`’s `createTemplatePackageJson` (same script names and purposes) and generated-project tests.
  - Documents implemented features vs planned enhancements explicitly, so users are not misled about unimplemented items (e.g., env var validation and CORS are clearly labeled as planned).
  - Generated endpoints (`GET /` Hello World and `GET /health`) align with `initializer` tests and generated-project tests.
  - Development commands (`npm run dev`, `npm test`, `npm run type-check`, `npm run lint`, `npm run format`, `npm run build`) all exist in `package.json` with matching semantics.

- Versioning and CHANGELOG correctness:
  - Project uses semantic-release, confirmed by `.releaserc.json` and `scripts.release = "semantic-release"`.
  - `CHANGELOG.md` explicitly states that the `package.json` `version` field is not authoritative and directs users to GitHub Releases and npm. This is the correct pattern for semantic-release projects.
  - README’s “Releases and Versioning” section matches the actual semantic-release configuration (branches, commit types → version bumps) and links to the correct GitHub and npm URLs.
  - There is no stale/manual version mismatch problem because docs intentionally do not list specific hard-coded versions.

- Link formatting and integrity:
  - Documentation links use proper Markdown link syntax:
    - README: `[Testing Guide](user-docs/testing.md)`, `[API Reference](user-docs/api.md)`, `[Security Overview](user-docs/SECURITY.md)`.
    - `user-docs/testing.md` links to `api.md#logging-and-log-levels` via a relative Markdown link.
  - All linked files exist in the repo and are included in the npm `files` array, so there are no broken links in the published package.
  - Code references (e.g., `eslint.config.js`, `npm test`, `dev-server.mjs`, `dist/src/index.js`, `src/index.ts`) are formatted with backticks rather than Markdown links, as required.
  - No user-facing docs contain plain-text paths to user-doc files that should be links; searches for `user-docs/` show only proper Markdown links.
  - User-facing docs do *not* link to internal project docs directories (`docs/`, `prompts/`, `.voder/`), satisfying the boundary rule.

- User-facing API documentation (user-docs/api.md):
  - Documents the exact public exports shown in `src/index.ts`:
    - `getServiceHealth(): string` → implemented as `return 'ok'` and verified by both runtime tests and `src/index.test.d.ts`.
    - `initializeTemplateProject(projectName: string): Promise<string>` → implementation returns the absolute project directory and does not do Git, matching the docs.
    - `initializeTemplateProjectWithGit(projectName: string): Promise<{ projectDir: string; git: GitInitResult }>` → implementation scaffolds the project then calls `initializeGitRepository`; failure to run `git` results in `initialized: false` and an error message, as stated.
    - `GitInitResult` type in the docs matches the `export interface GitInitResult` in `src/initializer.ts`.
  - Includes TS and JS usage examples with realistic error handling, aligned with ESM and the package’s `type: "module"`.
  - Describes generated project endpoints and internal stub server behavior consistently with actual code and tests.

- Testing documentation (user-docs/testing.md):
  - Commands documented (`npm test`, `npm test -- --watch`, `npm run test:coverage`, `npm run test:coverage:extended`, `npm run type-check`) exactly match defined scripts and their behavior.
  - Explains test file formats with concrete examples mirroring real files (`src/server.test.ts`, `src/initializer.test.ts`, `src/index.test.js`, `src/check-node-version.test.js`, `src/index.test.d.ts`).
  - Coverage explanation aligns with `vitest.config.mts`: v8 provider, text & HTML reporters, thresholds at 80%, and `src/template-files/**` excluded.
  - Provides clear recommended workflows (during development, before committing, when refactoring public APIs) that are consistent with the actual scripts and test layout.

- Security documentation (user-docs/SECURITY.md):
  - Clearly states current behavior and limitations: only simple JSON endpoints, no auth, no persistence, no CORS, no env-var validation.
  - Accurately describes the use of `@fastify/helmet`:
    - Confirmed by `src/server.ts` (`app.register(helmet);`) and the dependencies configured in initialized projects.
  - CSP, CORS, and header sections explicitly differentiate between current default behavior and recommended configuration patterns for users, avoiding any suggestion that advanced policies are already in place.
  - Maps documentation sections back to requirement IDs (e.g., `REQ-SEC-HEADER-DOCS`, `REQ-SEC-CSP-CUSTOM`, `REQ-SEC-CORS-ENV`), reinforcing traceability without leaking project doc links into user docs.

- License consistency:
  - Single `package.json` has `"license": "MIT"` with a valid SPDX identifier.
  - `LICENSE` file contains standard MIT license text and matches that declaration.
  - No additional `LICENSE`/`LICENCE` files, so there is no intra-project discrepancy.

- Code documentation and traceability:
  - All key named functions in production code (`getServiceHealth`, `buildServer`, `startServer`, `initializeTemplateProject`, `initializeTemplateProjectWithGit`, and helpers in `initializer.ts`, as well as functions in `check-node-version.mjs`) have JSDoc with `@supports` annotations tying them to specific stories/decisions and requirement IDs.
  - Branch-level comments (e.g., around `app.register(helmet)`) also annotate which requirements they support.
  - Tests include file-level `@supports` headers and embed requirement identifiers in test names and `describe` blocks (e.g., `[REQ-FASTIFY-SERVER-STUB]`, `[REQ-SEC-HEADERS-PRESENT]`, `[REQ-LOG-LEVEL-CONFIG]`), enabling automated requirement validation from test output.
  - Annotation format is consistent and parseable (`@supports path/to/story.md REQ-...`), meeting the traceability requirements without exposing internal paths to end users in the published documentation set.


**Next Steps:**
- Add a short high-level summary section at the top of `user-docs/SECURITY.md` (e.g., bullets for endpoints, data storage, authentication, and default headers) to give users a quick overview before the detailed sections.
- Add a brief “Programmatic API” subsection in `README.md` summarizing the three main exports (`getServiceHealth`, `initializeTemplateProject`, `initializeTemplateProjectWithGit`) with one-line descriptions and a tiny TS/JS example, while linking to `user-docs/api.md` for full details.
- Optionally add a “Generated Project Layout” section (either in README or `user-docs/api.md`) listing the key files scaffolded into a new project (e.g., `src/index.ts`, `dev-server.mjs`, `tsconfig.json`, `README.md`, `.gitignore`) so users know exactly what structure to expect.
- Consider duplicating the Node.js minimum version (currently clearly stated in README and enforced by `scripts/check-node-version.mjs`) into a tiny “Prerequisites” subsection in `user-docs/testing.md` or `user-docs/api.md` for users who jump directly to those docs.

## DEPENDENCIES ASSESSMENT (98% ± 18% COMPLETE)
- Dependencies are in excellent condition. All installed packages are on the latest dry-aged-deps-approved versions, the lockfile is tracked in git, installs and audits are clean with no deprecations or vulnerabilities, and there are no visible compatibility issues.
- Package management is correctly configured for npm: root-level package.json and package-lock.json are present, and `git ls-files package-lock.json` confirms the lockfile is committed, ensuring reproducible installs.
- Runtime dependencies are minimal and focused: `fastify@5.6.2` and `@fastify/helmet@13.0.2` are appropriate, modern choices for a Fastify+TypeScript template and are compatible with the declared Node engine (>=22.0.0).
- DevDependencies cover the tooling stack (TypeScript 5.9.3, ESLint 9.39.1 with @eslint/js 9.39.1, Vitest 4.0.15, Prettier 3.7.4, semantic-release 25.0.2, husky 9.1.7, jscpd, dry-aged-deps, @types/node 24.10.2) with no apparent redundancy or conflicts.
- `npx dry-aged-deps --format=xml` reports 3 outdated packages (`@eslint/js`, `@types/node`, `eslint`), but all have `<filtered>true</filtered>` due to age and the summary shows `<safe-updates>0</safe-updates>`, meaning there are currently NO safe upgrade candidates by policy; current versions are therefore the latest safe ones and considered up-to-date.
- `npm install --ignore-scripts` completes successfully with `up to date` and shows no `npm WARN deprecated` messages and `found 0 vulnerabilities`, indicating a clean install with no deprecated or vulnerable packages flagged by npm.
- `npm audit` reports `found 0 vulnerabilities`, confirming that the current dependency tree has no known security issues at this time.
- The presence of a semantic-release setup (`semantic-release` and `.releaserc.json`) plus `dry-aged-deps` in devDependencies indicates a mature, automated approach to dependency and release management, aligned with the 7-day maturity policy.
- No evidence of dependency conflicts, peer dependency warnings, or circular dependency problems surfaced during installation or audit, suggesting a healthy and compatible dependency tree.

**Next Steps:**
- No immediate dependency changes are required; keep the current versions as they are the latest safe ones according to `dry-aged-deps`.
- On future runs, if `npx dry-aged-deps --format=xml` reports any packages with `<filtered>false</filtered>` and `<current> < <latest>`, upgrade those packages to the reported `<latest>` versions, then update and commit both package.json and package-lock.json.
- Continue to rely on `npm install` and `npm audit` as part of the normal workflow to catch any new deprecation or security warnings that may appear as the ecosystem evolves.

## SECURITY ASSESSMENT (88% ± 18% COMPLETE)
- Security posture is strong: dependencies are vulnerability-free, CI/CD enforces security-relevant gates, template code uses secure Fastify defaults (helmet, structured logging), and there are no hardcoded secrets or injection surfaces in current functionality. Remaining issues are process/coverage gaps (no dedicated audit script, CI only audits prod deps at high severity, and no .env.example for generated projects), not active vulnerabilities.
- Dependency security: `npm install` and `npm audit` (with and without `--omit=dev`, at `--audit-level=moderate`) all report 0 vulnerabilities. `npx dry-aged-deps` finds no mature upgrades, indicating all current versions are both up to date and considered safe under the maturity policy.
- Security incidents: No `docs/security-incidents/` directory and no `*.disputed.md` / `*.known-error.md` files exist, so there are no previously accepted or disputed vulnerabilities that need re-validation. This also means no audit-filter configuration is currently required.
- Hardcoded secrets and .env handling: Grep across `src` and `scripts` for `API_KEY`, `SECRET`, `TOKEN` finds nothing. `.gitignore` correctly ignores `.env` variants and explicitly allows `.env.example`. `git ls-files .env` and `git log --all --full-history -- .env` show `.env` has never been tracked. The template’s `.gitignore.template` also ignores `.env`, so generated projects follow the same safe pattern. No `.env` or `.env.example` is present in the repo, which is acceptable from a security standpoint.
- Application security (implemented Fastify server): `src/server.ts` and the generated `src/template-files/src/index.ts.template` only expose simple JSON endpoints (`/`, `/health`), use `@fastify/helmet` for security headers, and configure Fastify’s pino-based logging with environment-driven log levels. There is no custom HTML rendering, no user-supplied templating, and no database access, so XSS/SQLi surfaces are effectively absent in the current code.
- Dev server and process spawning safety: The dev-server template (`src/template-files/dev-server.mjs`) validates `PORT` (integer 1–65535, must be free) and uses Node’s `net` API to find free ports, with clear error messages via `DevServerError`. It starts `tsc` and the compiled server using `spawn` and `process.execPath` with fixed argument lists (no shell, no user-controlled interpolation). Git initialization uses `execFile('git', ['init'], { cwd })` without a shell, so there is no evident command-injection risk.
- Node version enforcement: `scripts/check-node-version.mjs` enforces a minimum of Node 22.0.0 at `preinstall`, aligning with `package.json`'s `engines` field. This prevents running the template in older, potentially vulnerable or unsupported Node runtimes.
- CI/CD security: The single `ci-cd.yml` workflow runs on `push` to `main` and performs `npm ci`, `npm audit --omit=dev --audit-level=high`, `npm run lint`, `npm run type-check`, `npm run build`, `npm test`, `npm run format:check`, and a non-blocking `npx dry-aged-deps --format=table`. It then runs `semantic-release` with `NPM_TOKEN` and `GITHUB_TOKEN` from secrets, followed by a post-release smoke test that installs the published package and verifies `getServiceHealth() === 'ok'`. This provides a strong automated gate and live verification without exposing secrets in the repo.
- Dependency automation conflicts: No Dependabot or Renovate configuration files are present, and the only automation around dependencies is `dry-aged-deps` and semantic-release. This avoids conflicting update tools as required by the policy.
- Gaps and non-blocking issues: There is no `npm` script named `audit:ci` (so `npm run audit:ci` fails), CI only audits production dependencies (`--omit=dev`) and only at `--audit-level=high`, and there is no `.env.example` for generated projects. These are process/documentation shortcomings rather than current security vulnerabilities, and they do not violate the acceptance criteria since audits are clean and no incidents are being accepted as residual risk.

**Next Steps:**
- Add a dedicated audit script in package.json, e.g. "audit:ci": "npm audit --audit-level=moderate", and use it as the canonical way to run audits locally and in CI. This aligns with the dev-script centralization policy and prepares the project for future integration with `better-npm-audit` or `audit-ci` if disputed vulnerabilities arise.
- Strengthen the CI audit step in `.github/workflows/ci-cd.yml` by covering dev dependencies and at least moderate severity, for example: replace `npm audit --omit=dev --audit-level=high` with `npm audit --audit-level=high` or `npm audit --audit-level=moderate`. Given the current clean audit, this change is safe and increases future coverage.
- Add a non-sensitive `src/template-files/.env.example` (e.g. documenting `LOG_LEVEL`, `NODE_ENV`, `PORT`) so generated projects get a clear, safe pattern for environment configuration without risking secret exposure.
- Optionally, add a brief security section to the main README or user docs describing that the template enables helmet by default, uses structured JSON logging, and ships with a secure `.gitignore` that protects `.env` files. This improves transparency and helps consumers understand the security posture of generated services.

## VERSION_CONTROL ASSESSMENT (90% ± 19% COMPLETE)
- Version control and CI/CD for this project are in very good health. The repo uses trunk-based development on main, has a single unified CI/CD workflow with comprehensive quality gates plus automated semantic-release publishing and post-release smoke tests, modern Husky pre-commit and pre-push hooks that mirror CI checks, a clean git status (excluding .voder files), and a well-structured .gitignore that avoids committing build artifacts, reports, or generated test projects. No high-penalty violations were found under the required scoring model.
- PENALTY CALCULATION:
- Baseline: 90%
- Total penalties: 0% → Final score: 90%
- # CI/CD pipeline
- Single unified workflow at .github/workflows/ci-cd.yml triggered on push to main; no tag-based triggers or manual workflow_dispatch events.
- Workflow runs a full quality gate before release: npm ci, npm audit --omit=dev --audit-level=high, npm run lint, npm run type-check, npm run build, npm test, npm run format:check, plus a non-blocking dry-aged-deps dependency freshness report.
- Automated publishing via semantic-release: Release step runs npx semantic-release on every push to main with NPM_TOKEN and GITHUB_TOKEN, implementing fully automated versioning and npm/GitHub releases (no manual gates).
- Post-release smoke tests install the just-published package from npm and verify getServiceHealth() returns "ok", providing post-deployment verification.
- Recent CI runs on main are predominantly successful; last inspected run (ID 20212285571) completed successfully with all steps passing and no deprecation warnings for GitHub Actions or workflow syntax.
- Actions use current major versions (actions/checkout@v4, actions/setup-node@v4); no deprecated v1/v2/v3 actions detected.
- # Repository status
- git status -sb shows only modifications in .voder/history.md and .voder/last-action.md; these are explicitly excluded from validation, so the working tree is effectively clean for project code.
- Branch is main and tracking origin/main; no unpushed commits outside .voder files.
- # Repository structure & .gitignore
- .gitignore is comprehensive: ignores node_modules, logs, coverage, caches, temp files, and build outputs (lib/, build/, dist/), as well as CI artifact directories.
- .voder/traceability/ is explicitly ignored, while .voder/ itself is not, and .voder files (.voder/history.md, .voder/implementation-progress.md, etc.) are tracked — exactly matching the required pattern.
- Generated initializer/test project directories (cli-api/, cli-test-project/, manual-cli/, sample-project-exec-test/, etc.) are ignored, preventing generated test projects from being tracked (aligned with ADR 0014).
- git ls-files checks confirm no built artifacts or generated reports are tracked: no lib/, dist/, build/, out/, no *-report.*, *-output.*, *-results.*, and no scripts/*.md|log|txt artifacts.
- Tracked files are source, tests, configuration, docs, and template files (e.g., src/template-files/*.template), not compiled outputs.
- # Commit history & trunk-based development
- Current branch is main, and pushes to main trigger the CI/CD pipeline — no evidence of long-lived feature branches or PR-based flow, consistent with trunk-based development.
- Recent commits use clean Conventional Commit messages (docs:, test:, chore:), are small and focused, and show work being done directly on main.
- No evidence of secrets or sensitive data in recent commits; commit subjects describe documentation, tests, and internal hygiene changes.
- # Pre-commit & pre-push hooks
- Husky 9.x is configured via "prepare": "husky" in package.json, using the modern .husky/ directory layout (no deprecated .huskyrc or old install commands).
- .husky/pre-commit runs npm run format (prettier --write .) and npm run lint (eslint .), satisfying requirements for automatic formatting and linting on commit with quick feedback.
- .husky/pre-push runs npm run build, npm test, npm run lint, npm run type-check, and npm run format:check, providing comprehensive local quality gates before push.
- Pre-push checks closely mirror CI steps (build, test, lint, type-check, format:check); security audit and release steps correctly remain CI-only due to secret/registry requirements.
- No deprecation warnings or legacy Husky patterns are evident in the configuration; hooks are installed automatically via npm install (prepare script).
- # Other relevant observations
- package.json centralizes all dev scripts (build, test, lint, format, type-check, release), matching the contract-centralization requirement for tooling.
- Semantic-release is configured (.releaserc.json present) and drives versioning; the fixed "version": "0.0.0" in package.json is therefore intentional and not a versioning problem.
- No high-penalty issues were identified: no generated test projects tracked, .voder/traceability/ correctly ignored but .voder/ kept, security scanning present in CI, no built artifacts or generated reports in version control, and both pre-commit and pre-push hooks implemented with appropriate scopes.

**Next Steps:**
- Optionally add id-token: write to the workflow permissions block so @semantic-release/npm can fully use GitHub OIDC without emitting the informational message about missing ACTIONS_ID_TOKEN_REQUEST_URL; this is a small hardening/clarity improvement, not a functional bug.
- Introduce an npm run audit script (e.g., "audit": "npm audit --omit=dev --audit-level=high") and update CI to call npm run audit for better alignment with the centralized scripts pattern, while keeping the same behavior.
- If the repository grows significantly, consider adding lint-staged or similar tooling so pre-commit hooks run format/lint only on staged files, maintaining sub-10-second pre-commit times on larger codebases while leaving the comprehensive checks to pre-push and CI.
- Continue to ensure any future project generators or initializers use temporary directories in tests and rely on the existing .gitignore entries so no generated projects ever get committed, preserving the current clean state.
- Periodically review GitHub Actions marketplace for new major versions of actions/checkout and actions/setup-node and upgrade when appropriate to stay ahead of future deprecations, keeping the CI/CD pipeline modern and warning-free.

## FUNCTIONALITY ASSESSMENT (88% ± 95% COMPLETE)
- 1 of 8 stories incomplete. Earliest failed: docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md
- Total stories assessed: 8 (0 non-spec files excluded)
- Stories passed: 7
- Stories failed: 1
- Earliest incomplete story: docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md
- Failure reason: This file is a concrete user story/specification for linting and formatting behavior, so it is in scope for assessment.

The project is configured with ESLint and Prettier:
- Scripts `lint`, `lint:fix`, `format`, and `format:check` exist and are wired as the story describes.
- `eslint.config.js` uses `@eslint/js` and `@typescript-eslint/parser`, so ESLint understands TypeScript and enforces quality rules (REQ-LINT-ESLINT, REQ-LINT-TYPESCRIPT).
- `.prettierrc.json` exists and Prettier is declared in devDependencies (REQ-FORMAT-PRETTIER, REQ-QUALITY-CONSISTENT).

However, when actually running the commands now:
- `npm run lint` succeeds → fresh template code is lint-clean (AC "Lint Check Passes", REQ-LINT-CLEAN satisfied).
- `npm run format:check` succeeds → all files are currently formatted (AC "Format Check Passes", REQ-FORMAT-CLEAN, REQ-FORMAT-CHECK-ONLY satisfied).
- `npm run lint:fix` fails with a runtime error because ESLint cannot load its default formatter due to missing `chalk`. As a result, the auto-fix command does not complete and cannot fix issues. This contradicts Acceptance Criterion "Lint Auto-Fix Works" and Requirement REQ-LINT-FIX.
- `npm run format` fails with `prettier: command not found`, so the auto-format command cannot apply Prettier formatting. This contradicts Acceptance Criterion "Format Auto-Fix Works" and Requirements REQ-FORMAT-WRITE and REQ-FORMAT-PRETTIER.

Because the story explicitly requires that both lint and format auto-fix commands work (and be suitable for CI/CD), and the current repository state has broken `lint:fix` and `format`, the story is not fully implemented.

Status: FAILED – configuration and basic checks are present and passing, but the auto-fix commands required by the story do not execute successfully, so multiple acceptance criteria and requirements are not met.

**Next Steps:**
- Complete story: docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md
- This file is a concrete user story/specification for linting and formatting behavior, so it is in scope for assessment.

The project is configured with ESLint and Prettier:
- Scripts `lint`, `lint:fix`, `format`, and `format:check` exist and are wired as the story describes.
- `eslint.config.js` uses `@eslint/js` and `@typescript-eslint/parser`, so ESLint understands TypeScript and enforces quality rules (REQ-LINT-ESLINT, REQ-LINT-TYPESCRIPT).
- `.prettierrc.json` exists and Prettier is declared in devDependencies (REQ-FORMAT-PRETTIER, REQ-QUALITY-CONSISTENT).

However, when actually running the commands now:
- `npm run lint` succeeds → fresh template code is lint-clean (AC "Lint Check Passes", REQ-LINT-CLEAN satisfied).
- `npm run format:check` succeeds → all files are currently formatted (AC "Format Check Passes", REQ-FORMAT-CLEAN, REQ-FORMAT-CHECK-ONLY satisfied).
- `npm run lint:fix` fails with a runtime error because ESLint cannot load its default formatter due to missing `chalk`. As a result, the auto-fix command does not complete and cannot fix issues. This contradicts Acceptance Criterion "Lint Auto-Fix Works" and Requirement REQ-LINT-FIX.
- `npm run format` fails with `prettier: command not found`, so the auto-format command cannot apply Prettier formatting. This contradicts Acceptance Criterion "Format Auto-Fix Works" and Requirements REQ-FORMAT-WRITE and REQ-FORMAT-PRETTIER.

Because the story explicitly requires that both lint and format auto-fix commands work (and be suitable for CI/CD), and the current repository state has broken `lint:fix` and `format`, the story is not fully implemented.

Status: FAILED – configuration and basic checks are present and passing, but the auto-fix commands required by the story do not execute successfully, so multiple acceptance criteria and requirements are not met.
- Evidence: [
  {
    "type": "story-file",
    "path": "docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md",
    "details": "Story file exists and its contents match the specification provided in the prompt, including all acceptance criteria and requirements."
  },
  {
    "type": "scripts-config",
    "path": "package.json",
    "details": "Quality scripts are wired as required:\n\n\"scripts\": {\n  \"lint\": \"eslint .\",\n  \"lint:fix\": \"eslint . --fix\",\n  \"format\": \"prettier --write .\",\n  \"format:check\": \"prettier --check .\",\n  ...\n}\n\nThis is structurally aligned with REQ-LINT-ESLINT, REQ-LINT-FIX, REQ-FORMAT-WRITE, and REQ-FORMAT-CHECK-ONLY."
  },
  {
    "type": "eslint-config",
    "path": "eslint.config.js",
    "details": "File exists and configures ESLint 9 with TypeScript support:\n\n- Imports `@eslint/js` and `@typescript-eslint/parser`\n- Uses `js.configs.recommended`\n- Adds a TS-only config block with `files: ['**/*.ts']`, parser set to `@typescript-eslint/parser`, and some complexity/max-lines rules\n- Ignores `dist/**`, `node_modules/**`, `**/*.d.ts`, `vitest.config.mts`\n\nThis shows ESLint is enabled and understands TypeScript syntax, addressing REQ-LINT-ESLINT and REQ-LINT-TYPESCRIPT."
  },
  {
    "type": "prettier-config",
    "path": ".prettierrc.json",
    "details": "File exists with a valid Prettier configuration (e.g. singleQuote, trailingComma, semi, arrowParens, printWidth). This supports REQ-FORMAT-PRETTIER and REQ-QUALITY-CONSISTENT."
  },
  {
    "type": "command",
    "command": "npm run lint",
    "details": "`npm run lint` exited with code 0:\n\n> @voder-ai/create-fastify-ts@0.0.0 lint\n> eslint .\n\nNo errors were reported. This demonstrates that the current template code passes lint checks, satisfying Acceptance Criterion \"Lint Check Passes\" and REQ-LINT-CLEAN."
  },
  {
    "type": "command",
    "command": "npm run format:check",
    "details": "`npm run format:check` exited with code 0:\n\n> @voder-ai/create-fastify-ts@0.0.0 format:check\n> prettier --check .\n\nChecking formatting...\nAll matched files use Prettier code style!\n\nThis shows all tracked files are currently formatted according to Prettier, satisfying Acceptance Criterion \"Format Check Passes\" and REQ-FORMAT-CLEAN."
  },
  {
    "type": "command",
    "command": "npm run lint:fix",
    "details": "`npm run lint:fix` FAILED with exit code 2:\n\n> @voder-ai/create-fastify-ts@0.0.0 lint:fix\n> eslint . --fix\n\nStderr:\nThere was a problem loading formatter: /Users/tomhoward/Projects/template-fastify-ts/node_modules/eslint/lib/cli-engine/formatters/stylish.js\nError: Cannot find module 'chalk'\nRequire stack:\n- /Users/tomhoward/Projects/template-fastify-ts/node_modules/eslint/lib/cli-engine/formatters/stylish.js\n\nBecause ESLint cannot load its formatter due to a missing `chalk` module, `npm run lint:fix` does not complete successfully. This violates Acceptance Criterion \"Lint Auto-Fix Works\" and Requirement REQ-LINT-FIX (the auto-fix command itself is broken)."
  },
  {
    "type": "command",
    "command": "npm run format",
    "details": "`npm run format` FAILED with exit code 127:\n\n> @voder-ai/create-fastify-ts@0.0.0 format\n> prettier --write .\n\nStderr:\nsh: prettier: command not found\n\nDespite `prettier` being listed in devDependencies, the `prettier` CLI is not found when running `npm run format`, so formatting cannot be applied. This violates Acceptance Criterion \"Format Auto-Fix Works\" and Requirements REQ-FORMAT-WRITE and REQ-FORMAT-PRETTIER (the write/auto-fix path is currently non-functional)."
  }
]
