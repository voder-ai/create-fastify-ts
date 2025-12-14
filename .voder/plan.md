## NOW

- [ ] Update the project’s development dependencies so that the code-duplication tool version matches the latest safe release identified by the dependency freshness report, ensuring the package metadata and lockfile are consistent and all existing tests and quality checks still pass with the new version.

## NEXT

- [ ] Add the dependency freshness tool itself as an explicit development dependency so that the CI pipeline uses the locally declared version instead of installing it on the fly, keeping dependency versions controlled by package metadata.
- [ ] Adjust the CI dependency audit step to use the current recommended flags for excluding development dependencies, removing obsolete warnings while preserving the existing high-severity production audit behavior.
- [ ] Ensure that any new or updated development dependencies introduced for tooling (such as jscpd and dry-aged-deps) are covered by the existing scripts and documentation so contributors know how and when these tools run.

## LATER

- [ ] Document a lightweight dependency management policy that explains how to interpret the dependency freshness report, when to apply safe updates to development and runtime dependencies, and how those changes are validated through the existing quality pipeline.
- [ ] Periodically expand coverage of the dependency freshness tooling to include any new subprojects or packages added in the future, keeping the same pattern of safe, incremental upgrades validated by tests.
- [ ] Consider adding a short developer-facing guide that illustrates common dependency update workflows in this project (for example, updating a dev tool vs a runtime library) and how those map to commit types and CI expectations.
