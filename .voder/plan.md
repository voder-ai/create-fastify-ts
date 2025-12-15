## NOW

- [ ] Change the dev-server initial compilation test so it no longer relies on a specific hard-coded port and instead uses the dev server’s automatic port selection while still asserting that, after the initial TypeScript compile completes, the server is listening and responds successfully on its health endpoint.

## NEXT

- [ ] Update the npm-init smoke test so that when the published version environment variable is not set, the test suite cleanly skips those smoke scenarios instead of throwing an error during test file loading, while preserving the strict behavior expected in the continuous integration environment.
- [ ] Add a short section to the development documentation explaining how to run the smoke tests for the published package, including which environment variables must be set and what behavior to expect when they are omitted.
- [ ] Ensure that all long-running dev-server and generated-project end-to-end tests have clear, bounded timeouts and use existing helper functions for process startup and shutdown so they remain stable and deterministic across different environments.

## LATER

- [ ] Introduce a dedicated test profile for the slowest end-to-end scenarios (such as full npm-init flows and dev-server watch behaviors) so contributors can choose between a fast default test run and an exhaustive validation run without changing test code.
- [ ] Refine dev-server error reporting during initial TypeScript compilation and watch mode so that failures surface concise, developer-friendly messages while keeping the existing behavior verified by the tests.
- [ ] Extend generated-project smoke coverage with an additional scenario that exercises the development server command in a freshly initialized project, confirming that initial compilation, automatic port selection, and health checks all succeed end to end.
