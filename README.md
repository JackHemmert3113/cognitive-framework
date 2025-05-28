# Cognitive Framework 🔨

A modular, open-source framework for building next-generation developer tools and workflows that combine the best of **human-in-the-loop (IDE-driven)** and **AI-driven (API)** development.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/node?logo=node.js&logoColor=white&label=node&color=green)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Issues](https://img.shields.io/github/issues/JackHemmert3113/cognitive-framework.svg)](https://github.com/JackHemmert3113/cognitive-framework/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/JackHemmert3113/cognitive-framework.svg)](https://github.com/JackHemmert3113/cognitive-framework/discussions)

Cognitive empowers developers and AI to collaborate seamlessly. Whether you're creating developer tools, building applications, or exploring new paradigms of human-AI interaction, Cognitive gives you the building blocks for flexible, modern workflows.

## 🌟 Key Features

- **📋 Requirements Framework** - Write specifications that both humans and AI can understand and act upon
- **🎛️ Dual Mode Architecture** - Seamlessly switch between IDE assistance and API automation
- **🧪 AI-Powered Testing** - Generate and validate tests with AI assistance
- **🔄 Flexible Integration** - Works with any AI provider (OpenAI, Anthropic, local LLMs)
- **AI Context File Generation** - Easily create `.ai/` context for AI copilots in your IDE
- **Pluggable & Extensible** - Build custom tools, integrate new AI providers, and extend as needed

## 🧩 Monorepo Structure

- [`packages/agent-core`](./packages/agent-core): Core utilities for building AI agents
- [`packages/ai-core`](./packages/ai-core): Shared AI functionality (adapters, analyzers, model selectors)
- [`packages/dual-mode`](./packages/dual-mode): Dual-mode adapter for IDE and API-driven tools
- [`packages/ai-test-framework`](./packages/ai-test-framework): AI-generated test suite integration
- [`packages/requirements`](./packages/requirements): Framework for structured, AI-readable requirements
- [`packages/forge-agent`](./packages/forge-agent): CLI and compatibility tooling
- [`examples/`](./examples): Example projects and workflows
All packages reside inside the `packages/` directory.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/JackHemmert3113/cognitive-framework.git
cd cognitive-framework

# Install dependencies
npm ci

# Run examples
npm run example:ide-driven    # Developer-focused workflow
npm run example:ai-driven     # AI-orchestrated workflow
```

## 📦 Packages

| Package | Description |
| ------- | ----------- |
| [`@cognitive/agent-core`](./packages/agent-core) | Base agent utilities |
| [`@cognitive/ai-core`](./packages/ai-core) | Shared AI functionality |
| [`@cognitive/dual-mode`](./packages/dual-mode) | Dual-mode adapter for AI tools |
| [`@cognitive/ai-test-framework`](./packages/ai-test-framework) | AI-generated test suite integration |
| [`@cognitive/requirements`](./packages/requirements) | Structured, AI-ready requirements |
| [`@forge/agent`](./packages/forge-agent) | CLI and compatibility tooling |

## 💻 Core Components

### Requirements Framework
Transform ideas into actionable specifications that work for both humans and AI.

```javascript
const { RequirementsFramework } = require('@cognitive/requirements');

// IDE-driven: Developer writes detailed specs
const requirement = await framework.process({
  id: 'REQ-001',
  description: 'User authentication system',
  acceptanceCriteria: ['Support OAuth', 'Session management']
});

// AI-driven: AI generates specs from ideas  
const requirement = await framework.process(
  "I need a way to track inventory"
);
```

### Dual Mode
Build tools that work both as IDE assistants and standalone automation.

```javascript
const { DualMode } = require('@cognitive/dual-mode');

const tool = DualMode.create('My Tool', processor);

// Automatically detects mode based on environment
const result = await tool.process(data);
```

### Test Framework
Generate comprehensive test suites with AI assistance.

```javascript
const { createAITestFramework } = require('@cognitive/ai-test-framework');

const framework = createAITestFramework();
const results = await framework.process({ path: './my-app' });
console.log(results);
```

## 🏗️ Architecture

Cognitive enables two distinct development paradigms:

### IDE-Driven Development
Perfect for professional developers building complex applications
- Human leads, AI assists
- Full control over implementation
- AI provides suggestions and enhancements

### AI-Driven Development  
Ideal for rapid prototyping and standard patterns
- AI orchestrates development
- Human provides guidance and validation
- Fast path from idea to working code

## 🤝 Built with Cognitive Framework

- **[Your Project Here]** - Join our community and showcase what you've built!

## 📚 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Reference](docs/api-reference.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🌱 Community

- [GitHub Discussions](https://github.com/JackHemmert3113/cognitive-framework/discussions) - Ask questions and share ideas
- [Issue Tracker](https://github.com/JackHemmert3113/cognitive-framework/issues) - Report bugs and request features

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © Jack Hemmert. See [LICENSE](LICENSE) for details.

---

## 🏷️ Badges

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/JackHemmert3113/cognitive-framework/pulls)
[![Issues](https://img.shields.io/github/issues/JackHemmert3113/cognitive-framework.svg)](https://github.com/JackHemmert3113/cognitive-framework/issues)
[![Node Version](https://img.shields.io/badge/node-%3E=16-blue.svg)](https://nodejs.org/)
[![Discussions](https://img.shields.io/github/discussions/JackHemmert3113/cognitive-framework.svg)](https://github.com/JackHemmert3113/cognitive-framework/discussions)

---

Built with ❤️ to make AI-enhanced development accessible to everyone.

## Examples

Use the dual mode adapter with custom prompts:

```javascript
const { AIDualMode } = require('@cognitive/dual-mode');

const processor = {
  async analyzeForIDE(data) {
    return { context: {}, analysis: '', prompts: 'Run lint > run tests' };
  }
};

const tool = AIDualMode.create('demo', processor);
```

## 🔍 Under the Hood

See [ARCHITECTURE.md](ARCHITECTURE.md) for how modules interact and how prompts are merged.

## Version

1.0.0 – Custom prompts supported (Added in v0.1).

## Links

- [MODES](MODES.md)
- [PROMPTS](PROMPTS.md)
- [RECIPES](RECIPES.md)
- [TROUBLESHOOTING](TROUBLESHOOTING.md)
- [CONTRIBUTING](CONTRIBUTING.md)
- [CHANGELOG](CHANGELOG.md)
