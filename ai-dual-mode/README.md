# AI Dual Mode 🤖

A powerful, reusable architecture for building AI-enhanced developer tools that seamlessly work in two modes:

1. **IDE Mode** 📝 - Generates context files for your IDE's AI assistant (GitHub Copilot, Cursor, Windsurf, etc.)
2. **API Mode** 🚀 - Direct AI integration for automation, CI/CD, and programmatic use

## 📚 Documentation

- [Integration Guide](./INTEGRATION-GUIDE.md) - Step-by-step guide for integrating into existing projects
- [AI Integration Prompt](./AI-INTEGRATION-PROMPT.md) - Quick prompt template for AI-assisted integration
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute to this project
- [Changelog](./CHANGELOG.md) - Version history and release notes
- [License](./LICENSE) - MIT license details

> **Note for Contributors:** When adding new documentation files, please update this list to maintain easy navigation.

## Why AI Dual Mode?

Modern developers use AI assistants in their IDEs, but automated tools need direct AI integration. This library provides a unified architecture that supports both workflows, making your tools flexible and future-proof.

## Features

- 🔄 **Automatic mode detection** - Detects whether to use IDE or API mode based on environment
- 🎯 **IDE-optimized output** - Generates context files that AI assistants understand
- 🤖 **Multiple AI providers** - Supports OpenAI with more providers coming soon
- 🛠️ **Flexible processor pattern** - Easy to integrate with any tool or framework
- 📊 **CI/CD ready** - Special mode for continuous integration environments
- 🔒 **Privacy-first** - IDE mode keeps all data local, API mode gives you full control

## Installation

```bash
npm install ai-dual-mode
```

For local development or private projects:
```bash
npm install ../ai-dual-mode
```

## Quick Start

```javascript
const { AIDualMode } = require('ai-dual-mode');

// 1. Define your processor
const processor = {
  // For IDE mode - generates context files
  async analyzeForIDE(data) {
    return {
      context: { /* your analysis */ },
      analysis: "# Markdown report",
      prompts: "Custom AI prompts"
    };
  },
  
  // For API mode - prepares AI request
  async prepareForAPI(data) {
    return {
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: JSON.stringify(data) }
      ]
    };
  },
  
  // For API mode - handles AI response
  async processAIResponse(response, originalData) {
    return { /* processed result */ };
  }
};

// 2. Create instance
const tool = AIDualMode.create('My Tool', processor);

// 3. Process your data
const result = await tool.process(yourData);
```

## Mode Detection

The library automatically detects which mode to use:

1. **Explicit**: Set `mode` in config
2. **Environment**: Checks for `AI_API_KEY` or `AI_MODE=api`
3. **CI Detection**: Uses CI mode in CI/CD environments
4. **Default**: Falls back to IDE mode

## IDE Mode

Generates AI-ready context files:

```
.ai/
├── context.json      # Structured data for AI analysis
├── analysis.md       # Human-readable report
├── prompts.md        # Ready-to-use AI prompts
├── copilot-guide.md  # GitHub Copilot specific
└── cursor-hints.json # Cursor IDE specific
```

### Using with Your IDE

1. Run your tool to generate context files
2. Open any file in `.ai/` directory
3. Ask your AI assistant to analyze it
4. Use prompts from `prompts.md` for specific tasks

## API Mode

Direct AI integration for automation:

```javascript
const tool = new AIDualMode({
  toolName: 'My Automation',
  processor: myProcessor,
  mode: 'api',
  config: {
    api: {
      apiKey: process.env.AI_API_KEY,
      model: 'gpt-4',
      provider: 'openai'
    }
  }
});

const result = await tool.process(data);
// Returns: { mode: 'api', result: /* AI-generated content */ }
```

## Examples

### Test Framework Integration

```javascript
const { AIDualMode } = require('ai-dual-mode');

const testProcessor = {
  async analyzeForIDE(testResults) {
    return {
      context: {
        coverage: calculateCoverage(testResults),
        failures: testResults.filter(t => !t.passed)
      },
      analysis: generateTestReport(testResults),
      prompts: "Generate tests for uncovered code"
    };
  }
};

const tester = AIDualMode.create('Test Analyzer', testProcessor);
```

### Documentation Generator

```javascript
const docProcessor = {
  async analyzeForIDE(files) {
    const undocumented = findUndocumentedFiles(files);
    return {
      context: { undocumented },
      analysis: `${undocumented.length} files need documentation`,
      prompts: `Generate docs for ${undocumented[0]}`
    };
  }
};

const docGen = AIDualMode.create('Doc Generator', docProcessor);
```

See the [examples directory](./examples) for complete working examples:
- [Test Framework Example](./examples/test-framework.js)
- [Documentation Generator Example](./examples/documentation.js)

## Configuration

```javascript
{
  mode: 'auto',        // 'ide', 'api', 'ci', or 'auto'
  config: {
    ide: {
      outputDir: '.ai',           // Where to save context files
      includeIDESpecific: true    // Generate IDE-specific files
    },
    api: {
      provider: 'openai',         // AI provider
      apiKey: 'your-key',         // Or use AI_API_KEY env var
      model: 'gpt-4',            // Model to use
      temperature: 0.3           // AI temperature
    },
    ci: {
      outputFormat: 'json',       // Output format for CI
      saveToFile: true,          // Save results to file
      outputFile: 'results.json' // Output filename
    }
  }
}
```

## Processor Interface

Your processor should implement these methods based on the modes you support:

```javascript
const processor = {
  // Required for IDE mode
  async analyzeForIDE(data) {
    return {
      context: {},      // Required: analysis data
      analysis: "",     // Required: markdown report
      prompts: "",      // Optional: custom prompts
      patterns: "",     // Optional: patterns to follow
      priorities: ""    // Optional: priority areas
    };
  },
  
  // Required for API mode
  async prepareForAPI(data) {
    return {
      messages: [],     // Required: chat messages
      temperature: 0.3, // Optional: AI temperature
      maxTokens: 2000, // Optional: max tokens
      responseFormat: {}// Optional: response format
    };
  },
  
  // Required for API mode
  async processAIResponse(aiResponse, originalData) {
    return {};         // Your processed result
  },
  
  // Optional for CI mode
  async analyzeForCI(data) {
    // Falls back to analyzeForIDE if not implemented
  }
};
```

## Environment Variables

- `AI_API_KEY` - API key for AI provider
- `AI_MODE` - Force specific mode ('ide', 'api', 'ci')
- `CI` - Detected automatically in CI environments

## Error Handling

The library provides clear error messages:

```javascript
try {
  const result = await tool.process(data);
} catch (error) {
  console.error('Error:', error.message);
  // "API key required for API mode"
  // "Processor must implement analyzeForIDE method"
}
```

## Integration

For detailed integration instructions and patterns, see our [Integration Guide](./INTEGRATION-GUIDE.md).

For quick AI-assisted integration, use our [AI Integration Prompt](./AI-INTEGRATION-PROMPT.md).

## Coming Soon

- 🤖 Anthropic Claude support
- 🏠 Local LLM integration
- 🔌 Plugin system
- 📈 Usage analytics
- 🌐 Web dashboard

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT © JackHemmert3113 - see [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: jack@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/JackHemmert3113/ai-dual-mode/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/JackHemmert3113/ai-dual-mode/discussions)

---

Built with ❤️ to make AI-enhanced development tools accessible to everyone.
Learn more in the [Getting Started guide](../docs/getting-started.md) and browse the [API Reference](../docs/api-reference.md).

