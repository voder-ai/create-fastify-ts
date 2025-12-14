## NOW

- [ ] Update the main README and the user security and API documentation so that descriptions of security headers and logging behavior for newly generated projects exactly match the current implementation, explicitly distinguishing any stub-only features and removing or rewording claims that generated projects already use Helmet or environment-driven log levels when they do not.

## NEXT

- [ ] Align the generated project README template with the updated central documentation by adjusting its sections on endpoints, logging, and security so that a freshly scaffolded project’s README is fully consistent with its actual behavior.
- [ ] Refine the Node version enforcement error messages in the version-check script to replace internal repository path references with user-friendly text that points to the public documentation rather than to non-existent local files in npm installs.
- [ ] Introduce a concise user-facing configuration guide in the user documentation that summarizes supported environment variables (such as port and log level) and their effects on both the stub server and generated projects, ensuring the guide is consistent with current code behavior.

## LATER

- [ ] Once the documentation and template README are fully aligned with current behavior, extend the generated project server implementation to use Helmet and environment-driven logging and then update the docs again to describe the new capabilities accurately.
- [ ] Add example .env.example files for both the template repository and generated projects and document their usage in the user configuration guide, focusing on safe patterns for environment-based configuration.
- [ ] Establish a lightweight documentation change checklist in the internal development docs that explicitly calls out which user-facing files must be updated when security, logging, or CLI behavior changes, to keep future documentation in sync with the implementation.
