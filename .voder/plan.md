## NOW

- [ ] Make the generated-project production build and node-based production start tests run unconditionally by removing the environment-variable gating from their test file so that every standard test run actually builds a fresh generated project, verifies the dist artifacts, and confirms the compiled server’s /health endpoint responds with the expected 200 JSON payload.

## NEXT

- [ ] Adjust the optional npm-based production-start test so that it remains a separate, clearly marked optional suite (kept skipped by default) that mirrors the main node-based start test without affecting the standard test run’s reliability.
- [ ] Update the Story 006.0 testing-related documentation and any inline comments in the production E2E test files so they accurately describe that the build and node-based start checks now always run as part of the normal test suite, and that the npm-based variant is an extra optional check.
- [ ] Ensure that the Story 006.0 requirements about clean, warning-free, and reasonably fast builds are reflected in the tests or supporting documentation (for example by clarifying acceptable build-time expectations and what constitutes a failure vs a warning).

## LATER

- [ ] Introduce lightweight performance observability for the generated-project build step (for example, capturing approximate build duration in the test logs) to justify future tuning if build times become a concern.
- [ ] Refactor any duplicated helper logic between the production build/start tests and other generated-project tests into a small shared test utility module to keep future Story 006.x extensions easy to implement and maintain.
- [ ] Extend production-behavior tests to cover additional future endpoints or configuration options introduced in later stories, ensuring they also run against a real compiled generated project from dist.
