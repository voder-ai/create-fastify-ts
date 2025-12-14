# API Reference

This document describes the public API surface of the `@voder-ai/create-fastify-ts` package as currently implemented.

## Module entry point

Import from the package root using standard ES module syntax:

```ts
import {
  getServiceHealth,
  initializeTemplateProject,
  initializeTemplateProjectWithGit,
  type GitInitResult,
} from '@voder-ai/create-fastify-ts';
```

or in JavaScript:

```js
import {
  getServiceHealth,
  initializeTemplateProject,
  initializeTemplateProjectWithGit,
} from '@voder-ai/create-fastify-ts';
```

## Functions

### `getServiceHealth(): string`

Returns a simple string representing the current health of the service wiring.

- **Returns**: the string `"ok"`.
- **Errors**: does not throw under normal conditions.

Example:

```ts
import { getServiceHealth } from '@voder-ai/create-fastify-ts';

if (getServiceHealth() === 'ok') {
  console.log('Service wiring looks good');
}
```

### `initializeTemplateProject(projectName: string): Promise<string>`

Creates a new Fastify TypeScript template project on disk without attempting to initialize a Git repository.

- **Parameters**:
  - `projectName` (`string`): The intended name of the project. This is typically used to determine the directory name for the new project (for example, `my-fastify-service`), subject to any internal normalization rules.

- **Returns**: a `Promise` that resolves to:
  - `string`: Absolute path to the created project directory on disk.

- **Errors**:
  - The Promise may reject for:
    - Invalid or unsupported `projectName` values.
    - File system or template-creation errors (e.g., insufficient permissions, target directory already exists in a non-overwritable way, or other I/O errors).

Example (TypeScript):

```ts
import { initializeTemplateProject } from '@voder-ai/create-fastify-ts';

async function main() {
  const projectDir = await initializeTemplateProject('my-fastify-service');
  console.log('Project created at:', projectDir);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
```

Example (JavaScript):

```js
import { initializeTemplateProject } from '@voder-ai/create-fastify-ts';

async function main() {
  const projectDir = await initializeTemplateProject('my-fastify-service');
  console.log('Project created at:', projectDir);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
```

### `initializeTemplateProjectWithGit(projectName: string): Promise<{ projectDir: string; git: GitInitResult }>`

Creates a new Fastify TypeScript template project on disk and attempts to initialize a Git repository in the created project directory.

This function reuses the same project scaffolding logic as `initializeTemplateProject` to create the project, and then performs a best-effort Git initialization step. It never rejects solely because Git is unavailable or Git initialization fails; those conditions are reported via the returned `GitInitResult`.

- **Parameters**:
  - `projectName` (`string`): The intended name of the project. This is typically used to determine the directory name for the new project (for example, `my-fastify-service`), subject to any internal normalization rules.

- **Returns**: a `Promise` that resolves to an object of the shape:
  - `projectDir` (`string`): Absolute path to the created project directory on disk.
  - `git` (`GitInitResult`): Object describing the result of the Git initialization attempt.

- **Behavior when Git is not available**:
  - The project directory and template files are still created successfully using the same scaffolding as `initializeTemplateProject`.
  - Git initialization is skipped or fails gracefully.
  - The returned `git.initialized` is `false`.
  - The returned `git.errorMessage` is populated with a human-readable explanation (for example, that `git` could not be found or failed to run).

- **Errors**:
  - The Promise may reject for file system or template-creation errors (e.g., insufficient permissions, target directory already exists in a non-overwritable way, or other I/O errors).
  - It is not rejected solely because Git is unavailable; that case is reported via the `GitInitResult` in the resolved value.

Example (TypeScript):

```ts
import { initializeTemplateProjectWithGit, type GitInitResult } from '@voder-ai/create-fastify-ts';

async function main() {
  const { projectDir, git } = await initializeTemplateProjectWithGit('my-fastify-service');

  console.log('Project created at:', projectDir);

  if (git.initialized) {
    console.log('Git repository initialized.');
  } else {
    console.warn('Git was not initialized:', git.errorMessage);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
```

Example (JavaScript):

```js
import { initializeTemplateProjectWithGit } from '@voder-ai/create-fastify-ts';

async function main() {
  const { projectDir, git } = await initializeTemplateProjectWithGit('my-fastify-service');

  console.log('Project created at:', projectDir);

  if (git.initialized) {
    console.log('Git repository initialized.');
  } else {
    console.warn('Git was not initialized:', git.errorMessage);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
```

## Types

### `GitInitResult`

Represents the outcome of attempting to initialize a Git repository in the newly created project directory.

Shape:

```ts
type GitInitResult = {
  /**
   * Absolute path to the project directory where Git initialization was attempted.
   */
  projectDir: string;

  /**
   * Whether a Git repository was successfully initialized.
   */
  initialized: boolean;

  /**
   * Standard output from the Git initialization command, if available.
   */
  stdout?: string;

  /**
   * Standard error output from the Git initialization command, if available.
   */
  stderr?: string;

  /**
   * A human-readable error message if Git initialization did not succeed.
   */
  errorMessage?: string;
};
```

- When Git is available and initialization succeeds:
  - `projectDir` is always populated with the absolute project directory path.
  - `initialized` is `true`.
  - `stdout` may contain the standard output from `git init` (or similar), or be `undefined` if not captured.
  - `stderr` is typically `undefined` (or empty) unless Git wrote to standard error.
  - `errorMessage` is `undefined`.

- When Git is not available or initialization fails:
  - `projectDir` is always populated with the absolute project directory path.
  - `initialized` is `false`.
  - `stdout` may be present with any captured standard output, or `undefined`.
  - `stderr` may be present with any captured standard error details, or `undefined`.
  - `errorMessage` is present and contains a brief explanation (e.g., `git not found in PATH` or the underlying error message).
  - The project is still created and usable at the returned `projectDir` path.

## Logging and Log Levels

Generated projects use Fastify's integrated Pino logger with sensible defaults:

- In non-production environments (`NODE_ENV` not set to `production`), the default log level is `debug`.
- In production (`NODE_ENV=production` and no explicit log level), the default log level is `info`.
- You can override the level in any environment by setting the `LOG_LEVEL` environment variable (`trace`, `debug`, `info`, `warn`, `error`, `fatal`).

Examples:

```bash
# Development with verbose logs
LOG_LEVEL=debug npm run dev

# Production with standard informational logs
NODE_ENV=production LOG_LEVEL=info npm start

# Temporary deep troubleshooting in production (use sparingly)
NODE_ENV=production LOG_LEVEL=trace npm start
```

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
