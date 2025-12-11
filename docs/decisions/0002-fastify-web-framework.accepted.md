---
status: accepted
date: 2025-12-08
decision-makers: Development Team
---

# Use Fastify as Web Framework for REST APIs

## Context and Problem Statement

The microservice requires a web framework to handle HTTP requests, routing, and multipart/form-data file uploads. We need a Node.js web framework that provides good performance, TypeScript support, and a developer-friendly API for building REST endpoints.

## Decision Drivers

- **TypeScript Support**: Must work seamlessly with TypeScript and ES Modules (as per ADR-001)
- **Performance**: Fast request handling and low overhead for image upload/processing
- **File Upload Handling**: Built-in or well-supported multipart/form-data handling
- **Developer Experience**: Good documentation, active community, and ease of use
- **Plugin Ecosystem**: Availability of plugins for common needs (validation, CORS, etc.)
- **Maintainability**: Active maintenance and regular updates
- **Learning Curve**: Should be approachable for frontend developers (primary persona)
- **Production Ready**: Battle-tested in production environments

## Considered Options

- Fastify
- Express.js
- Koa
- Hapi
- NestJS

## Decision Outcome

Chosen option: "Fastify", because it provides excellent TypeScript support, superior performance, modern async/await patterns, built-in schema validation, and a thriving plugin ecosystem. It aligns well with modern Node.js development practices and our TypeScript + ESM decision.

### Consequences

- Good, because excellent TypeScript support with strong typing throughout
- Good, because high performance with low overhead (benchmarks show 2x faster than Express)
- Good, because built-in JSON schema validation for request/response
- Good, because async/await first design pattern (no callback hell)
- Good, because well-maintained multipart plugin (@fastify/multipart) for file uploads
- Good, because comprehensive plugin ecosystem for common needs
- Good, because excellent documentation and active community
- Good, because modern API design that feels natural for developers familiar with async patterns
- Bad, because smaller community compared to Express.js
- Bad, because fewer third-party middleware options compared to Express
- Bad, because learning curve for developers only familiar with Express
- Neutral, because different plugin system compared to Express middleware

### Confirmation

This decision will be confirmed through:

- **package.json**: Must include `fastify` as a dependency
- **File upload plugin**: Must use `@fastify/multipart` for handling image uploads
- **TypeScript types**: Must use `@types/node` and Fastify's built-in TypeScript definitions
- **Server code**: HTTP server initialization uses `fastify()` constructor
- **Route definitions**: Routes use Fastify's `server.post()`, `server.get()` methods
- **Schema validation**: Request/response schemas defined using JSON Schema format
- **Tests**: API tests successfully make requests to Fastify server

## Pros and Cons of the Options

### Fastify

Modern, fast, and TypeScript-first web framework.

- Good, because excellent TypeScript support out of the box
- Good, because significantly faster than alternatives (low overhead)
- Good, because built-in schema validation with JSON Schema
- Good, because async/await native design
- Good, because strong typing for routes, hooks, and plugins
- Good, because comprehensive plugin system (@fastify/multipart, @fastify/cors, etc.)
- Good, because automatic Content-Type parsing
- Good, because excellent error handling with custom error types
- Good, because active maintenance and modern best practices
- Bad, because smaller ecosystem than Express
- Bad, because different patterns may require learning for Express users

### Express.js

The most popular Node.js web framework.

- Good, because largest community and ecosystem
- Good, because maximum third-party middleware availability
- Good, because familiar to most Node.js developers
- Good, because extensive documentation and tutorials
- Bad, because middleware uses callbacks, not native async/await
- Bad, because poor TypeScript support (requires many @types packages)
- Bad, because slower performance compared to modern frameworks
- Bad, because limited built-in validation
- Bad, because manual setup required for most features
- Bad, because legacy design patterns not optimized for modern async code

### Koa

Express successor by same team, middleware-focused.

- Good, because modern async/await support
- Good, because cleaner middleware composition than Express
- Good, because lightweight core
- Good, because decent TypeScript support
- Bad, because smaller ecosystem than Express
- Bad, because requires more manual setup (no built-in routing)
- Bad, because no built-in request validation
- Bad, because less active development than Fastify
- Bad, because steeper learning curve for middleware patterns

### Hapi

Enterprise-focused framework with strong conventions.

- Good, because comprehensive built-in features
- Good, because strong validation with Joi
- Good, because configuration-centric approach
- Bad, because heavyweight compared to alternatives
- Bad, because slower performance than Fastify
- Bad, because more complex API and configuration
- Bad, because overkill for simple microservice
- Bad, because less intuitive for frontend developers
- Bad, because smaller community than Express or Fastify

### NestJS

Full-featured framework with Angular-inspired architecture.

- Good, because comprehensive TypeScript framework
- Good, because built-in dependency injection
- Good, because extensive features (GraphQL, WebSocket, etc.)
- Good, because strong conventions and architecture
- Bad, because heavyweight and complex for simple REST API
- Bad, because steep learning curve with decorators and DI
- Bad, because overkill for single-endpoint microservice
- Bad, because slower than lightweight alternatives
- Bad, because poor fit for frontend developers unfamiliar with Angular patterns

## More Information

**Fastify Version**: Use Fastify v4.x which has stable TypeScript support and ESM compatibility.

**Key Plugins for Our Use Case**:

- `@fastify/multipart`: For handling image file uploads
- `@fastify/cors`: For CORS headers (if needed for browser access)
- `@fastify/helmet`: For security headers
- `@fastify/rate-limit`: For future rate limiting (Secure Access theme)

**TypeScript Configuration**: Fastify has excellent built-in TypeScript types, no additional @types packages needed.

**Performance Considerations**: Fastify's performance advantage matters for image upload endpoints where we want minimal framework overhead during file processing.

**Migration Path**: If Fastify proves inadequate, migration to Express or Koa is straightforward as route handler patterns are similar.

**Related Decisions**:

- ADR-001: TypeScript + ESM - Fastify has excellent support for both
- Future ADR for image processing library should consider integration with Fastify's async patterns

**Re-evaluation Triggers**: This decision should be revisited if:

- Fastify plugin ecosystem proves insufficient for critical features
- Performance benchmarks show no advantage for our specific use case
- Team strongly prefers Express patterns and productivity suffers
- TypeScript support degrades in future Fastify versions
