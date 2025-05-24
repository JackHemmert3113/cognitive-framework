# @forge/dual-mode

A flexible library that enables tools to seamlessly operate in both **IDE mode** (for human-in-the-loop, context-driven workflows) and **API mode** (for automated, programmatic interaction with AI). Designed as a core part of the [Forge Framework](https://github.com/JackHemmert3113/forge-framework), `@forge/dual-mode` makes it easy to build developer tools and applications that work for both professional coders and pure AI automation.

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
npm install @forge/dual-mode
# or
yarn add @forge/dual-mode
```

---

## 🧑‍💻 Usage

### Basic Example

```js
const { DualMode } = require('@forge/dual-mode');

const myTool = DualMode.create('my-tool', async (input) => {
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

### `DualMode.create(name, processor, options)`

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
const tool = DualMode.create('advanced-tool', processor, {
  mode: 'ide',
  outputDir: './.ai/custom-context'
});
```

### Forcing API Mode

```js
const tool = DualMode.create('api-tool', processor, {
  mode: 'api',
  aiProvider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});
```

---

## 🌟 Example Workflows

### IDE-Driven (Human-in-the-Loop)

1. Developer writes requirements.
2. `@forge/dual-mode` generates `.ai/` context files.
3. AI assistant in the IDE interprets files, generates code/tests.
4. Developer reviews, edits, and approves results.

### API-Driven (Automated)

1. An idea or requirement is submitted.
2. `@forge/dual-mode` processes it via AI APIs—generates code, tests, or documentation.
3. Results are returned directly, no manual intervention needed.

---

## 🛠️ Integration with Forge Framework

`@forge/dual-mode` is a core part of the [Forge Framework](https://github.com/JackHemmert3113/forge-framework). It works out-of-the-box with:

- [`@forge/requirements`](../requirements) — for structured requirements
- [`@forge/test-framework`](../test-framework) — for AI-powered testing

---

## 📂 Related Packages

- [`@forge/requirements`](../requirements) — AI-readable requirements
- [`@forge/test-framework`](../test-framework) — AI-generated test suites

---

## 📝 License

MIT © Jack Hemmert

---

## 💡 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

---