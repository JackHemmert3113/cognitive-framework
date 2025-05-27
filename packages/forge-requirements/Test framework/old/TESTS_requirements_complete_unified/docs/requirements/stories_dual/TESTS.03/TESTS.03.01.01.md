# TESTS.03.01.01 – Define shared type definitions

---

## 🧑‍💻 Human Format (Product Intent)

**As** a full-stack engineer,  
**I want** shared `.d.ts` type definitions for core test framework entities,  
**So that** I can build and refactor test features confidently with accurate types in both frontend and backend projects.

### ✅ Acceptance Criteria
- Entities covered:
- Workout
- Meal
- UserProfile
- HealthMetrics
- TestScenario
- AC is verified by automated test runs in CI
- Any regression causes a visible failure with actionable logs

---

## 🤖 AI Format (Execution Structure)

**Objective:**  
Implement support for these entities:
- Workout
- Meal
- UserProfile
- HealthMetrics
- TestScenario

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

- [ ] Define `Workout` interface in `shared/types/workout.d.ts`
- [ ] Define `Meal` and `UserProfile` in their own `.d.ts` files
- [ ] Document each interface with JSdoc comments for AI parsing
- [ ] Create `shared/types/index.d.ts` barrel export
- [ ] Replace duplicated types in `formcoach-web` and `backend` with imports from shared types
- [ ] Run `tsc` in both packages to ensure compatibility
