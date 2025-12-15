## NOW

- [ ] Create or update an internal development guide that clearly documents the trunk-based workflow and release process, including that all changes go directly to the main branch using Conventional Commits, the single CI/CD pipeline runs on every push to main, and semantic-release automatically publishes new versions without manual tags or approvals.

## NEXT

- [ ] Add a contributor-focused section to the main project documentation that summarizes the expected Git usage (no long-lived feature branches, no manual release tags) and points to the detailed development guide for full workflow details.
- [ ] Document the behavior and purpose of the pre-commit and pre-push hooks so contributors understand which checks run automatically before commits and pushes and how this aligns with the CI/CD pipeline.
- [ ] Explicitly state in the contributor documentation that generated sample projects, build artifacts, and temporary test outputs must never be committed, reinforcing the existing tests and ignore rules that enforce this policy.

## LATER

- [ ] Introduce a lightweight checklist for adding new features or stories that combines version-control expectations (commit format, branch usage), traceability requirements, and testing expectations into a single reference for contributors.
- [ ] Optionally enhance the main README with a brief CI/CD overview and a link to the detailed development and release workflow documentation, making the automated release model more visible to new users.
- [ ] If additional workflows are ever added (for example, for documentation-only checks), keep them documented in the same development guide and ensure they complement, rather than duplicate, the primary CI/CD pipeline.
