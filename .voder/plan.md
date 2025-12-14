## NOW

- [ ] Create a shared test helper module that encapsulates the repeated generated-project flow of creating a temp project, linking dependencies, running the TypeScript build, starting the compiled server, waiting for the health endpoint to respond, and shutting the server down, and update the existing generated-project production and logging test files to use this helper for their common setup instead of duplicating that logic inline.

## NEXT

- [ ] Extract additional smaller helpers from the generated-project tests to handle common assertions such as verifying that runtime logs do not reference source files and that log level configuration behaves correctly, and update the tests to call these helpers instead of repeating assertion code blocks.
- [ ] Refactor the dev-server integration tests to move their repeated process-start, readiness-wait, and shutdown logic into a dedicated helper module, and update the tests to use these helpers to further reduce duplication and improve readability.
- [ ] Expand TypeScript type-checking coverage to include the dev-server integration test file by removing it from the type-check exclusion list and adjusting its code or supporting type definitions so that strict type-checking passes cleanly.
- [ ] Simplify the ESLint complexity rule configuration by switching from an explicit numeric max to the default error-only form once the codebase is confirmed to comply, keeping behavior unchanged while making the configuration clearer.

## LATER

- [ ] Gradually tighten the maximum allowed lines per function threshold in the lint configuration by first identifying larger functions and refactoring them into smaller, well-named helpers, then lowering the configured limit once violations are resolved.
- [ ] Introduce brief developer documentation describing the new shared test helpers for generated projects and the dev server so contributors know how to use them and avoid reintroducing duplicated patterns in future tests.
- [ ] Periodically revisit jscpd duplication reports after new features are added and, when new clusters of duplication appear, apply the same helper-extraction strategy to keep duplication levels low without compromising test clarity.
