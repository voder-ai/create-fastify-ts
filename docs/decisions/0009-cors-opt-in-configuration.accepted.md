---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# CORS Configuration as Opt-In with Environment-Based Recommendations

## Context and Problem Statement

APIs built from this Fastify TypeScript template may be consumed by browser-based frontend applications, which requires Cross-Origin Resource Sharing (CORS) configuration. However, not all APIs need CORS (e.g., server-to-server communication, same-origin deployments). We need to decide whether CORS should be enabled by default, opt-in, or conditional, and how to make it easy for developers to configure securely.

## Decision Drivers

- **Security by Default**: Template should not introduce security vulnerabilities
- **Production Ready**: Should encourage secure production configurations
- **Developer Experience**: Should be easy to enable when needed
- **Flexibility**: Different projects have different CORS requirements
- **Education**: Should guide developers toward secure CORS practices
- **Environment Awareness**: Development and production often have different CORS needs
- **Minimal by Default**: Don't include dependencies that may not be needed

## Considered Options

- CORS opt-in with environment-based examples
- @fastify/cors enabled by default (wide open)
- @fastify/cors enabled by default (environment-based)
- No CORS support (developers add manually)

## Decision Outcome

Chosen option: "CORS opt-in with environment-based examples", because it maintains security by default (no CORS unless explicitly enabled), provides clear documentation and examples for enabling CORS safely, and guides developers toward environment-appropriate configurations (permissive in development, restrictive in production).

### Consequences

- Good, because secure by default (CORS not enabled unless needed)
- Good, because doesn't add unnecessary dependency for projects that don't need CORS
- Good, because forces developers to think about CORS requirements
- Good, because provides clear examples for common scenarios
- Good, because encourages environment-based configuration (strict in prod, permissive in dev)
- Good, because documentation teaches secure CORS practices
- Good, because easy to enable when needed (documented pattern)
- Bad, because requires manual configuration when CORS is needed
- Bad, because one more thing developers need to set up for browser-consumed APIs
- Neutral, because adds documentation burden (need good examples)

### Confirmation

This decision is confirmed through:

- **package.json**: Does NOT include `@fastify/cors` by default
- **Documentation**: Clear guide on when and how to add CORS
- **Examples**: Environment-based CORS configuration examples provided
- **Security docs**: Explanation of CORS security implications
- **Code comments**: Template includes commented-out CORS example
- **Story 011.0**: Auth middleware example includes CORS considerations

## Pros and Cons of the Options

### CORS opt-in with environment-based examples

CORS not enabled by default, with documentation showing how to add it securely.

- Good, because secure by default (no CORS unless explicitly needed)
- Good, because reduces dependencies for projects that don't need CORS
- Good, because forces intentional decision about CORS
- Good, because documentation teaches secure practices
- Good, because examples show environment-based configuration
- Good, because guides developers to think about allowed origins
- Good, because encourages principle of least privilege
- Bad, because extra setup step for browser-consumed APIs
- Bad, because developers might copy insecure examples from internet
- Neutral, because requires good documentation to be effective

### @fastify/cors enabled by default (wide open)

CORS enabled with `origin: true` (allow all origins).

- Good, because works immediately for all browser requests
- Good, because no configuration needed
- Good, because reduces initial setup friction
- Bad, because **major security risk** (allows any website to call API)
- Bad, because encourages lazy security practices
- Bad, because hard to lock down later (breaking change)
- Bad, because adds dependency that may not be needed
- Bad, because violates "secure by default" principle

### @fastify/cors enabled by default (environment-based)

CORS enabled with different configs for dev/prod.

- Good, because convenient for development
- Good, because encourages environment-based thinking
- Good, because somewhat secure (restrictive in production)
- Bad, because assumes all projects need CORS
- Bad, because adds dependency that may not be needed
- Bad, because complex default configuration
- Bad, because requires environment variable setup from day one
- Bad, because production config still requires origin configuration

### No CORS support (developers add manually)

Don't provide CORS plugin or documentation.

- Good, because minimal dependencies
- Good, because no assumptions about project needs
- Bad, because no guidance on secure CORS implementation
- Bad, because developers will find insecure examples online
- Bad, because poor developer experience
- Bad, because doesn't teach best practices
- Bad, because template should provide guidance on common needs

## More Information

**Related Decisions:**

- ADR-0002: Fastify framework - @fastify/cors is the official CORS plugin for Fastify
- ADR-0006: @fastify/helmet security headers - CORS is another security concern

**When CORS is Needed:**

CORS is required when:

- API is consumed by browser-based frontend (React, Vue, Angular)
- Frontend and API are on different domains/ports
- Frontend makes fetch/axios requests to API

CORS is NOT needed when:

- Server-to-server communication
- Same-origin deployment (frontend and API on same domain)
- Mobile app consuming API (not subject to browser CORS)
- CLI tools or desktop apps consuming API

**Documentation Examples:**

The template will include documentation showing:

**Development-Friendly CORS:**

```typescript
// src/app.ts
import cors from '@fastify/cors';

const app: FastifyPluginAsync = async (fastify, opts) => {
  // For development: allow localhost origins
  if (process.env.NODE_ENV === 'development') {
    await fastify.register(cors, {
      origin: ['http://localhost:3000', 'http://localhost:5173'],
    });
  }
};
```

**Production-Safe CORS:**

```typescript
// Environment-based with whitelist
await fastify.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

**Simple Restrictive CORS:**

```typescript
await fastify.register(cors, {
  origin: 'https://myapp.com',
  credentials: true,
});
```

**Installation Instructions:**

```bash
npm install @fastify/cors
```

**Security Guidance:**

Documentation will explain:

- Never use `origin: true` in production
- Use specific origin whitelist
- Be careful with `credentials: true`
- Consider preflight request caching
- Understand wildcard (`*`) limitations with credentials

**Story Integration:**

- **010.0-DEVELOPER-DATABASE-EXAMPLE**: May show CORS with database API
- **011.0-DEVELOPER-AUTH-EXAMPLE**: Will show CORS with credentials for auth
- **012.0-DEVELOPER-API-EXAMPLE**: External API example may discuss CORS implications

**Template Structure:**

```typescript
// src/app.ts (commented example)
import { FastifyPluginAsync } from 'fastify';
// import cors from '@fastify/cors';

const app: FastifyPluginAsync = async (fastify, opts) => {
  // Uncomment to enable CORS (see docs/security-practices.md for guidance)
  // await fastify.register(cors, {
  //   origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
  // });
  // Your routes here
};
```

**Environment Variables:**

```bash
# .env.example
# CORS Configuration (optional - only needed if enabling @fastify/cors)
# ALLOWED_ORIGINS=https://myapp.com,https://admin.myapp.com
```

**Benefits of Opt-In Approach:**

1. **Security**: No accidental CORS vulnerabilities
2. **Intentionality**: Developers must understand CORS before enabling
3. **Flexibility**: Easy to customize for specific needs
4. **Education**: Documentation teaches secure practices
5. **Minimal**: Doesn't bloat template with unused dependencies

**Future Considerations:**

- May add CORS configuration wizard to @fastify/cli in future
- Consider adding CORS to dedicated security example story
- Monitor for common CORS misconfigurations and improve docs
- May create environment-specific CORS plugin helper
