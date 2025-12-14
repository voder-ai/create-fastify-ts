## NOW

- [ ] Change the generated project’s build configuration so that every production build first clears the existing dist directory before running the TypeScript compiler, ensuring that each build produces a clean dist output with no stale files from previous builds.

## NEXT

- [ ] Tighten the generated-project build test so that it fails when the build command exits with a non‑zero status, while still logging diagnostic output, thereby strictly enforcing that the build succeeds for the Story 006.0 acceptance criteria.
- [ ] Add a deterministic production-start test that runs the compiled server binary (the dist/src/index.js entrypoint produced by the build) for a freshly generated project and verifies that the /health endpoint responds with HTTP 200 and the expected JSON payload.
- [ ] Update the generated project’s README template to describe the now-functional build and start scripts, including how to run a production build and start the compiled server and what artifacts are created in the dist directory.

## LATER

- [ ] Optionally re-enable or refine the existing npm-based production-start E2E test so it can run reliably in CI and local environments, using it as a deeper smoke test beyond the new direct-node start test.
- [ ] Enhance tests or documentation to address Story 006.0’s guidance about fast, warning-free builds, for example by documenting expected build times and warning behavior rather than asserting hard timing guarantees in tests.
- [ ] Consider introducing a small shared utility module for generated-project tests to reduce duplication between build, start, and future production-behavior tests while keeping each story’s tests focused and readable.
