# Cleanup Manifest - 2025-05-27

## Duplicates Found and Resolved
- requirements: Found at / and /packages/requirements
  - Action: Moved /requirements to /packages/requirements-old
  - Reason: /packages/requirements is the canonical version referenced in the root package.json

- dual-mode: Found at /packages/dual-mode and /packages/ai-dual-mode
  - Action: Moved /packages/ai-dual-mode to /packages/ai-dual-mode-old
  - Reason: /packages/dual-mode is the canonical version referenced in the root package.json

## Final Structure
cognitive-framework/
├── packages/
│   ├── agent-core/
│   ├── ai-core/
│   ├── ai-dual-mode-old/  (preserved for reference)
│   ├── ai-test-framework/
│   ├── dual-mode/
│   ├── forge-agent/
│   ├── requirements/
│   └── requirements-old/  (preserved for reference)
├── codex/
├── docs/
├── examples/
├── forge-agent/  (not a package, contains documentation/tests)
├── ideas/
├── scripts/
└── tools/

## Verification Complete
- No duplicate packages exist
- All packages in /packages directory
- No package directories at root level
- Git status clean

## Notes
- The issue description mentioned moving /ai-test-framework to /packages/ai-test-framework and deleting /packages/test-framework, but:
  - No /ai-test-framework directory was found at the root level
  - No /packages/test-framework directory was found
  - /packages/ai-test-framework already exists and is the canonical version
