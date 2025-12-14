---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Use @fastify/helmet for Security Headers

## Context and Problem Statement

The Fastify TypeScript template must be production-ready and secure by default. Web applications are vulnerable to various attacks that can be mitigated through proper HTTP security headers. We need a solution to automatically configure security headers that protect against common web vulnerabilities (XSS, clickjacking, MIME sniffing, etc.) while maintaining ease of use for developers.

## Decision Drivers

- **Security by Default**: Template must be secure out of the box without additional configuration
- **Production Ready**: Must meet security best practices for production deployments
- **Comprehensive Protection**: Should address OWASP top 10 and common web vulnerabilities
- **Fastify Integration**: Must work seamlessly with Fastify as per ADR-0002
- **Ease of Use**: Simple to configure and customize when needed
- **Maintainability**: Well-maintained plugin with regular security updates
- **Standards Compliance**: Follow industry-standard security header recommendations
- **Developer Experience**: Clear documentation and sensible defaults

## Considered Options

- @fastify/helmet
- @fastify/sensible (with custom security headers)
- Custom middleware for security headers
- Manual header configuration

## Decision Outcome

Chosen option: "@fastify/helmet", because it provides comprehensive, battle-tested security header protection specifically designed for Fastify, with sensible defaults that make the template secure out of the box while remaining configurable for specific use cases.

### Consequences

- Good, because sets 11+ security headers automatically with one plugin registration
- Good, because specifically designed for Fastify (official Fastify plugin)
- Good, because based on helmet.js (battle-tested, widely trusted in Node.js ecosystem)
- Good, because protects against common vulnerabilities: XSS, clickjacking, MIME sniffing
- Good, because includes Content Security Policy (CSP), HSTS, X-Frame-Options, etc.
- Good, because configurable - can customize individual headers when needed
- Good, because regularly updated to address new security threats
- Good, because well-documented with clear examples
- Good, because zero configuration needed for sensible defaults
- Bad, because adds dependency (though small and focused)
- Bad, because may require customization for apps with specific CSP needs
- Neutral, because opinionated defaults (good for security, may need tweaking for specific use cases)

### Confirmation

This decision is confirmed through:

- **package.json**: Contains `@fastify/helmet` as a dependency
- **Server initialization**: Helmet plugin registered with `fastify.register(helmet)`
- **HTTP responses**: Security headers present in all HTTP responses
- **Tests**: Integration test in `src/generated-project-security-headers.test.ts` verifies security headers are set correctly on the `/health` endpoint of a generated project
- **Documentation**: Security documentation explains which headers are set and why
- **Customization**: Template includes examples of customizing helmet configuration

## Pros and Cons of the Options

### @fastify/helmet

Official Fastify plugin for security headers based on helmet.js.

- Good, because official Fastify plugin (maintained by Fastify team)
- Good, because comprehensive security header coverage (11+ headers)
- Good, because based on helmet.js (proven security tool with years of production use)
- Good, because protects against OWASP top 10 vulnerabilities related to headers
- Good, because includes: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, X-DNS-Prefetch-Control, X-Download-Options, X-Permitted-Cross-Domain-Policies, Referrer-Policy, etc.
- Good, because zero-config sensible defaults
- Good, because highly configurable for specific needs
- Good, because TypeScript types included
- Good, because excellent documentation
- Good, because actively maintained with security updates
- Bad, because adds ~50KB dependency
- Bad, because strict CSP defaults may break some frontend apps (requires customization)

### @fastify/sensible (with custom security headers)

General utilities plugin with some security helpers.

- Good, because provides multiple utilities beyond security
- Good, because includes httpErrors, assert, and async helpers
- Good, because reduces boilerplate in route handlers
- Bad, because **does not provide comprehensive security headers**
- Bad, because security is not its primary focus
- Bad, because would require manual header configuration alongside it
- Bad, because mixing concerns (utilities + partial security)
- Bad, because incomplete security solution for production-ready template

### Custom middleware for security headers

Write custom Fastify middleware to set security headers.

- Good, because no external dependencies
- Good, because complete control over implementation
- Good, because can customize to exact needs
- Bad, because requires maintaining security knowledge in-house
- Bad, because easy to miss important headers or misconfigure
- Bad, because need to stay updated on security best practices manually
- Bad, because reinventing well-tested solution
- Bad, because increased maintenance burden
- Bad, because error-prone (security is hard to get right)

### Manual header configuration

Manually set headers in each route or via hooks.

- Good, because no dependencies
- Good, because explicit control
- Bad, because extremely error-prone and repetitive
- Bad, because easy to forget headers on some routes
- Bad, because difficult to maintain consistency
- Bad, because no centralized security configuration
- Bad, because requires deep security knowledge
- Bad, because violates DRY principle

## More Information

**Related Decisions:**

- ADR-0002: Fastify framework - @fastify/helmet is the official Fastify security headers solution

**Security Headers Configured:**

@fastify/helmet sets the following headers by default:

- **Content-Security-Policy**: Helps prevent XSS attacks
- **X-DNS-Prefetch-Control**: Controls browser DNS prefetching
- **Expect-CT**: Certificate Transparency
- **X-Frame-Options**: Prevents clickjacking
- **Strict-Transport-Security**: Forces HTTPS connections
- **X-Download-Options**: Prevents IE from executing downloads in site context
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Origin-Agent-Cluster**: Isolates agent clusters
- **X-Permitted-Cross-Domain-Policies**: Controls Adobe Flash/PDF cross-domain
- **Referrer-Policy**: Controls referrer information
- **X-XSS-Protection**: Legacy XSS protection (for older browsers)

**Customization Example:**

```typescript
await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});
```

**Production Readiness:**

Using @fastify/helmet is a key component of the template's "production-ready" and "secure by default" goals as outlined in the story map. It ensures that APIs created from this template start with strong security posture without requiring developers to be security experts.

**Future Considerations:**

- Monitor helmet.js updates for new security recommendations
- Provide documentation on customizing CSP for specific frontend frameworks
- Consider adding @fastify/cors for CORS security alongside helmet
- May add @fastify/rate-limit for additional production security
