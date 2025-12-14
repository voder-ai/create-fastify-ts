# Implementation Progress Assessment

**Generated:** 2025-12-14T14:17:30.591Z

![Progress Chart](./progress-chart.png)

Projection: flat (no recent upward trend)

## IMPLEMENTATION STATUS: INCOMPLETE (88% ± 17% COMPLETE)

## OVERALL ASSESSMENT
Overall implementation quality is high across code, tests, execution, security, dependencies, and version control, but the project is still incomplete relative to the strict functional and documentation goals. Most engineering practices are excellent: type-safe, well-structured code with strong linting and formatting; a comprehensive Vitest suite with high coverage and realistic initializer/CLI/dev-server flows; robust CI/CD with semantic-release, dependency audits, and continuous deployment on main; and secure defaults including helmet on the Fastify stub. However, functionality traceability shows 2 of 8 stories incomplete, with Story 006.0 (developer production build) only partially satisfied due to skipped long-running E2E health checks and some remaining gaps in explicit requirement coverage. Documentation is generally accurate and up to date for users and contributors, but not all helper functions and flows have full story/requirement annotations, which is required for 100% alignment. Addressing the remaining functional gaps and tightening traceability annotations would move the project from very strong but incomplete into fully complete status.



## CODE_QUALITY ASSESSMENT (94% ± 18% COMPLETE)
- Code quality is strong: linting, formatting, type-checking, duplication checks, and CI/CD quality gates are all correctly configured, automated, and passing. Complexity and file-size constraints are already at or stricter than recommended defaults, with no suppressed checks or major smells. Remaining issues are minor (some duplication in tests and room for richer TS-specific lint rules).
- Linting: `npm run lint` (ESLint 9, flat config) passes. Config is based on `@eslint/js` recommended rules, with TypeScript parsing via `@typescript-eslint/parser`. No `eslint-disable` directives are present in `src` or `scripts`, so rules are enforced consistently.
- Complexity and size: ESLint enforces `complexity: ['error', { max: 20 }]`, `max-lines-per-function: 80`, and `max-lines: 300` for TS files, and the code passes under these limits. This means no function exceeds complexity 20, no function exceeds 80 lines, and no file exceeds 300 lines—better than the documented thresholds.
- Formatting: Prettier is configured via `.prettierrc.json` and enforced by `npm run format`/`format:check`. `npm run format:check` passes, and `.husky/pre-commit` runs `npm run format` then `npm run lint`, ensuring consistent style before every commit.
- Type checking: `tsconfig.json` uses `strict: true` with modern NodeNext module settings. `npm run type-check` (`tsc --noEmit`) passes. Targeted `grep` confirms there are no `@ts-nocheck` or `@ts-ignore` annotations in `src` or `scripts`; suppressions appear only in node_modules.
- Duplication: `npm run duplication` (`jscpd --threshold 20 src scripts`) passes. Report shows 10 clones with ~7.13% duplicated TS lines and 8.32% tokens, mostly between test files (e.g., `generated-project-*` tests, `cli.test.ts`, dev-server helpers). There is no evidence of high duplication in core production modules, so DRY violations are minor and localized to tests.
- Production code purity: Core runtime modules (`src/cli.ts`, `src/index.ts`, `src/initializer.ts`, `src/server.ts`) do not import test frameworks or mocks. Test-related helpers are clearly named and separate. A search for `vitest|jest|mocha|sinon|chai|expect(` in `src` found no occurrences in production paths.
- Error handling and clarity: CLI and initializer functions validate inputs, provide clear error messages, and use `process.exitCode` rather than hard exits. Git initialization is explicitly best-effort and returns structured results instead of throwing. Names (e.g., `initializeTemplateProjectWithGit`, `GitInitResult`, `buildServer`) are descriptive, and comments focus on intent and link back to stories/ADRs via `@supports`.
- Tooling & hooks: `package.json` centralizes all dev scripts (build, lint, test, type-check, format, duplication, release). `scripts/` contains only scripts referenced from `package.json` (no orphan scripts). Husky hooks are correctly configured: pre-commit runs fast checks (format + lint) and pre-push runs the full quality suite (build, test, lint, type-check, format:check).
- CI/CD: `.github/workflows/ci-cd.yml` defines a single pipeline triggered on `push` to `main` that runs audit, lint, type-check, build, tests, and format check, then uses `semantic-release` to publish automatically and performs a post-release smoke test by installing the package and invoking `getServiceHealth`. This matches the required single unified CI/CD workflow for continuous deployment.
- AI slop / temporary files: No `.patch`, `.diff`, `.rej`, `.tmp`, or backup files were found. There are no placeholder, empty, or obviously unused source files. Comments and docs are specific to this project; there are no generic AI-style boilerplate blocks, and no broad quality-check suppressions hiding issues.

**Next Steps:**
- Refine test duplication: Use the existing jscpd output to identify the most repeated test patterns (e.g., project generation in `generated-project-production*.test.ts`, repeated CLI invocation flows) and factor them into shared test helpers or factories. This will reduce duplication and improve test readability without changing production code.
- Optionally simplify ESLint complexity config: Since all functions already satisfy `max: 20`, you can change `complexity: ['error', { max: 20 }]` to `complexity: 'error'` to rely on ESLint’s default and slightly declutter the config (no behavior change).
- Incrementally add TS-specific lint rules for further safety: When you want to raise the bar, introduce `@typescript-eslint/eslint-plugin` and enable one recommended rule at a time (using the “suppress-then-fix” approach) so lint stays green while you gradually improve type-aware code quality.
- Maintain current hook and CI performance: As the codebase grows, keep an eye on `pre-commit` runtime. If it becomes slow, consider limiting format/lint there to changed files while keeping the comprehensive checks in `pre-push` and CI, preserving the fast feedback loop without weakening quality gates.

