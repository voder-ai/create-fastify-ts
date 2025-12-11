---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Use npm as Package Manager

## Context and Problem Statement

The Fastify TypeScript template needs a package manager for installing dependencies, managing lockfiles, and running scripts. The choice of package manager affects template initialization, CI/CD performance, disk space usage, and developer experience. We need to decide which package manager to use as the default and recommended option for projects created from this template.

## Decision Drivers

- **Ubiquity**: Available by default with Node.js installation
- **Compatibility**: Works with all npm packages and registries
- **Template Distribution**: Ease of template initialization via `npm init`
- **CI/CD Performance**: Fast dependency installation in pipelines
- **Lockfile Management**: Reliable dependency locking
- **Developer Familiarity**: Most developers know the tool
- **Workspace Support**: If template expands to monorepo structure
- **Maintenance Burden**: Minimal template-specific configuration
- **Documentation**: Clear, widely available resources

## Considered Options

- npm (Node.js default package manager)
- pnpm (Fast, disk-efficient package manager)
- yarn (Facebook's package manager)
- bun (All-in-one JavaScript runtime and package manager)

## Decision Outcome

Chosen option: "npm", because it's included with Node.js by default (zero installation required), provides the best compatibility and ubiquity, supports template initialization via `npm init`, has improved significantly in recent versions (speed, lockfile reliability), and is familiar to all Node.js developers regardless of experience level.

### Consequences

- Good, because included with Node.js (no additional installation)
- Good, because universal compatibility (every Node.js developer has npm)
- Good, because template initialization via `npm init @voder-ai/fastify-ts`
- Good, because npm 7+ has workspaces support for future monorepo needs
- Good, because npm 7+ has significantly improved performance
- Good, because package-lock.json is widely understood
- Good, because extensive documentation and community resources
- Good, because CI/CD caching strategies well-established
- Good, because semantic-release and most tools default to npm
- Bad, because slower than pnpm for large dependency trees
- Bad, because uses more disk space than pnpm (no content-addressable storage)
- Neutral, because perceived as "slower" despite recent improvements

### Confirmation

This decision is confirmed through:

- **package-lock.json**: npm lockfile present in repository
- **package.json**: Uses npm-compatible scripts syntax
- **.npmrc**: npm configuration file (if needed)
- **CI/CD**: GitHub Actions uses `npm ci` for installation
- **Documentation**: All commands use `npm` syntax
- **Template init**: Distributed via `npm init @voder-ai/fastify-ts`
- **.gitignore**: Ignores `node_modules/` (npm convention)

## Pros and Cons of the Options

### npm (Node.js default package manager)

Built-in package manager included with Node.js.

- Good, because included with every Node.js installation (zero setup)
- Good, because universal - all Node.js developers have it
- Good, because template initialization via `npm init` or `npm create`
- Good, because npm 7+ has workspaces for monorepo support
- Good, because npm 8+ has significantly improved performance
- Good, because package-lock.json is standard and widely understood
- Good, because extensive documentation and community knowledge
- Good, because semantic-release, Husky, and most tools default to npm
- Good, because CI/CD caching well-established (`npm ci`)
- Good, because no additional tool to install or learn
- Bad, because slower than pnpm for large projects (still acceptable for most use cases)
- Bad, because uses more disk space than pnpm (duplicates packages)
- Bad, because perception of being "slow" (less true with npm 8+)

### pnpm (Fast, disk-efficient package manager)

Performant package manager with content-addressable storage.

- Good, because very fast installation (parallel, efficient caching)
- Good, because disk-efficient (content-addressable store, hard links)
- Good, because strict dependency resolution (prevents phantom dependencies)
- Good, because built-in monorepo support
- Good, because growing adoption in modern projects
- Bad, because **requires separate installation** (not included with Node.js)
- Bad, because less familiar to many developers
- Bad, because some tools may not support pnpm out of the box
- Bad, because pnpm-lock.yaml is less familiar
- Bad, because template initialization more complex (`npx create` vs `npm init`)
- Bad, because adds barrier to entry for template users

### yarn (Facebook's package manager)

Popular alternative package manager from Facebook.

- Good, because faster than npm (historically)
- Good, because familiar to many developers (widely adopted)
- Good, because yarn.lock is well-understood
- Good, because good workspace support (yarn workspaces)
- Bad, because requires separate installation
- Bad, because Yarn 1 vs Yarn 2+ (Berry) creates confusion
- Bad, because Yarn 2+ (Berry) has breaking changes and different philosophy
- Bad, because npm has caught up in performance (npm 8+)
- Bad, because semantic-release defaults to npm
- Bad, because template initialization more complex

### bun (All-in-one JavaScript runtime)

New JavaScript runtime with built-in package manager.

- Good, because extremely fast (written in Zig)
- Good, because all-in-one (runtime + package manager + bundler)
- Good, because growing excitement in community
- Bad, because **very new and experimental** (not production-ready)
- Bad, because requires separate installation (replaces Node.js)
- Bad, because limited ecosystem compatibility
- Bad, because not yet stable for production use
- Bad, because drastically different from Node.js ecosystem
- Bad, because would require users to switch entire runtime

## More Information

**Related Decisions:**

- ADR-0003: CI/CD with semantic-release - semantic-release uses npm by default for publishing

**npm Performance Improvements:**

npm has improved significantly in recent versions:

- **npm 7** (2020): Workspaces support, improved dependency resolution
- **npm 8** (2021): Performance improvements, better caching
- **npm 9** (2022): Further speed improvements
- **npm 10** (2023): Continued optimizations

**Template Initialization:**

npm enables simple template initialization:

```bash
# Using npm init (recommended)
npm init @voder-ai/fastify-ts my-api

# Or using npm create
npm create @voder-ai/fastify-ts my-api

# Or using npx
npx @voder-ai/create-fastify-ts my-api
```

**CI/CD Usage:**

```yaml
# .github/workflows/ci-cd.yml
- name: Install dependencies
  run: npm ci # Clean install from lockfile
```

**Lockfile Management:**

```bash
# Install dependencies
npm install

# Generates/updates package-lock.json
# Commit package-lock.json to version control

# CI uses clean install
npm ci  # Installs exact versions from lockfile
```

**Configuration:**

```ini
# .npmrc (optional)
save-exact=true        # Save exact versions (no ^ or ~)
engine-strict=true     # Enforce Node.js version in package.json
```

**Developer Experience:**

All npm commands are standard and familiar:

```bash
npm install           # Install dependencies
npm run dev          # Run dev script
npm test             # Run tests
npm run build        # Build for production
npm start            # Start production server
```

**Future Considerations:**

If the template needs to support other package managers in the future:

- Can detect package manager via `process.env.npm_config_user_agent`
- Can provide multiple lockfiles (package-lock.json + pnpm-lock.yaml)
- Can document alternative package manager usage
- Primary support remains npm for maximum compatibility

**Workspace Support:**

If template expands to monorepo:

```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

npm workspaces provide sufficient monorepo support for most use cases.

**Package Publishing:**

The template will be published to npm registry:

```bash
# Publishing (handled by semantic-release)
npm publish

# Template usage
npm init @voder-ai/template-fastify-ts
```

**Why Not Alternatives:**

- **pnpm**: Excellent tool, but adds installation barrier for template users
- **yarn**: Split ecosystem (v1 vs v2+), npm has caught up in features
- **bun**: Too new, not production-ready, would require runtime switch

**Developer Freedom:**

While npm is the default and documented option, developers can still use other package managers with the generated projects:

- Delete package-lock.json
- Use their preferred package manager
- Template doesn't enforce npm usage after initialization

However, all documentation, examples, and scripts assume npm for consistency and simplicity.
