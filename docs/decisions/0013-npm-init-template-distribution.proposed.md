---
status: proposed
date: 2025-12-11
decision-makers: Development Team
---

# Use npm init for Template Distribution and Initialization

## Context and Problem Statement

Developers need a fast, familiar way to initialize new projects from the Fastify TypeScript template. The initialization mechanism affects developer experience, template discoverability, and adoption. We need to decide how developers will scaffold new projects: should they use `npm init`, `git clone`, a custom CLI, or another approach?

## Decision Drivers

- **Developer Familiarity**: Most Node.js developers are familiar with `npm init` patterns
- **Zero Installation**: No need to install a separate CLI tool before creating a project
- **Template Updates**: Developers automatically get the latest template version
- **Discoverability**: Standard npm init pattern makes template easy to find and share
- **Simplicity**: Minimal steps from discovery to working project
- **npm Registry Integration**: Leverage existing package distribution infrastructure
- **Consistency with Ecosystem**: Follow patterns used by popular frameworks (Vite, Next.js, etc.)

## Considered Options

- npm init @voder-ai/fastify-ts (npm initializer pattern)
- git clone + manual setup
- Custom CLI tool (@voder-ai/create-fastify-ts)
- npx create-\* pattern (npx @voder-ai/create-fastify-ts)

## Decision Outcome

Chosen option: "npm init @voder-ai/fastify-ts", because it provides the best balance of developer familiarity, zero installation requirements, automatic template updates, and integration with the npm ecosystem. This pattern is used by many popular frameworks and tools, making it immediately recognizable to Node.js developers.

### Consequences

- Good, because developers can use `npm init @voder-ai/fastify-ts my-api` without installing anything first
- Good, because pattern is familiar to Node.js developers (used by Vite, etc.)
- Good, because template is always up-to-date (fetched from npm registry on each use)
- Good, because discoverable through npm search and documentation
- Good, because works with npm 6+, included with all modern Node.js versions
- Good, because supports interactive prompts for project name and configuration
- Good, because integrates seamlessly with npm registry and versioning
- Bad, because requires publishing template package to npm registry
- Bad, because template size affects download time (mitigated by keeping template minimal)
- Neutral, because alternative syntaxes also work: `npm create @voder-ai/fastify-ts`, `npx @voder-ai/create-fastify-ts`

### Confirmation

This decision will be confirmed when:

- Template package is published to npm as `@voder-ai/create-fastify-ts`
- Developers can run `npm init @voder-ai/fastify-ts my-api` successfully
- Generated project includes all necessary files and dependencies
- Documentation shows the npm init command as primary installation method
- Template version is automatically tracked in generated package.json

## Pros and Cons of the Options

### npm init @voder-ai/fastify-ts (npm initializer pattern)

Standard npm initializer pattern that maps to `@voder-ai/create-fastify-ts` package.

- Good, because zero installation required (npm is already installed with Node.js)
- Good, because familiar to all Node.js developers
- Good, because template is always latest version from npm registry
- Good, because works consistently across platforms (Windows, macOS, Linux)
- Good, because supports interactive prompts via command-line arguments or prompts
- Good, because simple one-command initialization: `npm init @voder-ai/fastify-ts my-api`
- Good, because leverages npm registry for distribution and versioning
- Good, because used by popular tools (Vite: `npm init vite`, Astro: `npm init astro`)
- Bad, because requires publishing and maintaining npm package
- Bad, because template size affects initial download time
- Bad, because requires npm registry to be available

### git clone + manual setup

Traditional approach: clone repository, remove .git, run npm install.

- Good, because no npm package publishing required
- Good, because full control over template repository
- Good, because works even if npm registry is down
- Bad, because multiple manual steps (clone, remove .git, rename, npm install)
- Bad, because no automatic template version updates
- Bad, because higher barrier to entry for new users
- Bad, because template is not discoverable through npm
- Bad, because requires git to be installed
- Bad, because clones entire git history initially
- Bad, because no way to parameterize project setup (must manually edit files)

### Custom CLI tool (@voder-ai/create-fastify-ts)

Standalone CLI tool installed globally or used via npx.

- Good, because full control over initialization experience
- Good, because can implement complex prompts and validation
- Good, because consistent naming with other create-\* tools
- Bad, because requires publishing and maintaining separate package
- Bad, because one more tool to maintain and version
- Bad, because requires installation step (`npm install -g`) or npx
- Bad, because adds complexity vs. standard npm init pattern
- Bad, because less discoverable than npm init pattern
- Neutral, because npx allows usage without installation: `npx @voder-ai/create-fastify-ts my-api`

### npx create-\* pattern

Alternative syntax that uses npx to run create package.

- Good, because no installation required when using npx
- Good, because familiar create-\* naming convention
- Good, because works with npm init as alias
- Neutral, because functionally equivalent to npm init @scope/template pattern
- Neutral, because different syntax preference (some prefer `npx create-*`, others prefer `npm init`)
- Note: This is actually the same implementation as npm init pattern, just different command syntax

## More Information

**npm init Pattern Details:**

When a developer runs:

```bash
npm init @voder-ai/fastify-ts my-api
```

npm automatically:

1. Resolves to package `@voder-ai/create-fastify-ts`
2. Downloads the latest version from npm registry
3. Executes the package's `bin` script
4. Passes `my-api` as argument

**Implementation Requirements:**

1. **Package Structure:**

   ```
   @voder-ai/create-fastify-ts/
   ├── package.json (with "bin" field)
   ├── index.js (template initialization logic)
   ├── template/ (files to copy to new project)
   └── README.md
   ```

2. **package.json Configuration:**

   ```json
   {
     "name": "@voder-ai/create-fastify-ts",
     "bin": {
       "create-fastify-ts": "./index.js"
     }
   }
   ```

3. **Initialization Script:**
   - Prompts for project name (if not provided)
   - Copies template files to new directory
   - Initializes git repository
   - Runs npm install
   - Displays success message with next steps

**Alternative Command Syntaxes:**

All of these work equivalently:

```bash
npm init @voder-ai/fastify-ts my-api
npm create @voder-ai/fastify-ts my-api
npx @voder-ai/create-fastify-ts my-api
```

**Template Versioning:**

- Template package version tracks template changes
- Generated projects can reference template version used
- Template can be pinned to specific version if needed:
  ```bash
  npm init @voder-ai/fastify-ts@1.2.3 my-api
  ```

**Related Decisions:**

- ADR-0011: npm as package manager - ensures consistency with npm-based ecosystem
- ADR-0003: Continuous deployment with semantic-release - can automate template package releases

**Examples from Ecosystem:**

- Vite: `npm init vite my-app`
- Astro: `npm init astro my-site`
- SvelteKit: `npm init svelte my-app`
- Remix: `npx create-remix my-app`

**Documentation Requirements:**

Primary installation command in README:

```markdown
## Quick Start

npm init @voder-ai/fastify-ts my-api
cd my-api
npm install
npm run dev
```

**Future Considerations:**

- Could add interactive prompts for template options (database choice, auth, etc.)
- Could support multiple template variants (minimal, full-featured, etc.)
- Could add telemetry to understand template usage patterns
- Template initializer package can be versioned separately from template content
