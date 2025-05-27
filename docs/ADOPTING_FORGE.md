# Adopting Cognitive Framework in Your Project

## Core Principles

- **Take what you need:** Use any combination of Cognitive Framework modules.
- **Plug-and-play:** All modules are designed for composability.
- **Self-healing and self-discovery available everywhere.**

## Examples

### Use Self-Healing Agents Only

```bash
npm install @cognitive/agent-core
```
```js
const { SelfHealingAgent } = require('@cognitive/agent-core');
SelfHealingAgent.start();
```

### Use Test Framework Only

```bash
npm install @cognitive/ai-core
```
```js
const { testGeneration } = require('@cognitive/ai-core');
const { createAITestFramework } = testGeneration;
const testFramework = createAITestFramework();
testFramework.process({ path: './my-app' });
```

### Use Everything

```bash
npm install @cognitive/agent-core @cognitive/ai-core
```
```js
const { SelfHealingAgent } = require('@cognitive/agent-core');
const { testGeneration, analyzers } = require('@cognitive/ai-core');
const { createAITestFramework } = testGeneration;
const { RequirementsAnalyzer } = analyzers;

// Compose as desired
SelfHealingAgent.start();
const testFramework = createAITestFramework();
testFramework.process();
RequirementsAnalyzer.analyze();
```

## Project Examples

- **Adaptive Wellness:** Uses full core, test framework, and requirements.
- **SparkFlow:** Uses core and SparkFlow integration, optional test framework.
- **Home Automation:** Just agent-core for self-healing/discovery.

---

## Philosophy

> Cognitive Framework is designed to empower your agents. Use as much or as little as you need—no lock-in, always composable, always agent-first.
