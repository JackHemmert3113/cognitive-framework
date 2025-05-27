# @cognitive/ai-core

Utility modules for interacting with AI providers.

## Installation

```bash
npm install @cognitive/ai-core
```

### Provider Dependencies

API mode requires installing the package for your chosen AI provider. For example, to
use OpenAI run:

```bash
npm install openai
```

If the provider package is missing the framework will fall back to a mock provider
that returns placeholder responses.

## Basic Usage

```javascript
const { adapters } = require('@cognitive/ai-core');
```

Read the [Getting Started guide](../../docs/getting-started.md) for an overview.
See the [API Reference](../../docs/api-reference.md) for package details.
