# REQUIREMENTS_PROMPT_SCHEMA.md

This schema defines how AI agents should traverse and utilize the Adaptive Testing Requirements System.

---

## 🧭 Hierarchical Structure

```
Vision
 └── Epic
       └── Feature
             └── Story
```

Each level contains standardized sections for consistent prompting and context interpretation.

---

## 📐 File Format Per Level

### 🔭 Vision

- Describes the strategic end-goal of the test system
- File: `vision/TESTS.vision.md`

### 💰 Business Value

- Defines key metrics or outcomes that justify delivery
- File: `business-value/TESTS.business-value.md`

### 🧱 Epic

- Format: `epics/TESTS.<epic_num>.md`
- Sections:
  - ❗ Problem
  - 🎯 Goal
  - 📦 Scope
  - 🔗 Related: vision + features

### 🧩 Feature

- Format: `features/TESTS.<epic_num>.<feature_num>.md`
- Sections:
  - 🧩 Capability
  - 💡 Benefit
  - ✅ Validation
  - 🔗 Related: epic + stories

### 🧪 Story

- Format: `stories/TESTS.<epic_num>.<feature_num>.<story_num>.md`
- Sections:
  - 🧑‍💻 Human Format
  - ✅ Acceptance Criteria
  - 🤖 AI Format
  - 📋 Tasks
  - 🔗 Related: feature

---

## 🧠 Agent Prompting Conventions

| Goal | Prompt |
|------|--------|
| Retrieve all stories under an epic | "List all stories under TESTS.03" |
| Find validation criteria for a feature | "What defines done for TESTS.03.03?" |
| Link a story to its business value | "Trace from TESTS.03.03.01 to the business goal" |
| Generate code for a story | "Read TESTS.03.03.01.md and implement the AI format tasks" |
| Suggest a new story for a feature | "Based on TESTS.03.03.md, propose a new test story" |

---

## 🧰 Tips

- Traverse from top → bottom to understand context
- Traverse bottom → top to trace value or impact
- Each story is atomic; features are deliverable; epics are systemic
