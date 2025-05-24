# TESTS.03.02.01 – Capture visual baselines for testable flows

---

## 🧑‍💻 Human Format (Product Intent)

**As** a QA engineer,  
**I want** generate image snapshots for key user flows,  
**So that** I can detect unintended layout changes and regressions quickly.

### ✅ Acceptance Criteria
- Entities covered:
- Login screen
- Dashboard
- Workout submission
- Settings
- AC is verified by automated test runs in CI
- Any regression causes a visible failure with actionable logs

---

## 🤖 AI Format (Execution Structure)

**Objective:**  
Implement support for these entities:
- Login screen
- Dashboard
- Workout submission
- Settings

**Requirements:**
- Ensure modular and reusable implementation
- Align input/output with agent and human-facing formats
- Integrate with CI and dev workflows
- Provide logs or errors in structured output

**Validation:**
- AI agents can read and validate structure
- Engineers confirm story via tests and CLI tools

---

## 📋 Tasks

- [ ] Use Playwright to capture screenshot after each test phase
- [ ] Store snapshots in `__snapshots__` directory by test ID
- [ ] Integrate with GitHub Actions to fail PRs on visual diff mismatches
- [ ] Add ignore rules for non-critical changes (timestamps, avatars)
