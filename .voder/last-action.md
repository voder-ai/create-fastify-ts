# Last Action Executed (Agentic)

**Action:** Used tool: list_directory with input: {"dirPath":"."}
Used tool: find_files with input: {"pattern":"cli-api","directory":"."}
Used tool: find_files with input: {"pattern":"cli-test-from-dist","directory":"."}
Used tool: find_files with input: {"pattern":"cli-test-project","directory":"."}
Used tool: find_files with input: {"pattern":"manual-cli","directory":"."}
Used tool: find_files with input: {"pattern":"test-project-exec-assess","directory":"."}
Used tool: find_files with input: {"pattern":"*.test.*","directory":"src"}
Used tool: list_directory with input: {"dirPath":"cli-api"}
Used tool: list_directory with input: {"dirPath":"cli-test-from-dist"}
Used tool: list_directory with input: {"dirPath":"cli-test-project"}
Used tool: list_directory with input: {"dirPath":"manual-cli"}
Used tool: list_directory with input: {"dirPath":"test-project-exec-assess"}
Used tool: search_file_content with input: {"filePath":"src/cli.test.ts","pattern":"cli-api","isRegex":false}
Used tool: read_file with input: {"filePath":"src/cli.test.ts","startLine":200,"endLine":320}
Used tool: run_command with input: {"command":"grep","args":["-R","cli-api","."]}
Used tool: run_command with input: {"command":"grep","args":["-R","cli-test-from-dist","."]}
Used tool: run_command with input: {"command":"grep","args":["-R","cli-test-project","."]}
Used tool: run_command with input: {"command":"grep","args":["-R","manual-cli","."]}
Used tool: run_command with input: {"command":"grep","args":["-R","test-project-exec-assess","."]}
Used tool: get_git_status with input: {}
Used tool: read_file with input: {"filePath":"src/dev-server.test.ts","startLine":1,"endLine":400}
Used tool: read_file with input: {"filePath":"src/dev-server.test-helpers.ts","startLine":1,"endLine":400}
Used tool: search_file_content with input: {"filePath":"src/initializer.test.ts","pattern":"cli-api","isRegex":false}
Used tool: search_file_content with input: {"filePath":"src","pattern":"manual-cli","isRegex":false}
Used tool: search_file_content with input: {"filePath":"src","pattern":"cli-test-project","isRegex":false}
Used tool: search_file_content with input: {"filePath":"src","pattern":"test-project-exec-assess","isRegex":false}
Used tool: read_file with input: {"filePath":"src/cli.test.ts","startLine":1,"endLine":260}
Used tool: read_file with input: {"filePath":"src/cli.test.ts","startLine":260,"endLine":360}
Used tool: read_file with input: {"filePath":"src/initializer.test.ts","startLine":1,"endLine":260}
Used tool: run_command with input: {"command":"rm","args":["-rf","cli-api","cli-test-from-dist","cli-test-project","manual-cli","test-project-exec-assess"]}
Used tool: modify_file with input: {"filePath":"src/cli.test.ts","instruction":"In the describe('CLI initializer (Story 001.0)') block, update the three projectName constants so they no longer reference the committed example directories.\n- In the first test ('creates a new project directory when invoked with a project name (with git available)'), change `const projectName = 'cli-api';` to `const projectName = 'cli-integration-project';`.\n- In the second test ('scaffolds the project without git initialization when git is not available'), change `const projectName = 'cli-api-no-git';` to `const projectName = 'cli-integration-no-git';`.\n- In the skipped E2E test, change `const projectName = 'cli-api-dev';` to `const projectName = 'cli-integration-dev';`.\nDo not alter any other code."}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format","--","src/cli.test.ts"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: get_git_status with input: {}
Used tool: git_add_all with input: {}
Used tool: git_commit with input: {"message":"test: decouple CLI tests from committed example projects"}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: git_push with input: {}
Used tool: get_github_pipeline_status with input: {}
Used tool: wait_for_github_workflow with input: {"runId":20206544328,"timeout":600000}
Used tool: run_command with input: {"command":"grep","args":["-R","cli-api","src"]}
Used tool: run_command with input: {"command":"grep","args":["-R","cli-test-from-dist","src"]}
Used tool: run_command with input: {"command":"grep","args":["-R","cli-test-project","src"]}
Used tool: run_command with input: {"command":"grep","args":["-R","manual-cli","src"]}
Used tool: run_command with input: {"command":"grep","args":["-R","test-project-exec-assess","src"]}
Used tool: remove_file with input: {"filePath":"cli-api"}
Used tool: remove_file with input: {"filePath":"cli-test-from-dist"}
Used tool: remove_file with input: {"filePath":"cli-test-project"}
Used tool: remove_file with input: {"filePath":"manual-cli"}
Used tool: remove_file with input: {"filePath":"test-project-exec-assess"}
Used tool: get_git_status with input: {}
Used tool: git_add_all with input: {}
Used tool: git_commit with input: {"message":"chore: remove committed generated test projects"}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: git_push with input: {}
Used tool: get_github_pipeline_status with input: {}
Used tool: wait_for_github_workflow with input: {"runId":20206627759,"timeout":600000}
Used tool: read_file with input: {"filePath":"docs/testing-strategy.md","startLine":1,"endLine":260}
Used tool: run_command with input: {"command":"git","args":["ls-files","dist","dist/**"]}
Used tool: run_command with input: {"command":"git","args":["ls-files","coverage","coverage/**"]}
Used tool: run_command with input: {"command":"git","args":["ls-files","*.log"]}
Used tool: run_command with input: {"command":"git","args":["ls-files","*coverage*"]}
Used tool: run_command with input: {"command":"git","args":["ls-files"]}
Used tool: generate_file with input: {"filePath":"docs/decisions/0014-generated-test-projects-not-committed.accepted.md","content":"# 0014 - Generated test projects must not be committed\n\n- Status: accepted\n- Date: 2025-12-14\n\n## Context\n\nThis repository provides an npm initializer (`npm init @voder-ai/fastify-ts`) that scaffolds new Fastify + TypeScript projects. During early development, several example or test projects generated by the initializer (for example `cli-api/`, `cli-test-from-dist/`, `cli-test-project/`, `manual-cli/`, and `test-project-exec-assess/`) were committed to the repository.\n\nWhile these directories were useful during initial bring-up and manual testing, keeping generated projects under version control has several drawbacks:\n\n- They are **not source of truth** for the initializer behaviour; the real contract is the template files in `src/template-files/` and the initializer/CLI code.\n- They quickly become **stale** as the initializer evolves, creating confusion for contributors and assessors.\n- They **pollute quality checks** (linters, formatters, duplication detectors) with duplicated boilerplate.\n- They violate the general guidance for generators and initializers: tests should create projects in **temporary directories** and clean them up, not rely on committed generated trees.\n\n## Decision\n\n1. **Generated test projects must never be committed to the repository.**\n   - Directories such as `cli-api/`, `cli-test-from-dist/`, `cli-test-project/`, `manual-cli/`, and `test-project-exec-assess/` are considered *generated artifacts* and must not live in git.\n   - Any future generated project used for testing must follow the same rule.\n\n2. **Tests must create their own projects in temporary directories.**\n   - Initializer tests (`src/initializer.test.ts`) and CLI tests (`src/cli.test.ts`) already follow this pattern by using `fs.mkdtemp(os.tmpdir() + ...)` and cleaning up with `fs.rm(..., { recursive: true, force: true })`.\n   - Dev-server tests use `src/dev-server.test-helpers.ts` to create synthetic projects in OS temp directories.\n   - This pattern is the canonical approach for all tests that need a scaffolded project.\n\n3. **Automated checks will guard against regressions.**\n   - A small repository-hygiene test will fail if any of the known generated-project directory names appear at the repository root.\n   - This ensures that accidentally re-committing generated projects is immediately caught during `npm test` and in CI.\n\n## Consequences\n\n- The working tree remains focused on **source, configuration, and intentional fixtures** only.\n- Tests are responsible for creating any temporary projects they need, using OS temporary directories and cleaning up after themselves.\n- Contributors have clear guidance: if they need an example project for documentation, it must be a small, manually maintained example (under a dedicated `examples/` or `fixtures/` directory) and **not** a full initializer output committed wholesale.\n\n## Requirements\n\n- **REQ-NO-GENERATED-PROJECTS**: No initializer-generated test projects (such as `cli-api/`, `cli-test-from-dist/`, `cli-test-project/`, `manual-cli/`, `test-project-exec-assess/`) may be committed to the repository. Tests must create such projects in temporary directories at runtime and remove them when finished.\n"}
Used tool: generate_file with input: {"filePath":"src/repo-hygiene.generated-projects.test.ts","content":"/**\n * Repository hygiene tests to prevent committing generated initializer projects.\n *\n * These tests enforce ADR 0014 by asserting that known generated-project\n * directory names do not exist at the repository root. Tests that need\n * scaffolded projects must create them in OS temporary directories instead.\n *\n * @supports docs/decisions/0014-generated-test-projects-not-committed.accepted.md REQ-NO-GENERATED-PROJECTS\n */\nimport { describe, it, expect } from 'vitest';\nimport fs from 'node:fs/promises';\nimport path from 'node:path';\nimport { fileURLToPath } from 'node:url';\n\nconst thisFilePath = fileURLToPath(import.meta.url);\nconst thisDir = path.dirname(thisFilePath);\nconst repoRoot = path.resolve(thisDir, '..');\n\nconst DISALLOWED_PROJECT_DIRS = [\n  'cli-api',\n  'cli-test-from-dist',\n  'cli-test-project',\n  'manual-cli',\n  'test-project-exec-assess',\n];\n\ndescribe('Repository hygiene (generated projects)', () => {\n  it('[REQ-NO-GENERATED-PROJECTS] should not contain known generated project directories at repo root', async () => {\n    const existing: string[] = [];\n\n    await Promise.all(\n      DISALLOWED_PROJECT_DIRS.map(async dirName => {\n        const fullPath = path.join(repoRoot, dirName);\n\n        try {\n          const stat = await fs.stat(fullPath);\n          if (stat.isDirectory()) {\n            existing.push(dirName);\n          }\n        } catch {\n          // If the path does not exist, this is the desired state.\n        }\n      }),\n    );\n\n    expect(\n      existing,\n      existing.length\n        ? `Generated project directories must not be committed, but found: ${existing.join(', ')}`\n        : undefined,\n    ).toEqual([]);\n  });\n});\n"}
Used tool: modify_file with input: {"filePath":"docs/testing-strategy.md","instruction":"In the \"Initializer Tests\" section, update the guidance to explicitly require use of OS temporary directories and to forbid committing generated projects, and adjust the code example accordingly.\n\n1. After the bullet list that starts with \"Create automated tests that run the full initialization process:\" and its fenced bash block, insert a new bullet list item emphasising OS temp dirs and non-committed projects. For example, add:\n\n- Always create test projects inside OS temporary directories using `fs.mkdtemp` and `os.tmpdir()`.\n- Never commit initializer-generated projects (such as full `my-api/` trees) to the repository; tests must create and delete them at runtime instead.\n- Prefer helper utilities (like `src/dev-server.test-helpers.ts` and the helpers in `src/initializer.test.ts` / `src/cli.test.ts`) that encapsulate temporary project creation and cleanup.\n\n2. Replace the TypeScript example under \"Example test structure:\" so that it uses `fs.mkdtemp` and `os.tmpdir()` instead of a hard-coded `../tmp-init-tests` directory, and shows cleanup via `fs.rm` with `{ recursive: true, force: true }`. The new example should look like:\n\n```ts\nimport fs from 'node:fs/promises';\nimport os from 'node:os';\nimport path from 'node:path';\n\ndescribe('npm init @voder-ai/fastify-ts', () => {\n  let tmpDir: string;\n\n  beforeEach(async () => {\n    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-init-'));\n  });\n\n  afterEach(async () => {\n    await fs.rm(tmpDir, { recursive: true, force: true });\n  });\n\n  it('creates a working project with all required files', async () => {\n    // Run initializer\n    execSync('npm init @voder-ai/fastify-ts test-app', { cwd: tmpDir });\n\n    const projectDir = path.join(tmpDir, 'test-app');\n\n    // Verify structure\n    expect(fs.existsSync(path.join(projectDir, 'package.json'))).toBe(true);\n    expect(fs.existsSync(path.join(projectDir, 'tsconfig.json'))).toBe(true);\n    expect(fs.existsSync(path.join(projectDir, 'src/index.ts'))).toBe(true);\n\n    // Install and test\n    execSync('npm install', { cwd: projectDir, stdio: 'inherit' });\n    execSync('npm test', { cwd: projectDir, stdio: 'inherit' });\n    execSync('npm run build', { cwd: projectDir, stdio: 'inherit' });\n\n    // Verify build output\n    expect(fs.existsSync(path.join(projectDir, 'dist'))).toBe(true);\n  });\n\n  it('fails gracefully when directory already exists', () => {\n    const projectDir = path.join(tmpDir, 'existing-app');\n    fs.mkdirSync(projectDir, { recursive: true });\n\n    expect(() => {\n      execSync('npm init @voder-ai/fastify-ts existing-app', { cwd: tmpDir });\n    }).toThrow();\n  });\n});\n```\n\nKeep the rest of the document unchanged."}
Used tool: run_command with input: {"command":"npm","args":["run","format","--","docs/decisions/0014-generated-test-projects-not-committed.accepted.md","src/repo-hygiene.generated-projects.test.ts","docs/testing-strategy.md"]}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: get_git_status with input: {}
Used tool: git_add_all with input: {}
Used tool: git_commit with input: {"message":"test: enforce no committed generated test projects"}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: git_push with input: {}
Used tool: get_github_pipeline_status with input: {}
Used tool: wait_for_github_workflow with input: {"runId":20206827015,"timeout":600000}

