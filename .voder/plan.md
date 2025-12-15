## NOW

- [ ] Update the configuration guide so that the section describing LOG_LEVEL and NODE_ENV in the generated server, along with any references to the security overview file, precisely matches the actual logging behavior and uses proper Markdown links instead of code-formatted file paths.

## NEXT

- [ ] Adjust the Security Overview and any related README sections so that all descriptions of default Helmet usage and logging behavior in generated projects are strictly aligned with what the template server currently does, neither under- nor over-stating features.
- [ ] Scan all user-facing documentation files for remaining plain-text or code-formatted references to other docs and convert them into proper Markdown links where appropriate to improve navigability and consistency.
- [ ] Create a concise contributor checklist document that summarizes, in one place, the expectations for adding new features or stories, including required commit conventions, traceability annotations, and test coverage obligations, and link to it from the existing contributing guidance.

## LATER

- [ ] Add a brief CI/CD overview subsection to the main README that explains, at a high level, how the single pipeline runs on each push to main and triggers semantic-release, and link from there to the internal development guide for deeper details.
- [ ] Review a small set of key exported functions for missing or file-level-only @supports annotations and add per-function traceability comments where absent, starting with modules that are most relevant to users (like the public initializer API).
- [ ] Extend the internal development guide with a short catalog of existing GitHub workflows (and any future ones) describing their purpose and how they relate to the primary CI/CD Pipeline, ensuring that any additions remain complementary instead of duplicating checks.
