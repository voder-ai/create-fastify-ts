# .voder Directory

This directory contains internal metadata and tooling state used by the voder.ai assistant to assess and evolve this repository.

## Version Control Policy

- The **.voder directory itself is tracked** in git so that key metadata files can evolve alongside the codebase.
- The **.voder/traceability/** subdirectory contains generated reports and derived data and **must remain ignored** from version control.
- Additional transient or large report files under .voder should also be ignored on a case-by-case basis via `.gitignore` patterns (for example, JSON snapshots or HTML reports), but the directory structure and stable markdown metadata files should be committed.

## Developer Guidance

- Do **not** add ignore rules that exclude the entire `.voder/` directory.
- When adding new persistent metadata under `.voder/`, prefer human-readable formats (Markdown or JSON) that can be reviewed in code review.
- Treat `.voder` contents as part of the project’s internal documentation and governance, similar to `docs/`.
