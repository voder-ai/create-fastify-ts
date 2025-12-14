---
status: 'proposed'
date: 2025-12-15
decision-makers: ['voder', 'user']
consulted: ['testing-strategy.md', 'vitest documentation']
informed: ['project contributors']
---

# Use .smoke.test.ts Naming Convention to Isolate Post-Publish Smoke Tests

## Context and Problem Statement

This project is distributed as an npm initializer (`npm init @voder-ai/fastify-ts`), requiring validation of both the local codebase before publishing (integration tests) and the published package after release (smoke tests). Smoke tests validate the published npm package, which doesn't exist until after semantic-release completes.

**The chicken-and-egg problem**: If smoke tests were part of the regular test suite that must pass before release, a bad release would prevent releasing a fix because the smoke tests would fail validation of the broken published package.

How should smoke tests be isolated from the regular test suite to prevent them from blocking releases while still providing post-publish validation?

## Decision Drivers

- **Critical requirement**: Smoke tests MUST NOT block releases (prevent chicken-and-egg problem)
- **Developer experience**: Clear distinction between integration and smoke tests
- **Discoverability**: Easy to identify smoke tests in the codebase
- **Scalability**: Pattern should work as more smoke tests are added
- **Simplicity**: Minimal configuration overhead
- **Explicitness**: Intent should be clear from package.json scripts
- **No accidental execution**: Smoke tests should not run during regular development or CI pre-release checks

## Considered Options

1. **Environment variable skip pattern** (current implementation) - Use `describe.skip` based on `SMOKE_TEST=true` environment variable
2. **Vitest config exclusion** - Exclude specific files in `vitest.config.mts`
3. **Separate directory structure** - Create `src/smoke-tests/` directory
4. **Convention-based naming with `.smoke.test.ts` suffix** - Use file naming pattern with script-level exclusion

## Decision Outcome

Chosen option: **Option 4 - Convention-based naming with `.smoke.test.ts` suffix**, because it provides the clearest separation through self-documenting code, explicit script configuration, and scalable pattern that works across any test framework.

### Implementation

1. **File naming**: `npm-init.smoke.test.ts` (instead of `npm-init-smoke.test.ts`)
2. **Package.json scripts**:
   ```json
   {
     "test": "vitest run --exclude '**/*.smoke.test.ts'",
     "test:smoke": "vitest run '**/*.smoke.test.ts'"
   }
   ```
3. **Remove conditional skip logic**: No need for `describeOrSkip` or environment variable checks
4. **CI/CD integration**: Run `npm test` for pre-release checks, `npm run test:smoke` after semantic-release completes

### Consequences

#### Good

- **Self-documenting**: File name immediately indicates test type without reading code
- **Explicit exclusion**: Package.json scripts make intent clear and visible
- **No accidental execution**: Smoke tests literally cannot run during `npm test`
- **Clean test output**: Regular tests show no mention of smoke tests (no "skipped" noise)
- **Scalable pattern**: Easy to add more smoke tests with same convention
- **Framework agnostic**: Pattern works beyond Vitest (Jest, Mocha, etc.)
- **Searchable**: Easy to find all smoke tests: `find . -name "*.smoke.test.ts"`
- **Prevents chicken-and-egg**: Impossible for smoke tests to block releases

#### Bad

- **Migration cost**: Existing `npm-init-smoke.test.ts` must be renamed
- **Convention reliance**: Developers must know the `.smoke.test.ts` convention
- **Script coupling**: Test exclusion lives in package.json, not test framework config

#### Neutral

- **Different from existing convention**: Other tests use standard `.test.ts` suffix
- **Requires documentation**: Convention must be explained in testing-strategy.md

### Confirmation

The decision is properly implemented when:

1. All smoke test files follow `*.smoke.test.ts` naming convention
2. `npm test` excludes `**/*.smoke.test.ts` pattern
3. `npm run test:smoke` runs only `**/*.smoke.test.ts` files
4. Regular test output shows no smoke tests (not even as skipped)
5. Smoke tests contain no conditional skip logic or environment variable checks
6. CI/CD workflow runs smoke tests after semantic-release, not before
7. Documentation in `testing-strategy.md` explains the convention and rationale

## Pros and Cons of the Options

### Option 1: Environment Variable Skip Pattern

Current implementation using `const describeOrSkip = process.env.SMOKE_TEST === 'true' ? describe : describe.skip;`

- Good, because it's simple to implement with no config changes
- Good, because tests live alongside integration tests for easy comparison
- Good, because Vitest shows skipped tests in output (visibility)
- Neutral, because it uses a single test framework configuration
- Bad, because smoke tests always load/parse even when skipped (minimal overhead)
- Bad, because environment variable could accidentally leak (e.g., in developer shell)
- Bad, because test output shows "3 skipped" which confuses developers about what's being skipped
- Bad, because conditional logic in test file obscures intent
- Bad, because reliance on runtime state (environment variable) is fragile

