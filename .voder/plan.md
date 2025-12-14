## NOW

- [ ] Implement ADR 0016: Migrate smoke tests to `.smoke.test.ts` naming convention
  - Rename `src/npm-init-smoke.test.ts` → `src/npm-init.smoke.test.ts`
  - Remove `describeOrSkip` conditional logic and environment variable checks from smoke test file
  - Update `package.json` test script to exclude `**/*.smoke.test.ts` pattern
  - Update `package.json` test:smoke script to run `**/*.smoke.test.ts` files
  - Update `.github/workflows/ci-cd.yml` to remove `SMOKE_TEST=true` environment variable (if present)
  - Update `docs/testing-strategy.md` to document the `.smoke.test.ts` convention and rationale
  - Verify `npm test` excludes smoke tests completely (no "skipped" output)
  - Verify `npm run test:smoke` runs only smoke tests

## NEXT

- [ ] Run full quality gates (lint, format, type-check, test, build) to validate ADR 0016 implementation
- [ ] Commit changes with message following conventional commits (e.g., `test: migrate smoke tests to .smoke.test.ts convention per ADR 0016`)
- [ ] Update history.md with summary of ADR 0016 implementation and smoke test isolation
- [ ] Consider promoting ADR 0016 from proposed to accepted after successful production validation
- [ ] Review existing CLI and initializer tests for any remaining duplication with npm init E2E tests

## LATER

- [ ] Consider adding additional npm init E2E test scenarios (invalid project names, error handling edge cases)
- [ ] Add metrics/reporting for npm init test execution times to catch performance regressions
- [ ] Explore testing npm init with different Node.js versions to validate cross-version compatibility
- [ ] Consider whether other test types (performance, security) would benefit from similar naming conventions (e.g., `.perf.test.ts`, `.security.test.ts`)
