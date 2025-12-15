## NOW

- [ ] Fix dev-server.mjs to wait for initial TypeScript compilation to complete before attempting to start the server, preventing "Cannot find module" errors when running `npm run dev` without a pre-built dist/ folder

## NEXT

- [ ] Add test coverage for the initial compilation scenario: create a test that runs `npm run dev` in a generated project without a pre-built dist/ folder and verifies the server starts successfully after TypeScript compilation completes
- [ ] Update the test to assert that the server responds to requests (e.g., /health endpoint) after the initial compilation, confirming REQ-DEV-INITIAL-COMPILE is satisfied
- [ ] Verify the fix works by running the new test and manually testing `npm run dev` in a fresh project without running `npm run build` first

## LATER

- [ ] Consider adding a visual indicator or log message when the dev server is waiting for initial TypeScript compilation to complete, improving developer experience and reducing confusion during the first startup
- [ ] Review other dev-server.mjs timing assumptions and hardcoded delays to ensure robustness across different system speeds and project sizes
- [ ] Document the expected behavior and timing characteristics of the initial compilation scenario in user-facing documentation or inline comments
