/**
 * CLI entrypoint for the Fastify TypeScript template.
 *
 * This minimal implementation wires the package up as an npm init template by
 * delegating to the initializer module. It does not yet implement prompts or
 * advanced options; it simply expects a single project name argument and
 * initializes the template in a directory with that name.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-NPM-TEMPLATE REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL
 */

import { initializeTemplateProject } from './initializer.js';

/**
 * Parse CLI arguments and delegate to the template initializer.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-NPM-TEMPLATE REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL
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
    const projectDir = await initializeTemplateProject(projectName);
    // User-facing CLI success message.
    console.log(`Initialized Fastify TypeScript project in: ${projectDir}`);
  } catch (error) {
    // User-facing CLI error message.
    console.error('Failed to initialize project:', error);
    process.exitCode = 1;
  }
}

void run();