**Response:**

```
Here’s what I implemented for the **##NOW** and **##NEXT** sections, plus the updated plan with checkboxes.

---

## What I changed

### 1) Decouple tests from committed generated projects (##NOW)

**Files touched**

- `src/cli.test.ts`

**Changes**

- Updated CLI initializer tests to use project names that are clearly **ephemeral per-test**, not tied to the previous committed example dirs:

  ```ts
  it('creates a new project directory when invoked with a project name (with git available)', async () => {
    const projectName = 'cli-integration-project';
    ...
  });

  it('scaffolds the project without git initialization when git is not available', async () => {
    const projectName = 'cli-integration-no-git';
    ...
  });

  it.skip('initializes a project and runs the dev server ...', async () => {
    const projectName = 'cli-integration-dev';
    ...
  });
  ```

- These tests already:
  - Create a **fresh OS temp directory** with `fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-cli-'))`
  - Change `cwd` into that temp dir
  - Run the compiled CLI to scaffold a new project under the temp dir
  - Clean up the temp dir and restore `cwd` in `afterEach`

So they never depended on the previously committed `cli-api/` etc. directories, but now the names no longer even collide, making the separation explicit and removing ambiguity.

**Quality checks**

- `npm run build`
- `npm test`
- `npm run lint`
- `npm run type-check`
- `npm run format:check`

