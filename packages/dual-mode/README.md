# @forge/dual-mode

## Overview
This package enables tools to work in both IDE (context file) and API (direct AI) modes seamlessly. It provides a unified architecture that supports both workflows, making your tools flexible and future-proof. In IDE mode, it generates context files for your IDE's AI assistant, while in API mode, it provides direct AI integration for automation and programmatic use.

## Installation
```bash
npm install @forge/dual-mode
```

## Key Features
- **Automatic mode detection** - Detects whether to use IDE or API mode based on environment
- **IDE context file generation** - Creates AI-ready context files that IDE assistants understand
- **API provider abstraction** - Supports multiple AI providers with a unified interface
- **Seamless mode switching** - Switch between modes without changing your code

## Usage Examples

### IDE Mode Example (generates context files)
```javascript
const { DualMode } = require('@forge/dual-mode');

// Define your processor
const processor = {
  async analyzeForIDE(data) {
    return {
      context: { /* your analysis */ },
      analysis: "# Markdown report",
      prompts: "Custom AI prompts"
    };
  }
};

// Create instance with IDE mode
const tool = DualMode.create({
  name: 'My Tool',
  processor,
  mode: 'ide'
});

// Process your data - generates files in .ai/ directory
await tool.process(yourData);
```

### API Mode Example (calls AI directly)
```javascript
const { DualMode } = require('@forge/dual-mode');

// Define your processor
const processor = {
  async prepareForAPI(data) {
    return {
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: JSON.stringify(data) }
      ]
    };
  },
  
  async processAIResponse(response, originalData) {
    return { /* processed result */ };
  }
};

// Create instance with API mode
const tool = DualMode.create({
  name: 'My Tool',
  processor,
  mode: 'api',
  apiKey: process.env.AI_API_KEY
});

// Process your data - calls AI API directly
const result = await tool.process(yourData);
```

## API Reference

### DualMode.create()
Creates a new dual-mode instance.

```javascript
DualMode.create(options)
```

Parameters:
- `options` (Object):
  - `name` (String): Name of your tool
  - `processor` (Object): Implementation of the processor interface
  - `mode` (String, optional): 'ide', 'api', or 'auto' (default: 'auto')
  - `apiKey` (String, optional): API key for direct AI integration
  - `outputDir` (String, optional): Directory for IDE context files (default: '.ai')
  - `provider` (String, optional): AI provider to use (default: 'openai')

### Processor Interface
Your processor must implement these methods:

For IDE mode:
- `analyzeForIDE(data)`: Generates context for IDE assistants

For API mode:
- `prepareForAPI(data)`: Prepares the request for the AI API
- `processAIResponse(response, originalData)`: Processes the AI response

### Configuration Options
- `mode`: 'ide', 'api', or 'auto'
- `outputDir`: Directory for IDE context files
- `provider`: AI provider ('openai', etc.)
- `apiKey`: API key for direct AI integration
- `apiEndpoint`: Custom API endpoint URL
- `apiOptions`: Additional options for the AI provider