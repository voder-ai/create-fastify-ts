---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Use @fastify/env for Environment Variable Management

## Context and Problem Statement

The Fastify TypeScript template needs a robust way to manage environment variables for configuration (database URLs, API keys, feature flags, etc.) across development, staging, and production environments. We need validated, type-safe environment variable handling that prevents configuration errors and protects secrets from being committed to version control.

## Decision Drivers

- **Security**: Secrets must never be committed to git
- **Validation**: Invalid configuration should fail fast at startup
- **Type Safety**: Environment variables should have TypeScript types
- **Developer Experience**: Clear error messages for missing/invalid configuration
- **Production Ready**: Reliable configuration loading in production
- **Fastify Integration**: Should work seamlessly with Fastify as per ADR-0002
- **Defaults**: Support sensible defaults for optional configuration
- **Documentation**: Self-documenting configuration via schema

## Considered Options

- @fastify/env (Fastify environment plugin with schema validation)
- dotenv (Popular environment variable loader)
- Native Node.js --env-file (Node 20.6+ built-in)
- Zod + dotenv (Schema validation with Zod)

## Decision Outcome

Chosen option: "@fastify/env", because it provides schema-based validation with JSON Schema, automatic TypeScript types, fails fast on invalid configuration, integrates seamlessly with Fastify's plugin system, and aligns with the Fastify ecosystem while providing excellent developer experience.

### Consequences

- Good, because official Fastify plugin (maintained by Fastify team)
- Good, because schema-based validation with JSON Schema (same as request validation)
- Good, because fails fast at startup with clear error messages
- Good, because automatic TypeScript types from schema
- Good, because supports defaults and transformations
- Good, because integrates with Fastify plugin system
- Good, because self-documenting (schema shows what config is needed)
- Good, because supports .env files via dotenv under the hood
- Good, because validates types, required fields, and formats
- Good, because separates schema from .env file (schema in code, values in .env)
- Bad, because adds dependency (though focused and small)
- Bad, because JSON Schema syntax may be verbose for simple cases
- Neutral, because requires learning JSON Schema (though similar to Fastify route schemas)

### Confirmation

This decision is confirmed through:

- **package.json**: Contains `@fastify/env` as a dependency
- **App initialization**: Plugin registered early in app setup
- **Schema definition**: Environment schema defined with JSON Schema
- **.env.example**: Example environment variables documented
- **.gitignore**: Contains `.env` to prevent committing secrets
- **TypeScript**: Config accessed via `fastify.config` with full types
- **Startup**: Invalid configuration causes startup failure with clear error

## Pros and Cons of the Options

### @fastify/env (Fastify environment plugin)

Official Fastify plugin for environment variable management with validation.

- Good, because official Fastify plugin (maintained by Fastify team)
- Good, because schema-based validation using JSON Schema
- Good, because fails fast at startup with clear, actionable error messages
- Good, because automatic TypeScript types generated from schema
- Good, because supports required and optional variables
- Good, because supports defaults for optional configuration
- Good, because supports type coercion (string to number, boolean, etc.)
- Good, because integrates with Fastify plugin system
- Good, because uses dotenv internally for .env file loading
- Good, because schema serves as documentation
- Good, because consistent with Fastify's validation approach
- Good, because separates schema (code) from values (.env)
- Bad, because JSON Schema can be verbose
- Bad, because adds dependency
- Neutral, because requires understanding JSON Schema

### dotenv (Popular environment variable loader)

Widely-used library for loading .env files.

- Good, because very popular and well-known
- Good, because simple to use
- Good, because minimal configuration
- Good, because works with any framework
- Bad, because no validation (silently uses undefined if var missing)
- Bad, because no type safety (everything is string)
- Bad, because no schema or documentation
- Bad, because errors only surface at runtime when var is used
- Bad, because requires manual type conversions
- Bad, because no default values support
- Bad, because doesn't fail fast on misconfiguration

### Native Node.js --env-file (Node 20.6+ built-in)

Node.js built-in environment file loading.

- Good, because no dependencies (built into Node.js 20.6+)
- Good, because simple and lightweight
- Good, because official Node.js feature
- Bad, because no validation whatsoever
- Bad, because no type safety
- Bad, because requires Node 20.6+ (newer requirement)
- Bad, because no schema or documentation
- Bad, because no default values
- Bad, because CLI flag required (--env-file)
- Bad, because doesn't integrate with Fastify
- Bad, because silently fails on missing variables

