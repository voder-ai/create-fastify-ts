## NOW

- [ ] Stop tracking the jscpd duplication report file and ensure it is treated as an ignored generated artifact so it no longer affects formatting checks on a fresh checkout.

## NEXT

- [ ] Ensure that with the duplication report ignored, the formatting check on a clean working copy completes successfully without reporting any files, satisfying the story’s requirement that the template is format-clean by default.
- [ ] If the lint/format story includes explicit checklist items about a clean repository or generated artifacts, update the story file’s checkboxes to reflect that the format check now passes on a fresh checkout.

## LATER

- [ ] Document briefly in the development setup or tooling docs that duplication reports are generated artifacts and are intentionally not tracked, so contributors know how to run and interpret duplication analysis.
- [ ] Consider refining duplication tooling configuration (such as output paths or additional options) once the lint/format story is fully complete, keeping formatting and version-control behavior stable.
