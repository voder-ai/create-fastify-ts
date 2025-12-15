## NOW

- [ ] Ensure newly generated projects include a minimal but fully working TypeScript test setup by updating the project template so that a fresh project has a Vitest-powered test script and at least one passing `.test.ts` file exercising the generated Fastify server, such that running the test command in that new project immediately executes and passes real tests.

## NEXT

- [ ] Add JavaScript and type-level example tests to the generated project template by creating a small `.test.js` file and a `.test.d.ts` file that both run successfully in a fresh project, satisfying the multiple test format requirements of the story.
- [ ] Introduce coverage configuration for generated projects by adding an appropriate Vitest configuration file or inline options so that the default test workflow in a new project produces coverage reports and enforces documented coverage thresholds.
- [ ] Update the generated project’s README template to describe the available test commands, how to run tests in watch mode and with coverage, and what the included example tests demonstrate, so the documentation acceptance criteria for the story are met.
- [ ] Extend or add end-to-end initializer tests in this repository to scaffold a new project and verify that its test command runs successfully, its example tests are present, and a coverage report is generated, confirming end-to-end compliance with the story for generated projects.

## LATER

- [ ] Enhance the example tests shipped in generated projects to cover additional behaviors such as error handling, logging, or small utility functions while keeping them fast and easy to understand.
- [ ] Consider adding an optional `test:watch` or `test:coverage` script to the generated project template for improved developer ergonomics once the basic test workflow is in place and validated.
- [ ] Refine coverage thresholds or exclude patterns for generated projects based on real-world feedback, ensuring they remain achievable while still catching meaningful gaps in test coverage.
