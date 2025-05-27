# @cognitive/ai-test-framework

AI assisted test generation and execution.

## Installation

```bash
npm install @cognitive/ai-test-framework
```

Provider packages are required when running in API mode. See
[@cognitive/ai-core](../ai-core/README.md) for details. For example, install the
OpenAI client with:

```bash
npm install openai
```

If the provider package is missing the framework falls back to a mock provider
that returns placeholder responses.

## Basic Usage

```javascript
const { createAITestFramework } = require('@cognitive/ai-test-framework');

const framework = createAITestFramework();
framework.process({ path: './my-app' });
```

## Running Modes

### IDE Mode

1. Install the package.
2. Create the framework with `mode: 'ide'`.
3. Run `process()` on your test results and open the generated directory in your IDE.

```javascript
const framework = createAITestFramework({ mode: 'ide', outputDir: '.ai-test' });
await framework.process(testResults);
```

Files like `context.json`, `analysis.md` and `prompts.md` appear in `.ai-test/`.

### API Mode

1. Install the provider package such as `openai`.
2. Set `AI_API_KEY` or pass `apiKey` in the config.
3. Run with `mode: 'api'` to get AI generated tests.

```javascript
const framework = createAITestFramework({
  mode: 'api',
  provider: 'openai',
  apiKey: process.env.AI_API_KEY
});
const result = await framework.process(testResults);
```

If no provider package is found the framework uses the mock provider described
in [@cognitive/ai-core](../ai-core/README.md).

### CI Mode

1. Configure `mode: 'ci'`.
2. Run the framework in your CI pipeline.
3. Review the JSON summary written to `test-analysis.json`.

```javascript
const framework = createAITestFramework({ mode: 'ci' });
await framework.process(testResults); // creates test-analysis.json
```

## Full Workflow Example

This script runs existing Jest tests, asks the AI for missing cases, and then
executes the new tests.

```javascript
const fs = require('fs');
const { runCLI } = require('jest');
const { createAITestFramework } = require('@cognitive/ai-test-framework');

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
- **Provider package not installed** – Install the package for your selected AI
  provider (e.g. `openai`). If it is missing the framework uses the mock
  provider described in [@cognitive/ai-core](../ai-core/README.md).

Learn more in the [Getting Started guide](../../docs/getting-started.md).
Detailed APIs are listed in the [API Reference](../../docs/api-reference.md).
