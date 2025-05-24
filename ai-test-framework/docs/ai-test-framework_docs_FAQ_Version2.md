# AI Test Framework - Frequently Asked Questions

## 📋 General Questions

### What is the AI Test Framework?

The AI Test Framework is an intelligent testing orchestrator for JavaScript/TypeScript projects. It runs your tests, analyzes coverage, and provides AI-powered insights to improve your test suite.

### How is this different from just using Jest?

| Feature | Jest Alone | AI Test Framework |
|---------|-----------|-------------------|
| Test execution | ✅ | ✅ |
| Coverage reports | ✅ | ✅ |
| Progress visualization | ❌ | ✅ Beautiful progress bars |
| AI insights | ❌ | ✅ Smart recommendations |
| Multi-package orchestration | ⚠️ Manual | ✅ Automatic |
| Unified reporting | ❌ | ✅ Comprehensive reports |
| Watch mode with smart detection | ⚠️ Basic | ✅ Enhanced |

### Is it free to use?

Yes! The core framework is open source and free. Future premium features may be offered for enterprise users, but the essential functionality will always remain free.

### What projects can use this?

Any JavaScript or TypeScript project can use the AI Test Framework:
- ✅ Single package projects
- ✅ Monorepos (npm/yarn/pnpm workspaces)
- ✅ React applications
- ✅ Node.js APIs
- ✅ React Native apps
- ✅ Vue/Angular/Svelte projects
- ✅ Nx workspaces
- ✅ Turborepo projects

## 🚀 Getting Started

### How do I install it?

```bash
npm install -D @your-utilities/ai-test-framework
npx ai-test-init
```

That's it! The init command will create a configuration file and add test scripts to your package.json.

### Do I need to change my existing tests?

No! The AI Test Framework works with your existing test setup. It's a layer on top of your test runner (Jest, Vitest, etc.), not a replacement.

### What if I'm not using Jest?

While Jest is the primary supported test runner, the framework is designed to be extensible:

```javascript
// ai-test.config.js
module.exports = {
  testRunner: 'vitest', // or 'mocha'
  testCommand: 'vitest run --coverage' // custom command
};
```

### Can I use it with TypeScript?

Absolutely! The framework automatically detects TypeScript projects and adjusts accordingly. No additional configuration needed.

## 🤖 AI Features

### What AI insights does it provide?

The framework analyzes your test results and provides insights like:
- 📊 "Coverage in the API module is below 60% - consider adding tests for error handling"
- ⚡ "The authentication test suite takes 45s - consider mocking external services"
- 🎯 "3 test files have no assertions - they may not be testing anything"
- 💡 "Similar test patterns detected - consider creating shared test utilities"

### Does it require an internet connection for AI features?

No, the current AI insights are generated locally using pattern analysis and heuristics. Future versions may offer cloud-powered insights as an optional feature.

### Can it write tests for me?

Not in the current version (v1.x). Test generation is planned for v2.0. Currently, it helps you understand what tests you need to write.

### How smart are the AI recommendations?

The AI uses multiple signals:
- Code coverage data
- Test execution patterns
- Common testing anti-patterns
- Performance metrics
- Historical trends (when available)

It's designed to give practical, actionable advice rather than generic suggestions.

## 🛠️ Configuration

### What configuration options are available?

Key configuration options:

```javascript
module.exports = {
  projectName: 'My App',           // Display name
  projectType: 'monorepo',         // single | monorepo | microservices
  packageManager: 'npm',           // npm | yarn | pnpm
  testRunner: 'jest',              // jest | vitest | mocha
  coverageThreshold: 80,           // Minimum coverage percentage
  aiInsightsEnabled: true,         // Enable/disable AI features
  watch: false,                    // Run in watch mode
  maxWorkers: 4,                   // Parallel execution
  customUtils: './test-utils',     // Path to custom utilities
  reporters: ['markdown', 'json']  // Output formats
};
```

### How do I configure for a monorepo?