## TESTING ASSESSMENT (96% ± 18% COMPLETE)
- Testing in this project is excellent. A comprehensive Vitest-based suite covers the initializer, CLI, dev server, Fastify server, Node version enforcement, and repository hygiene. All tests pass, run non-interactively, use OS temp directories with proper cleanup, and achieve >90% overall coverage with enforced 80% thresholds. Tests are well-structured, behavior-focused, and tightly linked to stories/ADRs via @supports annotations and REQ IDs. Remaining issues are minor (some logic in tests and a few slower integration tests).
- An established testing framework (Vitest) is used, configured via vitest.config.mts with clear include/exclude patterns and coverage settings. No custom/bespoke test runner is used.
- The canonical test commands are non-interactive and succeed: `npm test` (vitest run) and `npm run test:coverage` (vitest run --coverage) both exit with code 0 and exercise the full suite.
- Coverage is high and enforced: global coverage is ~91% for statements/lines and ~83% for branches, with Vitest thresholds set at 80% for lines/statements/branches/functions. The project meets these thresholds, and only a few branches in initializer-related code remain partially uncovered.
- Tests are well scoped across layers: unit tests for core logic (getServiceHealth, Node version parsing), integration tests for Fastify server behavior, initializer/Git behavior, dev server port resolution, and E2E-style tests that scaffold projects, build them, and (optionally) start servers.
- Filesystem hygiene and isolation are excellent: all project scaffolding and generator tests use OS temp directories (via fs.mkdtemp in os.tmpdir), and cleanup is performed in afterEach/afterAll or try/finally blocks. No tests write into repository-tracked paths, and a dedicated repo hygiene test asserts that known generated project directories do not exist at the repo root.
- Process-based tests (dev server, CLI, production server) are carefully controlled: child processes are spawned with explicit env/cwd, waited for via log-based polling with timeouts, and terminated cleanly with SIGINT, with robust error reporting to avoid flakiness.
- Tests cover both happy paths and error/edge scenarios: e.g., Fastify tests exercise 404 and 400 responses and invalid methods/payloads; initializer tests cover empty project names and missing git; dev server tests cover invalid/used ports; Node version tests validate both accepted and rejected versions with clear error messaging.
- Test structure and naming are strong: tests generally follow an Arrange–Act–Assert style, with helper functions encapsulating setup; test names describe expected behavior and often embed requirement IDs. Test file names reflect the features under test; there are no misleading or coverage-oriented names (e.g., no "branches" suffix misuse).
- Traceability is exemplary: test files include JSDoc headers with @supports annotations pointing to specific docs/stories/*.story.md files and ADRs, along with requirement IDs. Describe blocks reference stories, and many individual tests include [REQ-...] tags, enabling precise mapping from requirements to tests.
- Husky hooks enforce local quality gates: pre-commit runs format and lint; pre-push runs build, test, lint, type-check, and format:check. This helps guarantee that all tests pass and quality checks succeed before code is pushed, aligning with the zero-tolerance policy for failing tests.
- Minor issues: some tests (e.g., index.test.ts) use loops and small bits of control flow in assertions, which slightly diverges from the "no logic in tests" ideal, and a few integration tests (dev server hot reload, production build) are slower than typical unit tests—but still acceptable and well-contained. Optional E2E tests are correctly marked as skipped by default to avoid environment-related flakiness.

**Next Steps:**
- Tighten a few unit tests to reduce unnecessary control flow (e.g., replace small for-loops in getServiceHealth tests with a couple of explicit repeated calls or parameterized tests) to better align with the "no logic in tests" guideline.
- Add a couple of targeted tests for uncovered or partially covered branches in src/initializer.ts (e.g., error/fallback paths when reading template files) to improve branch coverage for that file beyond 80% and further reduce the chance of regressions in the initializer.
- Optionally separate fast unit tests from slower integration/E2E tests by introducing scripts like `npm run test:unit` and `npm run test:integration`, so developers can run a quick suite locally while CI and pre-push hooks still run the full set.
- If desired, enable the currently skipped CLI and production-start E2E tests in a controlled environment (e.g., dedicated CI job or behind an env flag such as E2E_FULL=1) to gain additional end-to-end assurance without risking local flakiness.
- Add or extend a short developer-facing document in docs/ describing the testing strategy (test commands, use of temp dirs, repository hygiene rules, and rationale for skipped long E2E tests) to help new contributors follow the established high standards.

## EXECUTION ASSESSMENT (90% ± 18% COMPLETE)
- The project executes reliably in its target environment. Build, lint, type-check, and formatting all pass, and a comprehensive vitest suite exercises the initializer, CLI, dev server, and generated Fastify app in realistic end-to-end flows. Error handling and resource cleanup are well implemented. A few deep E2E scenarios are present but intentionally skipped by default to avoid flakiness, and there is limited explicit performance/latency testing, which keeps the score just below "excellent".
- `npm test` passes with 9 test files run (49 tests passed, 3 skipped), covering the Node version check, library exports, CLI, dev server, Fastify server stub, initializer, generated-project production build, and repo hygiene for generated projects.
- `npm run build` succeeds, running `tsc -p tsconfig.json` followed by `scripts/copy-template-files.mjs`, which verifies `src/template-files` exists and copies assets into both `dist/template-files` and `dist/src/template-files` so runtime templates are available.
- `npm run lint`, `npm run type-check`, and `npm run format:check` all complete successfully, confirming that the codebase is syntactically correct, type-safe, and consistently formatted under the project’s own tooling configuration.
- The Fastify server stub (`src/server.ts`) is thoroughly tested: `/health` and `HEAD /health` return `200` with JSON payload and proper security headers from `@fastify/helmet`; unknown routes and unsupported methods return structured 404 errors; malformed JSON bodies return 400 with descriptive messages; `startServer` handles ephemeral ports and error cases.
- The initializer (`src/initializer.ts`) correctly scaffolds new projects using template files (with fallback to in-memory defaults), validates project names, and provides best-effort `git init` via `initializeGitRepository`, returning structured results instead of throwing on git failures; tests confirm directory structures and that a generated project can be built with `tsc` producing JS, d.ts, and sourcemaps in `dist/`.
- The CLI (`src/cli.ts`) is executed via child processes in tests against `dist/cli.js`, validating behavior with and without `git` in PATH, argument validation (usage error on missing name), and error propagation via `process.exitCode` and stderr messages.
- Dev server behavior, including port resolution and runtime, is validated end-to-end: tests spawn the `dev-server.mjs` script, confirm auto and strict port modes, detect invalid or in-use ports via custom `DevServerError`, honor `DEV_SERVER_SKIP_TSC_WATCH` in test mode, and verify hot-reload by modifying compiled output and observing restart logs; processes and temp directories are cleaned up reliably.
- Generated-project production behavior is validated by `generated-project-production.test.ts`, which scaffolds a project into a temp dir, symlinks `node_modules`, runs `tsc -p tsconfig.json` in the generated project, asserts build success, and verifies expected outputs (`dist/src/index.js`, `.d.ts`, `.js.map`).
- Several deeper, environment-dependent E2E tests (e.g., running `npm install` and `npm run dev` in a generated project, or starting the compiled server from `dist/src/index.js` and hitting `/health` over HTTP) are implemented but marked `it.skip`/`describe.skip` to avoid flakiness where npm or long-running processes aren’t guaranteed, slightly reducing end-to-end runtime coverage.
- Resource management is careful: Fastify servers are closed in `finally` blocks, child processes from dev-server and generated-project tests receive SIGINT and are awaited with timeouts, and temp directories are created via `fs.mkdtemp` and removed using `fs.rm(..., { recursive: true, force: true })`, reducing risk of leaks or orphaned resources. There are no database calls, so N+1 query and caching concerns are not applicable in this context.

**Next Steps:**
- Conditionally enable at least one full CLI + dev-server E2E (e.g., `RUN_SLOW_E2E=1 npm test`) that initializes a project, runs `npm install`, starts `npm run dev`, and verifies the `/health` endpoint, so that the complete developer workflow can be validated in controlled environments.
- Similarly, consider conditionally enabling the skipped generated-project production start test that runs `node dist/src/index.js` in the generated project and verifies `/health` over HTTP, closing the loop on both build and runtime server behavior.
- Add light performance/latency assertions where appropriate (e.g., ensuring dev server reports a URL and `/health` responds within a generous upper bound) to encode runtime performance expectations without making tests flaky.
- Expand user-facing documentation to explicitly describe the runtime assumptions (Node >= 22, how `npm run dev`, `npm run build`, and `npm start` behave in generated projects), reducing misconfiguration risks when others execute the tool.
- Optionally add a simple smoke-test script (exposed via an npm script) that uses the published package or `npx` to initialize a project and run its build/start commands, providing a one-command local verification of the end-to-end runtime behavior from a consumer’s perspective.

## DOCUMENTATION ASSESSMENT (82% ± 17% COMPLETE)
- User-facing documentation for this Fastify + TypeScript template is clear, accurate, and strongly aligned with the implemented features. README, user docs, and CHANGELOG correctly describe behavior, versioning (semantic‑release), and installation requirements, and all user-visible links are valid and published. License information is consistent. The main shortfall is incomplete traceability annotations for some named helper functions, which prevents full compliance with the strict code-story traceability requirements.
- README.md accurately documents how to use the template (`npm init @voder-ai/fastify-ts my-api`, dev/build/start scripts) and the behavior of generated projects (GET / returning a Hello World JSON). This matches the actual scaffolding logic in `src/initializer.ts` and the templates in `src/template-files/` (e.g., `index.ts.template`, `package.json.template`, `dev-server.mjs`).
- README clearly separates implemented functionality from planned enhancements (security headers, structured logging, env validation, CORS). These planned items are explicitly marked as not yet implemented, so there is no misleading description of current capabilities.
- User-facing docs are well-structured: root README, CHANGELOG, LICENSE, and `user-docs/` (testing.md, api.md, SECURITY.md). Development docs live under `docs/` and are not referenced from user docs, respecting the separation between user and project documentation.
- All documentation links are properly formatted and valid: README links to `[Testing Guide](user-docs/testing.md)`, `[API Reference](user-docs/api.md)`, and `[Security Overview](user-docs/SECURITY.md)`. These files exist and are included in the npm package via the `files` array in `package.json`. There are no user-facing links to `docs/`, `prompts/`, or other internal folders.
- Code references (commands, filenames) are correctly formatted with backticks (e.g., `npm test`, `.test.ts`, `tsconfig.json`) and not as Markdown links, avoiding broken links to non-published files.
- The project uses semantic-release for automated versioning, as documented in both `README.md` (Releases and Versioning section) and `CHANGELOG.md`. `CHANGELOG.md` explains that `package.json`’s `version` field is not authoritative and directs users to GitHub Releases and npm, which aligns with the presence of `.releaserc.json` and the `release` script.
- `user-docs/api.md` provides a solid API reference for public exports (`getServiceHealth`, `initializeTemplateProject`, `initializeTemplateProjectWithGit`, `GitInitResult`). Descriptions, parameter types, error behavior, and examples match the actual TypeScript implementations in `src/index.ts` and `src/initializer.ts` and the associated tests.
- `user-docs/testing.md` thoroughly documents test commands (`npm test`, `npm run test:coverage`, `npm run type-check`), explains the difference between behavior tests and type-level tests, and provides sample code for type tests. It explicitly distinguishes between the template repo and generated projects, noting that generated projects currently lack built-in Vitest configuration and scripts, which matches the generated `package.json.template`.
- `user-docs/SECURITY.md` accurately describes current security posture: minimal endpoints (`GET /health` for the internal stub server, `GET /` and `/health` for generated projects), and absence of auth, CORS, env validation, and automatic Helmet setup. It provides guidance and examples for configuring `@fastify/helmet` and `@fastify/cors` without claiming these are enabled by default, aligning with the actual templates (which include `@fastify/helmet` as a dependency but do not auto-register it in generated projects).
- License consistency is strong: root `LICENSE` contains standard MIT text with copyright © 2025 voder.ai, and `package.json` declares `"license": "MIT"` (valid SPDX). There is only one package, so no intra-repo conflicts, and no additional LICENSE files with differing content.
- Traceability annotations are implemented extensively using the preferred `@supports` format in many core modules: `src/index.ts`, `src/server.ts`, `src/initializer.ts`, `src/template-files/dev-server.mjs`, and tests like `src/server.test.ts` and `src/index.test.ts` all map code and tests to specific stories and requirement IDs in `docs/stories/` and `docs/decisions/`. Syntax is consistent and parseable.
- However, some named functions lack their own `@supports` annotations, violating the requirement that every named function and significant branch must include traceability: in `scripts/check-node-version.mjs`, exported helpers `parseNodeVersion`, `isVersionAtLeast`, and `getNodeVersionCheckResult` (and arguably the exported `enforceMinimumNodeVersionOrExit`) do not have function-level `@supports` despite being part of the documented Node version enforcement behavior.
- Similarly, `src/dev-server.test-helpers.ts` exposes several named helper functions (`createServerOnRandomPort`, `createDevServerProcess`, `waitForDevServerMessage`, `sendSigintAndWait`, `createMinimalProjectDir`, `createFakeProjectForHotReload`) with no `@supports` annotations, even though they implement test harness behavior directly tied to the dev-server story. This reduces traceability coverage for the dev-server feature tests.
- Branch-level traceability is good in many core flows (e.g., Helmet registration, dev-server port resolution, graceful shutdown) but not universal; some complex control flows in helper modules (e.g., parts of `check-node-version.mjs` and `dev-server.test-helpers.ts`) lack branch-level comments with `@supports`, weakening fully automated requirement-to-code linkage.
- README and all user docs satisfy the attribution requirement: each contains an Attribution section or line with “Created autonomously by [voder.ai](https://voder.ai).” The generated project README template (`src/template-files/README.md.template`) also includes this attribution, ensuring downstream users see correct provenance.
- No issues were found with documentation referencing unpublished files: `package.json`’s `files` array ensures all linked user docs (`README.md`, `CHANGELOG.md`, `LICENSE`, `user-docs/**`) are part of the published package, while internal docs (`docs/`, `prompts/`, `.voder/`) are correctly excluded and not linked from user-facing content.

**Next Steps:**
- Add function-level `@supports` annotations to all exported helpers in `scripts/check-node-version.mjs` (e.g., `parseNodeVersion`, `isVersionAtLeast`, `getNodeVersionCheckResult`, and `enforceMinimumNodeVersionOrExit`), referencing the appropriate install and Node-version stories and requirements. This will close a key gap in traceability for install-time behavior.
- Add `@supports` annotations to each exported function in `src/dev-server.test-helpers.ts`, tying them to the dev-server story (`docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md`) and the relevant requirement IDs (e.g., REQ-DEV-PORT-AUTO, REQ-DEV-HOT-RELOAD, REQ-DEV-GRACEFUL-STOP, REQ-DEV-TYPESCRIPT-WATCH). Consider also adding brief descriptive JSDoc blocks for clarity.
- Perform a quick audit of all `src/**/*.ts`, `src/**/*.js`, and `scripts/**/*.mjs` files to ensure every named function has a nearby `@supports` (or legacy `@story`/`@req`) annotation and that significant branches (conditionals, loops, try/catch) implementing business logic are similarly annotated. Fix any additional gaps discovered.
- Optionally enhance the user-facing docs with a short `user-docs/generated-project.md` summarizing the behavior and structure of freshly generated projects (endpoints, scripts, where to add routes, and how to enable security features like Helmet and CORS). This would consolidate information currently spread across README and SECURITY into a single generated-project overview.
- Keep the current discipline of separating user documentation (`README.md`, `CHANGELOG.md`, `user-docs/**`) from internal development docs (`docs/**`, `prompts/**`), and when adding new docs, continue to avoid user-facing Markdown links into `docs/` or `prompts/`. Ensure any new user-facing documents are added to the `files` array in `package.json` so links remain valid in the published npm package.

## DEPENDENCIES ASSESSMENT (85% ± 19% COMPLETE)
- Dependencies are generally well-managed: installs are clean, no vulnerabilities or deprecations are reported, tooling and app code build/test/lint successfully, and the lockfile is committed. The only shortcoming is an out-of-date but safe dev dependency (`jscpd`) that should be upgraded to the latest mature version identified by dry-aged-deps.
- Project uses a single Node/TypeScript package (`@voder-ai/create-fastify-ts`) with a clear separation of runtime dependencies (`fastify`, `@fastify/helmet`) and dev tooling (TypeScript, ESLint, Vitest, Prettier, jscpd, semantic-release, etc.).
- `package-lock.json` exists and is tracked in git (`git ls-files package-lock.json` returns the file), ensuring reproducible installs.
- `npm install --ignore-scripts` completes with no `npm WARN deprecated` messages and reports `found 0 vulnerabilities`, indicating no known security issues or deprecated packages in the current tree.
- `npm audit` exits with code 0 (`found 0 vulnerabilities`), further confirming no known security vulnerabilities in the installed dependencies.
- Core workflows succeed on the current dependency set: `npm run build` (TypeScript build and template copy), `npm test` (Vitest; 9 test files, 49 tests passed, 3 skipped), and `npm run lint` (ESLint) all run without errors, demonstrating good compatibility between dependencies.
- `npm ls --depth=0` exits successfully and lists all top-level dependencies with no peer/version conflict errors, suggesting a healthy dependency tree with no obvious resolution issues.
- `npx dry-aged-deps --format=xml` reports 4 outdated packages but only 1 safe update (`<safe-updates>1</safe-updates>`). Three packages (`@eslint/js`, `eslint`, `@types/node`) have newer versions that are filtered by age (`<filtered>true</filtered>` with `<filter-reason>age</filter-reason>`), so they are intentionally not safe to upgrade yet under the 7-day maturity policy.
- The remaining package, `jscpd`, is an actively used dev dependency (via the `duplication` script) and is reported with `<current>4.0.4</current>`, `<latest>4.0.5</latest>`, `<age>529</age>`, and `<filtered>false</filtered>`, making `4.0.5` a safe, mature candidate; this means the current version is out of date under the defined policy.
- No evidence of circular dependencies or installation issues was observed; builds and runtime tests that exercise Fastify and the generated project templates all pass, indicating that the current dependency versions are mutually compatible and stable.
- Tooling and metadata (Node engine constraint, `overrides` for `semver-diff`, centralized npm scripts) show good package management practices, but the outstanding `jscpd` update prevents a perfect score for dependency currency with safe mature versions.

**Next Steps:**
- Upgrade `jscpd` to the latest safe version identified by dry-aged-deps: update `devDependencies.jscpd` in `package.json` from `^4.0.4` to a range including `4.0.5` (e.g. `"^4.0.5"` or `"4.0.5"`), then run `npm install` to refresh `package-lock.json`.
- After upgrading `jscpd`, re-run `npm run build`, `npm test`, and `npm run lint` (and optionally `npm run duplication`) to verify that all tooling and tests still pass with the updated dependency.
- Commit the change with a Conventional Commit message such as `build: update jscpd to 4.0.5`, ensuring `package-lock.json` is included and remains tracked in git.
- Re-run `npx dry-aged-deps --format=xml` to confirm that `jscpd` now shows `<current> == <latest>` with `<filtered>false</filtered>` and that there are no remaining unfiltered packages where the current version lags behind the latest safe version. Once that’s true, the dependency health will be in the 90–100% range.

## SECURITY ASSESSMENT (92% ± 18% COMPLETE)
- The project has a strong security posture for its current scope. Dependency security is clean (no known vulnerabilities, no pending mature upgrades), there are no hardcoded secrets or unsafe .env handling, the Fastify stub server is protected with @fastify/helmet, and CI/CD enforces dependency audits and continuous deployment without manual gates. Remaining items are minor hardening and ergonomics improvements rather than active vulnerabilities.
- Dependency audits show no vulnerabilities: `npm audit --production --audit-level=moderate` and `npm audit --audit-level=moderate` both report `found 0 vulnerabilities` (exit code 0).
- `npx dry-aged-deps --format=json` reports `totalOutdated: 0` and `safeUpdates: 0`, meaning no mature (≥7 days) safe upgrades are currently available; the current dependency set is up-to-date per the dry-aged-deps safety policy.
- There is no `docs/security-incidents/` directory and no SECURITY-INCIDENT files, so there are no existing accepted, disputed, or unresolved vulnerabilities to re-evaluate.
- No audit-filtering configuration files (`.nsprc`, `audit-ci.json`, `audit-resolve.json`) are present, which is acceptable because there are no disputed or accepted-risk vulnerabilities that would require suppression.
- The CI/CD workflow `.github/workflows/ci-cd.yml` includes a blocking dependency vulnerability audit step: `npm audit --production --audit-level=high`, enforcing that any high-severity runtime vulnerability will fail the pipeline and block releases, in line with ADR 0015.
- CI also runs `npx dry-aged-deps --format=table` as a non-blocking step (with `continue-on-error: true`), providing visibility into safe dependency updates without breaking the build.
- There is a single unified CI/CD pipeline triggered on `push` to `main` that runs lint, type-check, build, test, format-check, dependency audit, and then `semantic-release` for publishing, followed by a post-release smoke test of the published package. This implements true continuous deployment without manual gates.
- The post-release smoke test installs the just-published package in a temp project and verifies that `getServiceHealth()` returns `'ok'`, ensuring that what was published is loadable and minimally functional.
- No Dependabot or Renovate configurations are present (`.github/dependabot.yml`, `.github/dependabot.yaml`, `renovate.json` all absent), so there is no conflicting dependency automation alongside `dry-aged-deps` and npm audit.
- The host project’s `.gitignore` correctly excludes `.env` and related environment files, while allowing `.env.example` if added in the future.
- Git tracking checks confirm `.env` is not tracked and has never been committed: `git ls-files .env` and `git log --all --full-history -- .env` both return empty output.
- Searches across `src`, `docs`, `user-docs`, and `.github` for common secret patterns (`API_KEY`, `SECRET`, `token`, `password`) return no matches, indicating there are no obvious hardcoded credentials or tokens in the codebase or configs.
- The internal Fastify stub server (`src/server.ts`) registers `@fastify/helmet` with default options and exposes only `GET /health`, returning static JSON. This significantly reduces attack surface and enables standard security headers.
- Server tests (`src/server.test.ts`) verify correct behavior for `/health`, unknown routes, malformed JSON payloads, and specifically assert the presence of security headers such as `content-security-policy`, `x-frame-options`, `strict-transport-security`, `x-content-type-options`, and `referrer-policy`.
- The generated project entrypoint (`src/template-files/index.ts.template`) exposes only `GET /` and `GET /health` returning static JSON, with no request bodies, parameters, or user input processing, minimizing risk of injection or validation issues at this stage.
- The template project’s `.gitignore.template` excludes `node_modules/`, `dist/`, `.env`, and `.env.local`, ensuring generated projects follow correct local secret-handling practices and do not commit environment files by default.
- There is no use of SQL or any database code; thus SQL injection risk is currently non-applicable for implemented functionality.
- Documentation in `user-docs/SECURITY.md` clearly states current limitations (no auth, no CORS, no persistent storage, no automatic helmet in generated projects) and provides guidance on adopting `@fastify/helmet`, CSP, and CORS in line with OWASP recommendations, avoiding a false sense of security.
- `docs/security-practices.md` and ADR `docs/decisions/0015-dependency-security-scanning-in-ci.accepted.md` describe and match the implemented dependency security strategy, ensuring policy and implementation are aligned.
- Node version enforcement via `scripts/check-node-version.mjs` ensures installs only proceed on Node >= 22.0.0, reducing exposure to older runtimes with unpatched vulnerabilities or missing features.
- No evidence of secrets being echoed in CI logs; secrets are only referenced through `${{ secrets.NPM_TOKEN }}` and `${{ secrets.GITHUB_TOKEN }}` and used for authenticated npm publishing and GitHub release operations.

**Next Steps:**
- Optionally add a minimal `.env.example` at the root (with non-sensitive placeholders) to document environment variable usage patterns for contributors, even if the current library does not require env vars itself.
- Consider introducing a fast, lightweight secret scanning tool (e.g., secretlint or gitleaks) integrated via `npm run` scripts and the existing CI pipeline, to catch accidental secret commits proactively.
- As new features are added (e.g., authentication, stateful endpoints, file upload, or database integration), ensure that Fastify schemas are used for input validation and that new code includes explicit tests for authorization, validation, and error handling behaviors.
- When you eventually enable helmet and CORS in generated projects (beyond the current Hello World scope), align implementation with the patterns already documented in `user-docs/SECURITY.md` (explicit CORS allowlists, CSP configuration, and OWASP-aligned header settings).
- If the project later encounters an npm advisory that must be disputed or accepted as residual risk, create `docs/security-incidents/SECURITY-INCIDENT-*.disputed.md` / `.known-error.md` as appropriate and configure an audit filter (`.nsprc`, `audit-ci.json`, or `audit-resolve.json`) referencing those incident files.

## VERSION_CONTROL ASSESSMENT (90% ± 19% COMPLETE)
- Version control and CI/CD for this repository are in very good health. The project uses trunk-based development on `main`, has a single unified workflow that runs tests, lint, type-check, build, formatting, security audit, and semantic-release-based publishing on every push to `main`, and enforces strong local quality gates via Husky pre-commit and pre-push hooks. There are no tracked build artifacts or generated test projects, and `.voder` is handled correctly. No high-penalty violations were found, so the score remains at the 90% baseline.
- PENALTY CALCULATION:
- Baseline: 90%
- Total penalties: 0% → Final score: 90%

**Next Steps:**
- Keep CI/CD actions (`actions/checkout`, `actions/setup-node`, semantic-release and its plugins) reasonably up to date to avoid future deprecation issues; periodically review workflow logs for new warnings.
- Consider documenting the local workflow (pre-commit + pre-push hooks and how they mirror CI) in `docs/` so new contributors understand the required quality checks before pushing.
- If the project grows in scope, you could complement `npm audit` with an additional static security analysis tool (e.g., ESLint security rules or a Node-focused SAST) in CI, though current security scanning already meets the stated requirements.
- Continue to ensure that build outputs (e.g., future `dist/` contents) stay out of version control and that any new generated artifacts or reports are added to `.gitignore` rather than committed.

## FUNCTIONALITY ASSESSMENT (75% ± 95% COMPLETE)
- 2 of 8 stories incomplete. Earliest failed: docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md
- Total stories assessed: 8 (0 non-spec files excluded)
- Stories passed: 6
- Stories failed: 2
- Earliest incomplete story: docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md
- Failure reason: This story is **partially implemented** and cannot be marked complete because key acceptance criteria around *production start and runtime behavior* are not verified.

What is satisfied:
- **Build pipeline in a generated project**:
  - Generated projects have `npm run build` wired to `npm run clean && tsc -p tsconfig.json` and `npm run clean` removes `dist/` (REQ-BUILD-TSC, REQ-BUILD-CLEAN).
  - `tsconfig.json` in generated projects sets `outDir: "dist"`, includes `src/`, excludes `dist` and `node_modules` (REQ-BUILD-OUTPUT-DIST).
  - `declaration: true`, `declarationMap: true`, and `sourceMap: true` generate `.d.ts` files and sourcemaps (REQ-BUILD-DECLARATIONS, REQ-BUILD-SOURCEMAPS).
  - ESM configuration is consistent via `"type": "module"` and `module: "NodeNext"` (REQ-BUILD-ESM).
  - The dedicated build test `src/generated-project-production.test.ts` scaffolds a real generated project in a temp directory, runs `tsc -p tsconfig.json`, asserts exit code 0, and verifies `dist/src/index.js`, `dist/src/index.d.ts`, and `dist/src/index.js.map` exist. This provides concrete evidence that the generated template **compiles successfully**, produces the expected artifacts, and does so quickly (<1s in the test run), satisfying **Build Succeeds**, **Build Output Generated**, **Type Declarations Generated**, **Fast Build**, and most of **Clean Build Output** for the template code.
- **Production configuration and documentation**:
  - Generated `package.json` has `start: "node dist/src/index.js"`, which runs compiled JavaScript from `dist/` with no watch (REQ-START-PRODUCTION, REQ-START-NO-WATCH).
  - The generated `src/index.ts` uses `PORT` env var with default 3000 and logs `Server listening at ...` on startup, aligning with REQ-START-PORT and REQ-START-LOGS.
  - Generated README and root README clearly document the build process, dev vs production execution, and expected behavior of `npm run build` and `npm start`, covering the DoD documentation items.

What is **not** fully satisfied (reasons for FAILED):
- **Production Start Works / Server Responds in a generated project**:
  - Story acceptance criteria explicitly require:
    - Running `npm start` starts the server from `dist/` (Production Start Works).
    - After `npm start`, `/health` responds with 200 OK (Server Responds).
    - Production server runs entirely from `dist/` without depending on TS sources (No Source References).
  - There are two E2E-style tests designed to confirm this behavior, but **both are disabled**:
    - `src/generated-project-production.test.ts` contains a node-based production start test (`startCompiledServerViaNode`) that starts `node dist/src/index.js` and verifies `/health` returns 200 and `{ status: 'ok' }`, but the entire suite is wrapped in `describe.skip(...)` and is never executed.
    - `src/generated-project-production-npm-start.test.ts` directly exercises `npm install`, `npm run build`, and `npm start` in a generated project and then checks `/health`, but this suite is also completely disabled via `describe.skip(...)`.
  - The only part of Story 006.0 that is currently executed in tests is the build-and-artifacts check; **no automated test run actually starts the compiled server for a generated project or asserts that the health endpoint works in production mode**.
- Because the specification and Definition of Done require demonstrating that the production server can be started from the compiled bundle and responds correctly, and the existing tests that would provide that evidence are explicitly skipped, those acceptance criteria (REQ-START-PRODUCTION, the "Production Start Works", "Server Responds", and fully proving "No Source References" at runtime) remain unverified.

Given the need for concrete evidence and the emphasis on tests as the primary validation mechanism, the presence of skipped E2E tests for production start means **not all acceptance criteria are met**, so this story is assessed as **FAILED**.

To reach PASSED, the project would need, at minimum, one non-skipped test (node-based or npm-based) that:
- Scaffolds a generated project;
- Runs the build through the intended path (ideally `npm run build`, or an equivalent well-justified shortcut);
- Starts the server from `dist` (via `node dist/src/index.js` or `npm start`);
- Confirms a 200 OK response and `{ status: 'ok' }` body from `/health`.
Once such a test is enabled and passing, the remaining acceptance criteria would be demonstrably satisfied.

**Next Steps:**
- Complete story: docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md
- This story is **partially implemented** and cannot be marked complete because key acceptance criteria around *production start and runtime behavior* are not verified.

What is satisfied:
- **Build pipeline in a generated project**:
  - Generated projects have `npm run build` wired to `npm run clean && tsc -p tsconfig.json` and `npm run clean` removes `dist/` (REQ-BUILD-TSC, REQ-BUILD-CLEAN).
  - `tsconfig.json` in generated projects sets `outDir: "dist"`, includes `src/`, excludes `dist` and `node_modules` (REQ-BUILD-OUTPUT-DIST).
  - `declaration: true`, `declarationMap: true`, and `sourceMap: true` generate `.d.ts` files and sourcemaps (REQ-BUILD-DECLARATIONS, REQ-BUILD-SOURCEMAPS).
  - ESM configuration is consistent via `"type": "module"` and `module: "NodeNext"` (REQ-BUILD-ESM).
  - The dedicated build test `src/generated-project-production.test.ts` scaffolds a real generated project in a temp directory, runs `tsc -p tsconfig.json`, asserts exit code 0, and verifies `dist/src/index.js`, `dist/src/index.d.ts`, and `dist/src/index.js.map` exist. This provides concrete evidence that the generated template **compiles successfully**, produces the expected artifacts, and does so quickly (<1s in the test run), satisfying **Build Succeeds**, **Build Output Generated**, **Type Declarations Generated**, **Fast Build**, and most of **Clean Build Output** for the template code.
- **Production configuration and documentation**:
  - Generated `package.json` has `start: "node dist/src/index.js"`, which runs compiled JavaScript from `dist/` with no watch (REQ-START-PRODUCTION, REQ-START-NO-WATCH).
  - The generated `src/index.ts` uses `PORT` env var with default 3000 and logs `Server listening at ...` on startup, aligning with REQ-START-PORT and REQ-START-LOGS.
  - Generated README and root README clearly document the build process, dev vs production execution, and expected behavior of `npm run build` and `npm start`, covering the DoD documentation items.

What is **not** fully satisfied (reasons for FAILED):
- **Production Start Works / Server Responds in a generated project**:
  - Story acceptance criteria explicitly require:
    - Running `npm start` starts the server from `dist/` (Production Start Works).
    - After `npm start`, `/health` responds with 200 OK (Server Responds).
    - Production server runs entirely from `dist/` without depending on TS sources (No Source References).
  - There are two E2E-style tests designed to confirm this behavior, but **both are disabled**:
    - `src/generated-project-production.test.ts` contains a node-based production start test (`startCompiledServerViaNode`) that starts `node dist/src/index.js` and verifies `/health` returns 200 and `{ status: 'ok' }`, but the entire suite is wrapped in `describe.skip(...)` and is never executed.
    - `src/generated-project-production-npm-start.test.ts` directly exercises `npm install`, `npm run build`, and `npm start` in a generated project and then checks `/health`, but this suite is also completely disabled via `describe.skip(...)`.
  - The only part of Story 006.0 that is currently executed in tests is the build-and-artifacts check; **no automated test run actually starts the compiled server for a generated project or asserts that the health endpoint works in production mode**.
- Because the specification and Definition of Done require demonstrating that the production server can be started from the compiled bundle and responds correctly, and the existing tests that would provide that evidence are explicitly skipped, those acceptance criteria (REQ-START-PRODUCTION, the "Production Start Works", "Server Responds", and fully proving "No Source References" at runtime) remain unverified.

Given the need for concrete evidence and the emphasis on tests as the primary validation mechanism, the presence of skipped E2E tests for production start means **not all acceptance criteria are met**, so this story is assessed as **FAILED**.

To reach PASSED, the project would need, at minimum, one non-skipped test (node-based or npm-based) that:
- Scaffolds a generated project;
- Runs the build through the intended path (ideally `npm run build`, or an equivalent well-justified shortcut);
- Starts the server from `dist` (via `node dist/src/index.js` or `npm start`);
- Confirms a 200 OK response and `{ status: 'ok' }` body from `/health`.
Once such a test is enabled and passing, the remaining acceptance criteria would be demonstrably satisfied.
- Evidence: [
  {
    "description": "Story specification and acceptance criteria",
    "data": "docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md defines acceptance criteria including: `npm run build` succeeds; `dist/` created with compiled JS matching `src/`; `.d.ts` generated; `npm start` runs compiled code from `dist/`; server /health responds 200; production runs entirely from `dist/`; build is fast (<10s); build output is clean/warning-free. Requirements: REQ-BUILD-TSC, REQ-BUILD-OUTPUT-DIST, REQ-BUILD-DECLARATIONS, REQ-BUILD-SOURCEMAPS, REQ-BUILD-CLEAN, REQ-BUILD-ESM, REQ-START-PRODUCTION, REQ-START-NO-WATCH, REQ-START-PORT, REQ-START-LOGS."
  },
  {
    "description": "Generated project build configuration and scripts implement build and start behavior",
    "data": "src/template-files/package.json.template:\n{\n  \"name\": \"{{PROJECT_NAME}}\",\n  \"version\": \"0.0.0\",\n  \"private\": true,\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"node dev-server.mjs\",\n    \"clean\": \"node -e \\\"const fs=require('fs'); fs.rmSync('dist', { recursive: true, force: true });\\\"\",\n    \"build\": \"npm run clean && tsc -p tsconfig.json\",\n    \"start\": \"node dist/src/index.js\"\n  },\n  \"dependencies\": {\n    \"fastify\": \"^5.6.2\",\n    \"@fastify/helmet\": \"^13.0.2\"\n  },\n  \"devDependencies\": {\n    \"typescript\": \"^5.9.3\",\n    \"@types/node\": \"^24.10.2\"\n  }\n}\n\nThis shows for generated projects:\n- REQ-BUILD-TSC: build script uses `tsc -p tsconfig.json`.\n- REQ-BUILD-CLEAN: `clean` removes `dist` and `build` runs `npm run clean && tsc ...`.\n- REQ-START-PRODUCTION / REQ-START-NO-WATCH: `start` runs `node dist/src/index.js` (compiled JS, no watcher)."
  },
  {
    "description": "Generated project TypeScript config ensures dist output, declarations, sourcemaps, and ESM",
    "data": "src/template-files/tsconfig.json.template:\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"NodeNext\",\n    \"moduleResolution\": \"NodeNext\",\n    \"rootDir\": \".\",\n    \"outDir\": \"dist\",\n    \"strict\": true,\n    \"esModuleInterop\": true,\n    \"forceConsistentCasingInFileNames\": true,\n    \"skipLibCheck\": true,\n    \"resolveJsonModule\": true,\n    \"declaration\": true,\n    \"declarationMap\": true,\n    \"sourceMap\": true,\n    \"types\": [\"node\"]\n  },\n  \"include\": [\"src\"],\n  \"exclude\": [\"dist\", \"node_modules\"]\n}\n\nThis supports:\n- REQ-BUILD-OUTPUT-DIST: `outDir` is `dist`.\n- REQ-BUILD-DECLARATIONS: `declaration: true`.\n- REQ-BUILD-SOURCEMAPS: `sourceMap: true` and `declarationMap: true`.\n- REQ-BUILD-ESM: `module: \"NodeNext\"` plus package.json `\"type\": \"module\"` implies ESM output."
  },
  {
    "description": "Generated project server template: health endpoint, port, and logs",
    "data": "src/template-files/src/index.ts.template defines Fastify server:\n- Routes:\n  - `GET '/'` → `{ message: 'Hello World from Fastify + TypeScript!' }`.\n  - `GET '/health'` → `{ status: 'ok' }`.\n- Port and logging:\n  ```ts\n  const port = Number(process.env.PORT ?? 3000);\n\n  fastify\n    .listen({ port, host: '0.0.0.0' })\n    .then((address) => {\n      console.log(`Server listening at ${address}`);\n    })\n    .catch((err) => {\n      console.error('Failed to start server', err);\n      process.exit(1);\n    });\n  ```\nThis implements for generated projects:\n- REQ-START-PORT: uses `PORT` env var with default 3000.\n- REQ-START-LOGS: logs `Server listening at <address>` and Fastify JSON logs.\n- Health endpoint behavior expected once compiled server runs."
  },
  {
    "description": "Initializer wires story 006.0 requirements into generated package.json",
    "data": "src/initializer.ts `createTemplatePackageJson`:\n```ts\n * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-START-PRODUCTION REQ-START-NO-WATCH REQ-START-PORT REQ-START-LOGS\nfunction createTemplatePackageJson(projectName: string): TemplatePackageJson {\n  const normalizedName = projectName.trim();\n\n  return {\n    name: normalizedName,\n    version: '0.0.0',\n    private: true,\n    type: 'module',\n    scripts: {\n      dev: 'node dev-server.mjs',\n      clean:\n        \"node -e \\\"const fs=require('fs'); fs.rmSync('dist', { recursive: true, force: true });\\\"\",\n      build: 'npm run clean && tsc -p tsconfig.json',\n      start: 'node dist/src/index.js',\n    },\n    dependencies: {\n      fastify: '^5.6.2',\n      '@fastify/helmet': '^13.0.2',\n    },\n    devDependencies: {\n      typescript: '^5.9.3',\n      '@types/node': NODE_TYPES_VERSION,\n    },\n  };\n}\n```\nConfirms new projects created via `initializeTemplateProject` get the intended build/clean/start scripts and deps for Story 006.0."
  },
  {
    "description": "Generated project README documents production build & start and dev vs prod differences",
    "data": "src/template-files/README.md.template documents:\n- Scripts:\n  - `dev` runs dev server from TS sources with watch/reload.\n  - `build` \"cleans the dist/ directory, then compiles TypeScript into JavaScript in dist/ (including .d.ts types and sourcemaps) while preserving the src/ directory structure\".\n  - `start` runs the compiled server from `dist/` without watch.\n- \"Production build and start\" section describing `npm run build` and `npm start` behavior, including artifacts and port selection.\n- Attribution: \"Created autonomously by voder.ai\".\nThis satisfies the story's documentation-related DoD items for generated projects."
  },
  {
    "description": "Template root README documents production build behavior at template level",
    "data": "README.md (root) explains generated project scripts:\n- `npm run dev` → dev server via dev-server.mjs.\n- `npm run build` → compiles TS to JS into `dist/`, emits `.d.ts` and sourcemaps.\n- `npm start` → runs compiled Fastify server from `dist/src/index.js` with no watch.\nThis aligns with Story 006.0's requirement that developers understand dev vs production execution."
  },
  {
    "description": "Generated project production build test executes successfully and validates dist artifacts",
    "data": "Test file: src/generated-project-production.test.ts\n- Annotated with `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-TSC REQ-BUILD-OUTPUT-DIST REQ-BUILD-DECLARATIONS REQ-BUILD-SOURCEMAPS REQ-BUILD-ESM REQ-START-PRODUCTION REQ-START-NO-WATCH REQ-START-PORT REQ-START-LOGS`.\n- beforeAll:\n  - Creates temp dir via `fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-prod-'))`.\n  - `initializeTemplateProject('prod-api')` to scaffold a real generated project.\n  - Symlinks root `node_modules` into the project.\n  - Runs `tsc -p tsconfig.json` inside the project using the template's TypeScript binary.\n  - Awaits process exit and asserts `buildExitCode` is 0.\n- Test:\n  ```ts\n  it('builds the project with tsc and outputs JS, d.ts, and sourcemaps into dist/', async () => {\n    const distDir = path.join(projectDir, 'dist');\n    const distIndexJs = path.join(distDir, 'src', 'index.js');\n    const distIndexDts = path.join(distDir, 'src', 'index.d.ts');\n    const distIndexMap = path.join(distDir, 'src', 'index.js.map');\n\n    expect(await directoryExists(distDir)).toBe(true);\n    expect(await fileExists(distIndexJs)).toBe(true);\n    expect(await fileExists(distIndexDts)).toBe(true);\n    expect(await fileExists(distIndexMap)).toBe(true);\n  });\n  ```\n- Production start helper `startCompiledServerViaNode` exists but is only used in a skipped suite (see next evidence)."
  },
  {
    "description": "Execution of generated-project-production.test.ts shows build test passes and start test is skipped",
    "data": "Command run for this assessment:\n\n`npm test -- src/generated-project-production.test.ts --reporter=verbose`\n\nOutput (excerpt):\n\n```text\n> @voder-ai/create-fastify-ts@0.0.0 test\n> vitest run src/generated-project-production.test.ts --reporter=verbose\n\n[generated-project-production] initialized project at /private/var/folders/.../fastify-ts-prod-.../prod-api\n[generated-project-production] linked node_modules from /Users/tomhoward/Projects/template-fastify-ts/node_modules\n[generated-project-production] starting tsc build in /private/var/folders/.../fastify-ts-prod-.../prod-api\n[generated-project-production] tsc build exit code 0\n\n ✓ src/generated-project-production.test.ts > Generated project production build (Story 006.0) [REQ-BUILD-TSC] > builds the project with tsc and outputs JS, d.ts, and sourcemaps into dist/\n ↓ src/generated-project-production.test.ts > Generated project production start via node (Story 006.0) [REQ-START-PRODUCTION] > starts the compiled server from dist/src/index.js and responds on /health\n\nTest Files 1 passed (1)\nTests 1 passed | 1 skipped (2)\n```\nThis confirms:\n- The build portion (REQ-BUILD-TSC, REQ-BUILD-OUTPUT-DIST, REQ-BUILD-DECLARATIONS, REQ-BUILD-SOURCEMAPS) runs and passes in a real generated project.\n- The production start test is *skipped* and not executed."
  },
  {
    "description": "Node-based production start E2E test for generated project is permanently skipped",
    "data": "Bottom of src/generated-project-production.test.ts:\n```ts\n// NOTE: The node-based production start E2E can be enabled by changing describe.skip to describe in environments where longer-running E2Es are acceptable.\ndescribe.skip('Generated project production start via node (Story 006.0) [REQ-START-PRODUCTION]', () => {\n  it('starts the compiled server from dist/src/index.js and responds on /health', async () => {\n    // ... uses startCompiledServerViaNode, waits for 'Server listening at ...', then\n    // polls health endpoint and asserts 200 and body { status: 'ok' } ...\n  }, 180_000);\n});\n```\nBecause of `describe.skip`, this test is *never run* in any environment unless the code is manually changed, so there is no automated verification of REQ-START-PRODUCTION / Server Responds."
  },
  {
    "description": "npm-based production start E2E test for generated project also exists but is fully skipped",
    "data": "src/generated-project-production-npm-start.test.ts:\n- Annotated with `@supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-START-PRODUCTION REQ-START-PORT REQ-START-LOGS`.\n- Uses `initializeTemplateProject` to scaffold, then `runNpmCommand` helper to run `npm install`, `npm run build`, and spawns `npm start`.\n- Waits for `Server listening at ...` in stdout, then polls `/health` and asserts 200 + `{ status: 'ok' }`.\n- Entire suite is guarded by:\n  ```ts\n  describe.skip('Generated project production start via npm (Story 006.0) [REQ-START-PRODUCTION]', () => {\n    it('starts the compiled server from dist/ with npm start and responds on /health', async () => {\n      // ...\n    });\n  });\n  ```\nSo no automated test currently exercises `npm start` in a generated project or confirms the health endpoint in that mode."
  },
  {
    "description": "Template library itself builds successfully (not the generated project build)",
    "data": "Command: `npm run build`\n\nOutput:\n```text\n> @voder-ai/create-fastify-ts@0.0.0 build\n> tsc -p tsconfig.json && node ./scripts/copy-template-files.mjs\n```\nExit code 0 confirms the *template package* builds cleanly, but this is distinct from `npm run build` inside a generated project that Story 006.0 is mostly about."
  }
]
