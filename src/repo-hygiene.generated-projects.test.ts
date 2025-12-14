/**
 * Repository hygiene tests to prevent committing generated initializer projects.
 *
 * These tests enforce ADR 0014 by asserting that known generated-project
 * directory names do not exist at the repository root. Tests that need
 * scaffolded projects must create them in OS temporary directories instead.
 *
 * @supports docs/decisions/0014-generated-test-projects-not-committed.accepted.md REQ-NO-GENERATED-PROJECTS
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFilePath);
const repoRoot = path.resolve(thisDir, '..');

const DISALLOWED_PROJECT_DIRS = [
  'cli-api',
  'cli-test-from-dist',
  'cli-test-project',
  'manual-cli',
  'test-project-exec-assess',
];

describe('Repository hygiene (generated projects)', () => {
  it('[REQ-NO-GENERATED-PROJECTS] should not contain known generated project directories at repo root', async () => {
    const existing: string[] = [];

    await Promise.all(
      DISALLOWED_PROJECT_DIRS.map(async dirName => {
        const fullPath = path.join(repoRoot, dirName);

        try {
          const stat = await fs.stat(fullPath);
          if (stat.isDirectory()) {
            existing.push(dirName);
          }
        } catch {
          // If the path does not exist, this is the desired state.
        }
      }),
    );

    expect(
      existing,
      existing.length
        ? `Generated project directories must not be committed, but found: ${existing.join(', ')}`
        : undefined,
    ).toEqual([]);
  });
});
