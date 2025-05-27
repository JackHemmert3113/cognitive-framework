# Cleanup Manifest - 2025-05-27

## Duplicates Found and Resolved
- ai-test-framework: Found at / and /packages/test-framework
  - Action: Moved /ai-test-framework to /packages/ai-test-framework
  - Action: Deleted /packages/test-framework (old placeholder version)
- dual-mode: Found at /ai-dual-mode and /packages/dual-mode
  - Action: Moved /ai-dual-mode to /packages/ai-dual-mode
  - Note: Both packages have different names (@forge/dual-mode vs @cognitive/dual-mode) and serve different purposes
- requirements: Found at / and /packages/requirements
  - Action: Moved /requirements to /packages/forge-requirements
  - Note: Both packages have different names (@forge/requirements vs @cognitive/requirements) and serve different purposes

## Other Packages Moved
- agent-core: Moved from / to /packages/agent-core

## Final Structure
cognitive-framework/
├── packages/
│   ├── agent-core/
│   ├── ai-core/
│   ├── ai-dual-mode/
│   ├── ai-test-framework/
│   ├── dual-mode/
│   ├── forge-requirements/
│   └── requirements/
├── codex/
├── docs/
├── examples/
├── forge-agent/
└── [NO PACKAGES AT ROOT LEVEL]

## Verification Complete
- No duplicate packages exist
- All packages in /packages directory
- All imports updated
- Git status clean