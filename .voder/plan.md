## NOW

- [ ] Remove the tracked sample-project-exec-test generated project directory from the source tree so that no committed files from that project remain in the repository.

## NEXT

- [ ] Ensure the ignore rules explicitly prevent any future sample-project-exec-test project directories from being added to version control so that generated projects stay out of the tracked codebase.
- [ ] Ensure that all remaining tracked source and documentation files conform to the configured formatting rules so that a fresh checkout has no formatting violations.
- [ ] Verify that, on a clean codebase, the lint and format commands for the lint/format story (lint, lint with fixes, format, and format check) all complete successfully without reporting issues, satisfying the story’s acceptance criteria.

## LATER

- [ ] Extend repository hygiene tests or ignore rules to cover any other common generated-project directory names so that accidental commits of generated projects are systematically prevented.
- [ ] Document in the development setup guide that generated sample projects must be created only in temporary directories and never committed, reinforcing the expectations behind the lint/format and repo-hygiene stories.
