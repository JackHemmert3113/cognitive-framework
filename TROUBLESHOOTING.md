<!--
MIT License
-->
# Troubleshooting ⚠️

Common fixes for the framework.

## Examples

- **Failing tests**
  ```bash
  node -e "Object.keys(require.cache).forEach(k => delete require.cache[k])"
  ```

## 🔍 Under the Hood

Some issues stem from stale Node module caches. Clearing them reloads fresh code.

## Version

0.1.0 (guide Added in v1.2)

## Links

- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- [CHANGELOG](CHANGELOG.md)
