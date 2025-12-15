# Security Overview

Created autonomously by [voder.ai](https://voder.ai).

This document provides a high-level view of the current security characteristics of this Fastify TypeScript template (minimal API service).

## Current Capabilities and Limitations

A **freshly generated project** created via `npm init @voder-ai/fastify-ts` exposes:

- `GET /` – returns a Hello World JSON payload such as `{ "message": "Hello World from Fastify + TypeScript!" }`.
- `GET /health` – returns a JSON payload such as `{ "status": "ok" }`.

The `GET /` Hello World endpoint and the `GET /health` health check endpoint are currently the only application endpoints in generated projects.

There are currently **no** authenticated endpoints, no image-upload functionality, and no persistent storage. As a result:

- The service does **not** store user data.
- The service does **not** perform user authentication or authorization.
- The service does **not** provide rate-limiting or abuse protection on public endpoints yet.
- The service does **not** configure CORS (no custom CORS policy is in place).
- The template does **not** yet register `@fastify/helmet` in `src/index.ts` out of the box. Enabling Helmet (or similar HTTP security header configuration) is a **recommended next step** after project generation so that all HTTP responses benefit from a common baseline of security headers. You can add and customize this configuration in your own application code.
- The service does **not** perform validation or strict checking of environment variables at startup.

These limitations are expected for an early bootstrap; future versions will introduce additional endpoints and stronger security features.

## Data Handling

Because the only implemented endpoints in generated projects are:

- `GET /` (returning a static Hello World JSON message), and
- `GET /health` (returning a simple status JSON),

and they do not accept user input beyond the HTTP request itself:

- No request bodies or files are processed.
- No user data is written to databases, disks, or external services.

As new endpoints are added (for example, for file upload and processing), this document will be updated to describe how those endpoints handle and protect user data.

## Transport Security

The service is designed to run behind your chosen HTTP infrastructure (for example, a cloud load balancer, API gateway, or reverse proxy).

- Use HTTPS for all external traffic to protect data in transit.
- Terminate TLS at your chosen edge component and forward traffic to the service over a secure internal network.

## Future Security Features

Planned areas of improvement include, but are not limited to:

- Authentication and authorization once write or user-specific endpoints are introduced.
- Request validation and file-type checking for image upload endpoints.
- Rate limiting or other controls to mitigate abuse.
- Additional automated security checks in the CI/CD pipeline.
- Explicit CORS configuration appropriate to your deployment environment.
- Security headers using Fastify plugins such as `@fastify/helmet` (or equivalent) **beyond the current default configuration**, including application-specific tuning of policies like CSP.
- More robust environment-variable validation and configuration checks at startup.
- Enhanced log redaction rules and clear logging content guidelines to ensure that structured JSON logs (already provided via Fastify's default Pino integration) do not contain sensitive data.

Until these features are implemented and documented, you should treat the service as a minimal building block and place it behind your own security controls appropriate to your environment.

---

## HTTP Security Headers (REQ-SEC-HEADER-DOCS, REQ-SEC-HELMET-DEFAULT, REQ-SEC-OWASP)

This template is designed to work well with `@fastify/helmet` as the recommended way to configure common HTTP security headers in line with [OWASP Secure Headers Best Practices](https://owasp.org/www-project-secure-headers/). A freshly generated project **does not** register Helmet by default in `src/index.ts`; instead, you are expected to add and configure Helmet yourself if you want these headers to be applied.

The examples and descriptions in this section show **recommended patterns** for using `@fastify/helmet` and explain the kinds of headers it can configure for you in alignment with OWASP guidance.

> Important: After generating a new project, you should **explicitly register** `@fastify/helmet` (for example, in `src/index.ts`, `app.ts`, or `server.ts`) and review/customize its configuration (for example, CSP directives) for your application’s needs.

### Typical `@fastify/helmet` setup

```ts
import Fastify from 'fastify';
import helmet from '@fastify/helmet';

const app = Fastify({
  logger: true,
});

await app.register(helmet, {
  // Optional: add CSP configuration here (see CSP section below)
});

app.get('/', async () => ({ message: 'Hello World from Fastify + TypeScript!' }));

await app.listen({ port: 3000, host: '0.0.0.0' });
```

By default, `@fastify/helmet` configures a set of headers recommended by OWASP to mitigate common web vulnerabilities such as clickjacking, XSS, MIME sniffing, and information disclosure. The exact set can change by version; the list below reflects the typical defaults and their purposes.

### Default security headers and what they do (REQ-SEC-HEADER-DOCS)

The following describes the major headers configured by `@fastify/helmet` out of the box (or via the individual sub‑options). Consult the plugin and underlying Helmet documentation for the exact behavior for the version you use.

#### `X-DNS-Prefetch-Control`

- **Example value**: `X-DNS-Prefetch-Control: off`
- **Purpose**: Controls browser DNS prefetching of links and resources.
- **Helps prevent**: Excessive or unintended DNS lookups that could leak browsing patterns or put unnecessary load on infrastructure.
- **OWASP alignment**: Helps with privacy- and performance-related aspects of secure headers.

#### `Expect-CT` (deprecated in browsers but sometimes still set)

- **Example value**: `Expect-CT: max-age=0`
- **Purpose**: Historically used to enforce Certificate Transparency; now largely obsolete.
- **Helps prevent**: Misissued TLS certificates from being silently accepted.
- **OWASP alignment**: Certificate management and transport-layer hardening; you should prefer modern TLS monitoring solutions.

#### `X-Frame-Options`

- **Example value**: `X-Frame-Options: SAMEORIGIN`
- **Purpose**: Controls whether your site can be embedded in an `<iframe>`.
- **Helps prevent**: Clickjacking attacks where an attacker overlays UI elements to trick users into clicking unintended targets.
- **OWASP alignment**: Recommended to be set to `DENY` or `SAMEORIGIN` for most APIs and admin UIs.

> Note: Modern guidance prefers using a CSP `frame-ancestors` directive instead (see CSP section), but `X-Frame-Options` is still useful as a defense-in-depth measure for older browsers.

#### `Strict-Transport-Security` (HSTS)

- **Example value**:  
  `Strict-Transport-Security: max-age=15552000; includeSubDomains`
- **Purpose**: Instructs browsers to only connect to your site over HTTPS for a given period.
- **Helps prevent**: Protocol downgrade attacks and cookie hijacking over HTTP.
- **OWASP alignment**: OWASP strongly recommends HSTS for all HTTPS-only production deployments.

> Important: Only enable HSTS when your site is fully and consistently reachable via HTTPS; misconfiguration may result in temporary loss of access over HTTP.

#### `X-Download-Options` (for older IE)

- **Example value**: `X-Download-Options: noopen`
- **Purpose**: Instructs Internet Explorer not to open downloads directly in the browser.
- **Helps prevent**: Some content-sniffing and download‑execution issues in legacy clients.
- **OWASP alignment**: Legacy-hardening measure, mostly for backwards compatibility.

#### `X-Content-Type-Options`

- **Example value**: `X-Content-Type-Options: nosniff`
- **Purpose**: Prevents browsers from MIME-sniffing a response away from the declared `Content-Type`.
- **Helps prevent**: Certain XSS and content-type confusion attacks, especially when serving user-generated content or downloads.
- **OWASP alignment**: Strongly recommended default header for all web apps and APIs.

#### `X-Permitted-Cross-Domain-Policies`

- **Example value**: `X-Permitted-Cross-Domain-Policies: none`
- **Purpose**: Controls whether Adobe Flash, Adobe Reader, and other clients can load data from your domain using cross-domain policy files.
- **Helps prevent**: Legacy cross-domain data access from Flash/Adobe clients.
- **OWASP alignment**: Hardens older plugin ecosystems.

#### `Referrer-Policy`

- **Example value**: `Referrer-Policy: no-referrer` or `strict-origin-when-cross-origin`
- **Purpose**: Controls how much referrer information is sent with requests.
- **Helps prevent**: Unnecessary leakage of sensitive URLs, query parameters, or tokens to third-party sites.
- **OWASP alignment**: OWASP recommends restrictive `Referrer-Policy` settings to protect sensitive data in URLs.

#### `Permissions-Policy` (formerly `Feature-Policy`)

- **Example value**:  
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Purpose**: Controls access to powerful browser features (camera, microphone, geolocation, etc.) on a per-origin basis.
- **Helps prevent**: Unintended use of sensitive device capabilities by embedded content or third-party scripts.
- **OWASP alignment**: Part of the recommended browser feature-hardening strategy.

#### `Content-Security-Policy` (CSP) – optional

- **Purpose**: Restricts the sources from which content (scripts, styles, images, fonts, etc.) can be loaded.
- **Helps prevent**: A wide range of XSS and content-injection attacks.
- **OWASP alignment**: OWASP highly recommends CSP for modern applications.

> Note: `@fastify/helmet` may not enable a strict CSP by default, because an incorrect policy can easily break legitimate functionality. You are expected to **explicitly configure** CSP based on your app’s needs (see the next section: **Content Security Policy (CSP)**).

---

## Content Security Policy (CSP) (REQ-SEC-CSP-CUSTOM, REQ-SEC-OWASP)

CSP is one of the most effective mechanisms for mitigating XSS and related injection issues. OWASP recommends adopting a **strict, application-specific CSP** and rolling it out carefully (often starting in `Report-Only` mode).

This template does **not** ship with a hard-coded CSP beyond the defaults provided by `@fastify/helmet`. Instead, you are expected to configure CSP yourself when you customize Helmet. Below are example patterns for safe CSP customization.

### Enabling a basic CSP

```ts
import helmet from '@fastify/helmet';

await app.register(helmet, {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      // Restrict everything to same origin by default
      defaultSrc: ["'self'"],

      // Allow scripts from self and explicitly trusted CDNs
      scriptSrc: ["'self'", 'https://cdn.example.com'],

      // Allow styles from self and inline styles if strictly required
      // Prefer using nonces/hashes instead of 'unsafe-inline'
      styleSrc: ["'self'"],

      // Restrict images to self, data URLs, and a trusted asset host
      imgSrc: ["'self'", 'data:', 'https://images.example.com'],

      // Disallow all framing by other sites
      frameAncestors: ["'none'"],

      // Disallow connections except to self and your API domains
      connectSrc: ["'self'", 'https://api.example.com'],
    },
  },
});
```

Considerations:

- Start with a **restrictive** base (`defaultSrc: 'self'`) and explicitly add allowed sources.
- Avoid `'unsafe-inline'` and `'unsafe-eval'` in `scriptSrc` and `styleSrc` wherever possible; they significantly weaken CSP.
- For dynamic scripts/styles, prefer using **nonces** or **hashes** and configure CSP accordingly.
- For SPAs or applications that rely heavily on third-party scripts, roll out CSP gradually using [`Content-Security-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only) and monitor violations.

### Environment-specific CSP example (development vs production)

During development, you might need a more permissive CSP (for example, when using hot module reloading or local tooling). In production, you should tighten it.

```ts
const isProd = process.env.NODE_ENV === 'production';

await app.register(helmet, {
  contentSecurityPolicy: isProd
    ? {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
        },
      }
    : {
        // Development: allow localhost tooling and HMR endpoints
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            'http://localhost:3000',
            'http://localhost:3001',
            "'unsafe-eval'", // if required by tooling; remove in production
          ],
          styleSrc: ["'self'", "'unsafe-inline'"], // only for dev
          connectSrc: ["'self'", 'ws://localhost:3000', 'http://localhost:3000'],
          imgSrc: ["'self'", 'data:'],
          frameAncestors: ["'none'"],
        },
      },
});
```

> When relaxing CSP for development, keep the production policy as strict as possible and do not reuse dev settings in production builds.

---

## CORS (Cross-Origin Resource Sharing) (REQ-SEC-CORS-DOCS, REQ-SEC-CORS-ENV, REQ-SEC-CORS-OPTOUT, REQ-SEC-OWASP)

CORS controls which **browser-based** frontends are allowed to call your API from a different origin. It is separate from CSP and from authentication/authorization.

### CORS is **not enabled by default** (REQ-SEC-CORS-OPTOUT)

- A freshly generated project using this template **does not** install or register `@fastify/cors`.
- Therefore, by default:
  - Browsers will **block** cross-origin calls to your API (aside from simple cases that do not trigger CORS preflight).
  - Non-browser clients (e.g., curl, Postman, server-to-server HTTP) are **not** affected by CORS and can call the API as usual.
- This aligns with the principle of **secure by default**: you must **explicitly opt in** to CORS where and how you need it.

To enable CORS safely, you must:

1. Install `@fastify/cors`.
2. Register and configure it explicitly.

### Basic CORS setup (explicit opt-in) (REQ-SEC-CORS-DOCS)

```bash
npm install @fastify/cors
```

```ts
import cors from '@fastify/cors';

await app.register(cors, {
  origin: false, // start from the safest default; see below for env-based configuration
});
```

This configuration:

- Explicitly sets `origin: false`, meaning:
  - **No cross-origin** browser requests are allowed.
  - Same-origin requests continue to work as usual.
- You can then selectively allow origins using environment-based rules (see next section).

### Environment-based CORS configuration (development vs production) (REQ-SEC-CORS-ENV)

A common pattern is to allow more permissive CORS in local development (e.g., React/Vue dev servers on `localhost`) and strict, explicit origins in production.

```ts
import cors from '@fastify/cors';

const isProd = process.env.NODE_ENV === 'production';

const devAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite default
];

