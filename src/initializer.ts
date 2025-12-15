/**
 * Project initializer for the Fastify TypeScript template.
 *
 * This module is responsible for creating the minimal project structure
 * required by the template-init story. The initial implementation focuses
 * on creating the target directory (if it does not already exist) and
 * writing a minimal package.json configured for ES modules and TypeScript.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT REQ-INIT-NPM-TEMPLATE
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { createTemplatePackageJson, type TemplatePackageJson } from './template-package-json.js';

const execFile = promisify(execFileCallback);

/**
 * Result of attempting to initialize a Git repository for a project.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-GIT-CLEAN
 */
export interface GitInitResult {
  /**
   * Absolute path to the project directory where Git initialization was attempted.
   */
  projectDir: string;
  /**
   * True if `git init` appears to have succeeded, false otherwise.
   */
  initialized: boolean;
  /**
   * The stdout captured from the `git init` command, if any.
   */
  stdout?: string;
  /**
   * The stderr captured from the `git init` command, if any.
   */
  stderr?: string;
  /**
   * If Git initialization failed, a short reason or error message.
   */
  errorMessage?: string;
}

/**
 * Resolve the absolute path to the directory containing template files.
 *
 * The template-files directory is always resolved as a sibling of this
 * module's directory, regardless of whether it is running from src or dist.
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL
 */
function getTemplateFilesDir(): string {
  const thisFilePath = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(thisFilePath), 'template-files');
}

/**
 * Copy a text template file into the target project directory.
 *
 * Optionally performs placeholder substitution before writing.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL
 * @param templateDir - Absolute path to the directory containing template assets.
 * @param templateRelativePath - Path to the template file, relative to templateDir.
 * @param targetFilePath - Absolute path where the processed file should be written.
 * @param replacements - Optional map of placeholder -> replacement string.
 */
async function copyTextTemplate(
  templateDir: string,
  templateRelativePath: string,
  targetFilePath: string,
  replacements?: Record<string, string>,
): Promise<void> {
  const templatePath = path.join(templateDir, templateRelativePath);
  const raw = await fs.readFile(templatePath, 'utf8');
  const processed =
    replacements && Object.keys(replacements).length > 0
      ? Object.entries(replacements).reduce((acc, [key, value]) => acc.replaceAll(key, value), raw)
      : raw;
  await fs.writeFile(targetFilePath, processed, 'utf8');
}

/**
 * Write the package.json file for a new project.
 *
 * Attempts to read package.json.template from the template directory and apply
 * the project name substitution. If the template is unavailable or invalid,
 * falls back to createTemplatePackageJson.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT
 * @param templateDir - Absolute path to the directory containing template assets.
 * @param projectDir - Absolute path to the project directory.
 * @param trimmedName - Validated, trimmed project name.
 */
async function writePackageJson(
  templateDir: string,
  projectDir: string,
  trimmedName: string,
): Promise<void> {
  const packageJsonTemplatePath = path.join(templateDir, 'package.json.template');
  let pkgJson: TemplatePackageJson;
  try {
    const templateContents = await fs.readFile(packageJsonTemplatePath, 'utf8');
    const replaced = templateContents.replaceAll('{{PROJECT_NAME}}', trimmedName);
    pkgJson = JSON.parse(replaced) as TemplatePackageJson;
  } catch {
    pkgJson = createTemplatePackageJson(trimmedName);
  }
  const pkgJsonPath = path.join(projectDir, 'package.json');
  const fileContents = `${JSON.stringify(pkgJson, null, 2)}\n`;
  await fs.writeFile(pkgJsonPath, fileContents, 'utf8');
}

/**
 * Scaffold the source files for a new project.
 *
 * Ensures the src directory exists and copies the main index and test files
 * from templates.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL REQ-INIT-TYPESCRIPT
 * @param templateDir - Absolute path to the directory containing template assets.
 * @param projectDir - Absolute path to the project directory.
 */
async function scaffoldSourceFiles(templateDir: string, projectDir: string): Promise<void> {
  const srcDir = path.join(projectDir, 'src');
  await fs.mkdir(srcDir, { recursive: true });
  await copyTextTemplate(
    templateDir,
    path.join('src', 'index.ts.template'),
    path.join(srcDir, 'index.ts'),
  );
  await copyTextTemplate(
    templateDir,
    path.join('src', 'index.test.ts.template'),
    path.join(srcDir, 'index.test.ts'),
  );
}

