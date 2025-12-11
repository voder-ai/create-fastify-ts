# Building an npm Create Initializer Package

## Overview

This guide explains how to create an npm initializer package (also known as a `create-*` package) that allows users to scaffold new projects using the `npm create` command pattern. This is the same pattern used by popular tools like Vite, Next.js, and Create React App.

## What is npm create?

When you run `npm create <name>`, npm automatically:

1. Transforms the name following specific conventions
2. Downloads and installs the corresponding `create-<name>` package
3. Executes the package's main bin script via `npm exec`

### Name Transformation Rules

npm applies these transformations to initializer names:

```bash
npm init foo                 -> npm exec create-foo
npm init @usr/foo            -> npm exec @usr/create-foo
npm init @usr                -> npm exec @usr/create
npm init @usr@2.0.0          -> npm exec @usr/create@2.0.0
npm init @usr/foo@2.0.0      -> npm exec @usr/create-foo@2.0.0
```

**Example**: When you run `npm create vite@latest`, npm actually executes `create-vite@latest`.

## Step-by-Step Implementation

### 1. Create Package Structure

First, create your package directory and initialize it:

```bash
mkdir create-my-project
cd create-my-project
npm init
```

### 2. Configure package.json

Your `package.json` needs these essential fields:

```json
{
  "name": "create-my-project",
  "version": "0.0.1",
  "description": "Project initializer for my-project",
  "bin": "index.js",
  "keywords": ["create", "initializer", "template", "scaffold"],
  "license": "MIT"
}
```

**Key Points**:

- **`name`**: Must follow `create-*` naming convention
- **`bin`**: Points to the executable script (can be a string for single bin or object for multiple)
- **`keywords`**: Help users discover your package on npm

### 3. Create the Executable Script

Create `index.js` (or your chosen bin file):

```javascript
#!/usr/bin/env node

// Import required modules
const { argv } = require('node:process');
const path = require('node:path');
const fs = require('node:fs');

// Get project name from arguments
const projectName = argv[2] || 'my-app';
const targetDir = path.resolve(process.cwd(), projectName);

console.log(`Creating project: ${projectName}`);

// Create project directory
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Your scaffolding logic here
// - Copy template files
// - Generate package.json
// - Install dependencies
// - Initialize git repository
// etc.

console.log('Project created successfully!');
console.log(`\nNext steps:`);
console.log(`  cd ${projectName}`);
console.log(`  npm install`);
console.log(`  npm run dev`);
```

**Critical**: The first line `#!/usr/bin/env node` is **required** for the script to execute with Node.js.

### 4. Accept Arguments and Options

For more advanced CLIs, use argument parsing libraries:

```javascript
#!/usr/bin/env node

const { argv } = require('node:process');

// Simple argument parsing
const projectName = argv[2];
const template = argv.find(arg => arg.startsWith('--template='))?.split('=')[1];

console.log(`Project: ${projectName}`);
console.log(`Template: ${template || 'default'}`);
```

**Recommended Libraries**:

