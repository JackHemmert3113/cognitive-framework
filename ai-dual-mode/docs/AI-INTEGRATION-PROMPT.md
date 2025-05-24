# AI Dual Mode Integration Prompt

Copy this prompt when adding ai-dual-mode to any project:

---

## Integration Request

I want to integrate ai-dual-mode into my project. The ai-dual-mode library provides a reusable architecture for AI-enhanced developer tools with two modes:
- IDE Mode: Generates context files for AI assistants
- API Mode: Direct AI integration for automation

Please analyze my project and create an appropriate integration by:

1. Installing ai-dual-mode from `../Utilities/ai-dual-mode`
2. Creating a processor that understands my project's data/purpose
3. Adding appropriate CLI flags or integration points
4. Following the patterns in ai-dual-mode's INTEGRATION-GUIDE.md

The processor should:
- Analyze whatever data my tool processes
- Generate useful context for AI assistants
- Provide relevant prompts for common tasks
- Support both IDE and API modes when applicable

Make the integration feel natural to my project's existing structure and maintain backward compatibility.

---

## Quick Reference Examples

### For Test Tools
"Add ai-dual-mode to analyze test results. It should identify failures, coverage gaps, and generate missing tests."

### For Documentation Tools  
"Add ai-dual-mode to analyze code and generate documentation. It should find undocumented code and suggest improvements."

### For Build Tools
"Add ai-dual-mode to analyze build processes. It should identify bottlenecks and suggest optimizations."

### For Any Tool
"Add ai-dual-mode following the examples in INTEGRATION-GUIDE.md. Adapt the patterns to fit my tool's purpose."

---

## What Makes a Good Integration

The AI should:
1. Understand your tool's purpose from its code/docs
2. Create a processor that provides real value
3. Generate meaningful analysis and prompts
4. Integrate smoothly without breaking existing features
5. Follow your project's coding style

No configuration needed - just let the AI analyze your project and create the right integration.