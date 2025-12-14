# Development Setup

This document describes the initial project structure and tooling.

## Project Structure

- `src/`
  - `index.ts` – small TypeScript entry module exposing `getServiceHealth()` and template initializer functions.
  - `index.test.ts` – verifies the TypeScript + ESM wiring by calling `getServiceHealth()`.
  - `initializer.ts` – implements project scaffolding logic for `npm init @voder-ai/fastify-ts`.
  - `cli.ts` – command-line interface entry point for the initializer.
- `docs/` – architecture decision records and user stories that drive implementation.

## Tooling Overview

- **TypeScript** – primary language for the service. Configuration lives in `tsconfig.json` and targets Node ESM via `"module": "NodeNext"`.
- **Vitest** – test runner for unit/integration tests co-located with source files in `src/`.
- **ESLint 9 (flat config)** – basic linting configured in `eslint.config.js` with TypeScript parser enabled.
- **Prettier** – code formatter configured via `.prettierrc.json`.

## Code Quality and Traceability

ESLint 9 (flat config) and Prettier together define the single, authoritative code-quality configuration for this project. Their configuration must not be duplicated or redefined elsewhere (for example, no additional `.eslintrc.*`, `.prettierrc.*`, or editor-specific overrides that conflict with the central setup).

The relevant configuration files are:

- `eslint.config.js` – ESLint flat configuration (rules, parser, plugins).
- `.prettierrc.json` – Prettier formatting rules.
- `.prettierignore` – Paths and files excluded from Prettier formatting.

In addition to linting and formatting, this project treats traceability annotations as a first-class part of code quality. These annotations are **required** for all new production code and tests, not optional, and are enforced as part of the project’s standards.

### Traceability for Production Code

All new production code (e.g., functions, classes, modules under `src/`) must include traceability annotations using the `@supports` JSDoc tag. Each `@supports` tag should reference:

- The relevant story or ADR file path (for example, `docs/decisions/001-typescript-esm.accepted.md`).
- The specific requirement ID (for example, `REQ-TSC-BOOTSTRAP`).

A typical function-level annotation in TypeScript:

```ts
/**
 * @supports docs/decisions/001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 */
export function getServiceHealth(): string {
  return 'ok';
}
```

If a function satisfies multiple requirements, use multiple `@supports` lines in the same JSDoc block.

### Traceability for Tests

All new test files must:

1. Include a **file-level** comment with `@supports` indicating the story or ADR whose requirements are being verified.
2. Embed the relevant requirement IDs directly in test names and/or `describe` blocks so the linkage is visible in test output.

Example test file header and describe block in a Vitest test:

```ts
/**
 * @supports docs/decisions/001-typescript-esm.accepted.md REQ-TSC-BOOTSTRAP
 */

import { describe, it, expect } from 'vitest';
import { getServiceHealth } from './index.js';

describe('getServiceHealth – REQ-TSC-BOOTSTRAP', () => {
  it("returns 'ok' for service bootstrap – REQ-TSC-BOOTSTRAP", () => {
    expect(getServiceHealth()).toBe('ok');
  });
});
```

These traceability annotations are mandatory for all new code and tests. Pull requests that add or modify behavior are expected to include appropriate `@supports` tags and requirement IDs as part of meeting the project’s code-quality bar.

## Prerequisites

- **Node.js**: Node.js 22 or newer is required. Installs on older Node.js versions will fail with a clear error message due to a preinstall check implemented by the `scripts/check-node-version.mjs` preinstall hook (REQ-INSTALL-NODE-VERSION from `docs/stories/002.0-DEVELOPER-DEPENDENCIES-INSTALL.story.md`).
- **npm**: npm 10+ is recommended.

From a clean checkout, install dependencies with:

```bash
npm ci
```

This uses `package-lock.json` to produce a reproducible local environment that matches CI.

## NPM Scripts

All developer tasks are centralized in `package.json` scripts. Run them from the project root.

- General form: `npm run <script-name>`
- Special case: `npm test` is a shorthand for `npm run test`.

### Script reference

