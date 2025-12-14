Here’s a concise, history-only summary of what’s been done so far, including the most recent work.

---

## Shared Test Helpers and Test Refactors

- Introduced `src/generated-project.test-helpers.ts` to centralize E2E logic for generated projects:
  - Manages temporary project directories, scaffolding, and `node_modules` symlinks.
  - Provides helpers to run `tsc`, start `dist/src/index.js`, poll `/health`, and assert JSON logs and log levels.
  - Annotated helpers with `@supports` tags tied to build/logging requirements.

- Refactored `src/generated-project-production.test.ts`:
  - Replaced custom temp-dir and server-startup logic with shared helpers.
  - Simplified artifact validation under `dist/` and ensured tests run only against compiled output (removing `src/`).
  - Updated the heavier generated-project E2E suite to reuse the helpers.

- Refactored `src/generated-project-logging.test.ts`:
  - Removed bespoke utilities and switched to the shared helpers.
  - Simplified log assertions with `assertHasJsonLogLine` and `assertNoInfoLevelRequestLogs`.
  - Reduced imports so tests depend only on Vitest plus the helper module.

---

## TypeScript, Dev-Server Tests, and ESLint

- Updated `tsconfig.json` to type-check `src/dev-server.test.ts`, while still excluding `dist` and `node_modules`.
- Added `src/mjs-modules.d.ts` for `*.mjs` imports and removed `dev-server.mjs.d.ts`.
- Simplified `src/dev-server.test.ts` to use dynamic imports backed by the new declarations.
- Adjusted `eslint.config.js` to use the default `complexity: 'error'` threshold and verified there were no new lint issues.

---

## Quality Gates, CI, and Repository Review

- Ran and confirmed success for:
  - `npm test`
  - `npm run lint`
  - `npm run type-check`
  - `npm run build`
  - `npm run format`
  - `npm run format:check`

- Committed and pushed a refactor:
  - `test: refactor generated project and dev server tests into shared helpers`

- Confirmed GitHub Actions workflow **“CI/CD Pipeline (main)”** (run ID `20211284073`) completed successfully.

- Performed a repository review:
  - Reviewed repo layout and docs (`README.md`, user/dev docs, ADRs).
  - Inspected core implementation and tests (`src/server.ts`, `src/index.ts`, `src/initializer.ts`, new helpers).
  - Reviewed template files and scripts.
  - Checked documentation references to logging and Helmet for consistency with implementation.

---

## Documentation Updates: Endpoints, Logging, Security, Testing

- Updated `README.md`:
  - Documented generated `GET /` and `GET /health` endpoints.
  - Clarified that these endpoints live in generated `src/index.ts` (with the prior stub server only having `GET /health`).
  - Expanded logging documentation for Fastify + Pino, env-driven log levels, JSON logs (`npm start`), and `pino-pretty` via `npm run dev`.

- Updated `user-docs/api.md`:
  - Added a section distinguishing generated project HTTP endpoints from the internal library API.
  - Reworked the logging section to describe Fastify + Pino, environment-driven log levels, and parity with the former stub server.

- Updated `user-docs/SECURITY.md`:
  - Documented `@fastify/helmet` usage in both the stub server (at that time) and generated projects.
  - Clarified Helmet registration at bootstrap.
  - Linked Helmet usage to stub and generated `src/index.ts`.

- Enhanced `docs/testing-strategy.md`:
  - Documented `src/dev-server.test-helpers.ts` and `src/generated-project.test-helpers.ts`.
  - Recommended using these helpers instead of ad-hoc temp-project logic.
  - Ensured formatting conformed to Prettier.

---

## Build Script Annotations and Traceability

- Updated `scripts/copy-template-files.mjs`:
  - Added `@supports` JSDoc for `main()` describing:
    - Copying assets from `src/template-files` into `dist/` during `npm run build`.
    - Support for scaffolding from `dist` only.
    - Traceability to `REQ-BUILD-OUTPUT-DIST` and `REQ-BUILD-ESM`.

---

## Coverage, Testing Docs, and Coverage Scripts

- Reviewed coverage and test configuration in:
  - `package.json`
  - `vitest.config.mts`
  - `src/generated-project-production-npm-start.test.ts`
  - `user-docs/testing.md`
  - Related stories/requirements.

