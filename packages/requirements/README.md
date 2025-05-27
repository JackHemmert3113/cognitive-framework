# @forge/requirements

A robust framework for defining, parsing, and managing software requirements in a way that’s readable and actionable for both humans and AI. Part of the [Forge Framework](https://github.com/JackHemmert3113/forge-framework).

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
npm install @forge/requirements
# or
yarn add @forge/requirements
```

---

## 🧑‍💻 Usage

### Basic Example

```js
const { RequirementsFramework } = require('@forge/requirements');

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

---

## ⚙️ How It Works

- Parses requirements from structured objects or plain text.
- Validates and enhances requirements for clarity and completeness.
- Generates `.ai/` context files that can help AI assistants generate code, documentation, or tests.
- Designed to be used in both human-driven (IDE) and automated (API) workflows.

---

## 🧩 API Reference

### `new RequirementsFramework(options)`

- **options.mode:** `'ide-driven' | 'api-driven'` (default: `'ide-driven'`)
- **options.outputDir:** Directory for generated AI context files (default: `./.ai`)

### `.process(requirement | text)`

- **requirement:** Structured requirement object or plain text
- **Returns:** Promise resolving to processed requirement data

---

## 🛠️ Integration

Works out-of-the-box with:
- [`@forge/dual-mode`](../dual-mode) — Dual-mode context file/API integration
- [`@forge/test-framework`](../test-framework) — Automatic test generation

---

## 📄 Example Context Files

When you process a requirement, the following files may appear in `.ai/`:
- `analysis.md` — AI-friendly requirement analysis
- `acceptance_criteria.md` — Clear list of requirements
- `prompts.md` — Prompts for AI code generation

---

## 📝 License

MIT © Jack Hemmert

---

## 💡 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

---
For a step-by-step tutorial see the [Getting Started guide](../../docs/getting-started.md). Package APIs are listed in the [API Reference](../../docs/api-reference.md).

