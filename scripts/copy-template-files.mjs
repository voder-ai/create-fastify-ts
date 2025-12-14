#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Copy template assets from src/template-files into the built dist/ tree.
 *
 * This script is invoked as part of the `npm run build` process to ensure
 * that the packaged initializer includes the template files alongside the
 * compiled TypeScript output. It mirrors the expectations in the production
 * build story that the published package can scaffold projects entirely from
 * the contents of dist/.
 *
 * @supports docs/stories/006.0-DEVELOPER-PRODUCTION-BUILD.story.md REQ-BUILD-OUTPUT-DIST REQ-BUILD-ESM
 */
async function main() {
  const projectRoot = process.cwd();
  const srcTemplatesDir = path.resolve(projectRoot, 'src', 'template-files');
  const distDir = path.resolve(projectRoot, 'dist');

  // Ensure source templates exist; if not, fail fast so the build step is noisy.
  await fs.access(srcTemplatesDir);

  const distTemplateDir = path.join(distDir, 'template-files');
  const distSrcTemplateDir = path.join(distDir, 'src', 'template-files');

  await fs.mkdir(distTemplateDir, { recursive: true });
  await fs.mkdir(distSrcTemplateDir, { recursive: true });

  // Node 18+ supports fs.cp with recursive option. The project targets Node 22.
  await fs.cp(srcTemplatesDir, distTemplateDir, { recursive: true });
  await fs.cp(srcTemplatesDir, distSrcTemplateDir, { recursive: true });
}

main().catch(error => {
  console.error('Failed to copy template files into dist:', error);
  process.exit(1);
});