- Ran `npm run test:coverage` and verified:
  - V8 coverage in use.
  - 80% thresholds for statements, branches, functions, and lines.
  - Exclusion of `src/template-files/**`.
  - Text and HTML reports generated under `coverage/`.
  - Thresholds met.

- Confirmed:
  - `test:coverage` covers core tests.
  - `test:coverage:extended` runs heavier generated-project E2E tests.

- Updated `user-docs/testing.md`:
  - Documented coverage provider and thresholds.
  - Explained core vs extended suites.
  - Included example coverage output.

- Re-ran tests, coverage, type-check, lint, build, and format checks and confirmed success with clean git status (excluding `.voder/*`).

---

## Removal of Sample Exec Project and Repo Hygiene

- Removed the committed `sample-project-exec-test/` directory.
- Updated `.gitignore` to ignore `sample-project-exec-test/`.
- Re-ran:
  - `npm run format:check`
  - `npm run lint`
  - `npm run lint:fix`
  - `npm run format`
  - `npm run build`
  - `npm test`
  - `npm run type-check`
- Committed and pushed:
  - `chore: remove committed sample exec project and enforce ignore`
- Verified CI **CI/CD Pipeline** (run ID `20212086601`) succeeded.

---

## Extended Repo Hygiene for Generated Projects

- Reviewed hygiene mechanisms:
  - `src/repo-hygiene.generated-projects.test.ts`
  - `.gitignore`
  - ADR `docs/decisions/0014-generated-test-projects-not-committed.accepted.md`
  - Related tests (`initializer.test.ts`, `cli.test.ts`, generated-project/dev-server helpers/tests).

- Extended `DISALLOWED_PROJECT_DIRS` in `src/repo-hygiene.generated-projects.test.ts`:
  - Added all generated-project directory names used in tests (e.g., `cli-api`, `my-api`, `prod-api`, `logging-api`, etc.).
  - Kept logic ensuring these directories never exist at repo root.
  - Ran `npm test` and confirmed hygiene tests passed.
  - Commit: `test: extend repo hygiene checks for generated projects`.

- Documentation and ignore rules:
  - Updated `docs/development-setup.md` with a “Generated Projects and Repository Hygiene” section:
    - Explained that manually generated sample projects must not be committed and should live outside the repo or in temp dirs.
    - Referenced ADR 0014 and listed disallowed directory names.
  - Fixed ADR filename reference to `0014-generated-test-projects-not-committed.accepted.md`.
  - Updated `.gitignore` to ignore the same directories as the hygiene test.
  - Re-ran tests, lint, type-check, build, formatting.
  - Committed:
    - `test: extend repo hygiene checks for generated projects`
    - `docs: document generated-project repo hygiene and ignore patterns`
  - Pushed to `main` and verified CI success.

---

## Lint/Format Auto-Fix Commands and Smoke Testing

- Verified lint/format commands:
  - `npm run lint`
  - `npm run lint:fix`
  - `npm run format`
  - `npm run format:check`

- Updated `docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md`:
  - Marked lint/format checks and auto-fix commands as completed in acceptance criteria and DoD.

- Added `scripts/lint-format-smoke.mjs`:
  - Creates a temp project under `os.tmpdir()`.
  - Writes a minimal `package.json` with `lint:fix` and `format` scripts.
  - Writes an `eslint.config.js` using the `no-extra-semi` rule.
  - Copies `.prettierrc.json` from the repo.
  - Adds malformed JS (`const  answer = 42;;`).
  - Sets `PATH` and `NODE_PATH` to use the repo’s `node_modules`.
  - Runs `npm run lint:fix` and asserts the file changes.
  - Runs `npm run format` twice and asserts the first run changes the file and the second run is idempotent.
  - Cleans up in `finally`.

- Added npm script:
  - `"quality:lint-format-smoke": "node ./scripts/lint-format-smoke.mjs"`

- Manually validated:
  - `node ./scripts/lint-format-smoke.mjs`
  - `npm run quality:lint-format-smoke`

- Updated developer docs:
  - `docs/development-setup.md` to highlight `lint:fix` and `format` as safe auto-fix commands.
  - `docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md` to reflect working auto-fix commands.

- Updated `.github/workflows/ci-cd.yml`:
  - Added CI steps:

    ```yaml
    - name: Check formatting
      run: npm run format:check

    - name: Lint/format auto-fix smoke test
      run: npm run quality:lint-format-smoke
    ```

