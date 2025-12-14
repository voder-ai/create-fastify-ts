# Last Action Executed (Agentic)

**Action:** Used tool: list_directory with input: {"dirPath":"."}
Used tool: find_files with input: {"pattern":"*repo-hygiene*","directory":"."}
Used tool: find_files with input: {"pattern":"*.test.ts","directory":"src"}
Used tool: find_files with input: {"pattern":"*hygiene*","directory":"docs"}
Used tool: find_files with input: {"pattern":".gitignore","directory":"."}
Used tool: get_git_status with input: {}
Used tool: read_file with input: {"filePath":"src/repo-hygiene.generated-projects.test.ts"}
Used tool: read_file with input: {"filePath":".gitignore"}
Used tool: read_file with input: {"filePath":"docs/decisions/0014-generated-test-projects-not-committed.accepted.md"}
Used tool: list_directory with input: {"dirPath":"docs/decisions"}
Used tool: search_file_content with input: {"filePath":"src/initializer.test.ts","pattern":"-api","isRegex":false}
Used tool: read_file with input: {"filePath":"src/initializer.test.ts"}
Used tool: read_file with input: {"filePath":"src/cli.test.ts"}
Used tool: read_file with input: {"filePath":"src/dev-server.test-helpers.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project.test-helpers.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project-production.test.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project-production-npm-start.test.ts"}
Used tool: read_file with input: {"filePath":"src/generated-project-logging.test.ts"}
Used tool: list_directory with input: {"dirPath":"docs"}
Used tool: find_files with input: {"pattern":"*develop*","directory":"docs"}
Used tool: find_files with input: {"pattern":"*contribut*","directory":"docs"}
Used tool: list_directory with input: {"dirPath":"user-docs"}
Used tool: search_file_content with input: {"filePath":"README.md","pattern":"development","isRegex":false}
Used tool: read_file with input: {"filePath":"docs/development-setup.md"}
Used tool: check_file_exists with input: {"filePath":"my-api"}
Used tool: check_file_exists with input: {"filePath":"git-api"}
Used tool: check_file_exists with input: {"filePath":"cli-integration-project"}
Used tool: check_file_exists with input: {"filePath":"prod-api"}
Used tool: check_file_exists with input: {"filePath":"logging-api"}
Used tool: check_file_exists with input: {"filePath":"prod-start-api"}
Used tool: modify_file with input: {"filePath":"src/repo-hygiene.generated-projects.test.ts","instruction":"Extend the DISALLOWED_PROJECT_DIRS array to include additional common generated project directory names used in tests: 'my-api', 'git-api', 'no-git-api', 'cli-integration-project', 'cli-integration-no-git', 'cli-integration-dev', 'prod-api', 'logging-api', and 'prod-start-api'. Preserve formatting and ordering; group the new entries after the existing ones with a brief comment explaining they correspond to names used in tests."}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: git_add_all with input: {}
Used tool: git_commit with input: {"message":"test: extend repo hygiene checks for generated projects"}
Used tool: search_file_content with input: {"filePath":"docs/development-setup.md","pattern":"generated project","isRegex":false}
Used tool: search_file_content with input: {"filePath":"docs/development-setup.md","pattern":"initializer","isRegex":false}
Used tool: modify_file with input: {"filePath":"docs/development-setup.md","instruction":"After the \"Testing Strategy and Expectations\" section, add a new section titled \"Generated Projects and Repository Hygiene\". In that section, clearly state that any sample or initializer-generated projects used for manual testing must be created only in temporary or external directories and must never be added to version control. Reference ADR 0014 and mention that automated repo-hygiene tests and .gitignore rules enforce this, and that contributors should avoid creating project directories like 'cli-api', 'cli-test-from-dist', 'cli-test-project', 'manual-cli', 'test-project-exec-assess', 'my-api', 'git-api', 'no-git-api', 'cli-integration-project', 'cli-integration-no-git', 'cli-integration-dev', 'prod-api', 'logging-api', or 'prod-start-api' inside the repo."}
Used tool: search_file_content with input: {"filePath":"docs/development-setup.md","pattern":"0014-cli-api-generator-and-repo-hygiene","isRegex":false}
Used tool: search_file_content with input: {"filePath":"docs/development-setup.md","pattern":"0014-generated-test-projects-not-committed","isRegex":false}
Used tool: modify_file with input: {"filePath":"docs/development-setup.md","instruction":"In the \"Generated Projects and Repository Hygiene\" section, replace the ADR reference `docs/decisions/0014-cli-api-generator-and-repo-hygiene.accepted.md` with the correct existing ADR file `docs/decisions/0014-generated-test-projects-not-committed.accepted.md`."}
Used tool: modify_file with input: {"filePath":".gitignore","instruction":"At the end of the file, after the existing 'sample-project-exec-test/' ignore rule, add a short comment explaining that generated initializer projects must not be committed (referencing ADR 0014), followed by explicit ignore patterns for the common generated project directory names used in tests: 'cli-api/', 'cli-test-from-dist/', 'cli-test-project/', 'manual-cli/', 'test-project-exec-assess/', 'my-api/', 'git-api/', 'no-git-api/', 'cli-integration-project/', 'cli-integration-no-git/', 'cli-integration-dev/', 'prod-api/', 'logging-api/', and 'prod-start-api/'."}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format","--","docs/development-setup.md"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: git_add_all with input: {}
Used tool: git_commit with input: {"message":"docs: document generated-project repo hygiene and ignore patterns"}
Used tool: run_command with input: {"command":"npm","args":["run","build"]}
Used tool: run_command with input: {"command":"npm","args":["test"]}
Used tool: run_command with input: {"command":"npm","args":["run","lint"]}
Used tool: run_command with input: {"command":"npm","args":["run","type-check"]}
Used tool: run_command with input: {"command":"npm","args":["run","format:check"]}
Used tool: git_push with input: {}
Used tool: wait_for_github_workflow with input: {"workflowName":"CI/CD Pipeline","timeout":600000}

