## NOW

- [ ] Change the lint-and-format smoke test script so that the temporary mini-project’s lint and format commands invoke ESLint and Prettier via explicit Node entry-point paths from the main repository’s node_modules directory, rather than relying on PATH, ensuring the smoke test can always find and run these tools successfully in its isolated environment.

## NEXT

- [ ] Ensure the updated smoke test still verifies that lint auto-fix modifies the deliberately misformatted file and that a second format run is idempotent, keeping the behavioral assertions for the story’s requirements intact.
- [ ] Update the lint-and-format story documentation, if needed, to explicitly mention that the smoke test uses a self-contained temporary mini-project wired to the repository’s ESLint and Prettier binaries, clarifying how the acceptance criteria are validated.
- [ ] Confirm that the lint-and-format story’s dedicated smoke test is now stable across environments by running it in a clean context and checking that its behavior aligns with the documented requirements for fast, reliable lint and format auto-fix.

## LATER

- [ ] Extend the smoke test to exercise additional representative file types (for example JSON and Markdown) so that formatting consistency is demonstrated beyond JavaScript alone.
- [ ] Add a short section to the development setup documentation describing the smoke test’s behavior and how contributors can mimic its pattern when setting up lint/format tooling in downstream projects.
- [ ] Consider adding a lightweight secondary check that runs only the smoke test in isolation, providing an even faster sanity check for lint/format tooling when making ESLint or Prettier configuration changes in the future.
