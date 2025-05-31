# @cognitive/requirements

A robust framework for defining, parsing, and managing software requirements in a way that’s readable and actionable for both humans and AI. Part of the [Cognitive Framework](https://github.com/JackHemmert3113/cognitive-framework).

---

## 🚀 Features

- **Structured Requirements:** Define requirements in a format easy for humans and AI to understand.
- **AI-Ready:** Generates context files and prompts that AI assistants (and Forge tools) can process.
- **Validation:** Checks requirements for completeness and clarity.
- **Flexible Input:** Accepts structured objects or natural language.
- **Integration:** Works seamlessly with Dual Mode and Test Framework.

---

## 📦 Installation

```bash
npm install @cognitive/requirements
# or
yarn add @cognitive/requirements
```

---

## 🧑‍💻 Usage

### Basic Example

```js
const { RequirementsFramework } = require('@cognitive/requirements');

const framework = new RequirementsFramework({
  mode: 'ide-driven',
  outputDir: './.ai'
});

const requirement = {
  id: 'REQ-USER-001',
  type: 'functional',
  description: 'Allow users to reset their password via email.',
  acceptanceCriteria: [
    'User receives reset email',
    'Reset link expires in 30 minutes',
    'User can set a new password after using the link'
  ]
};

framework.process(requirement)
  .then(result => {
    console.log('Processed requirement:', result);
    console.log('AI context files written to .ai/');
  });
```

### Natural Language Example

```js
const rawText = "The app should let users reset passwords by sending a secure reset link to their email. The link must expire after 30 minutes.";
framework.process(rawText)
  .then(result => {
    console.log('Processed:', result);
  });
```

### Nested Requirements Example

```js
const vision = {
  id: 'VIS-100',
  type: 'vision',
  description: 'overall vision',
  metadata: { owner: 'dev', status: 'open', priority: 'P1', estimate: '1d', tags: 'demo', created: '2024-01-01', lastUpdated: '2024-01-02', team: 'core' },
  children: [
    {
      id: 'BV-10',
      type: 'business_value',
      description: 'business value',
      metadata: { owner: 'dev', status: 'open', priority: 'P1', estimate: '1d', tags: 'demo', created: '2024-01-01', lastUpdated: '2024-01-02', team: 'core' }
    }
  ]
};
framework.process(vision);
```

---

## ⚙️ How It Works

- Parses requirements from structured objects or plain text.
- Validates requirements against the canonical hierarchy (vision → business value → epic → feature → story → task) and checks required metadata fields.
- Generates `.ai/` context files that can help AI assistants generate code, documentation, or tests.
- Designed to be used in both human-driven (IDE) and automated (API) workflows.

---

## 🧩 API Reference

### `new RequirementsFramework(options)`

- **options.mode:** `'ide-driven' | 'api-driven'` (default: `'ide-driven'`)
- **options.outputDir:** Directory for generated AI context files (default: `./.ai`)
- **options.requiredMetadata:** Array of metadata fields that must be present. Defaults to the canonical contract fields.

### `.process(requirement | text)`

- **requirement:** Structured requirement object or plain text
- **Returns:** Promise resolving to processed requirement data

### `.processAndTest(requirement | text, projectPath, options?)`

- **projectPath:** Directory for the AI Test Framework (default: current working directory)
- **Returns:** Promise resolving to `{ requirement, testResult }`

---

## 🛠️ Integration

Works out-of-the-box with:
- [`@cognitive/dual-mode`](../dual-mode) — Dual-mode context file/API integration
- [`@cognitive/ai-test-framework`](../ai-test-framework) — Automatic test generation

### Command Line

Use the `cogreq` command to process a requirement file and immediately run the AI Test Framework:

```bash
cogreq requirement.md ./my-project
```

Common flags:

```bash
cogreq requirement.md ./my-project --output-dir ./custom-ai
cogreq requirement.md ./my-project --skip-tests
cogreq requirement.md --format text
```

---

## 📄 Example Context Files

When you process a requirement, the following files may appear in `.ai/`:
- `analysis.md` — AI-friendly requirement analysis
- `acceptance_criteria.md` — Clear list of requirements
- `PROMPTS.md` — Prompts for AI code generation

### TypeScript

This package ships with bundled type definitions so you can import it in a TypeScript project:

```ts
import { RequirementsFramework } from '@cognitive/requirements';
```

---

## 📝 License

MIT © Jack Hemmert

---

## 💡 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

For a step-by-step tutorial see the [Getting Started guide](../../docs/getting-started.md). Package APIs are listed in the [API Reference](../../docs/api-reference.md).