## NOW

- [ ] Refactor the npm init smoke test file so that all test functions are split into small, focused helpers and no longer rely on a file-wide or function-level lint rule suppression for maximum function length, while keeping the existing smoke test behavior and assertions unchanged.

## NEXT

- [ ] Unify any remaining repeated logic in the npm init smoke tests by extracting shared operations (such as running the initializer, locating the generated project, and checking key files) into reusable helper functions to reduce duplication and improve readability.
- [ ] Remove any remaining broad ESLint suppressions related to function length or file length in other long-running integration or E2E tests by introducing small helper functions and restructuring tests so they comply with the configured limits without changing observable behavior.
- [ ] Reduce duplicated code across generated-project E2E tests by consolidating common patterns (like starting compiled servers, polling health endpoints, or constructing environment variables) into existing shared helper modules, keeping each test file focused on the unique behavior it validates.

## LATER

- [ ] Introduce one additional targeted ESLint rule that meaningfully improves code quality for this project, enable it with the minimal configuration, and add localized suppressions where necessary to keep linting green while planning future cleanup of those suppressions.
- [ ] Gradually remove any temporary ESLint suppressions by updating the affected code to meet the rule requirements, starting with the most frequently executed or most complex test files to maximize impact on maintainability.
- [ ] Use the duplication-report tooling to identify the highest-impact remaining code clones and refactor those areas into shared helpers or simpler structures, ensuring each change is covered by existing or updated tests so behavior remains stable.
