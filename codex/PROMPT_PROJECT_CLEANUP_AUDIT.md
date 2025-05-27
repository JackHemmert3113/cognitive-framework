# \ud83d\udce2 Codex Prompt: Project Structure Audit & Cleanup

**CRITICAL**: Perform a COMPLETE directory audit of cognitive-framework. Multiple reviews have missed duplicate packages and structural issues.

**Date**: 2025-05-27  
**User**: JackHemmert3113

---

## \ud83c\udf1f Objectives

1. Find ALL duplicate packages/directories
2. Identify the canonical version of each package
3. Remove obsolete/duplicate code
4. Standardize the monorepo structure
5. Create a manifest of what was cleaned

---

## \ud83d\udd0d Required Audit Steps

### Step 1: Safety First
```bash
# Check git status - must be clean
git status

# Create safety backup
cp -r . ../cognitive-framework-backup-2025-05-27
```

### Step 2: Full Directory Scan
```bash
# List ALL directories that look like packages
find . -name "package.json" -not -path "*/node_modules/*" | sort

# Find duplicate package names
find . -name "package.json" -not -path "*/node_modules/*" -exec grep -H '"name"' {} \; | sort

# Find test/framework directories at all levels
find . -type d \( -name "*test*" -o -name "*framework*" -o -name "*dual*" \) -not -path "*/node_modules/*" | sort
```

### Step 3: Known Issues to Fix
- `/ai-test-framework` \u2192 Move to `/packages/ai-test-framework`
- `/packages/test-framework` \u2192 Delete (old version)
- Any other root-level packages \u2192 Move to `/packages/`

### Step 4: Execute Cleanup
```bash
# Move ai-test-framework to packages
mv ai-test-framework packages/ai-test-framework

# Remove old test-framework
rm -rf packages/test-framework

# Update package.json references if needed
find . -name "package.json" -not -path "*/node_modules/*" -exec sed -i '' 's|"@bradtech/test-framework"|"@cognitive/ai-test-framework"|g' {} \;
```

### Step 5: Create Cleanup Manifest
Create file `CLEANUP_MANIFEST.md` with this content:

```
# Cleanup Manifest - 2025-05-27

## Duplicates Found and Resolved
- ai-test-framework: Found at / and /packages/test-framework
  - Action: Moved /ai-test-framework to /packages/ai-test-framework
  - Action: Deleted /packages/test-framework (old placeholder version)

## Final Structure
cognitive-framework/
├── packages/
│   ├── ai-test-framework/
│   ├── dual-mode/
│   ├── adaptive-wellness/
│   └── [all other packages]
├── codex/
├── docs/
└── [NO PACKAGES AT ROOT LEVEL]

## Verification Complete
- No duplicate packages exist
- All packages in /packages directory
- All imports updated
- Git status clean
```

### Step 6: Verify Everything Works
```bash
# Run install to verify dependencies
npm install

# Run tests if they exist
npm test

# Final structure check
tree -L 2 -d packages/
```

---

## \ud83d\udea8 Checks That MUST NOT Be Skipped

1. Search for partial name matches (test vs ai-test, etc.)
2. Verify no package.json files at root except main one
3. Check for directories with code but no package.json
4. Ensure all cross-references between packages still work

---

## \ud83c\udf1f Success Criteria

- \u2705 No duplicate packages exist
- \u2705 All packages are in /packages directory  
- \u2705 No package directories at root level
- \u2705 CLEANUP_MANIFEST.md created
- \u2705 All tests pass
- \u2705 Git diff shows only moves, no lost code

---

## \ud83d\udccb Final Output

1. Create `CLEANUP_MANIFEST.md` in root
2. Update root `README.md` with correct structure
3. Commit with message: "chore: standardize monorepo structure, remove duplicates"