```javascript
// ai-test.config.js
module.exports = {
  projectType: 'monorepo',
  packages: {
    'web-app': { path: 'packages/web' },
    'api': { path: 'packages/api' },
    'shared': { path: 'packages/shared' }
  }
};
```

The framework will automatically detect workspace configurations for npm, yarn, and pnpm.

### Can I use different test commands per package?

Yes! Each package can have custom configuration:

```javascript
packages: {
  'web-app': { 
    path: 'packages/web',
    testCommand: 'npm run test:ui'
  },
  'api': { 
    path: 'packages/api',
    testCommand: 'npm run test:integration'
  }
}
```

## 🏃 Running Tests

### How do I run tests in watch mode?

```bash
npm run test:ai -- --watch
# or
ai-test --watch
```

Watch mode automatically re-runs affected tests when files change.

### Can I test a specific package in a monorepo?

```bash
# Test specific package
npm run test:ai -- --package web-app

# Test multiple packages
npm run test:ai -- --packages web-app,api

# Test by pattern
npm run test:ai -- --package-pattern "@myorg/*"
```

### How do I run only certain tests?

```bash
# By test name pattern
npm run test:ai -- --testNamePattern "user authentication"

# By file pattern
npm run test:ai -- --testPathPattern "api/**/*.test.js"

# By suite
npm run test:ai -- --selectProjects unit
```

### Can I generate different report formats?

```bash
# Markdown report (default)
npm run test:ai

# JSON report
npm run test:ai -- --reporter json

# HTML report
npm run test:ai -- --reporter html

# Multiple formats
npm run test:ai -- --reporters markdown,json,junit
```

## 🔧 Troubleshooting

### Tests are not being found

1. Check your test file naming:
   - Default patterns: `*.test.js`, `*.spec.js`, `*.test.ts`, `*.spec.ts`
   - Configure custom patterns in `testMatch`

2. Verify your project structure:
   ```bash
   ai-test --debug
   ```

3. Ensure test files are not ignored:
   ```javascript
   // Check these settings
   testPathIgnorePatterns: ['/node_modules/'],
   watchPathIgnorePatterns: ['/dist/']
   ```

### Coverage is showing 0%

1. Ensure coverage is enabled:
   ```javascript
   collectCoverage: true,
   collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}']
   ```

2. Check that source files are included:
   ```bash
   npm run test:ai -- --debug-coverage
   ```

3. Verify instrumentation is working:
   ```javascript
   coverageProvider: 'v8' // or 'babel'
   ```

### Tests pass locally but fail in CI

Common causes:

1. **Environment differences:**
   ```javascript
   // ai-test.config.js
   module.exports = {
     testEnvironment: process.env.CI ? 'node' : 'jsdom',
     testTimeout: process.env.CI ? 60000 : 30000
   };
   ```

2. **Timezone issues:**
   ```bash
   # In CI script
   export TZ=UTC
   npm run test:ai
   ```

3. **Missing dependencies:**
   ```bash
   # Use npm ci in CI
   npm ci
   npm run test:ai
   ```

### The AI insights seem wrong

The AI makes recommendations based on patterns. You can:

1. Provide feedback:
   ```bash
   ai-test feedback --issue "Incorrect coverage suggestion"
   ```

2. Disable specific insights:
   ```javascript
   aiInsights: {
     enabled: true,
     ignore: ['performance', 'complexity']
   }
   ```

3. Customize thresholds:
   ```javascript
   aiThresholds: {
     slowTest: 5000,      // 5s = slow
     lowCoverage: 70,     // Below 70% = low
     highComplexity: 10   // Cyclomatic complexity
   }
   ```

## 🚀 Advanced Usage

### Can I extend the framework with plugins?

Yes! Create custom plugins:

```javascript
// my-plugin.js
class MyTestPlugin {
  onTestStart(test) {
    console.log(`Starting: ${test.name}`);
  }
  
  onTestComplete(test, result) {
    if (result.duration > 1000) {
      this.slowTests.push(test.name);
    }
  }
  
  generateReport() {
    return {
      slowTests: this.slowTests,
      insights: ['Consider optimizing slow tests']
    };
  }
}

// ai-test.config.js
module.exports = {
  plugins: [
    new MyTestPlugin()
  ]
};
```

