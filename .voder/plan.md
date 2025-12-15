## NOW

- [ ] Change the dev server implementation in the template so that the initial TypeScript compilation is started using the generated project’s local TypeScript compiler directly (without relying on npx), ensuring that when no dist directory exists the dev server successfully runs an initial compile, logs the existing “initial TypeScript compilation complete” message, and keeps the watch process running for subsequent reloads.

## NEXT

- [ ] Update the dev server tests that cover REQ-DEV-INITIAL-COMPILE so they assert the new, robust initial-compilation behavior from a fresh project with no dist directory, including confirmation that the server starts and responds on its health endpoint after the first compile completes.
- [ ] Verify that all other dev-server behaviors required by the story (port auto/strict handling, hot reload, graceful shutdown, clean logs, TypeScript watch) still pass their existing tests after the implementation change, adjusting only expectations that legitimately changed (such as log wording) while preserving the story’s intent.
- [ ] Update the developer documentation in the dev-server story and any related docs to reflect the finalized initial-compilation behavior (how `npm run dev` works without a pre-built dist, what logs to expect, and how TypeScript errors are surfaced), and mark the corresponding acceptance criteria as satisfied.
- [ ] Re-run the full test suite focused on generated projects and dev-server functionality to confirm that Story 003.0 is now fully implemented and behaves correctly across integration and end-to-end scenarios.

## LATER

- [ ] Improve error reporting in the dev server so that TypeScript compiler failures during initial compilation and watch mode produce clear, actionable messages for developers while still satisfying the existing story requirements.
- [ ] Add a small, self-contained helper module for locating and invoking the local TypeScript CLI that can be reused by other tooling in generated projects if future stories introduce additional TypeScript-driven workflows.
- [ ] Consider adding an extra smoke-style test that runs the full `npm run dev` command in a generated project (in non-interactive mode) to validate end-to-end that initial compilation and watch startup work in realistic environments beyond the current focused dev-server tests.