**Response:**

```
- [x] Extend the existing repository-hygiene test so it asserts that additional common generated-project directory names do not exist at the repository root, preventing those generated projects from ever being accidentally committed again.

- [x] Update the development setup documentation to clearly state that any sample or generated projects used for manual testing must be created only in temporary or external directories and must never be added to version control.
- [x] Broaden the ignore rules for generated projects to cover a small, well-defined set of common generated-project directory patterns that match the new hygiene tests, ensuring consistent prevention at both the .gitignore and test levels.

## What I implemented

### 1) Extended repository-hygiene test (##NOW)

**File updated:** `src/repo-hygiene.generated-projects.test.ts`  
**Commit:** `test: extend repo hygiene checks for generated projects`

Changes:

- Expanded `DISALLOWED_PROJECT_DIRS` so the hygiene test asserts that **all** commonly used generated-project directory names are absent at the repo root:

```ts
const DISALLOWED_PROJECT_DIRS = [
  'cli-api',
  'cli-test-from-dist',
  'cli-test-project',
  'manual-cli',
  'test-project-exec-assess',
  // Additional common generated project directory names used in tests
  'my-api',
  'git-api',
  'no-git-api',
  'cli-integration-project',
  'cli-integration-no-git',
  'cli-integration-dev',
  'prod-api',
  'logging-api',
  'prod-start-api',
];
```

These names correspond to:

- `initializer.test.ts`: `my-api`, `git-api`, `no-git-api`
- `cli.test.ts`: `cli-integration-project`, `cli-integration-no-git`, `cli-integration-dev`
- `generated-project-production*.test.ts`: `prod-api`, `prod-start-api`
- `generated-project-logging.test.ts`: `logging-api`
- Plus the original committed directories (`cli-api`, `cli-test-from-dist`, `cli-test-project`, `manual-cli`, `test-project-exec-assess`)

The test logic itself remains the same: it checks that none of these directories exist at the repo root and fails with a clear message if any do.

Quality check run for this step:

- `npm test` – passed.

---

### 2) Documentation and ignore rules for generated projects (##NEXT)

This covers both NEXT tasks: documentation and `.gitignore` rules.

#### 2a) Development documentation update

**File updated:** `docs/development-setup.md`  
**Commit:** `docs: document generated-project repo hygiene and ignore patterns`

Changes:

- Added a new section **“Generated Projects and Repository Hygiene”** after the “Testing Strategy and Expectations” section.

Key content:

- Explicit statement that **any sample or initializer-generated projects for manual testing must be created only in temporary or external directories**, outside this repo’s working tree.
- Clear rule that such generated projects **must never be added to version control** here.
- Direct reference to the existing ADR:

  ```md
  ADR `docs/decisions/0014-generated-test-projects-not-committed.accepted.md` defines strict rules for keeping this repository free of sample or initializer-generated projects:
  ```

- Explanation that **repo-hygiene tests** and `.gitignore` rules enforce this policy.
- Explicit list of directory names contributors must not create/commit inside the repo:

  ```md
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
  ```

- Guidance to create such throwaway projects in OS temp dirs or outside this repo to keep hygiene and history clean.

Also fixed the ADR reference to match the actual filename:

- From: `0014-cli-api-generator-and-repo-hygiene.accepted.md` (non-existent)
- To: `0014-generated-test-projects-not-committed.accepted.md` (actual ADR file)

#### 2b) `.gitignore` broadening for generated projects

**File updated:** `.gitignore`  
(Same `docs:` commit as above, since this is part of the repo-hygiene documentation/guardrails.)

Changes:

- Appended a comment and explicit ignore patterns at the end of the file:

```gitignore
sample-project-exec-test/

# Ignore generated initializer projects created in tests (see ADR 0014)
cli-api/
cli-test-from-dist/
cli-test-project/
manual-cli/
test-project-exec-assess/
my-api/
git-api/
no-git-api/
cli-integration-project/
cli-integration-no-git/
cli-integration-dev/
prod-api/
logging-api/
prod-start-api/
```

These patterns line up exactly with the `DISALLOWED_PROJECT_DIRS` in the hygiene test and the list in the development-setup doc, giving you:

- Test-level enforcement (fails if these dirs are present)
- `.gitignore` enforcement (prevents accidental tracking)
- Developer documentation (sets expectations clearly)

---

## Quality checks and CI

Before and after the commits, I ran:

- `npm test`
- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm run format:check` (with a one-off `npm run format -- docs/development-setup.md` to fix Prettier issues)

All commands passed successfully.

Finally:

- Changes were pushed to `main` via `git_push`.
- The **“CI/CD Pipeline”** GitHub Actions workflow was monitored with `wait_for_github_workflow` and completed with **conclusion: success**.

Both ##NOW and ##NEXT plan items are fully implemented and verified.
```
