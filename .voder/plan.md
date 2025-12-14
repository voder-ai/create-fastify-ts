## NOW

- [ ] Extend the existing repository-hygiene test so it asserts that additional common generated-project directory names do not exist at the repository root, preventing those generated projects from ever being accidentally committed again.

## NEXT

- [ ] Update the development setup documentation to clearly state that any sample or generated projects used for manual testing must be created only in temporary or external directories and must never be added to version control.
- [ ] Broaden the ignore rules for generated projects to cover a small, well-defined set of common generated-project directory patterns that match the new hygiene tests, ensuring consistent prevention at both the .gitignore and test levels.

## LATER

- [ ] Add a brief section to the relevant architecture or process decision record documenting the repository hygiene policy for generated projects and how the tests and ignore rules enforce it.
- [ ] Introduce a concise contributor checklist in the development documentation that reiterates key version-control rules, including not committing build artifacts, coverage outputs, or any generated sample projects.
