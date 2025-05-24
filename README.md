# Forge Framework 🔨

> Open-source framework for human-AI collaborative development

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@forge/dual-mode.svg)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Forge provides the foundational tools and patterns for building applications where humans and AI work together seamlessly. Whether you're creating developer tools, building applications, or exploring new paradigms of human-AI interaction, Forge gives you the building blocks.

## 🌟 Key Features

- **📋 Requirements Framework** - Write specifications that both humans and AI can understand and act upon
- **🎛️ Dual Mode Architecture** - Seamlessly switch between IDE assistance and API automation
- **🧪 AI-Powered Testing** - Generate and validate tests with AI assistance
- **🔄 Flexible Integration** - Works with any AI provider (OpenAI, Anthropic, local LLMs)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/JackHemmert3113/forge-framework.git
cd forge-framework

# Install dependencies
npm install

# Run examples
npm run example:ide-driven    # Developer-focused workflow
npm run example:ai-driven     # AI-orchestrated workflow
```

## 📦 Core Components

### Requirements Framework
Transform ideas into actionable specifications that work for both humans and AI.

```javascript
const { RequirementsFramework } = require('@forge/requirements');

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
const { DualMode } = require('@forge/dual-mode');

const tool = DualMode.create('My Tool', processor);

// Automatically detects mode based on environment
const result = await tool.process(data);
```

### Test Framework
Generate comprehensive test suites with AI assistance.

```javascript
const { TestFramework } = require('@forge/test-framework');

const tests = await testFramework.generateTests(requirement);
const results = await testFramework.runTests();
```

## 🏗️ Architecture

Forge enables two distinct development paradigms:

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

## 🤝 Built with Forge

- **[Your Project Here]** - Join our community and showcase what you've built!

## 📚 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/api-reference.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🌱 Community

- [GitHub Discussions](https://github.com/JackHemmert3113/forge-framework/discussions) - Ask questions and share ideas
- [Issue Tracker](https://github.com/JackHemmert3113/forge-framework/issues) - Report bugs and request features

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

Forge Framework is MIT licensed. See [LICENSE](LICENSE) for details.

---

Built with ❤️ to make AI-enhanced development accessible to everyone.