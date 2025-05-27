<!--
MIT License
-->
# Modes 🚀

Quick overview of IDE vs API operation.

## Examples

### IDE Mode
```javascript
const tool = AIDualMode.create('demo', processor, { mode: 'ide' });
```

### API Mode
```javascript
const tool = AIDualMode.create('demo', processor, {
  mode: 'api',
  apiKey: process.env.AI_API_KEY
});
```

## 🔍 Under the Hood

DualMode auto-detects the mode when `mode: 'auto'` is used, checking env vars and CI settings.

## Version

0.1.0

## Links

- [README](README.md)
- [PROMPTS](PROMPTS.md)
- [ARCHITECTURE](ARCHITECTURE.md)