All passed locally.  
Committed as:

- `test: decouple CLI tests from committed example projects`

CI/CD GitHub Actions pipeline on `main` completed successfully.

---

### 2) Remove committed generated test projects (##NEXT)

**Directories removed**

- `cli-api/`
- `cli-test-from-dist/`
- `cli-test-project/`
- `manual-cli/`
- `test-project-exec-assess/`

Removed via the file-removal tool and staged/committed in git. A `git ls-files` shows none of these paths remain tracked.

**Quality checks**

- `npm run build`
- `npm test`
- `npm run lint`
- `npm run type-check`
- `npm run format:check`

All passed.

Committed as:

- `chore: remove committed generated test projects`

CI/CD pipeline run (ID `20206627759`) completed with conclusion `success`.

---

### 3) Scan for tracked build artifacts / generated outputs (##NEXT)

**Commands**

- `git ls-files dist dist/**`
- `git ls-files coverage coverage/**`
- `git ls-files *.log`
- `git ls-files *coverage*`
- `git ls-files`

**Outcome**

- No `dist/`, `coverage/`, log files, or other build artifacts are tracked.
- Tracked files are only:
  - Source (`src/**`)
  - Template assets (`src/template-files/**`)
  - Config (`tsconfig.json`, `eslint.config.js`, `vitest.config.mts`, etc.)
  - Documentation (`docs/**`, `user-docs/**`, `README.md`, `CHANGELOG.md`)
  - Scripts (`scripts/*.mjs`)
  - Git/CI tooling (.husky, workflow config, etc.)

