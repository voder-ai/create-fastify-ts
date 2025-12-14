## NOW

- [ ] Stop tracking the duplication report JSON file by removing `report/jscpd-report.json` from the tracked project files and adding an ignore rule so future duplication reports are treated as generated artifacts rather than committed source.

## NEXT

- [ ] Extend the pre-push hook configuration so that it also runs the dependency security audit, matching the audit step that already runs in the continuous integration workflow.
- [ ] Extend the pre-push hook configuration so that it also runs the lint and format smoke test, ensuring local pushes exercise the same lint/format safety net as the continuous integration workflow.
- [ ] Update the version-control or development-setup documentation to describe the expected local workflow, including the full set of checks that run automatically before pushes and how they align with the continuous integration pipeline.

## LATER

- [ ] Introduce an ignore rule and convention for any future generated analysis reports (such as coverage or duplication outputs) so they are never accidentally committed, and update contributor documentation to clarify this policy.
- [ ] Add a brief maintenance guideline that any new quality checks added to the continuous integration workflow must also be wired into the pre-push hook, keeping local and remote quality gates in sync over time.
- [ ] If duplication checking becomes part of the standard workflow, add a dedicated script and optional pre-push hook step for running the duplication check, while keeping its reports untracked and ignored.
