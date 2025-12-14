## NOW

- [ ] Replace the placeholder build and start scripts in the generated project’s template package configuration so that new projects compile their TypeScript source into a dist directory and run the Fastify server from the compiled dist output when developers execute the build and start commands.

## NEXT

- [ ] Update the TypeScript configuration template used for generated projects so that a production build emits declaration files and appropriate sourcemaps into the dist directory, matching the requirements for build output in the production-build story.
- [ ] Add automated tests that scaffold a new project in a temporary directory, run the build command, and assert that the build succeeds and produces the expected JavaScript and declaration files in dist without referencing the src directory at runtime.
- [ ] Add automated tests that start the compiled server in a generated project using the start command and verify that the /health endpoint on the configured port responds with a successful status code and the expected JSON payload.
- [ ] Adjust internal documentation or stories, if needed, to reflect the implemented build and start behavior for generated projects, including how to run production builds and servers and what outputs to expect.

## LATER

- [ ] Introduce a clean-build behavior for generated projects so that old dist contents are removed or overwritten safely before each build, ensuring the output directory accurately reflects the current source.
- [ ] Refine logging and configuration for the production start command in generated projects so that startup messages, port selection, and error cases align closely with all detailed requirements in the production-build story.
- [ ] Consider adding an optional start script or documented example for the template package itself if the story or future requirements call for running the stub server in production mode from this repository.
