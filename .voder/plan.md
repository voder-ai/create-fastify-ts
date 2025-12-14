## NOW

- [ ] Add a new automated test that starts a generated template service and asserts that an HTTP response (for example from the `/health` endpoint) includes the expected Helmet security headers, with the test annotated to support story 005.0-DEVELOPER-SECURITY-HEADERS and requirement REQ-SEC-HEADERS-TEST.

## NEXT

- [ ] Reuse the existing generated-project test helpers so the new security-headers test scaffolds a temporary project, builds it, starts the compiled server, performs the header assertions, and then shuts the server down and cleans up all temporary files and processes.
- [ ] Update the security-headers story and any related decision records or documentation sections to explicitly reference the new header verification test so that the documented acceptance criterion "Header Verification Test" is clearly satisfied.
- [ ] Confirm that the full automated test suite, type checking, linting, build, and formatting still succeed with the new security-headers test in place, ensuring the story is now fully implemented and non-regressive.

## LATER

- [ ] Expand the security-headers test to cover both the root (`/`) and `/health` endpoints in generated projects so that Helmet behavior is validated consistently across all default routes.
- [ ] Add brief guidance in the security or testing user documentation explaining how the security-headers test works, so users can copy the pattern into their own services when they customize Helmet or add new routes.
- [ ] If future stories introduce optional CORS support or CSP customization in code, extend the security-headers test suite to validate those headers and configurations under different environment settings.
