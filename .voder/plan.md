## NOW

- [ ] Ensure the lint auto-fix and format auto-fix commands work end‑to‑end by correcting any broken tooling configuration or dependencies so that running the lint auto-fix command and the format auto-fix command on deliberately misformatted code successfully rewrites the files without errors.

## NEXT

- [ ] Update the developer documentation (including the lint/format story if needed) so it clearly describes the now-working lint and format auto-fix commands and how contributors should use them in their workflow.
- [ ] Add or adjust a small safeguard (for example, a dedicated check in the quality scripts or a lightweight test) that exercises the lint and format auto-fix commands in a controlled way to prevent them from silently regressing in future changes.

## LATER

- [ ] Gradually introduce any additional linting rules or formatting conventions required by future stories using the prescribed one-rule-at-a-time, suppress-then-fix workflow.
- [ ] Extend contributor guidance to include recommended editor integrations for ESLint and Prettier so that most formatting and lint issues are prevented before running the command-line tools.
