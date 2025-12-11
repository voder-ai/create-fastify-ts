# API Reference

This document describes the public API surface of the `@voder-ai/create-fastify-ts` package as currently implemented.

## Module entry point

Import from the package root using standard ES module syntax:

```ts
import {
  getServiceHealth,
  initializeTemplateProjectWithGit,
  type GitInitResult,
} from '@voder-ai/create-fastify-ts';
```

or in JavaScript:

```js
import { getServiceHealth, initializeTemplateProjectWithGit } from '@voder-ai/create-fastify-ts';
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

### `initializeTemplateProjectWithGit(projectName: string): Promise<{ projectDir: string; git: GitInitResult }>`

Creates a new Fastify TypeScript template project on disk and attempts to initialize a Git repository in the created project directory.

- **Parameters**:
  - `projectName` (`string`): The intended name of the project. This is typically used to determine the directory name for the new project (for example, `my-fastify-service`), subject to any internal normalization rules.

- **Returns**: a `Promise` that resolves to an object of the shape:
  - `projectDir` (`string`): Absolute path to the created project directory on disk.
  - `git` (`GitInitResult`): Object describing the result of the Git initialization attempt.

- **Behavior when Git is not available**:
  - The project directory and template files are still created successfully.
  - Git initialization is skipped or fails gracefully.
  - The returned `git.initialized` is `false`.
  - The returned `git.errorMessage` is populated with a human‑readable explanation (for example, that `git` could not be found or failed to run).

- **Errors**:
  - The Promise may reject for file system or template‑creation errors (e.g., insufficient permissions, target directory already exists in a non‑overwritable way, or other I/O errors).
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
   * Whether a Git repository was successfully initialized.
   */
  initialized: boolean;

  /**
   * A human-readable error message if Git initialization did not succeed.
   * This is `null` (or possibly `undefined`) when `initialized` is `true`.
   */
  errorMessage: string | null;
};
```

- When Git is available and initialization succeeds:
  - `initialized` is `true`.
  - `errorMessage` is `null` (or otherwise empty).

- When Git is not available or initialization fails:
  - `initialized` is `false`.
  - `errorMessage` contains a brief explanation (e.g., `git not found in PATH` or the underlying error message).
  - The project is still created and usable at the returned `projectDir` path.

## Attribution

Created autonomously by [voder.ai](https://voder.ai).
