# @forge/agent - Complete Documentation

## 📋 Table of Contents
- [What is @forge/agent?](#what-is-forgeagent)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [For AI Agents](#for-ai-agents)
- [For Developers](#for-developers)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

## What is @forge/agent?

`@forge/agent` is a compatibility layer that ensures AI agents (GitHub Copilot, Junie, CI bots) use correct TypeScript commands when working with your projects. It solves the common "could not determine executable to run" error that occurs when agents incorrectly use `npx typescript` instead of `npx tsc`.

### Key Features
- 🔍 **Project Validation** - Checks if projects are agent-compatible
- 🔧 **Auto-fixing** - Automatically fixes common issues
- 📏 **Rule Engine** - JSON-loadable rules that agents can consume
- 🏷️ **Status Badges** - Show agent compatibility in READMEs
- 🌍 **Universal** - Works in monorepos and standalone projects

## Installation & Setup

### For Standalone Projects
```bash
# Local installation (recommended)
pnpm add -D @forge/agent

# Global installation (for CLI usage anywhere)
pnpm add -g @forge/agent
```

### For Monorepo Projects
```bash
# Add to root
pnpm add -D @forge/agent -w

# Or add to specific workspace
pnpm add -D @forge/agent --filter @mycompany/app
```

### Verify Installation
```bash
# Check version
forge-agent --version

# Validate current directory
forge-agent validate
```

## Usage Guide

### CLI Commands

#### `forge-agent validate`
Validates the current project for agent compatibility.

```bash
# Basic validation
forge-agent validate

# Validate specific path
forge-agent validate --path ./packages/my-app

# Auto-fix issues
forge-agent validate --fix

# Output as JSON (for CI/CD)
forge-agent validate --json
```

#### `forge-agent rules`
Displays current agent compatibility rules.

```bash
# Show rules in terminal
forge-agent rules

# Output as JSON
forge-agent rules --json
```

#### `forge-agent badge`
Generates README badges.

```bash
# Generate compatible badge
forge-agent badge

# Generate specific status
forge-agent badge --status needsSetup
forge-agent badge --status incompatible
```

### Programmatic API

```typescript
import { 
  validateProjectSetup,
  getTypeScriptCommand,
  loadAgentRules,
  isForbiddenCommand 
} from '@forge/agent';

// Validate a project
const result = await validateProjectSetup('./my-project');
if (!result.isValid) {
  result.issues.forEach(issue => {
    console.log(`${issue.type}: ${issue.message}`);
    console.log(`Fix: ${issue.fix}`);
  });
}

// Get correct command
const cmd = getTypeScriptCommand('typeCheck', { file: 'src/index.ts' });
// Returns: "npx tsc --noEmit src/index.ts"

// Check if command is forbidden
const check = await isForbiddenCommand('npx typescript --noEmit');
if (check.forbidden) {
  console.log(`Don't use that! ${check.reason}`);
  console.log(`Instead: ${check.fix}`);
}

// Load rules for custom logic
const rules = await loadAgentRules();
console.log(rules.agentGuidelines.general);
```

## For AI Agents

### Quick Reference
```bash
# ❌ NEVER use these:
npx typescript
npx typescript --noEmit
typescript --build

# ✅ ALWAYS use these:
npx tsc
npx tsc --noEmit
pnpm run check-types  # if script exists
```

### Integration Example
When your agent needs to type-check before making changes:

```typescript
// In your agent code
import { getTypeScriptCommand } from '@forge/agent';

async function typeCheckBeforeChange(projectPath: string) {
  // Get the correct command
  const command = getTypeScriptCommand('typeCheck');
  
  // Execute it
  const result = await exec(command, { cwd: projectPath });
  
  if (result.exitCode !== 0) {
    // Handle type errors
  }
}
```

### Reading Agent Rules
```typescript
// Load rules dynamically
const response = await fetch('https://unpkg.com/@forge/agent/agent-rules.json');
const rules = await response.json();

// Check forbidden commands
const forbidden = rules.rules.typescript.commands.forbidden;
```

## For Developers

### Making Your Project Agent-Compatible

1. **Add Required Scripts**
   ```json
   {
     "scripts": {
       "check-types": "tsc --noEmit"
     }
   }
   ```

2. **Ensure tsconfig.json is in Root**
   ```
   my-project/
   ├── tsconfig.json  ✅ (root level)
   ├── package.json
   └── src/
   ```

3. **Add Badge to README**
   ```markdown
   ![Agent Compatible](https://img.shields.io/badge/forge--agent-compatible-brightgreen)
   ```

### CI/CD Integration

#### GitHub Actions
```yaml
name: Agent Compatibility
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - name: Validate Agent Compatibility
        run: |
          npx @forge/agent validate
```

#### Pre-commit Hook
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "forge-agent validate"
    }
  }
}
```

## Architecture

### Package Structure
```
@forge/agent/
├── src/
│   ├── cli/              # CLI commands
│   ├── helpers/          # Core validation logic
│   └── templates/        # Project templates
├── agent-rules.json      # Rule definitions
├── schemas/              # JSON schemas
└── dist/                 # Compiled output
```

### Rule System
Rules are defined in `agent-rules.json`:
- **Forbidden commands** - Commands that should never be used
- **Preferred commands** - Recommended alternatives
- **Error patterns** - Common errors and their fixes
- **Project requirements** - Required files and configurations

## Troubleshooting

### Common Issues

#### "could not determine executable to run"
**Cause**: Using `npx typescript` instead of `npx tsc`
**Fix**: 
```bash
# Replace this
npx typescript --noEmit

# With this
npx tsc --noEmit
```

#### "Missing check-types script"
**Fix**:
```bash
pnpm pkg set scripts.check-types="tsc --noEmit"
```

#### "tsconfig.json not found"
**Fix**: Create `tsconfig.json` in project root:
```bash
forge-agent validate --fix
```

### Debug Mode
```bash
# Verbose output
DEBUG=forge:* forge-agent validate

# Check specific issues
forge-agent validate --json | jq '.issues'
```

## Links

- [GitHub Repository](https://github.com/forge/agent)
- [NPM Package](https://www.npmjs.com/package/@forge/agent)
- [Agent Guide](../AGENT_GUIDE.md)
- [API Reference](./API.md)
- [Contributing](../CONTRIBUTING.md)

---

Last updated: 2025-05-26 by JackHemmert3113