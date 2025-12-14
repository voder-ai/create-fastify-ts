/**
 * Type-level tests for the public API exports of this package.
 *
 * These tests are validated by the TypeScript compiler when you run
 * `npm run type-check`. If any of the expectations below become false
 * (for example, because a public API type changes in a breaking way),
 * the type-check step will fail.
 *
 * @supports docs/stories/004.0-DEVELOPER-TESTS-RUN.story.md REQ-TEST-EXAMPLES REQ-TEST-TYPESCRIPT
 */
import type {
  initializeTemplateProject,
  initializeTemplateProjectWithGit,
  GitInitResult,
} from './index.js';

/**
 * Utility type that checks whether two types A and B are exactly equal.
 *
 * When A and B are equal, this resolves to `true`; otherwise it resolves
 * to `false`. Combined with `Expect<...>`, this enables type-level tests
 * that fail compilation when expectations are not met.
 */
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/**
 * Utility type that asserts the provided condition is `true`.
 *
 * If `T` is not assignable to `true`, TypeScript will report a type error
 * at the site where `Expect` is instantiated.
 */
type Expect<T extends true> = T;

/**
 * [REQ-TEST-EXAMPLES] initializeTemplateProject returns a Promise<string>.
 */
export type InitializeTemplateProjectReturnsPromiseOfString = Expect<
  Equal<ReturnType<typeof initializeTemplateProject>, Promise<string>>
>;

/**
 * [REQ-TEST-EXAMPLES] initializeTemplateProjectWithGit returns a Promise
 * of an object containing a projectDir string and a GitInitResult.
 */
type ExpectedInitializeTemplateProjectWithGitReturn = Promise<{
  projectDir: string;
  git: GitInitResult;
}>;

export type InitializeTemplateProjectWithGitReturnType = Expect<
  Equal<
    ReturnType<typeof initializeTemplateProjectWithGit>,
    ExpectedInitializeTemplateProjectWithGitReturn
  >
>;

/**
 * [REQ-TEST-EXAMPLES] GitInitResult exposes the expected shape.
 */
type ExpectedGitInitResultShape = {
  projectDir: string;
  initialized: boolean;
  stdout?: string;
  stderr?: string;
  errorMessage?: string;
};

export type GitInitResultMatchesExpectedShape = Expect<
  Equal<GitInitResult, ExpectedGitInitResultShape>
>;
