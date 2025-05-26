# @cognitive/ai-core/adapters

A flexible library that enables tools to seamlessly operate in both **IDE mode** (for human-in-the-loop, context-driven workflows) and **API mode** (for automated, programmatic interaction with AI). Designed as a core part of the [Cognitive Framework](https://github.com/JackHemmert3113/cognitive-framework), `@cognitive/ai-core/adapters` makes it easy to build developer tools and applications that work for both professional coders and pure AI automation.

---

## 🚀 Features

- **Dual-Mode Operation**: Supports both IDE-driven and API-driven workflows.
- **Automatic Mode Detection**: Uses environment and configuration to choose the correct mode.
- **Context File Generation**: In IDE mode, generates `.ai/` context files for use with AI assistants.
- **Direct API Integration**: In API mode, calls AI providers like OpenAI or Anthropic directly.
- **Pluggable Architecture**: Easily integrate new AI providers or custom modes.

---

## 📦 Installation

```bash
npm install @cognitive/ai-core
# or
yarn add @cognitive/ai-core
```

---

## 🧑‍💻 Usage

### Basic Example

```js
const { adapters } = require('@cognitive/ai-core');
const { AIDualMode } = adapters;

const myTool = AIDualMode.create('my-tool', async (input) => {
  // Your core logic here!
  return { result: `Processed: ${input}` };
}, {
  // Optional config
  mode: 'auto', // 'ide', 'api', or 'auto'
  outputDir: './.ai'
});

(async () => {
  const data = "hello world";
  const result = await myTool.process(data);
  console.log('Output:', result);
})();
```

---

## ⚙️ How It Works

### IDE Mode

- Generates context files in the `.ai/` directory (e.g., prompts, analysis, design docs).
- These files are meant to be picked up by AI coding assistants in the IDE (Cursor, Copilot, etc.).
- Lets developers stay in full control, review, and modify AI-generated suggestions.

### API Mode

- Bypasses files and communicates directly with AI APIs (like OpenAI).
- Enables full automation—useful for scripts, bots, or CI/CD.
- Ideal for no-code/low-code builders and automated workflows.

### Auto Mode

- Automatically detects the mode based on:
  - Presence of API keys in environment/config
  - TTY status (interactive terminal)
  - Explicit config
- Picks the best mode for the current environment.

---

## 🧩 API Reference

### `AIDualMode.create(name, processor, options)`

- **name** (`string`): The name of your tool or workflow.
- **processor** (`function(input, context): Promise<output>`): The main function that performs the task.
- **options** (`object`):
  - `mode`: `'ide' | 'api' | 'auto'` (default: `'auto'`)
  - `outputDir`: Where to write context files (default: `./.ai`)
  - `aiProvider`: (API mode) Which AI provider to use (`'openai'`, `'anthropic'`, etc.)
  - `apiKey`: (API mode) API key for provider
  - ...other provider-specific settings

#### `.process(input[, context])`

Runs the tool in the detected mode.

#### `.getMode()`

Returns the current mode: `'ide'` or `'api'`.

#### `.setMode(mode)`

Manually override the mode.

---

## 🧰 Advanced Usage

### Customizing Context File Generation

```js
const { adapters } = require('@cognitive/ai-core');
const { AIDualMode } = adapters;

const tool = AIDualMode.create('advanced-tool', processor, {
  mode: 'ide',
  outputDir: './.ai/custom-context'
});
```

### Forcing API Mode

```js
const { adapters } = require('@cognitive/ai-core');
const { AIDualMode } = adapters;

const tool = AIDualMode.create('api-tool', processor, {
  mode: 'api',
  aiProvider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});
```

---

## 🌟 Example Workflows

### IDE-Driven (Human-in-the-Loop)

1. Developer writes requirements.
2. `@cognitive/ai-core/adapters` generates `.ai/` context files.
3. AI assistant in the IDE interprets files, generates code/tests.
4. Developer reviews, edits, and approves results.

### API-Driven (Automated)

1. An idea or requirement is submitted.
2. `@cognitive/ai-core/adapters` processes it via AI APIs—generates code, tests, or documentation.
3. Results are returned directly, no manual intervention needed.

---

## 🛠️ Integration with Cognitive Framework

`@cognitive/ai-core/adapters` is a core part of the [Cognitive Framework](https://github.com/JackHemmert3113/cognitive-framework). It works out-of-the-box with other modules in the `@cognitive/ai-core` package:

- [`@cognitive/ai-core/analyzers`](../analyzers) — for structured requirements analysis
- [`@cognitive/ai-core/testGeneration`](../test-generation) — for AI-powered testing

---

## 📂 Related Packages

- [`@cognitive/ai-core/analyzers`](../analyzers) — AI-readable requirements
- [`@cognitive/ai-core/testGeneration`](../test-generation) — AI-generated test suites

---

## 📝 License

MIT © Jack Hemmert

---

## 💡 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

---