- [yargs](https://github.com/yargs/yargs) - Full-featured command-line parser
- [prompts](https://github.com/terkelg/prompts) - Interactive prompts
- [commander](https://github.com/tj/commander.js) - Command-line interface framework
- [oclif](https://github.com/oclif/core) - Framework for building CLIs

**Example with arguments**:

```bash
npm create my-project@latest my-app -- --template=react-ts
#                               ↑              ↑
#                         project name    template option
```

**Note**: The extra `--` is necessary for npm to pass arguments to your CLI (not required for Yarn or pnpm).

## Testing Locally

### Option 1: Using npm exec

Test your package directly without installing:

```bash
npm exec .
# or with arguments
npm exec . -- my-test-app --template=typescript
```

### Option 2: Using npm link

Install your package globally for testing with `npm create`:

```bash
# In your package directory
npm link

# Now test it
npm create my-project my-test-app

# Unlink when done
npm unlink -g create-my-project
```

**Note**: When using the linked package, omit `@latest` as npm will look for the package on the registry if you include it.

## Common Implementation Patterns

### 1. Copy Template Files

```javascript
const fs = require('node:fs');
const path = require('node:path');

function copyTemplate(templateDir, targetDir) {
  const files = fs.readdirSync(templateDir);

  for (const file of files) {
    const srcPath = path.join(templateDir, file);
    const destPath = path.join(targetDir, file);

    if (fs.statSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyTemplate(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Store templates in your package
const templateDir = path.join(__dirname, 'templates', 'default');
copyTemplate(templateDir, targetDir);
```

### 2. Generate package.json

```javascript
const packageJson = {
  name: projectName,
  version: '0.1.0',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'vite build',
    test: 'vitest',
  },
  dependencies: {},
  devDependencies: {},
};

fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));
```

### 3. Install Dependencies

```javascript
const { execSync } = require('node:child_process');

console.log('Installing dependencies...');
execSync('npm install', {
  cwd: targetDir,
  stdio: 'inherit', // Show output to user
});
```

### 4. Initialize Git Repository

```javascript
const { execSync } = require('node:child_process');

try {
  execSync('git init', { cwd: targetDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: targetDir, stdio: 'inherit' });
  execSync('git commit -m "Initial commit from create-my-project"', {
    cwd: targetDir,
    stdio: 'inherit',
  });
  console.log('Git repository initialized');
} catch (error) {
  console.log('Git initialization skipped');
}
```

## Publishing to npm

### 1. Prepare for Publishing

Ensure your package is ready:

```bash
# Test your package
npm exec .

# Check what will be published
npm pack --dry-run

# Login to npm (if not already)
npm login
```

### 2. Publish

```bash
# Publish to npm
npm publish

# For scoped packages (e.g., @myorg/create-app)
npm publish --access public
```

### 3. Update Versions

Follow semantic versioning:

```bash
# Patch release (0.0.1 -> 0.0.2)
npm version patch

# Minor release (0.0.2 -> 0.1.0)
npm version minor

# Major release (0.1.0 -> 1.0.0)
npm version major

# Publish the new version
npm publish
```

## Best Practices

### 1. Package Structure

```
create-my-project/
├── index.js              # Main executable
├── templates/            # Template files
│   ├── default/
│   ├── typescript/
│   └── minimal/
├── lib/                  # Helper modules
│   ├── copy-template.js
│   ├── install-deps.js
│   └── prompts.js
├── package.json
├── README.md
└── LICENSE
```

### 2. Interactive Prompts

Use prompts for better user experience:

```javascript
const prompts = require('prompts');

const response = await prompts([
  {
    type: 'text',
    name: 'projectName',
    message: 'Project name:',
    initial: 'my-app',
  },
  {
    type: 'select',
    name: 'template',
    message: 'Select a template:',
    choices: [
      { title: 'TypeScript', value: 'typescript' },
      { title: 'JavaScript', value: 'javascript' },
      { title: 'Minimal', value: 'minimal' },
    ],
  },
]);
```

### 3. Error Handling

```javascript
try {
  // Your scaffolding logic
  fs.mkdirSync(targetDir, { recursive: true });
} catch (error) {
  console.error(`Error creating project: ${error.message}`);
  process.exit(1);
}
```

### 4. Clear User Feedback

```javascript
console.log('✨ Creating project...');
console.log('📦 Installing dependencies...');
console.log('✅ Project created successfully!\n');
console.log('Next steps:');
console.log(`  cd ${projectName}`);
console.log(`  npm run dev`);
```

### 5. Validate Input

```javascript
function validateProjectName(name) {
  if (!name) {
    console.error('Error: Project name is required');
    process.exit(1);
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    console.error('Error: Project name can only contain lowercase letters, numbers, and hyphens');
    process.exit(1);
  }

  if (fs.existsSync(path.resolve(process.cwd(), name))) {
    console.error(`Error: Directory "${name}" already exists`);
    process.exit(1);
  }
}
```

## Utility Libraries

### Helper Packages for Building Initializers

- **[base-create](https://npm.im/base-create)** - Utility to simplify writing npm initializers
- **[base-create-monorepo](https://npm.im/base-create-monorepo)** - Helper for monorepo initializers
- **[degit](https://github.com/Rich-Harris/degit)** - Clone git repositories without history
- **[fs-extra](https://github.com/jprichardson/node-fs-extra)** - Enhanced file system methods
- **[chalk](https://github.com/chalk/chalk)** - Terminal string styling
- **[ora](https://github.com/sindresorhus/ora)** - Elegant terminal spinners

### Example with Utilities

```javascript
#!/usr/bin/env node

const prompts = require('prompts');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');

async function main() {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'Project name:',
    initial: 'my-app',
  });

  const spinner = ora('Creating project...').start();

  try {
    await fs.copy('./templates/default', `./${response.name}`);
    spinner.succeed(chalk.green('Project created!'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}

main();
```

## Security Considerations

**Important**: npm initializers execute arbitrary code on users' machines. Consider these security practices:

1. **Minimize dependencies**: Fewer dependencies = smaller attack surface
2. **Pin versions**: Use exact versions in package.json
3. **Audit dependencies**: Run `npm audit` regularly
4. **Validate input**: Sanitize all user input to prevent injection attacks
5. **Avoid eval()**: Never use `eval()` or similar dynamic code execution
6. **Clear documentation**: Document what your package does
7. **Use official packages**: Prefer well-maintained, official packages

**For Users**: Only run initializers from trusted sources. Review the package on npm and GitHub before running.

## Examples in the Wild

Popular npm initializer packages to study:

- **[create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)** - Vite project scaffolding
- **[create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)** - Next.js application generator
- **[create-react-app](https://github.com/facebook/create-react-app)** - React application setup
- **[create-vue](https://github.com/vuejs/create-vue)** - Vue.js project scaffolding
- **[create-playwright](https://github.com/microsoft/playwright)** - Playwright test setup

## Monorepo Initializers

For creating monorepo templates, consider:

```javascript
// Create workspace structure
fs.mkdirSync(path.join(targetDir, 'packages'), { recursive: true });

// Create multiple packages
const packages = ['package-a', 'package-b'];
for (const pkg of packages) {
  const pkgDir = path.join(targetDir, 'packages', pkg);
  fs.mkdirSync(pkgDir, { recursive: true });

  // Copy package template
  copyTemplate('./templates/package', pkgDir);
}

// Create root package.json with workspace configuration
const rootPackageJson = {
  name: projectName,
  private: true,
  workspaces: ['packages/*'],
  scripts: {
    dev: 'turbo run dev',
    build: 'turbo run build',
  },
  devDependencies: {
    turbo: '^1.10.0',
  },
};
```

## Testing Your Initializer

### Automated Testing

```javascript
// test/create.test.js
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

describe('create-my-project', () => {
  const testDir = path.join(__dirname, 'tmp');

  beforeEach(() => {
    fs.ensureDirSync(testDir);
  });

  afterEach(() => {
    fs.removeSync(testDir);
  });

  it('should create project structure', () => {
    execSync('node ../index.js test-app', { cwd: testDir });

    const projectDir = path.join(testDir, 'test-app');
    expect(fs.existsSync(projectDir)).toBe(true);
    expect(fs.existsSync(path.join(projectDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, 'src'))).toBe(true);
  });
});
```

## Continuous Improvement

1. **Gather feedback**: Monitor issues and discussions on GitHub
2. **Version updates**: Keep dependencies and templates up-to-date
3. **Add templates**: Expand template options based on user needs
4. **Improve DX**: Make the CLI more intuitive and helpful
5. **Document thoroughly**: Keep README and guides current

## Additional Resources

- [npm init documentation](https://docs.npmjs.com/cli/commands/npm-init)
- [npm exec documentation](https://docs.npmjs.com/cli/commands/npm-exec)
- [Publishing packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Search create-\* packages on npm](https://www.npmjs.com/search?q=create-)

## Summary

Creating an npm initializer package involves:

1. ✅ Name your package `create-*`
2. ✅ Add a `bin` field pointing to your executable script
3. ✅ Start your script with `#!/usr/bin/env node`
4. ✅ Implement scaffolding logic (copy templates, generate files, etc.)
5. ✅ Test locally with `npm exec .` and `npm link`
6. ✅ Publish to npm with `npm publish`
7. ✅ Users run with `npm create your-package@latest`

This pattern enables you to create powerful, reusable project scaffolding tools that speed up development workflows and ensure consistency across projects.
