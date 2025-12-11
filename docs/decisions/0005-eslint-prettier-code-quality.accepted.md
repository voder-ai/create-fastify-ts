---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Use ESLint and Prettier for Code Quality

## Context and Problem Statement

The Fastify TypeScript template needs code quality tooling to enforce consistent code style, catch common errors, and maintain code quality across all projects created from this template. We need to decide on linting and formatting tools that work seamlessly with TypeScript, ESM, and modern development workflows.

## Decision Drivers

- **TypeScript Support**: Must understand TypeScript syntax and types
- **ESM Compatibility**: Must work with ES Modules as per ADR-0001
- **Automation**: Must be automatable via npm scripts and git hooks
- **IDE Integration**: Must work in VS Code and other popular editors
- **Fast Execution**: Quick feedback during development
- **Team Consistency**: Enforce consistent code style across all developers
- **Configurability**: Allow customization while providing sensible defaults
- **Separation of Concerns**: Clear distinction between linting (code quality) and formatting (style)
- **Maintenance**: Active development and community support

## Considered Options

- ESLint + Prettier (separate tools)
- Biome (unified linter and formatter)
- ESLint only (with formatting rules)
- Rome (predecessor to Biome)

## Decision Outcome

Chosen option: "ESLint + Prettier (separate tools)", because it provides the best combination of mature tooling, excellent TypeScript support, clear separation between linting and formatting concerns, and widespread adoption with extensive IDE integration.

### Consequences

- Good, because ESLint provides comprehensive code quality checks beyond formatting
- Good, because Prettier handles formatting consistently and automatically
- Good, because clear separation: ESLint for code quality, Prettier for style
- Good, because excellent TypeScript support via @typescript-eslint
- Good, because ESLint 9 flat config provides simpler, more maintainable configuration
- Good, because widespread IDE support (VS Code, JetBrains, etc.)
- Good, because extensive plugin ecosystems for both tools
- Good, because automatic formatting reduces code review noise
- Good, because git hooks (via Husky) can enforce quality before commits
- Bad, because requires two separate tools and configurations
- Bad, because potential conflicts between ESLint and Prettier rules (mitigated with eslint-config-prettier)
- Neutral, because need to configure both tools, though configurations are straightforward

### Confirmation

This decision is confirmed through:

- **package.json**: Contains `eslint` and `prettier` as devDependencies
- **eslint.config.js**: ESLint 9 flat config with TypeScript parser
- **.prettierrc** or package.json: Prettier configuration
- **npm scripts**: `npm run lint` and `npm run format` commands available
- **git hooks**: Husky pre-commit hook runs linting and formatting checks
- **CI/CD**: Linting and format checks run in GitHub Actions pipeline
- **IDE**: ESLint and Prettier work in VS Code with appropriate extensions

## Pros and Cons of the Options

### ESLint + Prettier (separate tools)

Industry-standard combination for JavaScript/TypeScript projects.

- Good, because ESLint is the most mature and feature-rich linter for JavaScript/TypeScript
- Good, because Prettier is the de facto standard for code formatting
- Good, because clear separation of responsibilities (linting vs. formatting)
- Good, because ESLint 9 flat config is simpler and more maintainable than legacy configs
- Good, because @typescript-eslint provides comprehensive TypeScript support
- Good, because extensive plugin ecosystems (accessibility, security, etc.)
- Good, because excellent IDE integration and tooling support
- Good, because Prettier is opinionated, reducing configuration decisions and bikeshedding
- Good, because widely adopted, familiar to most developers
- Bad, because requires managing two separate tools
- Bad, because potential for rule conflicts (solved with eslint-config-prettier)
- Bad, because two separate configuration files to maintain

### Biome

Modern, fast, unified linter and formatter written in Rust.

- Good, because single tool handles both linting and formatting
- Good, because extremely fast execution (written in Rust)
- Good, because single configuration file
- Good, because growing community and active development
- Bad, because relatively new (less battle-tested than ESLint/Prettier)
- Bad, because smaller ecosystem (fewer plugins and rules)
- Bad, because less IDE integration compared to ESLint/Prettier
- Bad, because not as widely adopted (harder to find help/documentation)
- Bad, because may require developers to learn new tool and configuration syntax

### ESLint only (with formatting rules)

Use ESLint for both linting and formatting.

- Good, because single tool to manage
- Good, because one configuration file
- Good, because ESLint can handle basic formatting rules
- Bad, because ESLint is slower at formatting than Prettier
- Bad, because formatting rules are more configurable, leading to inconsistency
- Bad, because ESLint formatting rules are less comprehensive than Prettier
- Bad, because conflicts with Prettier if team members use Prettier plugins
- Bad, because community consensus is to separate linting from formatting

### Rome (predecessor to Biome)

Rome was the predecessor to Biome (project archived in 2023).

- Good, because similar benefits to Biome (unified, fast)
- Bad, because project is archived and no longer maintained
- Bad, because superseded by Biome
- Bad, because should not use unmaintained tooling

## More Information

**Related Decisions:**

- ADR-0001: TypeScript + ESM - ESLint configuration uses @typescript-eslint/parser for TypeScript support
- ADR-0002: Fastify framework - ESLint rules can catch Fastify-specific anti-patterns

**Configuration Approach:**

- **ESLint**: Uses ESLint 9 flat config (`eslint.config.js`) with TypeScript parser
- **Prettier**: Minimal configuration, relying on Prettier's opinionated defaults
- **Integration**: No rule conflicts - ESLint focuses on code quality, Prettier on formatting

**Workflow Integration:**

- Pre-commit hooks run `lint` and `format:check` via Husky
- CI/CD pipeline includes `lint` and `format:check` as quality gates
- Developers can run `npm run lint:fix` and `npm run format` to auto-fix issues

**Future Considerations:**

- May add ESLint plugins for accessibility (eslint-plugin-jsx-a11y) if template expands to include frontend examples
- May add Prettier plugins for specific formatting needs (e.g., import sorting)
- Will monitor Biome's maturity and ecosystem growth as potential future alternative