### How do I integrate with my IDE?

**VS Code:** Install the AI Test Framework extension
```bash
code --install-extension your-utilities.ai-test-framework
```

**WebStorm/IntelliJ:** Add run configuration
```xml
<configuration name="AI Tests" type="NodeJSConfigurationType">
  <node-parameters>node_modules/.bin/ai-test</node-parameters>
</configuration>
```

**Vim/Neovim:** Add command
```vim
:command AITest !npm run test:ai
```

### Can I use it with Docker?

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run test:ai
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  test:
    build: .
    command: npm run test:ai -- --watch
    volumes:
      - .:/app
      - /app/node_modules
```

### How do I optimize for large projects?

1. **Parallel execution:**
   ```javascript
   maxWorkers: '50%', // Use half of CPU cores
   ```

2. **Sharding:**
   ```bash
   # Split across CI runners
   npm run test:ai -- --shard=1/3
   npm run test:ai -- --shard=2/3
   npm run test:ai -- --shard=3/3
   ```

3. **Caching:**
   ```javascript
   cache: true,
   cacheDirectory: '.test-cache'
   ```

4. **Selective testing:**
   ```javascript
   // Only test changed files
   onlyChanged: true,
   // Or use patterns
   changedFilesWithAncestor: true
   ```

## 🤝 Contributing

### How can I contribute?

1. **Report bugs:** Open issues on GitHub
2. **Suggest features:** Discuss in GitHub Discussions
3. **Submit PRs:** See CONTRIBUTING.md
4. **Write plugins:** Share with the community
5. **Improve docs:** Documentation PRs are welcome!

### Is there a roadmap?

Yes! See [NEXT-STEPS.md](../NEXT-STEPS.md) for the detailed roadmap. Key upcoming features:
- v1.2: Enhanced watch mode
- v1.5: Multi-language support
- v2.0: Test generation
- v3.0: Web dashboard

### How do I report security issues?

Please email security@your-utilities.com directly. Do not open public issues for security vulnerabilities.

## 💡 Best Practices

### What's the recommended project structure?

```
my-project/
├── src/
│   ├── components/
│   │   ├── Button.js
│   │   └── Button.test.js    # Co-located tests
│   └── utils/
│       ├── helpers.js
│       └── __tests__/         # Or in __tests__ folder
│           └── helpers.test.js
├── test/
│   ├── setup.js              # Global test setup
│   └── fixtures/             # Test data
├── ai-test.config.js         # AI Test Framework config
└── package.json
```

### Should I aim for 100% coverage?

Not necessarily. The AI Test Framework recommends:
- 80%+ for critical business logic
- 70%+ for UI components
- 60%+ for utilities
- Focus on meaningful tests over coverage numbers

### How often should I run the full test suite?

- **Locally:** Run affected tests on save (watch mode)
- **Pre-commit:** Run changed file tests
- **Pre-push:** Run full suite
- **CI/CD:** Run full suite with reporting

### Any testing anti-patterns to avoid?

The AI Test Framework will warn you about:
- ❌ Tests without assertions
- ❌ Skipped tests that stay skipped
- ❌ Tests that only test implementation
- ❌ Excessive mocking
- ❌ Non-deterministic tests
- ❌ Tests that depend on order

## 🆘 Getting Help

### Where can I get support?

1. **Documentation:** Check the [docs](../README.md) first
2. **Examples:** See the [examples](../examples/) directory
3. **GitHub Issues:** For bugs and features
4. **Discussions:** For questions and ideas
5. **Stack Overflow:** Tag with `ai-test-framework`

### Is there a community?

Join our community:
- Discord: discord.gg/ai-test-framework
- Twitter: @AITestFramework
- Newsletter: Subscribe on our website

### Can I hire consultants?

Yes, several community members offer consulting:
- Implementation help
- Custom plugin development
- Training workshops
- Performance optimization

Contact consulting@your-utilities.com for referrals.

---

**Still have questions?** Open an issue on GitHub and we'll add it to this FAQ!