- Repeated local quality runs and confirmed success.
- Committed and pushed:
  - `docs: document working lint and format auto-fix commands`
  - `chore: add lint and format auto-fix smoke test`
- Confirmed CI/CD pipeline success.

---

## Alignment of Security, Logging, and Node-Version Docs

- Reviewed key files:
  - `README.md`
  - `user-docs/SECURITY.md`
  - `user-docs/api.md`
  - `src/template-files/**`
  - `scripts/check-node-version.mjs`
  - `src/initializer.ts`
  - `src/server.ts` (before its removal)
  - Generated-project tests and helpers.

- Updated `user-docs/SECURITY.md`:
  - Corrected endpoint descriptions for stub vs generated projects.
  - Updated summary/Data Handling sections to list endpoints explicitly.

- Updated `user-docs/api.md`:
  - Reframed logging intro around user-facing behavior in generated `src/index.ts`.
  - Clarified the shared env-driven log-level algorithm across generated projects and the stub at that time.

- Updated `README.md`:
  - Clarified that CLI-scaffolded projects include:
    - `GET /` Hello World JSON.
    - `GET /health` health check.
    - Default security headers and structured logging.
  - In “What’s Included → Implemented”:
    - Highlighted `@fastify/helmet` security headers in generated `src/index.ts`, with stub parity.
    - Highlighted Pino-based structured logging in generated `src/index.ts`, again noting stub parity and dev vs prod formatting.
  - Emphasized Helmet and logging in the “Security” section.

- Updated `src/template-files/README.md.template`:
  - Added `## Security and Logging` describing Helmet and Fastify+Pino, including `pino-pretty` in dev and env-driven log levels.
  - Tweaked logging intro to highlight defaults in `src/index.ts`.

- Updated `scripts/check-node-version.mjs`:
  - Simplified error message to reference a public GitHub URL and Node requirement only.

- Updated `src/check-node-version.test.js`:
  - Relaxed assertions to match the new error text.

- Ran lint, type-check, tests, build, formatting and committed:
  - `docs: align security, logging, and node-version documentation with implementation`
- Confirmed CI/CD success.

---

## Configuration Guide and README Link

- Added `user-docs/configuration.md`:
  - Documented:
    - Node.js requirement (≥ 22) and `preinstall` check.
    - `PORT` behavior for generated projects, dev server, and stub server.
    - `LOG_LEVEL` and `NODE_ENV`:
      - Shared algorithm for generated projects and stub server.
      - Examples for dev, prod, troubleshooting.
    - Log format differences between JSON and pretty output.
    - `DEV_SERVER_SKIP_TSC_WATCH` flag for advanced/test workflows.
    - Clarified that CORS env vars mentioned in security docs are illustrative only.
  - Included the required attribution.

- Updated `README.md`:
  - Added a **Configuration** section linking to `user-docs/configuration.md` and summarizing its content.

- Ran lint, type-check, tests, build, formatting and committed:
  - `docs: add configuration guide for environment-driven behavior`
- Confirmed CI/CD workflow success.

---

## Stub Server Removal

- Analyzed `src/server.ts` and `src/server.test.ts` and confirmed:
  - They implemented an internal Fastify stub server with header/logging tests.
  - Generated projects already mirrored these patterns with sufficient tests.

- Removed stub server infrastructure:
  - Deleted:
    - `src/server.ts`
    - `src/server.test.ts`
  - Updated `package.json` coverage patterns to remove `server.test.ts`.

- Updated documentation to remove stub-server references and focus on generated projects only:
  - `README.md`
  - `docs/development-setup.md`
  - `docs/testing-strategy.md`
  - `user-docs/configuration.md`
  - `user-docs/api.md`
  - `user-docs/testing.md`
  - `user-docs/SECURITY.md`
  - Updated examples and references to point to generated `src/index.ts` and helpers/tests.

- Verified tests, linting, type-checking, formatting, and build succeeded and that stub-server references were gone.

---

## Type-Level Tests for Public API

- Reviewed:
  - `src/index.ts`
  - `tsconfig.json`
  - `docs/stories/004.0-DEVELOPER-TESTS-RUN.story.md`
  - `user-docs/testing.md`
  - `README.md`
  - `src/dev-server-test-types.d.ts`
  - `src/mjs-modules.d.ts`
  - `src/initializer.ts`
  - `src/cli.ts`

