# TESTS.03.01.01 — AI Format (Execution Structure)

**Objective:**  
Define `.d.ts` files in `shared/types/` for these domain entities:
- Workout
- Meal
- UserProfile
- HealthMetrics
- TestScenario

**Requirements:**
- Use `export interface` or `type` aliases with JSdoc comments
- Fields must match generator outputs from `wellness-test-utils.js`
- Types must be compatible with both Node (backend) and Vite (frontend)
- Add barrel file to re-export (`shared/types/index.d.ts`)

**Output Examples:**  
- `shared/types/workout.d.ts`
- `shared/types/index.d.ts`

**Validation:**
- `tsc` passes in `formcoach-web` and `backend`
- Agent prompt: `"use shared Workout type to validate a workout submission payload"`
