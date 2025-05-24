# Vision VIS-001: Empower holistic wellness for chronic conditions through adaptive, AI-driven technology

**Owner:** Jack Hemmert  
**Status:** Approved  
**Priority:** High  
**Estimate:** [TBD]  
**Tags:** vision, adaptive, chronic, ai  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** 2030-01-01  
**Team:** Adaptive Wellness

## Description
By 2030, Adaptive Wellness Systems aims to become the most trusted platform for managing chronic conditions. We will achieve this through empathetic AI-guided check-ins, adaptive fitness and nutrition plans, transparent integration of wearables and labs, and a privacy-first, user-owned data architecture.

# Business Value BV-001: Measurable improvement and engagement for chronic condition management

**Owner:** Product Team  
**Status:** Approved  
**Priority:** High  
**Estimate:** [TBD]  
**Tags:** business, growth, engagement, outcomes  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** [TBD]  
**Team:** Adaptive Wellness

## Description
Delivering actionable, measurable wellness outcomes will drive user engagement, retention, and membership growth. Our approach targets 10M U.S. adults with GI and neurological conditions, with scalable monetization through subscriptions, avatars, and B2B partnerships.

# Adaptive Wellness Systems – Full Business Plan (June 2025)

> **Note:** This document is referenced by [Vision VIS-001](vision.md) and [Business Value BV-001](business-value.md) as contextual background.  
> For requirements, see the [requirements-format.md](requirements-format.md) and linked artifacts.

## 1. Executive Summary

**Adaptive Wellness Systems** is a modular, AI-driven health platform designed to uncover flare-up triggers, adapt plans, and empower users managing chronic conditions. Our system combines **FormCoach** (intelligent fitness), **Check-In Coach** (symptom tracking), and upcoming nutrition tools into a unified experience powered by **avatars**, **biometric integration**, and **causal AI**.

We target 10M U.S. adults suffering from Crohn’s, migraines, IBS-D, and fatigue, with scalable monetization through subscriptions and avatar-driven upsells. We leverage AI copilots (ChatGPT, Junie, Grok), Azure HIPAA-compliant services, and animated guides (Sol, Maya, Kai) to drive empathy, privacy, and engagement—without founder appearances.

...

[Include full business plan here as reference; this file is for context, not a requirements artifact.]

# Epic EPIC-002: FormCoach MVP

**Business Value:** [BV-001](../business-value.md)  
**Owner:** Product Team  
**Status:** In Progress  
**Priority:** High  
**Estimate:** 30d  
**Tags:** formcoach, mvp, workouts  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** 2025-07-01  
**Team:** Adaptive Wellness

## Description
Deliver a minimum viable product for FormCoach, including adaptive workout planning, workout logging, and AI-powered avatar feedback. Prioritizes core user flow: plan workout, log session, review with feedback.

## Features
- [FEAT-010: Workout Logging](../features/feature-010-workout-logging.md)
- [FEAT-011: Adaptive Workout Planner](../features/feature-011-adaptive-planner.md)

## Related Issues/PRs
- [#122](../../issues/122): Implement MVP workout logging

## Customer Requests
- [REQ-2002: Logging Friction Feedback](../requests/req-2002-logging-friction.md)

# Feature FEAT-010: Workout Logging

**Epic:** [EPIC-002](../epics/epic-002-formcoach-mvp.md)  
**Owner:** Jack Hemmert  
**Status:** In Progress  
**Priority:** High  
**Estimate:** 8d  
**Tags:** workout, logging, formcoach  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** 2025-06-10  
**Team:** Adaptive Wellness

## Description
Enable users to log workout sessions, including exercises, sets, reps, and weights. Supports both gym and home scenarios, and provides the foundation for AI feedback and performance tracking.

## Stories
- [ST-021: User logs a workout session](../stories/story-021-user-logs-workout.md)
- [ST-022: View workout history](../stories/story-022-view-history.md)

## Acceptance Criteria
- [AC-065: Logging a workout](../acceptance-criteria/ac-065-logging.md)
- [AC-066: Required fields validation](../acceptance-criteria/ac-066-required-fields.md)

# Story ST-021: User Logs a Workout Session

**Feature:** [FEAT-010](../features/feature-010-workout-logging.md)  
**Owner:** Jack Hemmert  
**Status:** Ready for Dev  
**Priority:** High  
**Estimate:** 5h  
**Tags:** logging, ui, workout  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** 2025-05-25  
**Team:** Adaptive Wellness

## Description
As a user, I want to log my workout session with exercises, sets, reps, and weights so that I can track my progress and receive personalized feedback.

## Tasks
- [TASK-045: Implement backend API for workout logs](../tasks/task-045-backend-api-logs.md)
- [TASK-046: Design workout logging UI](../tasks/task-046-logging-ui.md)

## Acceptance Criteria
- [AC-065: Logging a workout](../acceptance-criteria/ac-065-logging.md)
- [AC-066: Required fields validation](../acceptance-criteria/ac-066-required-fields.md)

## Linked Issues/PRs
- [#123](../../issues/123): Workout logging UI implementation

# Task TASK-045: Implement Backend API for Workout Logs

**Story:** [ST-021](../stories/story-021-user-logs-workout.md)  
**Owner:** Backend Team  
**Status:** In Progress  
**Priority:** High  
**Estimate:** 3h  
**Tags:** api, backend, workout  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** 2025-05-22  
**Team:** Adaptive Wellness

## Description
Develop a REST API endpoint to create, read, and update workout logs for users. Ensure data validation for exercises, sets, reps, and weights. Integrate with Supabase and ensure security/authentication.

# Task TASK-046: Design Workout Logging UI

**Story:** [ST-021](../stories/story-021-user-logs-workout.md)  
**Owner:** Frontend Team  
**Status:** To Do  
**Priority:** Medium  
**Estimate:** 2h  
**Tags:** ui, frontend, workout  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** 2025-05-23  
**Team:** Adaptive Wellness

## Description
Design the user interface for logging a workout session, including fields for exercise selection, set/reps input, and weight entry. Should support mobile and desktop layouts and follow design system guidelines.

# Acceptance Criteria AC-065: Logging a Workout

**Priority:** High  
**Estimate:** 1h  
**Tags:** logging, workout  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** 2025-05-25  
**Team:** Adaptive Wellness

- User can add multiple exercises to a workout session.
- For each exercise, user can log sets, reps, and weight.
- Workout log is saved and retrievable from user’s history.

# Acceptance Criteria AC-066: Required Fields Validation

**Priority:** Medium  
**Estimate:** 0.5h  
**Tags:** logging, validation  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** 2025-05-25  
**Team:** Adaptive Wellness

- User cannot submit a workout log unless at least one exercise and one set are entered.
- User receives clear error messages if required fields are missing.

# Customer Request REQ-2002: Logging Friction Feedback

**Source:** Beta User (Support Ticket #5678)  
**Date:** 2025-05-10  
**Owner:** Product Team  
**Status:** Reviewed  
**Priority:** Medium  
**Estimate:** [TBD]  
**Tags:** customer, feedback, logging  
**Created:** 2025-05-20  
**Last Updated:** 2025-05-20  
**Target Date:** [TBD]  
**Team:** Adaptive Wellness

## Description
User reports that logging a workout takes too many taps and requests a faster way to repeat previous entries or auto-fill exercises from prior sessions.

## Linked Epics/Features/Stories
- [EPIC-002](../epics/epic-002-formcoach-mvp.md)
- [FEAT-010](../features/feature-010-workout-logging.md)











