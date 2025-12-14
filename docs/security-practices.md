# Contributor Security Practices

This document expands on the high-level security posture described in `docs/development-setup.md` and clarifies expectations for contributors as the service evolves.

## Current Security Posture

At this stage of the project:

- The service exposes only a `GET /health` endpoint.
- There is no authentication or authorization.
- The service does not persist data to databases or external storage.
- Dependencies are managed via `package.json` and `package-lock.json`, and basic vulnerability checks are available through npm tooling.

This means the current security risk surface is intentionally small, but it will grow as we introduce file uploads, processing logic, and any form of persistent storage.

## Day-to-Day Security Practices

When working on this repository, contributors are expected to:

- **Protect secrets**
  - Never commit secrets or sensitive data (API keys, access tokens, private certificates, passwords).
  - Use environment variables or local configuration files that are not tracked by git.

- **Be cautious with dependencies**
  - Prefer well-maintained, widely used packages with clear licensing.
  - Avoid introducing obviously unmaintained or deprecated libraries.
  - Keep dependency updates small and understandable; review `package-lock.json` changes when they arise.

- **Run basic vulnerability checks**
  - Use `npm audit --production` when working on dependencies or build tooling to identify known vulnerabilities.
  - Treat high and critical severity issues as defects that should be addressed promptly (by upgrading, replacing, or otherwise mitigating the affected dependency).

- **Validate external input**
  - Assume all client input is untrusted.
  - Validate HTTP request parameters, headers, and bodies, especially for endpoints that accept files or structured JSON.
  - Prefer framework-level validation (e.g., Fastify schemas) where possible, and add tests that cover invalid input and boundary conditions.

- **Respond to security signals**
  - Treat security warnings from npm, GitHub (e.g., Dependabot), or other tools as actionable work, not background noise.
  - Document any known security limitations or trade-offs in user-facing documentation when they are relevant to consumers.

## Future Security Enhancements

The CI/CD pipeline currently focuses on correctness (build, test, lint, type-check, formatting) and release automation, and also includes dedicated dependency security scanning.

Specifically:

- A blocking dependency vulnerability audit step using `npm audit --production --audit-level=high` runs in CI and will fail the pipeline on high (or higher) severity issues.
- A non-blocking `dry-aged-deps` freshness report runs alongside the main checks to highlight outdated dependencies without breaking the build.

For detailed rationale and design, see ADR `docs/decisions/0015-dependency-security-scanning-in-ci.accepted.md`.

As the project matures, we expect to:

- Introduce additional automated security checks into the CI/CD pipeline (for example, broader static analysis tools).
- Document any authentication, authorization, and rate-limiting behavior once it is implemented.
- Clarify security guarantees and limitations for API consumers in user-facing documentation.

Any new security tooling added to the pipeline should respect the existing goals:

- Fast feedback for contributors.
- Reliable, deterministic checks.
- Clear failure messages that make it easy to understand and fix issues.
