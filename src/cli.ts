#!/usr/bin/env node

/**
 * CLI entrypoint for the Fastify TypeScript template.
 *
 * This minimal implementation wires the package up as an npm init template by
 * delegating to the initializer module. It does not yet implement prompts or
 * advanced options; it simply expects a single project name argument and
 * initializes the template in a directory with that name.
 *
 * When Git is available, the initializer also sets up a clean, independent Git
 * repository for the new project, satisfying the Project Independence
 * acceptance criterion.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-NPM-TEMPLATE REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-GIT-CLEAN
 */

import { initializeTemplateProjectWithGit } from './initializer.js';

/**
 * Parse CLI arguments and delegate to the template initializer.
 *
 * When Git is available, this will also initialize a fresh repository for the
 * new project, satisfying the Project Independence acceptance criterion while
 * keeping the template repository separate.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-NPM-TEMPLATE REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-GIT-CLEAN
 */
async function run(): Promise<void> {
  const [, , projectName] = process.argv;

  if (!projectName) {
    // For the initial implementation, keep error handling simple. More
    // user-friendly messaging and prompts can be added in later stories.
    // User-facing CLI error message.
    console.error('Usage: npm init @voder-ai/fastify-ts <project-name>');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await initializeTemplateProjectWithGit(projectName);
    const { projectDir, git } = result;

    // User-facing CLI success message.
    console.log(`Initialized Fastify TypeScript project in: ${projectDir}`);

    if (git.initialized) {
      console.log('A new Git repository was created and initialized for this project.');
    } else {
      console.warn(
        'Warning: Git repository initialization failed. You may need to run `git init` manually.',
      );
    }

    process.exitCode = 0;
  } catch (error) {
    // User-facing CLI error message.
    console.error('Failed to initialize project:', error);
    process.exitCode = 1;
  }
}

void run();