- Created `src/index.test.d.ts` with type-level tests for the public API:
  - Asserted `initializeTemplateProject` returns `Promise<string>`.
  - Asserted `initializeTemplateProjectWithGit` returns `Promise<{ projectDir: string; git: GitInitResult }>` using the exported type.
  - Asserted `GitInitResult` shape:

    ```ts
    {
      projectDir: string;
      initialized: boolean;
      stdout?: string;
      stderr?: string;
      errorMessage?: string;
    }
    ```

  - Used `Equal` / `Expect` helper types for compile-time checks.
  - Annotated with `@supports` linking to story and requirement IDs.

- Confirmed `tsconfig.json` includes `"src"` so `.test.d.ts` files are type-checked.

- Ran:
  - `npm run type-check`
  - `npm test`
  - `npm run lint`
  - `npm run build`
  - `npm run format:check` → `npm run format` → `npm run format:check`

- Committed and pushed:
  - `test: add type-level tests for public API exports`
- Confirmed CI/CD pipeline success.

---

## Security Headers Test for Generated Projects

- Implemented `src/generated-project-security-headers.test.ts` to verify Helmet headers in a generated project:

  - Added JSDoc with `@supports` for:
    - `docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md`
    - `REQ-SEC-HEADERS-TEST`
    - `REQ-SEC-HEADERS-PRESENT`
    - `REQ-SEC-HELMET-DEFAULT`

  - Test behavior:
    - Uses `initializeGeneratedProject` with project name `security-api` in an OS temp dir.
    - Runs `runTscBuildForProject`, asserting `exitCode === 0`.
    - Removes the generated `src/` directory to ensure tests run against compiled `dist/` only.
    - Starts the compiled server with `startCompiledServerViaNode(projectDir, { PORT: '0' })`, capturing the `/health` URL.
    - Implements `fetchHealthWithHeaders(healthUrl)` using `node:http`:
      - Issues `GET /health`.
      - Collects `statusCode`, body, and headers.
    - Asserts:
      - Status code `200`.
      - Body `{ status: 'ok' }`.
      - Presence of representative Helmet security headers:
        - `x-dns-prefetch-control`
        - `x-frame-options`
        - `x-download-options`
        - `x-content-type-options`
        - `x-permitted-cross-domain-policies`
        - `referrer-policy`
      - Does not assert `Strict-Transport-Security` (HSTS is HTTPS-only).
    - Ensures the child process is terminated via `child.kill('SIGINT')` in `finally`.
    - Uses a 60-second timeout to be robust in CI.

  - Reuses helpers from `src/generated-project.test-helpers.ts`:
    - `initializeGeneratedProject`
    - `runTscBuildForProject`
    - `cleanupGeneratedProject`
    - `startCompiledServerViaNode`

  - Uses `beforeAll`/`afterAll` to provision and clean up the temp project.

- Updated story and ADR references:
  - `docs/stories/005.0-DEVELOPER-SECURITY-HEADERS.story.md`:
    - Added a note stating that automated verification lives in `src/generated-project-security-headers.test.ts` and exercises `REQ-SEC-HEADERS-TEST` against `/health`.

  - `docs/decisions/0006-fastify-helmet-security-headers.accepted.md`:
    - Updated “Confirmation” to explicitly mention `src/generated-project-security-headers.test.ts` as the integration test.

- Ran:
  - `npm run build`
  - `npm test`
  - `npm run lint`
  - `npm run type-check`
  - `npm run format`
  - `npm run format:check`

- Committed:
  - `test: add security headers verification for generated projects`
- Pushed to `main` and confirmed both **“CI/CD”** and **“CI/CD Pipeline”** workflows passed.

---

## Most Recent Work: Hardening the Lint/Format Smoke Test

### Explicit ESLint/Prettier CLIs in `scripts/lint-format-smoke.mjs`

