---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Require Node.js 22.x as Minimum Runtime Version

## Context and Problem Statement

The Fastify TypeScript template needs to specify a minimum Node.js runtime version that balances modern features, LTS support, and broad ecosystem compatibility. The minimum version affects what language features are available, deployment platform compatibility, and the template's production support lifecycle.

## Decision Drivers

- **LTS Support**: Minimum version should be in active or maintenance LTS to ensure security updates
- **ESM Support**: Must have stable ES Modules support (required by ADR-0001)
- **Modern Features**: Access to modern JavaScript features and performance improvements
- **Ecosystem Compatibility**: Dependencies must support the chosen version
- **Deployment Platforms**: Common hosting platforms must support the version
- **Support Lifecycle**: Avoid versions approaching end-of-life
- **Developer Experience**: Balance modern features with practical availability
- **CI/CD Compatibility**: GitHub Actions and other CI systems must support the version

## Considered Options

- Node.js 18.x LTS (Hydrogen)
- Node.js 20.x LTS (Iron)
- Node.js 22.x LTS (Jod)
- Node.js 24.x LTS (Krypton)

## Decision Outcome

Chosen option: "Node.js 22.x LTS (Jod)", because it provides stable ESM support, modern JavaScript features, is currently in Maintenance LTS phase (production-ready), has broad ecosystem support, and has a reasonable support lifecycle remaining. This version is old enough to be well-tested but new enough to avoid imminent end-of-life concerns.

### Consequences

- Good, because Node.js 22.x is in Maintenance LTS phase (stable and production-ready)
- Good, because stable ES Modules support aligns with ADR-0001
- Good, because modern async/await patterns and performance improvements
- Good, because broad npm ecosystem compatibility (packages support Node.js 22)
- Good, because all major hosting platforms support Node.js 22 (Vercel, Railway, AWS, etc.)
- Good, because GitHub Actions and CI systems have Node.js 22 available
- Good, because avoids imminent EOL (unlike Node.js 20 which ends Nov 2025)
- Good, because supported by all template dependencies (Fastify, Vitest, TypeScript tooling)
- Bad, because slightly older than latest LTS (Node.js 24 is Active LTS)
- Bad, because developers on Node.js 18 or 20 must upgrade
- Neutral, because most developers on LTS are already on 22 or can easily upgrade

### Confirmation

This decision is confirmed through:

- **package.json**: Should include `"engines": { "node": ">=22.0.0" }` field
- **README.md**: Must document "Requires Node.js 22 or newer"
- **.nvmrc** (if added): Should specify Node.js 22.x version
- **CI/CD workflows**: GitHub Actions must use Node.js 22.x in test matrix
- **Documentation**: Development setup guide references Node.js 22 requirement
- **Runtime checks**: Template initialization can optionally warn on unsupported versions

## Pros and Cons of the Options

### Node.js 18.x LTS (Hydrogen)

Released April 2022, entered Maintenance LTS October 2023, **End-of-Life March 2025**.

- Good, because widest compatibility (oldest still-supported LTS at decision time)
- Good, because stable ESM support
- Good, because most CI/CD systems support it
- Bad, because **already reached end-of-life** (March 2025 - before this decision date)
- Bad, because no security updates or bug fixes after EOL
- Bad, because using EOL runtime is a security risk
- Bad, because missing performance improvements from newer versions

**Conclusion**: Not viable - already end-of-life.

### Node.js 20.x LTS (Iron)

Released April 2023, entered Active LTS October 2023, Maintenance LTS since April 2024, **End-of-Life November 2025**.

- Good, because currently in Maintenance LTS (as of December 2025)
- Good, because stable ESM support
- Good, because broad ecosystem compatibility
- Good, because includes `--env-file` flag (though ADR-0010 chose not to use it)
- Good, because most hosting platforms support it
- Bad, because **End-of-Life in November 2025** (imminent - possibly already EOL)
- Bad, because security updates ending very soon
- Bad, because new projects would immediately face migration pressure
- Bad, because template would need version bump within months

**Conclusion**: Too close to EOL - not a good foundation for new projects.

### Node.js 22.x LTS (Jod)

Released April 2024, entered Active LTS October 2024, **Maintenance LTS until October 2027**.

- Good, because Maintenance LTS with support until October 2027
- Good, because 2+ years of support remaining from decision date
- Good, because mature and production-tested (in LTS for several months)
- Good, because stable ESM support with performance improvements
- Good, because supported by all major dependencies (Fastify 5.x, Vitest 4.x, etc.)
- Good, because all major hosting platforms support Node.js 22
- Good, because GitHub Actions has Node.js 22 available
- Good, because avoids EOL concerns for reasonable timeframe
- Good, because ecosystem has had time to adopt and test
- Bad, because slightly older than latest Active LTS (Node.js 24)
- Bad, because excludes developers still on Node.js 18 or 20
- Neutral, because balance between stability and modernity

**Conclusion**: Optimal choice - mature LTS with good support timeline.

### Node.js 24.x LTS (Krypton)

Released May 2025, entered Active LTS immediately (November 2025), **Maintenance LTS until May 2028**.

- Good, because Active LTS (current recommended version)
- Good, because longest support timeline (until May 2028)
- Good, because latest features and performance improvements
- Good, because stable ESM support
- Bad, because very new (released only ~7 months ago as of decision date)
- Bad, because ecosystem may not have fully adopted yet
- Bad, because some dependencies might not explicitly support it yet
- Bad, because less battle-tested in production
- Bad, because may have undiscovered issues
- Bad, because narrower developer base currently on this version
- Neutral, because cutting-edge may not be necessary for template

**Conclusion**: Too new - prefer more mature LTS for template foundation.

## More Information

**Node.js Release Schedule Reference:**

- Node.js 18: EOL March 2025 (already ended)
- Node.js 20: EOL November 2025 (imminent)
- Node.js 22: EOL October 2027 (2+ years remaining)
- Node.js 24: EOL May 2028 (2.5+ years remaining)

Source: https://nodejs.org/en/about/previous-releases (accessed December 2025)

**Related Decisions:**

- ADR-0001: TypeScript and ESM - requires Node.js with stable ESM support
- ADR-0010: @fastify/env - mentions but rejects Node.js 20.6+ `--env-file` feature

**Reassessment Criteria:**

- **Time-based**: Review when Node.js 22 enters final 6 months before EOL (April 2027)
- **Event-based**: When Node.js 26 or 28 reaches Active LTS and has 6+ months of ecosystem adoption
- **Technology-based**: If critical dependency drops Node.js 22 support
- **Security-based**: If Node.js 22 has critical security issues that can't be patched

**Upgrade Path:**
When reassessment triggers, likely upgrade to Node.js 24 or 26 depending on:

- Ecosystem maturity at that time
- LTS support timeline remaining
- Breaking changes in newer versions
- Template dependencies' version support
