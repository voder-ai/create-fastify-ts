## NOW

- [ ] Create a new `src/index.test.d.ts` type-level test file that exercises the exported API types from `src/index.ts` (for example, validating the `GitInitResult` shape via conditional-type assertions) and includes a JSDoc `@supports` header referencing story `docs/stories/004.0-DEVELOPER-TESTS-RUN.story.md` and the REQ-TEST-EXAMPLES / multiple-format requirements.

## NEXT

- [ ] Ensure the TypeScript configuration includes `src/index.test.d.ts` in the files checked by the existing type-check script so that breaking the public API types will cause type-check to fail.
- [ ] Run the existing test and type-check commands to confirm that the new `.test.d.ts` file compiles successfully and that the overall test suite and build still pass.
- [ ] Verify that the examples and claims in the Testing Guide and README that mention `src/index.test.d.ts` now correspond to the actual file contents and adjust the wording only if needed to match what the new type-level tests cover.

## LATER

- [ ] Add additional type-level assertions in `src/index.test.d.ts` for any new public exports added in future stories to keep type contracts continuously validated.
- [ ] Extend documentation in the Testing Guide with a short explanatory subsection that walks through how the `Expect` helper in the `.test.d.ts` file works, to help users create their own type-level tests.
- [ ] Consider adding a separate npm script dedicated to running only type-level tests (by narrowing TypeScript’s `include` set) if the project grows and you want a very fast feedback loop for API type changes.