- Updated `scripts/lint-format-smoke.mjs` to avoid relying on `PATH` inside the temp mini-project:

  - In `main()`, computed explicit paths:

    ```js
    const rootDir = process.cwd();
    const nodeExec = process.execPath;
    const eslintCli = path.join(rootDir, 'node_modules', 'eslint', 'bin', 'eslint.js');
    const prettierCli = path.join(
      rootDir,
      'node_modules',
      'prettier',
      'bin',
      'prettier.cjs',
    );
    ```

  - Verified CLI existence with `fs.access` and emitted clear errors if missing.

  - Updated the temp project’s `package.json` scripts to invoke the tools via Node and those explicit paths:

    ```js
    scripts: {
      'lint:fix': `"${nodeExec}" "${eslintCli}" . --fix`,
      format: `"${nodeExec}" "${prettierCli}" --write .`,
    }
    ```

  - Left all subsequent behavior and assertions intact:
    - The script still writes deliberately misformatted code.
    - Runs `lint:fix`, asserts the file changes.
    - Runs `format` twice, asserting the first run changes the file and the second is idempotent.

- Used commands and checks:
  - Ran `npm run quality:lint-format-smoke` multiple times to confirm the updated script works.
  - Inspected Prettier’s `package.json` and bin paths to correct the CLI path from `bin-prettier.cjs` to `bin/prettier.cjs`.

- Committed and pushed:
  - `test: harden lint/format smoke test to use explicit CLIs`

- Ran the full local quality suite after the change:
  - `npm run build`
  - `npm test`
  - `npm run lint`
  - `npm run type-check`
  - `npm run format:check`
  - `npm run quality:lint-format-smoke`

- Fixed formatting with Prettier for the script and re-committed:
  - `style: format lint/format smoke test script`
- Pushed and confirmed CI success.

### Documenting the Smoke Test in Story 007.0

- Updated `docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md`:

  - Added a new **“Automated Smoke Test”** subsection under “Implementation Notes” (before “Understanding Quality Tools”) describing:

    - That `scripts/lint-format-smoke.mjs` creates a temporary mini-project.
    - The project is wired directly to the repo’s ESLint and Prettier CLIs via Node entry points.
    - It writes misformatted code, runs the equivalent of `lint:fix` and `format`.
    - It asserts that the file changes appropriately and that `format` is idempotent on a second run.

- Ran:
  - `npm run format -- docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md`
  - `npm run format:check`
  - `npm run quality:lint-format-smoke`
  - `npm run build`
  - `npm test`
  - `npm run lint`
  - `npm run type-check`

- Committed and pushed:
  - `docs: describe automated lint/format smoke test for story 007.0`
  - After formatting:
    - `style: format lint/format story after smoke test docs update`

- Confirmed CI runs:
  - Waited for **“CI/CD Pipeline”** on `main` and verified success for the latest run IDs.

**Most recently we've executed the following action:**

---
Used tool: get_git_status with input: {}
Used tool: find_files with input: {"pattern":"package.json","directory":"."}
Used tool: read_file with input: {"filePath":"package.json"}
Used tool: list_directory with input: {"dirPath":"--help"}
Used tool: read_file with input: {"filePath":"--help/package.json"}
Used tool: read_file with input: {"filePath":"--help/README.md"}
Used tool: find_files with input: {"pattern":"repo-hygiene*.test.*","directory":"src"}
Used tool: read_file with input: {"filePath":"src/repo-hygiene.generated-projects.test.ts","startLine":1,"endLine":260}
Used tool: search_file_content with input: {"filePath":".gitignore","pattern":"--help","isRegex":false}
Used tool: get_git_status with input: {}
Used tool: read_file with input: {"filePath":"docs/decisions/0014-generated-test-projects-not-committed.accepted.md","startLine":1,"endLine":260}
Used tool: find_files with input: {"pattern":".eslintrc*","directory":"."}
Used tool: find_files with input: {"pattern":"scripts/lint-format-smoke.mjs","directory":"."}
Used tool: list_directory with input: {"dirPath":"scripts"}
Used tool: read_file with input: {"filePath":"scripts/lint-format-smoke.mjs","startLine":1,"endLine":260}
Used tool: run_command with input: {"command":"git","args":["status","-sb"]}
Used tool: read_file with input: {"filePath":"docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md","startLine":1,"endLine":260}
Used tool: run_command with input: {"command":"git","args":["log","-5","--oneline"]}
Used tool: run_command with input: {"command":"git","args":["show","--name-only","--oneline","-1"]}
Used tool: run_command with input: {"command":"rm","args":["-rf","--help"]}
Used tool: remove_file with input: {"filePath":"--help"}
Used tool: get_git_status with input: {}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: run_command with input: {"command":"npm","args":["run","quality:lint-format-smoke"]}
Used tool: git_add_all with input: {}
Used tool: get_git_status with input: {}
Used tool: git_commit with input: {"message":"chore: record lint/format smoke test hardening progress"}
Used tool: git_push with input: {}
Used tool: get_github_pipeline_status with input: {}
Used tool: wait_for_github_workflow with input: {"runId":20214598066,"timeout":600000}
---

