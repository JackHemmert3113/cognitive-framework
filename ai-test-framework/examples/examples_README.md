# AI Test Framework Examples

This directory contains example projects demonstrating how to use the AI Test Framework in different scenarios.

## 📁 Available Examples

### 1. Simple Project (`simple-project/`)
A basic Node.js project with unit tests demonstrating:
- Basic test setup
- Calculator and Validator modules
- Simple configuration
- Coverage reporting

**To run:**
```bash
cd simple-project
npm install
npm run test:ai
```

### 2. Monorepo Project (`monorepo-project/`)
A multi-package monorepo demonstrating:
- Workspace configuration
- Cross-package dependencies
- Different package types (API, Web, Shared)
- Parallel test execution

**To run:**
```bash
cd monorepo-project
npm install
npm run test:ai
```

### 3. React App (`react-app/`)
A React application demonstrating:
- Component testing with React Testing Library
- Custom hooks testing
- JSX/TSX support
- DOM testing environment

**To run:**
```bash
cd react-app
npm install
npm run test:ai
```

## 🚀 Quick Start with Any Example

1. **Navigate to example:**
   ```bash
   cd examples/[example-name]
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run AI tests:**
   ```bash
   npm run test:ai
   ```

4. **Try watch mode:**
   ```bash
   npm run test:ai -- --watch
   ```

5. **View the report:**
   ```bash
   cat test-results/ai-test-report.md
   ```

## 📊 What to Look For

### In the Console Output:
- 🎨 Colorized test results
- 📊 Progress bars during execution
- ✅ Pass/fail indicators
- 📈 Coverage percentages
- 🤖 AI insights summary

### In the Generated Report:
- Detailed test results per package
- Coverage analysis
- AI-powered recommendations
- Performance metrics
- Improvement suggestions

## 🛠️ Customizing Examples

Each example includes an `ai-test.config.js` file that you can modify:

```javascript
module.exports = {
  projectName: 'Your Project Name',
  coverageThreshold: 85,        // Adjust coverage requirements
  aiInsightsEnabled: true,      // Toggle AI features
  // ... more options
};
```

## 💡 Common Patterns

### Testing Best Practices:
1. **Organize tests** next to source files or in a `tests/` directory
2. **Use descriptive names** for test suites and cases
3. **Test edge cases** and error conditions
4. **Mock external dependencies** appropriately
5. **Aim for high coverage** but focus on meaningful tests

### AI Framework Features:
1. **Automatic discovery** - Finds all test files
2. **Parallel execution** - Runs tests efficiently
3. **Smart insights** - Identifies areas needing attention
4. **Progress tracking** - Visual feedback during runs
5. **Comprehensive reports** - Detailed analysis

## 🔧 Troubleshooting

### Tests not found?
- Check your test file naming (`*.test.js`, `*.spec.js`)
- Verify jest configuration in package.json

### Coverage too low?
- Add more test cases
- Check `collectCoverageFrom` patterns
- Focus on untested code paths

### AI insights not appearing?
- Ensure `aiInsightsEnabled: true` in config
- Check that tests are actually running
- Verify coverage data is being generated

## 📚 Learn More

- [Main README](../README.md) - Framework documentation
- [Configuration Guide](../docs/configuration.md) - All config options
- [API Reference](../docs/api.md) - Programmatic usage
- [Contributing](../CONTRIBUTING.md) - Help improve the framework

## 🎯 Next Steps

After trying these examples:

1. **Apply to your project** - Use `ai-test-init` in your own code
2. **Customize configuration** - Tailor to your needs
3. **Integrate with CI/CD** - Add to your pipeline
4. **Share feedback** - Help us improve!

---

Happy Testing! 🚀