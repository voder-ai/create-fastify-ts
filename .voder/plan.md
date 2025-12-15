## NOW

- [ ] Add a dedicated test suite that exercises the HTTP helper functions for generated projects so they are covered for both successful health checks and timeout/error scenarios, increasing coverage for the generated-project HTTP helpers module.

## NEXT

- [ ] Ensure the dev-server test helper module has tests that cover its core behaviors, including successful detection of startup log messages and proper handling when expected messages never appear within the timeout window.
- [ ] Add focused tests for the package-json helper module so that its main functions are executed and validated for both valid input and representative error conditions, raising its line and branch coverage.
- [ ] Extend the existing coverage test configuration or scripts so that a single coverage run reflects the overall project coverage accurately and can be used as a reliable gate once coverage levels are closer to the target thresholds.

## LATER

- [ ] Tighten global coverage thresholds to values that match the improved coverage levels and configure the test runner to fail when coverage drops below those thresholds, enforcing the desired standard.
- [ ] Add regression tests for any newly identified edge cases in the dev-server and generated-project flows (for example, interrupted builds or partial installs) to further harden the end-to-end behavior.
- [ ] Document the testing and coverage expectations in the development docs, including which helper modules and edge cases are explicitly covered, so future contributors understand the required level of test completeness.
