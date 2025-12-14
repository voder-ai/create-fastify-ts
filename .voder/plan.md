## NOW

- [ ] Update the user-facing documentation (README.md and user-docs/api.md) so that they explicitly describe the HTTP endpoints provided by a freshly generated project (including both the Hello World root route and the /health route) and clearly distinguish these from the internal stub server’s /health-only API, ensuring the documented endpoints and server roles exactly match the current template implementation and tests.

## NEXT

- [ ] Add a JSDoc block with an appropriate @supports annotation to the main function in scripts/copy-template-files.mjs so that this build script complies with the project’s traceability requirements and references the relevant production-build story and requirements.
- [ ] Adjust the security documentation in user-docs/SECURITY.md, if needed, to align its wording with the current generated project implementation by confirming that helmet and security headers are documented only where they are actually enabled in code and tests, without implying any unimplemented behavior.
- [ ] Extend the developer-facing documentation (for example in docs/development-setup.md or docs/testing-strategy.md) with a short section describing the new generated-project and dev-server shared test helpers, including when to use them and examples, so contributors avoid reintroducing duplicated test logic.
- [ ] Ensure that any references to logging behavior in README.md and user-docs/api.md clearly tie env-driven log levels and JSON vs pretty logging to the current generated project and dev-server implementations, updating phrasing where necessary to match the exact behavior covered by the logging tests.

## LATER

- [ ] Introduce a concise “API surface of the template” page under user-docs/ that consolidates the documented public CLI, initialization functions, and generated project behavior into a single reference, improving discoverability without duplicating existing content.
- [ ] Standardize a brief documentation style guide in docs/ (covering how to reference stories/requirements, how to describe endpoints, and how to document environment variables) to keep future docs consistent with the current structure.
- [ ] Periodically refine story and ADR documents to cross-link more explicitly to the corresponding user docs (for example, adding a short “user docs” pointer section in each completed story) so it is easy to trace from requirements through implementation to user-facing documentation.
