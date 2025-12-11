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

/**
 * Shape of the generated package.json file for a new project.
 */
interface TemplatePackageJson {
  name: string;
  version: string;
  private: boolean;
  type: 'module';
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

/**
 * Create the in-memory representation of package.json for a new project.
 *
 * @supports docs/stories/001.0-DEVELOPER-TEMPLATE-INIT.story.md REQ-INIT-FILES-MINIMAL REQ-INIT-ESMODULES REQ-INIT-TYPESCRIPT
 * @param projectName - The npm package name for the new project.
 * @returns A plain object ready to be stringified to package.json.
 */
function createTemplatePackageJson(projectName: string): TemplatePackageJson {
  const normalizedName = projectName.trim();

  return {
    name: normalizedName,
    version: '0.0.0',
    private: true,
    type: 'module',
    // Placeholder scripts: these will be fully wired up in later stories.
    scripts: {
      dev: "echo 'TODO: implement dev server in story 003.0-DEVELOPER-DEV-SERVER' && exit 1",
      build: "echo 'TODO: implement build pipeline in story 006.0-DEVELOPER-BUILD' && exit 1",
      start:
        "echo 'TODO: implement production start in story 003.0-DEVELOPER-DEV-SERVER' && exit 1",
    },
    // Minimal runtime dependency required by the template-init story.
    dependencies: {
      fastify: '^5.6.2',
    },
    // TypeScript is required for the initialized project.
    devDependencies: {
      typescript: '^5.9.3',
    },
  };
}

/**
 * Resolve the absolute path to the directory containing template files.
 *
 * The template-files directory is always resolved as a sibling of this
 * module's directory, regardless of whether it is running from src or dist.
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
 * Initialize a new Fastify TypeScript project in a directory relative to the
 * current working directory.
 *
 * This function is the core of the npm init template behavior. Higher-level
 * CLI entry points (wired up in later steps) will delegate to this function.
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

  const projectDir = path.resolve(process.cwd(), trimmedName);

  // Ensure the target directory exists. Using recursive: true keeps behavior
  // simple for the initial implementation; more nuanced handling of existing
  // directories will be added in later stories.
  await fs.mkdir(projectDir, { recursive: true });

  const pkgJson = createTemplatePackageJson(trimmedName);
  const pkgJsonPath = path.join(projectDir, 'package.json');

  // Write package.json with a trailing newline for POSIX friendliness.
  const fileContents = `${JSON.stringify(pkgJson, null, 2)}\n`;
  await fs.writeFile(pkgJsonPath, fileContents, 'utf8');

  // Copy additional minimal project files from template assets.
  const templateDir = getTemplateFilesDir();

  // Ensure src directory exists before writing src/index.ts.
  const srcDir = path.join(projectDir, 'src');
  await fs.mkdir(srcDir, { recursive: true });

  // src/index.ts
  await copyTextTemplate(
    templateDir,
    path.join('src', 'index.ts.template'),
    path.join(srcDir, 'index.ts'),
  );

  // tsconfig.json
  await copyTextTemplate(
    templateDir,
    'tsconfig.json.template',
    path.join(projectDir, 'tsconfig.json'),
  );

  // README.md with project name substitution.
  await copyTextTemplate(templateDir, 'README.md.template', path.join(projectDir, 'README.md'), {
    '{{PROJECT_NAME}}': trimmedName,
  });

  // .gitignore
  await copyTextTemplate(templateDir, '.gitignore.template', path.join(projectDir, '.gitignore'));

  return projectDir;
}