**This was the result:**
---
Here’s what I’ve done to execute the **##NOW** and **##NEXT** sections and finalize the work.

---

## What I did

1. **Reviewed and validated existing changes**
   - Confirmed `scripts/lint-format-smoke.mjs` already uses explicit Node entry points:
     - Resolves:
       - `eslintCli = <repoRoot>/node_modules/eslint/bin/eslint.js`
       - `prettierCli = <repoRoot>/node_modules/prettier/bin/prettier.cjs`
     - `package.json` in the temporary mini-project defines:
       - `"lint:fix": "\"<nodeExec>\" \"<eslintCli>\" . --fix"`
       - `"format": "\"<nodeExec>\" \"<prettierCli>\" --write ."`
   - Verified the script still:
     - Writes deliberately bad code to `sample.js`.
     - Runs `lint:fix` and asserts the file content changes.
     - Runs `format` and asserts the file content changes again.
     - Runs `format` a second time and asserts idempotence (no further changes).

2. **Verified documentation matches behavior**
   - Checked `docs/stories/007.0-DEVELOPER-LINT-FORMAT.story.md`.
   - Confirmed it already includes an **“Automated Smoke Test”** section explicitly describing:
     - A **temporary mini-project**.
     - Use of this repo’s ESLint and Prettier CLIs via **Node entry points**.
     - Assertions about auto-fix and idempotent formatting.
   - No doc changes were needed in this cycle.

3. **Validated smoke test stability**
   - Ran the smoke test directly via the existing script:
     - `npm run quality:lint-format-smoke`
   - Result: `Lint/format auto-fix smoke test passed`
   - This confirms:
     - ESLint and Prettier are found via explicit CLI paths.
     - The auto-fix behavior and idempotence checks run cleanly in an isolated temp project.

4. **Cleaned up an accidental generated project**
   - Removed the untracked `--help/` directory, which was a generated Fastify+TS project:
     - This aligns with ADR 0014 (“Generated test projects must not be committed”).
     - Ensures the repo stays free of committed initializer-generated projects.

5. **Quality checks before pushing**
   - Ran all required checks from the project’s scripts:
     - `npm run build`
     - `npm test`
     - `npm run lint`
     - `npm run type-check`
     - `npm run format:check`
     - `npm run quality:lint-format-smoke`
   - All passed successfully.

6. **Git operations**
   - Staged remaining changes (only `.voder/*` metadata files).
   - Committed with:
     - `chore: record lint/format smoke test hardening progress`
   - Pushed to `main`.

7. **CI/CD verification**
   - Monitored the latest **“CI/CD Pipeline (main)”** workflow run (ID `20214598066`).
   - It completed with **conclusion: success**.

---

## Updated Plan Status

### NOW

- [x] Change the lint-and-format smoke test script so that the temporary mini-project’s lint and format commands invoke ESLint and Prettier via explicit Node entry-point paths from the main repository’s node_modules directory, rather than relying on PATH, ensuring the smoke test can always find and run these tools successfully in its isolated environment.

### NEXT

- [x] Ensure the updated smoke test still verifies that lint auto-fix modifies the deliberately misformatted file and that a second format run is idempotent, keeping the behavioral assertions for the story’s requirements intact.
- [x] Update the lint-and-format story documentation, if needed, to explicitly mention that the smoke test uses a self-contained temporary mini-project wired to the repository’s ESLint and Prettier binaries, clarifying how the acceptance criteria are validated.
- [x] Confirm that the lint-and-format story’s dedicated smoke test is now stable across environments by running it in a clean context and checking that its behavior aligns with the documented requirements for fast, reliable lint and format auto-fix.

All tasks in **##NOW** and **##NEXT** are complete, changes are committed and pushed, and CI is passing.
---
