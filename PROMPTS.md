<!--
MIT License
-->
# Custom Prompts 💡

Add extra AI instructions via your processor's `analyzeForIDE` method.

## Examples

```javascript
const processor = {
  async analyzeForIDE(data) {
    return {
      context: {},
      analysis: '',
      prompts: '1. Lint\n2. Test'
    };
  }
};
```

The lines you provide appear after the defaults in `.ai/prompts.md`.

## 🔍 Under the Hood

The framework merges your `prompts` string with built-in suggestions in `generatePrompts()`. Execution order isn't enforced; script sequential calls if needed.

## Version

0.1.0 (custom prompts Added in v0.1)

## Links

- [MODES](MODES.md)
- [ARCHITECTURE](ARCHITECTURE.md)