### Zod + dotenv (Schema validation with Zod)

Combine dotenv with Zod schema validation.

- Good, because Zod provides excellent TypeScript types
- Good, because Zod has great error messages
- Good, because Zod is popular in TypeScript community
- Good, because supports complex validation logic
- Good, because supports transformations
- Bad, because not Fastify-specific (manual integration)
- Bad, because requires two dependencies (zod + dotenv)
- Bad, because different validation approach than Fastify (uses Zod vs JSON Schema)
- Bad, because manual setup and integration code
- Bad, because inconsistent with Fastify's validation patterns

## More Information

**Related Decisions:**

- ADR-0002: Fastify framework - @fastify/env integrates with Fastify plugin system
- ADR-0009: CORS opt-in - CORS example uses environment variables for allowed origins

**Environment Schema Example:**

```typescript
// src/config/env.schema.ts
export const envSchema = {
  type: 'object',
  required: ['NODE_ENV'],
  properties: {
    NODE_ENV: {
      type: 'string',
      enum: ['development', 'production', 'test'],
      default: 'development',
    },
    PORT: {
      type: 'number',
      default: 3000,
    },
    LOG_LEVEL: {
      type: 'string',
      enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      default: 'info',
    },
    DATABASE_URL: {
      type: 'string',
      // Required only in production
    },
    API_KEY: {
      type: 'string',
      // Sensitive value
    },
  },
};
```

**Plugin Registration:**

```typescript
// src/app.ts
import { FastifyPluginAsync } from 'fastify';
import fastifyEnv from '@fastify/env';
import { envSchema } from './config/env.schema.js';

const app: FastifyPluginAsync = async (fastify, opts) => {
  // Register env plugin first (before other plugins need config)
  await fastify.register(fastifyEnv, {
    schema: envSchema,
    dotenv: true, // Load from .env file
  });

  // Now fastify.config is available with typed environment variables
  fastify.log.info(`Starting in ${fastify.config.NODE_ENV} mode`);
  fastify.log.info(`Server will listen on port ${fastify.config.PORT}`);
};
```

**TypeScript Types:**

@fastify/env automatically adds types to `fastify.config`:

```typescript
// Automatically typed based on schema
const dbUrl: string = fastify.config.DATABASE_URL;
const port: number = fastify.config.PORT; // Coerced to number
```

**Environment Files:**

```bash
# .env (gitignored - contains actual secrets)
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://localhost/mydb
API_KEY=secret-key-12345

# .env.example (committed - shows required structure)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost/dbname
API_KEY=your-api-key-here
```

**Git Configuration:**

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

**Validation Benefits:**

**Fail Fast Example:**

```bash
# Missing required DATABASE_URL in production
NODE_ENV=production npm start

# Error: "DATABASE_URL" is required!
# Process exits immediately, preventing runtime errors
```

**Type Coercion Example:**

```bash
# PORT is string in .env but number in schema
PORT=3000

# Automatically converted to number
typeof fastify.config.PORT === 'number' // true
```

**Security Practices:**

1. **Never commit .env**: Always in .gitignore
2. **Commit .env.example**: Documents required variables
3. **Use secrets management**: For production (AWS Secrets Manager, etc.)
4. **Validate at startup**: Fail fast on misconfiguration
5. **Minimal defaults**: Required vars should not have defaults
6. **Document sensitive vars**: Comment which values are secrets

**Story Integration:**

- **005.0-DEVELOPER-SECURITY-HEADERS**: Uses NODE_ENV for environment detection
- **010.0-DEVELOPER-DATABASE-EXAMPLE**: Uses DATABASE_URL from config
- **011.0-DEVELOPER-AUTH-EXAMPLE**: Uses AUTH_SECRET, JWT_SECRET from config
- **012.0-DEVELOPER-API-EXAMPLE**: Uses EXTERNAL_API_KEY from config
- **013.0-DEVELOPER-DEPLOY-EXAMPLE**: Shows production environment configuration

**Advanced Features:**

```typescript
// Custom data format
properties: {
  ALLOWED_ORIGINS: {
    type: 'string',
    separator: ',', // Split comma-separated values into array
  },
}

// Conditional required (only in production)
if (process.env.NODE_ENV === 'production') {
  schema.required.push('DATABASE_URL');
}
```

**Future Considerations:**

- May add environment-specific schema variations
- Consider adding custom validators for complex formats
- May integrate with external secret management systems
- Will monitor for @fastify/env updates and new features