await app.register(cors, {
  origin: (origin, cb) => {
    // Requests with no Origin header (e.g., curl, server-to-server) are
    // typically allowed; CORS is mainly for browsers.
    if (!origin) {
      return cb(null, true);
    }

    if (!isProd) {
      // Development: allow localhost frontends (explicit list)
      if (devAllowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      // Block all other origins in dev as well, to catch misconfigurations early
      return cb(new Error('Origin not allowed by CORS (development config)'), false);
    }

    // Production: read from environment (comma-separated list)
    const allowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS ?? '';
    const allowedOrigins = allowedOriginsEnv
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    // All other origins are denied
    return cb(new Error('Origin not allowed by CORS (production config)'), false);
  },

  // Example: enable credentials only if needed and only when using HTTPS
  credentials: isProd && process.env.CORS_ALLOW_CREDENTIALS === 'true',

  // Limit allowed methods explicitly
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  // Optionally expose certain headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
});
```

Example environment variables for production:

```bash
# Only allow specific frontends
CORS_ALLOWED_ORIGINS=https://app.example.com,https://admin.example.com
CORS_ALLOW_CREDENTIALS=true
NODE_ENV=production
```

This pattern:

- Satisfies **REQ-SEC-CORS-ENV** by driving CORS configuration from environment variables.
- Avoids wildcard origins (`*`) in production, which OWASP strongly discourages for authenticated or sensitive APIs.
- Encourages explicit enumeration of trusted frontends.

### Safer patterns and OWASP alignment (REQ-SEC-OWASP, REQ-SEC-CORS-DOCS)

To align with OWASP recommendations:

- Prefer **explicit origin lists** over `origin: '*'`, especially if:
  - You use cookies, authorization headers, or other credentials.
  - Your API exposes user-specific or sensitive data.
- Only enable `credentials: true` when:
  - You have strict origin whitelists.
  - You understand browser cookie behavior (e.g., `SameSite=None; Secure`).
- Keep development CORS settings separate from production:
  - Do not reuse dev wildcards in production.
  - Codify the difference with `NODE_ENV` or a dedicated environment variable.
- Periodically audit your allowed origins list and remove unused entries.

---

## Summary and Acceptance Criteria Mapping

- **REQ-SEC-HEADER-DOCS / REQ-SEC-HELMET-DEFAULT**:  
  This document explains the typical default headers that `@fastify/helmet` can configure, what they do, and which attacks they help mitigate. It presents Helmet usage as a recommended pattern and makes clear that you must explicitly register and configure Helmet in your generated project if you want these headers applied.
- **REQ-SEC-CSP-CUSTOM**:  
  CSP is described with concrete customization examples, including restrictive and environment-specific policies.
- **REQ-SEC-CORS-DOCS / REQ-SEC-CORS-OPTOUT**:  
  CORS behavior is explicitly documented, including the fact that CORS is **not** enabled by default and requires explicit registration of `@fastify/cors`.
- **REQ-SEC-CORS-ENV**:  
  Environment-based CORS configuration patterns (development vs production) are provided with code and environment variable examples.
- **REQ-SEC-OWASP**:  
  The configuration guidance references OWASP best practices for secure headers, CSP, and CORS, and encourages explicit, restrictive policies.
