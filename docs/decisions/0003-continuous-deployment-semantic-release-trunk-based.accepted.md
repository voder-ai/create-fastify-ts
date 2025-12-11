---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Continuous Deployment with Semantic Release and Trunk-Based Development

## Context and Problem Statement

The microservice must be easy to release frequently and safely. We want every commit to the main branch to be a potential production release, with minimal manual overhead, while maintaining a clear history of changes for consumers.

We need to decide:

- How versions are managed and published to npm.
- How branching and integration workflows are structured.
- How CI/CD enforces quality gates before publishing.

## Decision

We adopt **continuous deployment** with the following practices:

1. **Trunk-based development on `main`**
   - All work is integrated into the `main` branch in small, frequent commits.
   - Short-lived local branches are allowed for experimentation, but the default path is directly committing to and pushing `main`.
   - The CI/CD pipeline runs on every push to `main`.

2. **Automated versioning and publishing via `semantic-release`**
   - `semantic-release` is responsible for determining version numbers, publishing to npm, and creating GitHub Releases.
   - The `package.json` `version` field is not manually updated and may be stale; the authoritative version is the one calculated by `semantic-release`.
   - Conventional Commits are used to signal the type of change (e.g., `feat` → minor, `fix` → patch).

3. **Single unified CI/CD pipeline**
   - A single GitHub Actions workflow (`CI/CD Pipeline`) runs quality gates (lint, type-check, build, test, format check), performs the release with `semantic-release`, and then executes a post-release smoke test by installing and calling the published package.
   - There are no separate build vs. release workflows and no manual approval gates.

## Rationale

- **Fast feedback and safety**: Trunk-based development with small commits reduces merge complexity and makes it easier to understand the impact of each change.
- **Reduced manual toil**: Automated version calculations and publishing remove the need for manual version bumps, tag creation, and release notes.
- **Predictable releases**: Conventional Commit messages drive semantic versioning, ensuring that consumers can infer the impact of each release from its version.
- **Single source of truth**: The `main` branch, combined with the CI/CD pipeline, is the single source of truth for what is in production.

## Confirmation

This decision is confirmed by:

- `.github/workflows/ci-cd.yml` defining a `CI/CD Pipeline` workflow triggered on `push` to `main`.
- `.releaserc.json` configuring `semantic-release` with npm and GitHub plugins.
- `package.json` scripts including `"release": "semantic-release"` with no manual version bump scripts.
- Development workflow documentation in `docs/development-setup.md` describing trunk-based development and Conventional Commit usage.

## Consequences

### Positive

- **Continuous deployment**: Every passing commit on `main` can be deployed automatically.
- **Clear history**: Conventional Commit messages and GitHub Releases provide a clear, machine-readable history of changes.
- **Lower cognitive load**: Developers do not need to remember versioning rules or manual release steps.
- **Alignment with tooling**: The approach matches modern Node.js ecosystem practices and works well with TypeScript and Fastify.

### Negative

- **Discipline required**: Developers must consistently follow Conventional Commit rules. Incorrect commit types can lead to incorrect version bumps.
- **No long-lived branches**: Teams accustomed to GitFlow or long-lived feature branches must adjust their habits.
- **Automated releases only**: Manual hotfix releases are discouraged; urgent fixes still go through the same pipeline but may require prioritizing their merges to `main`.

## Related Decisions

- ADR-001: TypeScript + ES Modules – influences how the code is built and published.
- ADR-002: Fastify as web framework – defines the runtime HTTP stack that the published package exposes.

## Re-evaluation Triggers

This decision should be revisited if:

- The team can no longer maintain Conventional Commit discipline, leading to noisy or misleading version history.
- The project grows to require more complex release trains (e.g., multiple supported major versions in parallel).
- External compliance requirements mandate manual approval steps in the deployment pipeline.
