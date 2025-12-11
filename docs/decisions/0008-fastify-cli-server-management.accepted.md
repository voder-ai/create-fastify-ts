---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Use @fastify/cli for Development and Production Server Management

## Context and Problem Statement

The Fastify TypeScript template needs a development server with hot reload functionality and a production server command. Developers need fast feedback during development (automatic restart on code changes) and a simple way to start the server in production. We need to decide on the tooling for managing the Fastify server lifecycle in both environments.

## Decision Drivers

- **Developer Experience**: Fast hot reload during development for rapid iteration
- **Production Ready**: Simple, reliable production server command
- **Fastify Integration**: Should align with Fastify best practices and ecosystem
- **TypeScript Support**: Native TypeScript support without additional compilation steps in development
- **Plugin Architecture**: Encourage Fastify plugin-based architecture (best practice)
- **Official Tooling**: Prefer official Fastify tools for consistency and support
- **Simplicity**: Minimal configuration and easy to understand
- **Debugging Support**: Should support debugging workflows

## Considered Options

- @fastify/cli (Official Fastify CLI)
- tsx (Modern TypeScript executor with watch mode)
- ts-node-dev (TypeScript development with watch)
- nodemon + tsx/ts-node

## Decision Outcome

Chosen option: "@fastify/cli", because it's the official Fastify CLI tool that provides both development hot reload (`--watch` flag) and production server management, encourages plugin-based architecture which is a Fastify best practice, includes native TypeScript support, and maintains consistency with the Fastify ecosystem.

### Consequences

- Good, because official Fastify tooling (maintained by Fastify team)
- Good, because built-in hot reload with `--watch` flag for development
- Good, because native TypeScript support without additional configuration
- Good, because single tool for both development (`fastify start --watch`) and production (`fastify start`)
- Good, because encourages plugin-based architecture (Fastify best practice)
- Good, because includes debugging support
- Good, because consistent with Fastify ecosystem and documentation
- Good, because well-documented within official Fastify documentation
- Good, because simplifies npm scripts (single `dev` and `start` command)
- Bad, because requires plugin-based app structure (app exported as Fastify plugin)
- Bad, because more opinionated about project organization
- Bad, because adds additional abstraction layer
- Neutral, because enforces best practices which may add initial learning curve

### Confirmation

This decision is confirmed through:

- **package.json**: Contains `@fastify/cli` as a devDependency
- **npm scripts**: `"dev": "fastify start --watch"` for development
- **npm scripts**: `"start": "fastify start"` for production
- **App structure**: Main app exported as Fastify plugin (e.g., `export default async function (fastify, opts) {}`)
- **Hot reload**: Server automatically restarts when TypeScript files change during development
- **TypeScript execution**: TypeScript files run directly without pre-compilation in development

## Pros and Cons of the Options

### @fastify/cli (Official Fastify CLI)

Official Fastify command-line tool for development and production.

- Good, because official Fastify tooling maintained by Fastify team
- Good, because built-in hot reload with `--watch` flag
- Good, because native TypeScript support (uses tsx internally)
- Good, because single tool for dev and production (`fastify start`)
- Good, because encourages Fastify plugin architecture (best practice)
- Good, because project scaffolding with `fastify generate`
- Good, because debugging support (`--debug` flag)
- Good, because consistent with Fastify ecosystem
- Good, because well-documented in official Fastify docs
- Good, because supports Fastify plugin options and configuration
- Bad, because requires specific app structure (plugin-based export)
- Bad, because more opinionated than standalone tools
- Bad, because adds abstraction layer over direct Fastify instantiation

### tsx (Modern TypeScript Executor)

Fast, modern TypeScript executor with watch mode.

- Good, because very fast execution (uses esbuild)
- Good, because simple and lightweight
- Good, because works with any code structure (no required patterns)
- Good, because excellent ESM support
- Good, because active development
- Good, because watch mode: `tsx watch src/index.ts`
- Good, because no configuration needed
- Bad, because not Fastify-specific
- Bad, because doesn't encourage plugin architecture
- Bad, because requires separate dev and production setups
- Bad, because newer tool (less battle-tested)

### ts-node-dev

TypeScript development server with watch mode.

- Good, because purpose-built for TypeScript development
- Good, because fast restarts with compilation cache
- Good, because popular in TypeScript community
- Bad, because no longer actively maintained (last update 2023)
- Bad, because slower than tsx or @fastify/cli
- Bad, because not Fastify-specific
- Bad, because being superseded by tsx

### nodemon + tsx/ts-node

File watcher combined with TypeScript executor.

- Good, because nodemon is mature and widely used
- Good, because highly configurable watch patterns
- Good, because can combine with any executor
- Bad, because requires two separate tools
- Bad, because more configuration needed
- Bad, because slower than integrated solutions
- Bad, because extra complexity
- Bad, because not Fastify-specific

## More Information

**Related Decisions:**

- ADR-0001: TypeScript + ESM - @fastify/cli has native TypeScript and ESM support
- ADR-0002: Fastify framework - @fastify/cli is the official CLI for Fastify

**Plugin-Based Architecture:**

@fastify/cli requires apps to be structured as Fastify plugins:

```typescript
// src/app.ts
import { FastifyPluginAsync } from 'fastify';

const app: FastifyPluginAsync = async (fastify, opts) => {
  // Register routes, plugins, etc.
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });
};

export default app;
```

**Development Workflow:**

```bash
# Development with hot reload
npm run dev
# Equivalent to: fastify start --watch --options

# Production
npm start
# Equivalent to: fastify start
```

**Configuration:**

@fastify/cli can be configured via:

- Command-line flags
- `.fastifyrc.yml` or `.fastifyrc.json`
- Package.json `fastify` field

**Benefits of Plugin Architecture:**

1. **Encapsulation**: App logic is encapsulated in a plugin
2. **Testability**: Plugins can be tested independently
3. **Reusability**: App can be imported and reused in other Fastify instances
4. **Composition**: Easy to compose multiple plugins
5. **Best Practice**: Aligns with Fastify's recommended architecture

**Template Structure:**

```
src/
  app.ts          # Main app plugin (exported)
  routes/         # Route plugins
  plugins/        # Custom plugins
```

**Debugging:**

```bash
# Start with debugger
fastify start --watch --debug

# Or with inspect
fastify start --watch --debug-host 0.0.0.0
```

**Future Considerations:**

- Template will include examples of plugin-based architecture
- Documentation will explain plugin benefits and patterns
- May add fastify generate commands for scaffolding routes/plugins
- Will leverage @fastify/cli's built-in features as they evolve