This satisfies the requirement that only source, configuration, and intentional fixtures are under version control.

(These checks were part of the same quality-pass cycle as above.)

---

### 4) Add internal guideline for generated projects (##NEXT)

**File added**

- `docs/decisions/0014-generated-test-projects-not-committed.accepted.md`

This ADR documents:

- **Context**: initializer-generated example projects (`cli-api`, `cli-test-from-dist`, etc.) had been committed and why that’s problematic.
- **Decision**:
  1. Generated initializer projects must **never be committed**.
  2. Tests must create projects in **OS temp directories** and clean them up at runtime.
  3. A repository-hygiene test will enforce this by failing if known generated-project directories appear at repo root.
- **Consequences**:
  - Repo remains focused on source/config/docs.
  - Any example project that *is* committed must be a small, manually maintained demo, not full initializer output.
- **Requirement**:
  - `REQ-NO-GENERATED-PROJECTS` captures this as a machine-checkable rule.

**File updated**

- `docs/testing-strategy.md`

Under **Initializer Tests**, I:

- Added explicit guidelines:

  ```markdown
  - Always create test projects inside OS temporary directories using `fs.mkdtemp` and `os.tmpdir()`.
  - Never commit initializer-generated projects (such as full `my-api/` trees) to the repository; tests must create and delete them at runtime instead.
  - Prefer helper utilities (like `src/dev-server.test-helpers.ts` and the helpers in `src/initializer.test.ts` / `src/cli.test.ts`) that encapsulate temporary project creation and cleanup.
  ```

