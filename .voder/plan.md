## NOW

- [ ] Make the hot-reload behavior test for the dev server pass by updating the test in the dev-server test suite so that it reliably detects the server restart on a compiled output change within an appropriate timeout while still asserting both the restart log message and a clean, graceful shutdown after the restart.

## NEXT

- [ ] If the updated test reveals an actual defect in the dev server’s hot-reload logic, adjust the hot-reload implementation so that changing the compiled output file always triggers a single restart with clear logging and no orphaned processes, then re-run the test to confirm it passes.
- [ ] Update the dev-server story to reflect that the hot-reload acceptance criteria are now fully validated by the passing test, including any notes about restart timing and graceful shutdown behavior.
- [ ] Ensure the entire dev-server test suite, including the hot-reload scenario, runs consistently without flakiness in the normal test environment so that story 003.0 can be considered complete and stable.

## LATER

- [ ] Add additional dev-server tests that exercise more complex change scenarios, such as multiple rapid changes to the compiled output file, to demonstrate that hot reload behaves sensibly under repeated edits.
- [ ] Extend documentation for contributors to explain how the dev server’s hot-reload mechanism works and how to diagnose or adjust it if future changes introduce timing or process-lifecycle issues.
- [ ] Consider adding a lightweight smoke test that runs only the dev-server hot-reload scenario, providing a quick sanity check when modifying dev-server or watcher-related code.
