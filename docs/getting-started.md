# Getting Started

This guide shows how to install the Cognitive Framework and run the examples.

## Requirements

- Node.js 16 or later
- Provider libraries for API mode (e.g. `npm install openai`)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/JackHemmert3113/cognitive-framework.git
cd cognitive-framework
npm ci
```

## Running Examples

The project ships with sample workflows.

```bash
npm run example:ide-driven  # Human-in-the-loop
npm run example:ai-driven   # Fully automated
```

For more details on individual modules see the [API Reference](api-reference.md).