- Replaced the old example that used a `../tmp-init-tests` directory with a new example that uses OS temp dirs and cleans them up:

  ```ts
  import fs from 'node:fs/promises';
  import os from 'node:os';
  import path from 'node:path';

  describe('npm init @voder-ai/fastify-ts', () => {
    let tmpDir: string;

    beforeEach(async () => {
      tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fastify-ts-init-'));
    });

    afterEach(async () => {
      await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('creates a working project with all required files', async () => {
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
      fs.mkdirSync(projectDir, { recursive: true });

      expect(() => {
        execSync('npm init @voder-ai/fastify-ts existing-app', { cwd: tmpDir });
      }).toThrow();
    });
  });
  ```

This makes the policy explicit and points contributors at the existing helpers (`src/initializer.test.ts`, `src/cli.test.ts`, `src/dev-server.test-helpers.ts`) as canonical patterns.

---

### 5) Validate and rely on test helpers (##NEXT)

**Existing helpers (validated, not changed)**

- `src/initializer.test.ts`
  - Uses `fs.mkdtemp` + `os.tmpdir()` for project roots.
  - Changes `process.cwd()` into the temp dir in `beforeEach` and restores/cleans up in `afterEach`.
  - Exercises the initializer directly (`initializeTemplateProject`, `initializeTemplateProjectWithGit`).

- `src/cli.test.ts`
  - Uses `fs.mkdtemp` + `os.tmpdir()` and per-test project names (now clearly non-root).
  - Spawns the compiled CLI (`dist/cli.js`) in the temp directory.
  - Contains an (intentionally skipped) full E2E “npm init → npm install → npm run dev → /health” test that also uses the temp dir.

