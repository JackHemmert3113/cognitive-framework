# @cognitive/test-framework

AI assisted test generation and execution.

## Installation

```bash
npm install @cognitive/test-framework
```

## Basic Usage

```javascript
const { createAITestFramework } = require('@cognitive/test-framework');

const framework = createAITestFramework();
framework.process({ path: './my-app' });
```

## Full Workflow Example

This script runs existing Jest tests, asks the AI for missing cases, and then
executes the new tests.

```javascript
const fs = require('fs');
const { runCLI } = require('jest');
const { createAITestFramework } = require('@cognitive/test-framework');

async function main() {
  const { results } = await runCLI({ json: true }, [process.cwd()]);

  const ai = createAITestFramework({
    mode: 'api',
    provider: 'openai',
    model: 'gpt-4'
  });
  const aiResult = await ai.process(results.testResults);

  for (const t of aiResult.result.generatedTests) {
    fs.writeFileSync(t.filename, t.content);
  }

  await runCLI({}, [process.cwd()]);
}

main();
```

## Configuration

`createAITestFramework(options)` supports:

- `mode` – `'ide' | 'api' | 'auto'` (default `'auto'`)
- `outputDir` – IDE context directory
- `apiKey` – API key for provider
- `provider` – AI provider name (`openai`, `anthropic`, ...)
- `model` – model to request (e.g., `gpt-4`)

```javascript
const framework = createAITestFramework({
  mode: 'api',
  provider: 'openai',
  model: 'gpt-4-turbo',
  apiKey: process.env.AI_API_KEY
});
```

## Troubleshooting

- **Missing dependencies** – Install Jest before running the example:
  `npm install --save-dev jest`.
- **No API key** – Set `AI_API_KEY` in your environment or pass `apiKey` in the
  configuration. Without it the framework falls back to IDE mode.

Learn more in the [Getting Started guide](../../docs/getting-started.md).
Detailed APIs are listed in the [API Reference](../../docs/api-reference.md).
