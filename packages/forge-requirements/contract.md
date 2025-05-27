# Requirements Format Contract

This document defines the **canonical format and conventions** for documenting requirements in the `adaptive-wellness` repository.  
All requirements—at every level—should follow these standards so that both humans and AI agents can parse, generate, and update them consistently.

---

## Table of Contents
- [Overview](#overview)
- [Hierarchy & Identifiers](#hierarchy--identifiers)
- [File & Folder Structure](#file--folder-structure)
- [Metadata Fields](#metadata-fields)
- [Format Templates](#format-templates)
  - [Vision](#vision-template)
  - [Business Value](#business-value-template)
  - [Epic](#epic-template)
  - [Feature](#feature-template)
  - [Story](#story-template)
  - [Task](#task-template)
  - [Acceptance Criteria](#acceptance-criteria-template)
  - [Customer Request](#customer-request-template)
- [Cross-linking & References](#cross-linking--references)
- [Best Practices](#best-practices)
- [FAQ](#faq)

---

## Overview

This contract ensures requirements are:
- **Consistent**: Standardized fields, order, and identifiers.
- **Traceable**: Every requirement, story, and task can be mapped to code, issues, PRs, and customer feedback.
- **AI-friendly**: Easy for AI agents and scripts to parse, update, and validate.

---

## Hierarchy & Identifiers

**Hierarchy:**
- Vision (`VIS-xxx`)
- Business Value (`BV-xxx`)
- Epic (`EPIC-xxx`)
- Feature (`FEAT-xxx`)
- Story (`ST-xxx`)
- Task (`TASK-xxx`)
- Acceptance Criteria (`AC-xxx`)
- Customer Request (`REQ-xxx`)
- Defect/Bug (`DF-xxx`)
- Enhancement (`ENH-xxx`)

**Identifier Format:**
- All items at every level must have a unique identifier, e.g., `EPIC-001`, `FEAT-002`, `ST-003`.
- Identifiers must be referenced in related issues, PRs, and documentation.

---

## File & Folder Structure

Recommended structure:
```
docs/
  requirements-format.md      # ← This contract
  vision.md
  business-value.md
  epics/
    epic-001-wellness-tracking.md
  features/
    feature-001-user-profile.md
  stories/
    story-001-create-profile.md
  tasks/
    task-001-design-profile-form.md
  acceptance-criteria/
    ac-001-profile-form-visible.md
  requests/
    req-1001-customer-x-profile.md
  requirements-index.md       # (Optional: summary table of all IDs and statuses)
```

---

## Metadata Fields

For every file, add the following fields immediately **after the Status line** and before any Description or content blocks. Leave blank (`[TBD]`) if unknown.

- **Priority:** [High / Medium / Low]
- **Estimate:** [e.g., 8h, 2d, 3 story points]
- **Tags:** [comma-separated list (lowercase), e.g., `frontend, mvp, accessibility`]
- **Created:** [YYYY-MM-DD]
- **Last Updated:** [YYYY-MM-DD]
- **Target Date:** [optional, YYYY-MM-DD]
- **Team:** [FormCoach, Adaptive Wellness, OptiVestAI, etc.]

---

## Format Templates

### Vision Template

````markdown
# Vision VIS-001: [One-sentence vision statement]

**Owner:** [Name or Team]  
**Status:** [Draft/In Progress/Approved]  
**Priority:** [High/Medium/Low]  
**Estimate:** [TBD]  
**Tags:** [TBD]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Target Date:** [TBD]  
**Team:** [TBD]

## Description
[Expanded vision statement, context, and long-term goals.]

# Business Value BV-001: [Short summary]

**Owner:** [Name or Team]  
**Status:** [Draft/In Progress/Approved]  
**Priority:** [High/Medium/Low]  
**Estimate:** [TBD]  
**Tags:** [TBD]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Target Date:** [TBD]  
**Team:** [TBD]

## Description
[What value does this bring to users/business? How does it align with vision?]

# Epic EPIC-001: [Epic Title]

**Business Value:** [BV-001 or link]  
**Owner:** [Name or Team]  
**Status:** [Draft/In Progress/Complete]  
**Priority:** [High/Medium/Low]  
**Estimate:** [e.g., 5d, 20 story points]  
**Tags:** [comma-separated]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Target Date:** [TBD]  
**Team:** [TBD]

## Description
[What is this epic? Why is it important?]

## Features
- [FEAT-001: Feature Name](../features/feature-001-feature-name.md)
- [FEAT-002: ...](...)

## Related Issues/PRs
- [#xx](../../issues/xx): [Issue/PR title] (`ST-xxx` or link)

## Customer Requests
- [REQ-1001: ...](../requests/req-1001-xxx.md)

# Feature FEAT-001: [Feature Title]

**Epic:** [EPIC-001 or link]  
**Owner:** [Name or Team]  
**Status:** [Draft/In Progress/Complete]  
**Priority:** [High/Medium/Low]  
**Estimate:** [e.g., 8h, 3 story points]  
**Tags:** [comma-separated]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Target Date:** [TBD]  
**Team:** [TBD]

## Description
[Brief feature description.]

## Stories
- [ST-001: Story Title](../stories/story-001-story-title.md)
- [ST-002: ...](...)

## Acceptance Criteria
- [AC-001](../acceptance-criteria/ac-001-xxx.md)
- [AC-002](...)

# Story ST-001: [Story Title]

**Feature:** [FEAT-001 or link]  
**Owner:** [Name or Team]  
**Status:** [Ready for Dev/In Progress/Complete]  
**Priority:** [High/Medium/Low]  
**Estimate:** [e.g., 8h, 2 story points]  
**Tags:** [comma-separated]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Target Date:** [TBD]  
**Team:** [TBD]

## Description
As a [user/role], I want [goal], so that [reason/benefit].

## Tasks
- [TASK-001: Task Title](../tasks/task-001-task-title.md)
- [TASK-002: ...](...)

## Acceptance Criteria
- [AC-001: Description](../acceptance-criteria/ac-001-xxx.md)
- [AC-002: ...](...)

## Linked Issues/PRs
- [#xx](../../issues/xx): [Issue/PR title]

# Task TASK-001: [Task Title]

**Story:** [ST-001 or link]  
**Owner:** [Name or Team]  
**Status:** [To Do/In Progress/Complete]  
**Priority:** [High/Medium/Low]  
**Estimate:** [e.g., 2h]  
**Tags:** [comma-separated]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Target Date:** [TBD]  
**Team:** [TBD]

## Description
[Task description, steps, or checklist.]

# Acceptance Criteria AC-001: [Short Description]

**Priority:** [High/Medium/Low]  
**Estimate:** [e.g., 1h]  
**Tags:** [comma-separated]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Target Date:** [TBD]  
**Team:** [TBD]

- [Criterion 1]
- [Criterion 2]

# Customer Request REQ-1001: [Short Description]

**Source:** [Customer Name/Org/Ticket #]  
**Date:** [YYYY-MM-DD]  
**Owner:** [Name or Team]  
**Status:** [Draft/In Progress/Complete]  
**Priority:** [High/Medium/Low]  
**Estimate:** [TBD]  
**Tags:** [comma-separated]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Target Date:** [TBD]  
**Team:** [TBD]

## Description
[Customer’s request, context, and desired outcome.]

## Linked Epics/Features/Stories
- [EPIC-001](../epics/epic-001-xxx.md)
- [FEAT-002](../features/feature-002-xxx.md)


Cross-linking & References

Always link IDs (e.g., [EPIC-001](../epics/epic-001-xxx.md)) in related files.
Reference IDs in commits, PRs, and issues to maintain traceability (e.g., “Implements FEAT-001, closes ST-003”).
Customer Requests should be linked to the relevant epics/features/stories.
Best Practices

Keep identifiers unique and sequential.
Update status fields as work progresses.
Enforce this format for all new requirements—AI agents and contributors should validate their outputs against this contract.
Use the [requirements-index.md] file for a summary table of all requirements and their statuses (optional, but helpful for reporting).
FAQ

Q: Can I add custom fields?
A: Yes, but keep core fields as documented for consistency.

Q: How should bugs/defects/enhancements be documented?
A: Use the same identifier scheme (DF-xxx, ENH-xxx) and templates, and link them to the relevant stories/features.

Q: How do I ensure AI agents follow this format?
A: Point them to this file and require that all generated requirements or updates adhere to these templates and conventions.

Last updated: 2025-05-20






