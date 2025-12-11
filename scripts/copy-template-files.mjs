#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

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