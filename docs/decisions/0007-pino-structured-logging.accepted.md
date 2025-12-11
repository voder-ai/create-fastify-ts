---
status: accepted
date: 2025-12-10
decision-makers: Development Team
---

# Use Pino for Structured Logging

## Context and Problem Statement

The Fastify TypeScript template requires a logging solution for request/response logging, error tracking, and application observability in production. We need structured, machine-readable logs that support debugging during development and enable effective monitoring and log aggregation in production environments.

## Decision Drivers

- **Production Observability**: Logs must be structured and searchable in production monitoring tools
- **Performance**: Minimal overhead to maintain API performance
- **Fastify Integration**: Should work seamlessly with Fastify as per ADR-0002
- **Structured Logging**: JSON format for log aggregation tools (ELK, Datadog, CloudWatch, etc.)
- **Request Context**: Ability to track logs across request lifecycle
- **Developer Experience**: Readable logs during development
- **TypeScript Support**: Strong typing for logger methods
- **Production Ready**: Battle-tested in high-throughput production environments

## Considered Options

- Pino (Fastify's built-in logger)
- Winston
- Bunyan
- Custom logging solution

## Decision Outcome

Chosen option: "Pino (Fastify's built-in logger)", because it provides the best combination of performance, Fastify integration, structured JSON logging, and production readiness. Pino is Fastify's default logger with zero-configuration integration, extremely low overhead, and is built by the same team that maintains Fastify.

### Consequences

- Good, because built-in integration with Fastify (zero additional configuration)
- Good, because extremely fast - minimal performance impact (5x faster than Winston)
- Good, because low memory overhead optimized for high-throughput applications
- Good, because structured JSON logging perfect for production log aggregation
- Good, because automatic request/response logging built into Fastify
- Good, because child loggers enable request context tracking
- Good, because Fastify automatically attaches logger to request objects
- Good, because TypeScript types included
- Good, because same team as Fastify (consistent philosophy and maintenance)
- Good, because supports all standard log levels (trace, debug, info, warn, error, fatal)
- Good, because pino-pretty available for human-readable development logs
- Bad, because JSON-only output requires pino-pretty for development readability
- Bad, because less feature-rich than Winston (focused on performance)
- Bad, because smaller plugin ecosystem compared to Winston
- Neutral, because opinionated JSON structure (good for consistency, may require adaptation)

### Confirmation

This decision is confirmed through:

- **Fastify initialization**: Logger configured in Fastify constructor options
- **Request logging**: Automatic request/response logging enabled
- **Log output**: JSON-formatted logs in production
- **Development logs**: pino-pretty configured for development environment
- **Request context**: Logger available on `request.log` in all route handlers
- **Error tracking**: Errors logged with full stack traces
- **Tests**: Log output verification in integration tests

## Pros and Cons of the Options

### Pino (Fastify's built-in logger)

Extremely fast, low-overhead JSON logger built by Fastify team.

- Good, because built specifically for Fastify with zero-config integration
- Good, because Fastify's default - best support and examples
- Good, because extremely fast (benchmarks: 5x faster than Winston, 10x faster than Bunyan)
- Good, because minimal memory overhead
- Good, because structured JSON logging by default
- Good, because automatic request/response logging via Fastify
- Good, because child loggers for request context (`request.log`)
- Good, because TypeScript support included
- Good, because supports standard log levels (trace, debug, info, warn, error, fatal)
- Good, because works seamlessly with log aggregation tools (ELK, Datadog, CloudWatch)
- Good, because pino-pretty for development-friendly output
- Good, because production-focused design philosophy
- Good, because same maintenance team as Fastify
- Bad, because JSON-only (requires pino-pretty for human-readable development)
- Bad, because fewer features than Winston (intentionally focused)
- Bad, because smaller transport/plugin ecosystem

### Winston

Popular, feature-rich logging library.

- Good, because very popular and widely used
- Good, because highly configurable and feature-rich
- Good, because multiple transports (file, console, HTTP, etc.)
- Good, because large ecosystem of plugins and transports
- Good, because flexible formatting options
- Good, because can output multiple formats simultaneously
- Bad, because significantly slower than Pino (5x slower in benchmarks)
- Bad, because higher memory overhead
- Bad, because requires manual integration with Fastify (not built-in)
- Bad, because more complex configuration needed
- Bad, because not designed specifically for Fastify
- Bad, because less comprehensive TypeScript support
- Bad, because doesn't integrate with Fastify's request lifecycle naturally

### Bunyan

Structured JSON logger (Pino's predecessor concept).

- Good, because structured JSON logging
- Good, because CLI tool for pretty-printing
- Good, because child loggers for context
- Bad, because significantly slower than Pino
- Bad, because not actively maintained (last update 2022)
- Bad, because not built for Fastify
- Bad, because Pino was created as the faster successor
- Bad, because requires manual Fastify integration

### Custom logging solution

Build custom logger or wrapper.

- Good, because complete control over implementation
- Good, because can customize to exact needs
- Bad, because reinventing well-tested solution
- Bad, because significant maintenance burden
- Bad, because performance optimization is difficult
- Bad, because won't integrate as well with Fastify
- Bad, because need to build request context tracking
- Bad, because TypeScript types need manual maintenance

## More Information

**Related Decisions:**

- ADR-0002: Fastify framework - Pino is Fastify's official logger, built by same team

**Pino Configuration:**

**Production (JSON logs):**

```typescript
const fastify = Fastify({
  logger: {
    level: 'info',
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          headers: request.headers,
        };
      },
    },
  },
});
```

**Development (pretty logs):**

```typescript
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
});
```

**Request Context Logging:**

```typescript
fastify.get('/api/data', async (request, reply) => {
  request.log.info('Fetching data'); // Automatically includes request ID
  // ...
});
```

**Log Levels:**

- **trace**: Very detailed debugging (usually disabled)
- **debug**: Debugging information
- **info**: General informational messages (default in production)
- **warn**: Warning messages
- **error**: Error messages with stack traces
- **fatal**: Critical errors that crash the application

**Performance Benchmarks:**

Pino is optimized for production performance:

- ~30,000 logs/second vs ~6,000 for Winston
- Minimal CPU overhead even under high load
- Low memory footprint

**Production Integration:**

Pino's JSON logs work seamlessly with:

- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Datadog**: Automatic log parsing
- **AWS CloudWatch**: JSON log groups
- **Google Cloud Logging**: Structured log ingestion
- **Azure Monitor**: Application Insights integration

**Development Experience:**

Install pino-pretty for development:

```bash
npm install --save-dev pino-pretty
```

Run with pretty logs:

```bash
node dist/index.js | pino-pretty
```

Or configure conditionally:

```typescript
const isDev = process.env.NODE_ENV === 'development';
const logger = isDev
  ? {
      transport: { target: 'pino-pretty' },
    }
  : { level: 'info' };
```

**Future Considerations:**

- May add custom serializers for specific data types
- May configure log rotation for file-based logging if needed
- Will monitor for new Pino transports and plugins
- Consider adding request ID generation for distributed tracing
