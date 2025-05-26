# Adopting Forge Framework in Your Project

## Core Principles

- **Take what you need:** Use any combination of Forge Framework modules.
- **Plug-and-play:** All modules are designed for composability.
- **Self-healing and self-discovery available everywhere.**

## Examples

### Use Self-Healing Agents Only

```bash
npm install @forge/agent-core
```
```js
const { SelfHealingAgent } = require('@forge/agent-core');
SelfHealingAgent.start();
```

### Use Test Framework Only

```bash
npm install @forge/ai-test-framework
```
```js
const { AITestFramework } = require('@forge/ai-test-framework');
AITestFramework.run({ path: './my-app' });
```

### Use Everything

```bash
npm install @forge/agent-core @forge/ai-test-framework @forge/requirements-framework
```
```js
const { SelfHealingAgent } = require('@forge/agent-core');
const { AITestFramework } = require('@forge/ai-test-framework');
const { RequirementsAnalyzer } = require('@forge/requirements-framework');

// Compose as desired
SelfHealingAgent.start();
AITestFramework.run();
RequirementsAnalyzer.analyze();
```

## Project Examples

- **Adaptive Wellness:** Uses full core, test framework, and requirements.
- **SparkFlow:** Uses core and SparkFlow integration, optional test framework.
- **Home Automation:** Just agent-core for self-healing/discovery.

---

## Philosophy

> Forge Framework is designed to empower your agents. Use as much or as little as you need—no lock-in, always composable, always agent-first.