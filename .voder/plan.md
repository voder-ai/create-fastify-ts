## NOW

- [ ] Adjust the repository’s ignore configuration so that the `.voder` directory itself is no longer ignored while ensuring that only the `.voder/traceability/` subdirectory remains excluded from version control.

## NEXT

- [ ] Ensure that all important metadata files already present under `.voder` (excluding the `traceability` subdirectory) are included in version control so their history is tracked alongside the rest of the project.
- [ ] Document the expected version-control treatment of the `.voder` directory in the internal development documentation, explaining that `.voder` files (except `traceability` outputs) are part of the tracked state and must not be globally ignored.
- [ ] Add a short note to the contribution or coding guidelines stating that new ignore rules must not exclude the `.voder` directory, to prevent accidental reintroduction of the problematic ignore pattern.

## LATER

- [ ] Extend internal documentation to describe the trunk-based workflow, the role of pre-commit and pre-push hooks, and the expectation that all quality checks pass locally before changes are shared.
- [ ] Provide guidance for structuring any future example or demo projects under a dedicated, documented fixtures or examples area that remains small and static, avoiding use of committed initializer outputs.
- [ ] Periodically tidy the repository by pruning obsolete fixtures or legacy directories that no longer support any current stories or tests, keeping version control focused on active source, configuration, and documentation.