- `src/dev-server.test-helpers.ts`
  - Provides:
    - `createServerOnRandomPort`
    - `createDevServerProcess`
    - `waitForDevServerMessage`
    - `sendSigintAndWait`
    - `createMinimalProjectDir`
    - `createFakeProjectForHotReload`
  - All project directories created under OS temp via `fs.mkdtemp(path.join(os.tmpdir(), 'dev-server-project-'))`.

These helpers *already* encapsulate the logic needed for initializer, CLI, and dev-server flows without relying on committed projects. No code changes were required; I verified usage and then referenced them explicitly in the updated testing strategy document.

---

### 6) Add automated check to prevent reintroduction (##NEXT)

**File added**

- `src/repo-hygiene.generated-projects.test.ts`

Key parts:

```ts
/**
 * Repository hygiene tests to prevent committing generated initializer projects.
 *
 * These tests enforce ADR 0014 by asserting that known generated-project
 * directory names do not exist at the repository root. Tests that need
 * scaffolded projects must create them in OS temporary directories instead.
 *
 * @supports docs/decisions/0014-generated-test-projects-not-committed.accepted.md REQ-NO-GENERATED-PROJECTS
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFilePath);
const repoRoot = path.resolve(thisDir, '..');

const DISALLOWED_PROJECT_DIRS = [
  'cli-api',
  'cli-test-from-dist',
  'cli-test-project',
  'manual-cli',
  'test-project-exec-assess',
];

describe('Repository hygiene (generated projects)', () => {
  it('[REQ-NO-GENERATED-PROJECTS] should not contain known generated project directories at repo root', async () => {
    const existing: string[] = [];

    await Promise.all(
      DISALLOWED_PROJECT_DIRS.map(async dirName => {
        const fullPath = path.join(repoRoot, dirName);

        try {
          const stat = await fs.stat(fullPath);
          if (stat.isDirectory()) {
            existing.push(dirName);
          }
        } catch {
          // If the path does not exist, this is the desired state.
        }
      }),
    );

    expect(
      existing,
      existing.length
        ? `Generated project directories must not be committed, but found: ${existing.join(', ')}`
        : undefined,
    ).toEqual([]);
  });
});
```

- This test runs as part of `npm test` (Vitest run includes all `src/**/*.test.*`).
- If any of the old generated directories ever reappears at the repo root, this test will fail locally and in CI.

**Traceability**

- Test header uses `@supports docs/decisions/0014-generated-test-projects-not-committed.accepted.md REQ-NO-GENERATED-PROJECTS`, satisfying the traceability requirement.

**Quality checks**

Executed:

- `npm run build`
- `npm test`
- `npm run lint`
- `npm run type-check`
- `npm run format:check`

All passed.  
Committed as:

- `test: enforce no committed generated test projects`

CI/CD pipeline run (ID `20206827015`) completed successfully.

---

## Updated plan with status

### NOW

- [x] Update any tests that currently rely on committed generated project directories so that they instead create and use temporary scaffolded projects at runtime while still passing, making those committed project trees no longer needed.

  - CLI tests now use clearly non-root project names and continue to create projects only in OS temp directories.
  - No tests depend on root-level generated project trees anymore.

### NEXT

- [x] Remove all committed generated test project directories from the repository (such as the CLI example projects) so that no generated project trees remain tracked in version control.
- [x] Scan the repository for any remaining tracked build artifacts or generated outputs (such as compiled bundles, coverage reports, or temporary logs) and delete or reconfigure them so that only source, configuration, and intentional fixtures are under version control.
- [x] Introduce or update an internal development guideline document that states generated projects used for testing must be created in temporary directories and must never be committed, explaining the rationale and pointing to existing temp-based test helpers as examples.
- [x] Ensure test helper utilities used to create temporary projects encapsulate all the logic needed for CLI and initializer end-to-end tests so that future tests never need to depend on pre-generated project trees in the repository.
- [x] Add a lightweight automated check in the test or lint suite that fails if specific disallowed directories (like previously committed generated project names) appear in the working tree, preventing reintroduction of these artifacts in future changes.

All requested **##NOW** and **##NEXT** tasks are implemented, verified locally, committed with Conventional Commits, pushed to `main`, and validated by the CI/CD pipeline.
```
