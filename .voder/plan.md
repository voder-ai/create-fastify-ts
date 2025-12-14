## NOW

- [ ] Add a fast, always-on test for a generated project that, after successfully building the project, starts the compiled server from the dist output and verifies that the /health endpoint returns a 200 response with the expected JSON body, so that Story 006.0’s production start and runtime behavior requirements are satisfied without relying on skipped E2E suites.

## NEXT

- [ ] Keep the existing node-based and npm-based production start E2E suites as explicitly optional, clearly documenting in their comments that they are heavier, end-to-end variants of the always-on runtime check and should only be enabled in environments that tolerate longer-running tests.
- [ ] Update the Story 006.0 documentation and any inline comments in the generated-project production tests to explain that there is now a mandatory runtime verification that starts the compiled server from dist and checks /health, with the optional E2Es providing additional coverage for full npm-based workflows.
- [ ] Ensure the new always-on runtime test explicitly encodes the requirement that the production server runs purely from dist (not from TypeScript sources) by only interacting with the compiled entrypoint and by failing if the server logs or configuration suggest a dependency on src files.

## LATER

- [ ] Introduce lightweight timing and logging around the generated-project build and runtime start steps in tests to provide visibility into performance and help justify future tuning if builds or startup become slower over time.
- [ ] Refactor any duplicated helpers between the various generated-project production tests (build-only, fast runtime check, optional node-based and npm-based E2Es) into a shared test utility module so future Story 006.x enhancements can reuse them cleanly.
- [ ] Extend the production-behavior tests to cover additional endpoints or configuration flags introduced by later stories while continuing to execute against a real compiled generated project running from dist.
