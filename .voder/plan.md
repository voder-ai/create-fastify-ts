## NOW

- [ ] Add a new regression test in the generated-project production test suite that creates a project with an intentionally broken TypeScript source file, runs the production build flow, and verifies that the build fails with a clear, asserted error instead of hanging or reporting success.

## NEXT

- [ ] Raise the global coverage thresholds in the test configuration to values that are just below the current measured coverage (for example, keeping a small buffer) so that future changes cannot significantly reduce coverage without causing the coverage run to fail.
- [ ] Update the development testing documentation to describe the current testing strategy, including the existence of helper-module tests and the enforced coverage thresholds, so contributors understand the required level of test completeness.
- [ ] Add a targeted dev-server regression test that simulates a failure during the TypeScript watch or server start phase and asserts that the error is surfaced with the expected message and exit behavior.

## LATER

- [ ] Add additional edge-case tests for generated projects that simulate partial dependency installation or missing build artifacts to ensure those scenarios fail fast and clearly.
- [ ] Introduce a small set of ultra-fast smoke tests that validate core flows (initializer, dev server, production build) with minimal setup, providing an even quicker feedback loop alongside the full suite.
- [ ] Once the test suite has remained stable for a while at the new thresholds, consider incrementally tightening coverage thresholds again to further lock in the higher coverage levels.
