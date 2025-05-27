# Requirements Documentation

This folder contains the canonical requirements contract, a worked example, and all future requirements artifacts for this project.

## Structure

- **contract.md** — The requirements format contract (canonical source)
- **example.md** — A full example showing how requirements should be written and cross-linked
- **PROMPTS.md** — AI-ready prompts for generating requirements and specs by persona
- **template-product-owner.md** — Requirements template for Product Owners/Business Stakeholders
- **template-developer.md** — Requirements template for Technical Leads/Developers
- **template-qa.md** — Requirements template for QA/Reviewers
- **template-non-technical.md** — Requirements template for non-technical contributors
- **vision/** — Vision statements
- **business-value/** — Business value definitions
- **epics/** — Epics
- **features/** — Features
- **stories/** — User stories
- **tasks/** — Tasks
- **acceptance-criteria/** — Acceptance Criteria
- **requests/** — Customer Requests
- **requirements-index.md** — (Optional) Tabular summary of requirements and status

## How to Use

1. **Start with `contract.md`**  
   All requirements must use the templates and conventions defined in `contract.md`.

2. **Refer to `example.md`**  
   See a canonical example of how to document and link requirements at multiple levels.

3. **Use the templates and prompts**  
   - Find persona-specific templates (`template-*.md`) and AI prompts (`PROMPTS.md`) in this folder.
   - Use these when drafting new requirements, specs, or test plans—either directly, or as prompts for AI tools.

4. **Add new requirements**  
   Place new requirements in the appropriate subfolder (e.g., features, epics, stories), using the templates and ID conventions.

5. **Cross-link artifacts**  
   Use markdown links and unique IDs to connect related requirements, customer requests, issues, and PRs.

6. **Keep metadata updated**  
   Update status, owner, and other metadata fields as work progresses.

## Why This Format?

- Ensures consistency and traceability
- Enables AI and automation to parse and validate requirements
- Makes onboarding and collaboration easier

## Questions?

See the FAQ in `contract.md` or ask in the project chat.

---
**New:**  
- See [`PROMPTS.md`](./PROMPTS.md) for ready-to-use AI prompts by persona.
- See the persona-specific templates (`template-*.md`) for a quick start on requirements, specs, and reviews.