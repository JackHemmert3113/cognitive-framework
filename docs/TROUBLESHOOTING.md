# Troubleshooting Guide

Quick fixes for common issues when using the Cognitive Framework.

## Failing Tests 🚧 (Added in v1.2)

If tests keep failing even after regenerating them, the Node.js module cache may be stale.

```bash
# Clear cache before rerunning
node -e "Object.keys(require.cache).forEach(k => delete require.cache[k])"
```

Clearing the cache or restarting Node ensures updated modules are loaded.

## More Help

See [ARCHITECTURE](ARCHITECTURE.md) for internals or open an issue if you're stuck.

