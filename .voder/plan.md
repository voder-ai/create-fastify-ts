## NOW

- [ ] Update the continuous integration workflow so that every change to the main branch runs an automatic dependency vulnerability scan and fails the pipeline when high‑severity issues are detected.

## NEXT

- [ ] Create an internal architecture decision record that documents the chosen dependency security scanning tool, the severity thresholds that block releases, and how this scan fits into the unified CI/CD pipeline.
- [ ] Update the internal development documentation to explain that the CI pipeline now enforces a dependency security gate on every main-branch change, including what types of issues will block a merge and how contributors should respond to a failed security check.
- [ ] Enhance the CI workflow with a non-blocking step that reports safe, mature dependency upgrade opportunities from the aging-based dependency tool so maintainers can easily see recommended updates without breaking the pipeline.

## LATER

- [ ] Introduce a broader code-level security scanner into the same CI workflow to catch insecure patterns, hardcoded secrets, and other vulnerabilities beyond dependency issues, keeping it aligned with the existing quality and deployment steps.
- [ ] Periodically refine the dependency vulnerability thresholds and scanning configuration based on project experience, ensuring the pipeline remains both secure and practical as the dependency landscape evolves.