| Script         | How to run             | What it does                                                                                                                                            | When to use locally                                                                                                                                                        |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`        | `npm run build`        | Compiles TypeScript using `tsc -p tsconfig.json` into `dist/`. Produces the code that is published and smoke‑tested.                                    | Before publishing or debugging build issues. Automatically run by the pre-push hook and CI.                                                                                |
| `test`         | `npm test`             | Runs the Vitest suite once in non-watch CI mode.                                                                                                        | To verify unit/integration tests pass for your changes. Automatically run by the pre-push hook and CI.                                                                     |
| `lint`         | `npm run lint`         | Runs ESLint across the project using the flat config in `eslint.config.js`.                                                                             | To check for lint issues before committing. Automatically run on each commit and push.                                                                                     |
| `lint:fix`     | `npm run lint:fix`     | Runs ESLint with automatic fixes where possible. This is a safe, working auto-fix command that developers can run locally at any time.                  | To automatically fix simple linting problems before a commit.                                                                                                              |
| `type-check`   | `npm run type-check`   | Runs the TypeScript compiler in `--noEmit` mode for pure type checking (no files written to `dist/`).                                                   | To verify type safety without doing a full build. Automatically run by the pre-push hook and CI.                                                                           |
| `format`       | `npm run format`       | Applies Prettier formatting to all supported files in the repo. This is a safe, working auto-fix command that developers are encouraged to use locally. | Before committing, or when Prettier reports formatting errors. Automatically run on pre-commit.                                                                            |
| `format:check` | `npm run format:check` | Verifies that files conform to Prettier formatting rules without changing them.                                                                         | As part of a local quality gate before pushing. Automatically run by the pre-push hook and CI.                                                                             |
| `release`      | `npm run release`      | Invokes `semantic-release` to analyze commits, determine the next version, publish to npm, and create GitHub releases.                                  | Rarely run manually. CI runs semantic-release on every push to `main`. Use locally only for debugging the release process (requires valid `NPM_TOKEN` and `GITHUB_TOKEN`). |

## Local Development Workflow (Trunk-Based)

This repository follows a trunk-based development model: all work is integrated directly into the `main` branch in small, frequent commits. Short-lived topic branches may be used locally, but the default flow assumes developers commit and push to `main`.

A typical end-to-end workflow for making a change looks like this:

1. **Sync your local `main`**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Make a small, focused change**
   - Update or add code under `src/`.
   - Add or update tests co-located with source files in `src/`.
   - Adjust documentation under `docs/` if needed.
3. **Run local quality checks** (fast feedback before hooks and CI):
   ```bash
   npm test
   npm run lint
   npm run type-check
   npm run build
   npm run format:check
   ```
   If you encounter lint or formatting issues, you can safely auto-fix many of them locally using:
   ```bash
   npm run lint:fix
   npm run format
   ```
4. **Stage and commit your changes** using a Conventional Commit message (see below):
   ```bash
   git add .
   git commit -m "type(scope): short description"
   ```
   The pre-commit hook will automatically run `npm run format` and `npm run lint`, fixing simple style issues and blocking commits that fail linting.
5. **Push to `main`**:
   ```bash
   git push origin main
   ```
   The pre-push hook will run `npm run build`, `npm test`, `npm run lint`, `npm run type-check`, and `npm run format:check` before the push is sent to GitHub. If any of these checks fail, the push is blocked until you resolve the issues.
6. **Let CI/CD run** on GitHub. On every push to `main`, the `CI/CD Pipeline` workflow repeats the same quality checks and, if they pass, publishes a new version via `semantic-release`.

Keeping changes small and following this workflow ensures that `main` is always releasable and that every commit can be deployed safely.

### Conventional Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to drive automated versioning via `semantic-release`.

The basic format is:

```text
<type>(<optional scope>): <short description>
```

Common types used in this repository:

- `feat:` – **ONLY** for new user-visible functionality.
- `fix:` – Bug fixes that correct user-visible broken behavior.
- `docs:` – Documentation-only changes (README, ADRs, guides, story files).
- `style:` – Code style/formatting changes that do not change behavior.
- `refactor:` – Code changes that neither fix bugs nor add features.
- `test:` – Adding or updating tests without changing production code.
- `chore:` – Internal tooling and maintenance (lint rules, TypeScript config, dependencies, traceability annotations).
- `ci:` – CI/CD pipeline configuration changes.
- `build:` – Build system or external dependency changes.

Guidelines:

- Use `feat:` **only** when you add or change behavior that end users can observe.
- Group all work for a logical change into a single commit (including formatting or lint fixes for that change).
- Do **not** manually bump versions in `package.json`; `semantic-release` calculates versions from the commit history.

## Continuous Deployment and CI/CD Pipeline

Pushes to the `main` branch trigger the `CI/CD Pipeline` workflow defined in `.github/workflows/ci-cd.yml`. This workflow implements true continuous deployment: every commit to `main` that passes quality checks is automatically released.

The pipeline runs the following steps in order:

1. **Checkout and install**
   - Checks out the repository.
   - Sets up Node.js (version `22.x`) and configures npm caching.
   - Runs `npm ci` to install dependencies based on `package-lock.json`.
2. **Quality gates** – these mirror the local scripts and pre-push hook:
   - `npm run lint` – ESLint for static analysis.
   - `npm run type-check` – TypeScript compiler in `--noEmit` mode.
   - `npm run build` – full TypeScript compile to `dist/`.
   - `npm test` – Vitest test suite.
   - `npm run format:check` – Prettier formatting verification.
3. **Automated release with semantic-release**
   - Runs `semantic-release` (via `npx semantic-release`).
   - Analyzes commit messages following the Conventional Commits spec.
   - Determines whether to publish a new version (`feat` → minor, `fix` → patch, etc.).
   - Updates the npm package (via `@semantic-release/npm`) when a release is warranted.
   - Creates or updates a GitHub Release with generated release notes.
4. **Post-release smoke test**
   - Creates a temporary project.
   - Installs the just-published npm package by name.
   - Dynamically imports the package and calls `getServiceHealth()`.
   - Fails the workflow if `getServiceHealth()` is missing or does not return `"ok"`.

Because the quality gates and release happen in a single workflow run, there are no manual approval gates or separate release pipelines. If the pipeline is green, the new version is already published and has passed a basic smoke test.

## Versioning and Branching Strategy

This project combines trunk-based development with automated semantic versioning:

- **Branching model**
  - `main` is the single long-lived branch and always represents the latest releasable state.
  - Developers integrate changes directly into `main` using small, frequent commits.
  - Long-lived feature branches are discouraged; if used locally, they should be short-lived and merged back quickly.
- **Versioning model**
  - Versions are managed by `semantic-release` as configured in `.releaserc.json`.
  - Commit messages following the Conventional Commits spec determine whether a new release is created and what its version bump is (e.g., `feat` → minor, `fix` → patch).
  - The `version` field in `package.json` is not manually maintained and may not match the latest published npm version.
  - The authoritative versions are:
    - The published package on npm.
    - The GitHub Releases created by `semantic-release`.
- **Developer responsibilities**
  - Use correct Conventional Commit types so `semantic-release` can infer the right semantic version bump.
  - Do not run `npm version` or manually edit the `version` in `package.json`.
  - Avoid creating release tags manually; tags are created by `semantic-release` as part of the CI/CD workflow.

For the rationale behind this approach and how it supports continuous deployment, see `docs/decisions/003-continuous-deployment-semantic-release-trunk-based.accepted.md`.

## Voder Metadata and Version Control

The `.voder` directory is part of the tracked project state and is committed to git, with the exception of `.voder/traceability/` and other explicitly ignored report artifacts. Contributors MUST NOT introduce or reintroduce ignore rules that exclude the entire `.voder` directory (for example, `/.voder` in `.gitignore` or similar tooling configuration).

Treat `.voder` like `docs/`: it is considered internal documentation and governance metadata and must remain under version control so that its evolution is reviewable and auditable. When adding or updating ignore rules (for git, editors, or other tools), ensure they do not exclude the `.voder/` directory itself, in line with the project’s version-control policy.

## Testing Strategy and Expectations

The test suite covers multiple areas:

- `src/index.test.ts` validates the TypeScript and ESM wiring by importing the public entry point and asserting that `getServiceHealth()` returns `"ok"`.
- `src/initializer.test.ts` tests project scaffolding and template file generation.
- `src/cli.test.ts` tests the command-line interface behavior.
- `src/generated-project*.test.ts` files test the actual generated projects in temporary directories.

Tests are run locally with:

```bash
npm test
```

They also run automatically as part of:

- The pre-push hook (`npm test` is one of the required checks).
- The CI/CD pipeline, which invokes the same `npm test` script.

Contributor expectations for tests:

- Any new behavior or change to existing behavior must be covered by automated tests. Prefer updating existing tests over duplicating coverage.
- Tests should be fast, deterministic, and isolated: avoid real network calls, time-based flakiness, and external services.
- Assertions should focus on observable behavior and contract (inputs/outputs, HTTP responses) rather than internal implementation details (private helpers, specific log messages, or internal data structures), unless those internals are themselves part of an explicit contract.
- Where practical, tests should include lightweight traceability annotations (for example, comments or descriptions) that reference the user stories or ADRs they validate. This helps maintain a clear link between requirements, design decisions, and verification.

## Generated Projects and Repository Hygiene

ADR `docs/decisions/0014-generated-test-projects-not-committed.accepted.md` defines strict rules for keeping this repository free of sample or initializer-generated projects:

- Any projects generated for manual testing (for example, via a CLI or template) MUST be created only in temporary or external directories, outside this repository’s working tree.
- Generated example projects MUST NEVER be added to version control in this repo, even if they are useful for local experimentation.

Automated repo-hygiene tests and `.gitignore` rules enforce this policy. Contributors must avoid creating or checking in project directories like:

- `cli-api`
- `cli-test-from-dist`
- `cli-test-project`
- `manual-cli`
- `test-project-exec-assess`
- `my-api`
- `git-api`
- `no-git-api`
- `cli-integration-project`
- `cli-integration-no-git`
- `cli-integration-dev`
- `prod-api`
- `logging-api`
- `prod-start-api`

Create any such throwaway projects in locations like your system temp directory or a sibling directory outside this git repository so that repo hygiene, CI checks, and version-control history remain clean.

## Security Posture and Contributor Responsibilities

The current security posture reflects an early-stage service:

- The only exposed endpoint is `GET /health`, with no authentication or authorization.
- There is no persistent data storage; the service does not yet write to databases or external stateful systems.
- Dependency health is monitored via npm tooling and lockfiles; the project relies on the Node and npm ecosystem for vulnerability advisories.

Security-related checks and practices expected today:

- Run `npm audit --production` periodically when working on dependency or build-related changes, and review any reported vulnerabilities.
- Keep dependencies reasonably up to date, preferring maintained packages and avoiding obviously unmaintained or deprecated libraries when adding new dependencies.
- Review transitive dependency changes in `package-lock.json` when they arise from manual or automated updates.

Contributor responsibilities for security:

- Do not commit secrets or sensitive data (API keys, tokens, private certificates, production URLs with embedded credentials). Use environment variables or local configuration instead.
- Be cautious when introducing new dependencies: prefer well-known, actively maintained packages with clear licenses and security history.
- Validate and sanitize all external input, especially as upcoming features introduce file upload endpoints and richer request payloads. Assume client input is untrusted.
- Treat security warnings from npm, GitHub, or other tooling (e.g., Dependabot alerts) as defects that must be triaged and addressed, not as optional advice.

The CI/CD pipeline now includes a dedicated dependency vulnerability audit step using `npm audit --production --audit-level=high`, and a non-blocking `dry-aged-deps` freshness report that highlights stale dependencies without failing the build. For details on how these checks are wired into the pipeline and how to interpret their output, see `docs/decisions/0015-dependency-security-scanning-in-ci.accepted.md`.
