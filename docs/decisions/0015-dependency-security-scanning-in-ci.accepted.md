---
status: accepted
date: 2025-12-14
decision-makers: Development Team
---

# Dependency Security Scanning in CI/CD Pipeline

## Context and Problem Statement

The `create-fastify-ts` template relies on npm packages for both runtime behavior and development tooling. While developers can run `npm audit` locally, the CI/CD pipeline previously did not enforce any automated dependency vulnerability checks. This created a gap between local practices and the guarantees provided by the trunk-based continuous deployment pipeline described in ADR-0003.

To treat security as a first-class concern, we need:

- An automated dependency vulnerability check that runs on every push to `main`.
- Clear, deterministic failure conditions so that high-severity issues block releases.
- A solution that integrates cleanly with the existing single, unified CI/CD workflow without introducing manual gates.

## Decision

We will:

1. **Run `npm audit` in CI as a blocking quality gate**
   - Add a step to the `CI/CD Pipeline` workflow that runs:
     - `npm audit --production --audit-level=high`
   - This step executes after `npm ci` and before other quality gates (lint, type-check, build, tests, formatting).
   - Any reported **high severity** production vulnerability causes the pipeline to fail and prevents semantic-release from publishing a new version.

2. **Use `dry-aged-deps` as a non-blocking freshness signal**
   - Add a follow-up step that runs `npx dry-aged-deps --format=table` with `continue-on-error: true`.
   - This step reports safe, mature upgrade opportunities in the workflow logs without blocking the pipeline.
   - Maintainers can consult the CI output when planning dependency updates.

This decision aligns CI behavior with our documented security practices while preserving fast, automated continuous deployment.

## Rationale

- **Security as a quality gate**: By running `npm audit --production --audit-level=high` in CI, we ensure that any high-severity vulnerability in runtime dependencies (or their transitive tree) blocks releases until addressed.
- **Production focus**: Using `--production` limits the audit to dependencies that affect runtime behavior, avoiding noise from purely development-time tooling.
- **Severity threshold**: Failing only on `--audit-level=high` balances security with practicality, reducing spurious failures from low/medium issues while still catching serious problems automatically.
- **Non-blocking freshness reports**: `dry-aged-deps` is valuable for highlighting mature, safe updates but is not itself a security scanner. Running it as a non-blocking step keeps the pipeline green while still surfacing actionable maintenance work in logs.
- **Single unified workflow**: Both steps are added to the existing `.github/workflows/ci-cd.yml` pipeline, preserving the single-workflow, no-manual-gates design from ADR-0003.

## Consequences

### Positive

- **Automated enforcement**: High-severity production vulnerabilities now automatically fail CI, stopping new releases until fixed.
- **Aligned with documentation**: Brings the pipeline in line with the security expectations in `docs/development-setup.md` and `docs/security-practices.md`.
- **Actionable insights**: CI logs from `dry-aged-deps` provide maintainers with a clear view of safe, mature upgrades, supporting proactive dependency hygiene.
- **No manual gates**: The audit and freshness steps run automatically on every push to `main`, preserving fully automated continuous deployment.

### Negative

- **Potential transient failures**: Newly disclosed vulnerabilities with no immediate patch may temporarily block releases until a mitigation strategy is chosen.
- **Audit noise risk**: Although limited to `--production` and `--audit-level=high`, some findings may require manual triage to determine real impact.

## Implementation

- **Workflow changes**
  - In `.github/workflows/ci-cd.yml`:
    - After the `Install dependencies` step (`npm ci`), add:

      ```yaml
      - name: Dependency vulnerability audit
        run: npm audit --production --audit-level=high
      ```

    - After `Check formatting` and before `Release`, add:

      ```yaml
      - name: Dependency freshness report (non-blocking)
        continue-on-error: true
        run: npx dry-aged-deps --format=table
      ```

- **Scope**
  - `npm audit` runs against the current lockfile (`package-lock.json`) to ensure that the exact dependency graph used in CI is evaluated.
  - Only production dependencies are included in the audit to focus on runtime risk.

## Alternatives Considered

- **Running `npm audit` locally only**
  - Rejected because it relies on manual discipline and provides no guarantee that `main` is free of known high-severity issues.

- **Using third-party scanners (Snyk, osv-scanner, etc.)**
  - Deferred for now to avoid additional accounts, configuration, or runtime overhead.
  - May be revisited in a future ADR if project requirements expand.

- **Blocking CI on all severities**
  - Rejected as too noisy for the current scale; would risk frequent false positives and slow down delivery.

## Related Decisions

- ADR-0003: Continuous deployment with semantic-release and trunk-based development.
- ADR-0011: Use npm as the package manager (enables `npm audit` in CI).

## Re-evaluation Triggers

This decision should be revisited if:

- The volume or nature of `npm audit` findings makes `--audit-level=high` impractical (e.g., many false positives or unpatchable advisories).
- The project adopts an additional security scanner that overlaps significantly with `npm audit`.
- The dependency ecosystem or npm audit behavior changes in ways that materially affect pipeline reliability.
