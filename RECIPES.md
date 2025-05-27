<!--
MIT License
-->
# Recipes 🧪

Short how-tos for common workflows.

## Examples

### Generate tests
```bash
npx cogtest --mode api --provider openai
```

### Add custom prompts
```javascript
// inside analyzeForIDE
return { prompts: 'Lint > Test > Build' };
```

## 🔍 Under the Hood

Recipes combine Dual Mode with the Requirements and Test Framework modules. Mix and match per project.

## Version

0.1.0

## Links

- [PROMPTS](PROMPTS.md)
- [MODES](MODES.md)
- [README](README.md)