/**
 * Scaffold configuration and supporting files for a new project.
 *
 * Copies TypeScript configuration, README, gitignore, dev server script, and
 * Vitest configuration from templates, including project name substitution
 * where applicable.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT
 * @supports docs/stories/003.0-DEVELOPER-DEV-SERVER.story.md REQ-DEV-START-FAST
 * @param templateDir - Absolute path to the directory containing template assets.
 * @param projectDir - Absolute path to the project directory.
 * @param trimmedName - Validated, trimmed project name.
 */
async function scaffoldConfigFiles(
  templateDir: string,
  projectDir: string,
  trimmedName: string,
): Promise<void> {
  await copyTextTemplate(
    templateDir,
    'tsconfig.json.template',
    path.join(projectDir, 'tsconfig.json'),
  );
  await copyTextTemplate(templateDir, 'README.md.template', path.join(projectDir, 'README.md'), {
    '{{PROJECT_NAME}}': trimmedName,
  });
  await copyTextTemplate(templateDir, '.gitignore.template', path.join(projectDir, '.gitignore'));
  await copyTextTemplate(templateDir, 'dev-server.mjs', path.join(projectDir, 'dev-server.mjs'));
  await copyTextTemplate(
    templateDir,
    'vitest.config.mts.template',
    path.join(projectDir, 'vitest.config.mts'),
  );
}

/**
 * Perform the common on-disk scaffolding steps for a new project.
 *
 * This helper encapsulates directory creation and file scaffolding so it can
 * be reused by higher-level initialization functions.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT
 * @param trimmedName - Validated, trimmed project name.
 * @returns The absolute path to the initialized project directory.
 */
async function scaffoldProject(trimmedName: string): Promise<string> {
  const projectDir = path.resolve(process.cwd(), trimmedName);
  await fs.mkdir(projectDir, { recursive: true });
  const templateDir = getTemplateFilesDir();
  await writePackageJson(templateDir, projectDir, trimmedName);
  await scaffoldSourceFiles(templateDir, projectDir);
  await scaffoldConfigFiles(templateDir, projectDir, trimmedName);
  return projectDir;
}

/**
 * Attempt to initialize a Git repository in the given project directory.
 *
 * Git initialization is treated as best-effort: failures are captured in the
 * returned result object and do not throw.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-GIT-CLEAN
 * @param projectDir - Absolute path to the project directory.
 * @returns A GitInitResult describing the outcome.
 */
export async function initializeGitRepository(projectDir: string): Promise<GitInitResult> {
  try {
    const { stdout, stderr } = await execFile('git', ['init'], {
      cwd: projectDir,
    });
    return {
      projectDir,
      initialized: true,
      stdout: stdout || undefined,
      stderr: stderr || undefined,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error while running git init';
    return {
      projectDir,
      initialized: false,
      errorMessage: message,
    };
  }
}

/**
 * Initialize a new Fastify TypeScript project in a directory relative to the
 * current working directory.
 *
 * This function is the core of the npm init template behavior. Higher-level
 * CLI entry points (wired up in later steps) will delegate to this function.
 *
 * NOTE: This function preserves the existing behavior of only scaffolding
 * project files and does not perform Git initialization.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT REQ-INIT-NPM-TEMPLATE
 * @param projectName - Name of the project directory (and npm package name).
 * @returns The absolute path to the initialized project directory.
 */
export async function initializeTemplateProject(projectName: string): Promise<string> {
  const trimmedName = projectName.trim();
  if (!trimmedName) {
    throw new Error('Project name must be a non-empty string');
  }
  return scaffoldProject(trimmedName);
}

/**
 * Initialize a new Fastify TypeScript project and then attempt to initialize
 * a Git repository within it.
 *
 * Project scaffolding is always attempted first. Git initialization is
 * best-effort: project creation succeeds even if Git initialization fails,
 * and any Git errors are reported in the returned GitInitResult instead of
 * throwing.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-DIRECTORY REQ-INIT-FILES-MINIMAL REQ-INIT-GIT-CLEAN
 * @param projectName - Name of the project directory (and npm package name).
 * @returns An object containing the project directory path and the Git initialization result.
 */
export async function initializeTemplateProjectWithGit(
  projectName: string,
): Promise<{ projectDir: string; git: GitInitResult }> {
  const trimmedName = projectName.trim();
  if (!trimmedName) {
    throw new Error('Project name must be a non-empty string');
  }
  const projectDir = await scaffoldProject(trimmedName);
  const git = await initializeGitRepository(projectDir);
  return { projectDir, git };
}
