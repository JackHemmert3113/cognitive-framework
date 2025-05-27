<!--
MIT License
-->
# 📢 Codex Prompt: Generate Real Runnable Tests in `ai-test-framework`

**Context:**  
This prompt applies to the `ai-test-framework` package within the `cognitive-framework` monorepo. The goal is to replace placeholder test stubs with real, executable test cases that pass immediately, and to apply consistent documentation using the 🧠 Cognitive-Framework Documentation Codex.

---

## 🎯 Objectives

1. Replace placeholder tests with real, runnable assertions  
2. Parse function signatures to generate valid test inputs  
3. Ensure tests can run immediately via `npm test`  
4. Fix any failing tests in the project  
5. Apply the 🧠 Documentation Codex to all modified files  

---

## 🔁 Task Instructions

Codex, fix the `ai-test-framework` package to generate real, runnable tests instead of placeholders.

### Replace Placeholder Tests

Wherever you see:

```js
test('should test add', () => { /* TODO */ });
```

Transform it into:

```js
test('add should return sum of two numbers', () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
});
```

Use static analysis or AST parsing to:
- Detect exported function names
- Count function arguments
- Generate safe, simple test inputs
- Produce 2–3 meaningful assertions per test

If no exports are found, fall back to a minimal check:

```js
test('auto sanity check', () => {
  expect(1 + 1).toBe(2);
});
```

---

### Ensure Tests Are Runnable

- Import or require the actual module being tested
- Ensure test files conform to Node.js or Jest conventions
- All generated tests must run cleanly using `npm test`

---

### Fix All Failing Tests

- Make all existing tests pass
- Remove or rewrite broken, outdated, or placeholder tests
- Validate full test suite with: `npm test`

---

### Apply 🧠 Cognitive-Framework Documentation Codex

To each updated file:

- Add a file-level JSDoc comment like:

```js
/**
 * 🧪 <ComponentName> - Auto-generates real tests from code exports.
 *
 * This component scans for exported functions and creates meaningful, runnable tests.
 *
 * @example
 * test('add returns sum', () => expect(add(1, 2)).toBe(3));
 */
```

- Use emoji-tagged section headers in code:
  - 🚀 Quick Start
  - 🔍 Internal Design
  - 🧪 Tests
  - ⚙️ Configuration

- Add `@example` blocks to explain test output logic  
- Refactor inline comments to explain “why” not just “what”  

---

## 📈 Output Requirements

- ✅ All tests must be runnable and pass with `npm test`  
- ✅ No generated test contains `/* TODO */` or placeholder code  
- ✅ Each file has consistent doc headers and emoji markers  
- ✅ Output is clear for both junior and senior developers  

---

## 🧪 Quick Validation

After running this prompt, verify success:

```bash
cd packages/ai-test-framework
npm test  # Should pass 100%
npm run generate -- examples/sample.js  # Should create real tests
```

---

## 📂 Save This File As

```
codex/PROMPT_GENERATE_REAL_TESTS.md
```

Use this prompt as a reusable Codex or AI agent command to upgrade the testing layer in any module inside the `cognitive-framework`.
