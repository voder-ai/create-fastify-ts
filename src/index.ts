/**
 * Re-export the template project initializer for external consumers.
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-NPM-TEMPLATE
 */
export { initializeTemplateProject } from './initializer.js';

/**
 * Re-export the git-enabled template project initializer and associated result type.
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-DIRECTORY
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-GIT-CLEAN
 */
export { initializeTemplateProjectWithGit, type GitInitResult } from './initializer.js';