### Option 2: Vitest Config Exclusion

Exclude specific files in `vitest.config.mts` using `exclude` array.

- Good, because smoke tests never load during normal test runs (performance)
- Good, because no environment variable needed for regular tests
- Good, because clear separation in codebase
- Good, because test output doesn't show skipped smoke tests
- Neutral, because configuration is framework-specific (Vitest)
- Bad, because requires separate vitest command: `vitest run src/npm-init-smoke.test.ts`
- Bad, because must remember to update vitest.config.mts when adding new smoke test files
- Bad, because exclusion configuration is hidden in config file, not visible in package.json
- Bad, because less discoverable (need to check vitest.config.mts to understand exclusion)

### Option 3: Separate Directory Structure

Create `src/smoke-tests/` directory and exclude entire directory.

```
src/
  npm-init-e2e.test.ts (integration)
  smoke-tests/
    npm-init-smoke.test.ts
```

- Good, because very clear organizational separation
- Good, because easy to exclude entire directory with single pattern
- Good, because easy to find all smoke tests (look in smoke-tests/ directory)
- Good, because can have different tsconfig/eslint rules for smoke tests if needed
- Neutral, because requires directory-level thinking instead of file-level
- Bad, because adds directory structure complexity
- Bad, because breaks current flat structure convention in `src/`
- Bad, because need to update multiple tool configs (vitest, tsconfig, eslint)
- Bad, because over-engineered for potentially small number of smoke tests
- Bad, because less flexible (can't easily co-locate related integration and smoke tests)

### Option 4: Convention-based Naming with `.smoke.test.ts` Suffix

Use file naming pattern with explicit script-level exclusion.

- Good, because self-documenting (file name indicates test type)
- Good, because explicit exclusion in package.json scripts (visible intent)
- Good, because no accidental execution (pattern match prevents running)
- Good, because clean test output (no "skipped" tests shown)
- Good, because scalable (easy to add more `*.smoke.test.ts` files)
- Good, because framework agnostic (pattern works with any test runner)
- Good, because searchable (`find . -name "*.smoke.test.ts"`)
- Good, because no conditional logic needed in test files
- Good, because separation of concerns (integration vs. smoke) encoded in naming
- Neutral, because requires renaming existing file(s)
- Neutral, because developers must learn the convention
- Bad, because different naming convention from other tests (`.test.ts` vs `.smoke.test.ts`)
- Bad, because test exclusion lives in package.json, not test framework config

## Reassessment Criteria

This decision should be reassessed when:

- **New test isolation needs emerge**: If other test types (performance, security, etc.) need similar isolation, evaluate whether the `.TYPE.test.ts` convention should be generalized
- **Test framework changes**: If migrating from Vitest to another test framework, verify the exclusion pattern still works effectively
- **CI/CD complexity increases**: If managing smoke test execution becomes burdensome, consider whether tooling improvements or alternative approaches are needed
- **Developer confusion observed**: If multiple developers misunderstand or misuse the convention, consider whether additional tooling (linting rules, pre-commit hooks) is needed

## More Information

### Related Testing Patterns

This decision follows the "Test Pyramid" principle where:

- **Integration tests** (broad base): Test local code before publishing
- **Smoke tests** (narrow top): Test published artifacts in production-like environment

The isolation ensures that the pyramid remains stable - a problem at the top (smoke tests) doesn't prevent fixing the base (releasing a fix).

### Migration Plan

To implement this decision:

1. Rename `src/npm-init-smoke.test.ts` → `src/npm-init.smoke.test.ts`
2. Remove `describeOrSkip` logic and environment variable checks from smoke test file
3. Update `package.json`:
   - Modify `test` script: `vitest run --exclude '**/*.smoke.test.ts'`
   - Keep `test:smoke` script: `vitest run '**/*.smoke.test.ts'` (or update if using env var currently)
4. Update `.github/workflows/ci-cd.yml` to use `npm run test:smoke` (remove `SMOKE_TEST=true` if present)
5. Update `docs/testing-strategy.md` to document the `.smoke.test.ts` convention
6. Verify: `npm test` should show 0 smoke tests (not even skipped), `npm run test:smoke` should run only smoke tests

### Why This Matters

The chicken-and-egg problem is real and has broken release pipelines in production systems:

1. Release v1.0.0 with a critical bug
2. Smoke tests fail because v1.0.0 is broken
3. Try to release v1.0.1 with fix
4. Pre-release checks run `npm test` which includes smoke tests
5. Smoke tests pull v1.0.0 from npm registry (the broken version)
6. Smoke tests fail
7. Release blocked - cannot release fix

With proper isolation:

1. Release v1.0.0 with a critical bug
2. Post-release smoke tests fail (alert generated, but release is complete)
3. Release v1.0.1 with fix
4. Pre-release checks run `npm test` (excludes smoke tests)
5. Integration tests validate local fix
6. Release proceeds
7. Post-release smoke tests validate v1.0.1 (now pass)
