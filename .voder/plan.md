## NOW

- [ ] Add environment-driven log level configuration to the generated project’s Fastify server template so that the logger level is controlled by a LOG_LEVEL environment variable with sensible defaults, and update or add tests to verify that changing LOG_LEVEL actually affects the runtime log level as required by the logging story.

## NEXT

- [ ] Introduce development-time pretty logging for generated projects by integrating pino-pretty into the dev server path so that running the dev script produces human-readable structured logs while keeping production logs as raw JSON.
- [ ] Extend the generated project README to include a dedicated logging section that explains available log levels, how to configure LOG_LEVEL, how to add custom log messages (including request-scoped logging), and the difference between development and production log formats.
- [ ] Add a focused test suite that validates the dev-time pretty logging behavior and request-context logging examples, with traceability annotations referencing the logging story and its REQ-LOG-* requirements.
- [ ] Update the logging story file to mark the newly satisfied acceptance criteria as complete and document how the implementation (code and tests) fulfills each requirement.

## LATER

- [ ] Provide additional user documentation that outlines recommended patterns for integrating generated project logs with common aggregation tools such as CloudWatch, Datadog, or ELK, using concrete JSON log examples from the template.
- [ ] Refine logging-related helper utilities and test fixtures to reduce duplication and make it easy to add further logging features or stories (for example, correlation IDs or structured error fields) without rewriting test scaffolding.
- [ ] Consider adding optional configuration hooks in the generated project template that allow teams to plug in their own Pino transports or redact rules while preserving the documented defaults and keeping the template simple for new users.
