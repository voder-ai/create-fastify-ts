## NOW

- [ ] Refactor the dev server test file so that all test and describe callbacks comply with the configured maximum function length, removing every max-lines-per-function lint suppression in that file while keeping the existing dev server hot-reload and skip-watch test behaviors and assertions unchanged.

## NEXT

- [ ] Add per-function traceability annotations to all named helpers in the dev server test helpers module so each helper clearly declares which dev-server story requirements it implements.
- [ ] Add per-function traceability annotations to all named helpers in the generated-project test helpers module so each helper is linked to its corresponding initializer, build, logging, or security story requirements.
- [ ] Reduce any remaining duplicated health-check or server-start logic across generated-project tests by routing those behaviors through the existing shared helpers, keeping each test file focused on its unique assertions.
- [ ] Introduce one additional TypeScript-focused ESLint rule from the recommended set (for example, unused variables) into the lint configuration and add targeted suppressions where necessary so that the project’s lint baseline becomes slightly stricter without introducing failing checks.

## LATER

- [ ] Gradually enable further ESLint rules one at a time using the suppress-then-fix pattern to incrementally raise the static-analysis bar while keeping the codebase green at each step.
- [ ] Extend the duplication-check configuration to report per-file duplication summaries and treat large increases in test-helper duplication as a warning signal to refactor.
- [ ] Introduce lightweight inline comments on complex test helpers explaining non-obvious behaviors (such as timing assumptions or log-message parsing) to improve long-term maintainability without increasing function complexity.
