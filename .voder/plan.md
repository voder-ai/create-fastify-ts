## NOW

- [ ] Make the `[REQ-INIT-E2E-INTEGRATION] generated project can install dependencies and build` integration test in src/npm-init-e2e.test.ts pass reliably by updating it to use the same shared generated-project helpers and node_modules reuse strategy as the other E2E tests, so that a project created via the initializer can successfully run dependency installation and a full build end to end.

## NEXT

- [ ] Ensure all other tests in src/npm-init-e2e.test.ts still pass and explicitly assert that both the dependency installation and build steps complete with successful exit codes for the generated project.
- [ ] Confirm that the initializer’s scaffolding logic and template files used by the npm init flow still match the expectations encoded in the integration tests (required files, scripts, and minimal Fastify server behavior).
- [ ] Update the Story 001.0-DEVELOPER-TEMPLATE-INIT.story.md file to reflect that REQ-INIT-E2E-INTEGRATION is now fully satisfied by the passing integration tests, keeping traceability annotations aligned with the test names and requirements.

## LATER

- [ ] Strengthen the post-release smoke tests to mirror the updated integration test shape, ensuring that projects generated from the published npm package also verify dependency installation and build in the same way.
- [ ] Add targeted diagnostics or clearer failure messages in the integration tests when npm install or build fails inside the generated project, to make future regressions easier to debug.
- [ ] Consider adding a lightweight health-check test that runs `npm init` with a minimal, offline-capable registry configuration to reduce flakiness from external npm registry issues while still validating the initializer workflow.
