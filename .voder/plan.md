## NOW

- [ ] Update the internal testing strategy documentation to explain that the main coverage command focuses on core test suites and excludes the heaviest generated-project E2E tests, so developers understand how this scoped coverage run satisfies the testing story’s coverage requirements.

## NEXT

- [ ] Introduce an additional npm script that runs an extended coverage suite including the generated-project production and logging tests, while keeping the existing fast coverage script unchanged for core tests.
- [ ] Adjust the generated-project production and logging test suites as needed so they execute successfully under the new extended coverage run without flakiness or timeouts.
- [ ] Document the new extended coverage command in the testing guide and README, clarifying that it is a slower, optional run that includes the generated-project E2E-style suites.
- [ ] Decide whether and how the extended coverage run should be integrated into continuous integration, such as via an optional or scheduled job that does not slow down the main quality gate.

## LATER

- [ ] Refine and optimize the extended coverage run to keep its execution time reasonable as more generated-project tests are added.
- [ ] Reevaluate global coverage thresholds and excluded paths once the extended coverage run is stable, ensuring they still reflect desired quality targets.
- [ ] Consider adding targeted coverage reports for specific subsystems (initializer, dev server, logging, generated projects) to make it easier to see the impact of future changes on test coverage.
