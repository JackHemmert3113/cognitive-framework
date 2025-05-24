# AI Test Framework - Common Scenarios

This guide covers real-world scenarios and how to handle them with the AI Test Framework.

## 📋 Table of Contents

1. [Testing a New Project](#testing-a-new-project)
2. [Adding to Existing Project](#adding-to-existing-project)
3. [CI/CD Integration](#cicd-integration)
4. [Handling Test Failures](#handling-test-failures)
5. [Improving Low Coverage](#improving-low-coverage)
6. [Custom Test Utilities](#custom-test-utilities)
7. [Testing Different Environments](#testing-different-environments)
8. [Performance Optimization](#performance-optimization)
9. [Team Collaboration](#team-collaboration)
10. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## 1. Testing a New Project

### Scenario: Starting fresh with AI Test Framework

```bash
# 1. Initialize your project
mkdir my-awesome-app
cd my-awesome-app
npm init -y

# 2. Install AI Test Framework
npm install -D @your-utilities/ai-test-framework jest

# 3. Initialize configuration
npx ai-test-init

# 4. Create your first source file
mkdir src
```

```javascript
// src/greeting.js
function greet(name) {
  if (!name) {
    throw new Error('Name is required');
  }
  return `Hello, ${name}!`;
}

module.exports = { greet };
```

```javascript
// src/greeting.test.js
const { greet } = require('./greeting');

describe('greet function', () => {
  test('returns greeting with name', () => {
    expect(greet('Jack')).toBe('Hello, Jack!');
  });

  test('throws error when name is empty', () => {
    expect(() => greet()).toThrow('Name is required');
  });
});
```

```bash
# 5. Run AI tests
npm run test:ai

# Output:
# 🤖 AI Test Framework v1.1.0
# ✅ All tests passed!
# 📊 Coverage: 100%
# 🎯 AI Insight: Great job! Full coverage achieved.
```

## 2. Adding to Existing Project

### Scenario: You have a project with existing tests

```javascript
// ai-test.config.js
module.exports = {
  projectName: 'My Existing Project',
  
  // If you have custom test commands
  testCommand: 'npm run test:custom',
  
  // If tests are in non-standard locations
  testMatch: [
    '**/tests/**/*.spec.js',
    '**/src/**/*.test.js'
  ],
  
  // Preserve existing Jest config
  useExistingJestConfig: true,
  
  // Gradual adoption - start with lower threshold
  coverageThreshold: 60,
  
  // Exclude legacy code initially
  coveragePathIgnorePatterns: [
    '/legacy/',
    '/vendor/'
  ]
};
```

```bash
# Run without modifying existing setup
npm run test:ai -- --no-coverage-override
```

## 3. CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/ai-test.yml
name: AI Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run AI Tests
      run: npm run test:ai -- --no-colors
      
    - name: Upload test report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: ai-test-report
        path: test-results/ai-test-report.md
        
    - name: Comment PR with results
      uses: actions/github-script@v6
      if: github.event_name == 'pull_request'
      with:
        script: |
          const fs = require('fs');
          const report = fs.readFileSync('test-results/ai-test-report.md', 'utf8');
          const summary = report.split('\n').slice(0, 20).join('\n');
          
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: `## 🤖 AI Test Results\n\n${summary}\n\n[View full report](https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId})`
          });
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test

ai-test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run test:ai -- --no-colors
  coverage: '/Coverage:\s*(\d+\.?\d*)%/'
  artifacts:
    when: always
    reports:
      junit: test-results/junit.xml
    paths:
      - test-results/
    expire_in: 1 week
```

## 4. Handling Test Failures

### Scenario: Tests are failing, need to debug

```javascript
// ai-test.config.js
module.exports = {
  // Enable detailed error output
  verbose: true,
  
  // Stop on first failure for debugging
  bail: true,
  
  // Run specific test file
  testNamePattern: 'UserService',
  
  // Enable step-by-step debugging
  runInBand: true,
  
  // Custom error formatting
  errorHandler: (error, testPath) => {
    console.log(`\n❌ FAILED: ${testPath}`);
    console.log(`Error: ${error.message}`);
    console.log(`Stack: ${error.stack}`);
    
    // Add debugging hints
    if (error.message.includes('Cannot read property')) {
      console.log('\n💡 Hint: Check for null/undefined values');
    }
  }
};
```

```bash
# Debug specific test
npm run test:ai -- --testNamePattern="should handle user login"

# Run with Node debugger
node --inspect-brk node_modules/.bin/ai-test
```

## 5. Improving Low Coverage

### Scenario: Coverage is below threshold

```javascript
// Use AI Test Framework utilities to identify gaps
const { CoverageAnalyzer } = require('@your-utilities/ai-test-framework');

async function analyzeCoverage() {
  const analyzer = new CoverageAnalyzer();
  const report = await analyzer.analyze('./coverage/lcov.info');
  
  console.log('Uncovered lines by file:');
  report.files.forEach(file => {
    if (file.coverage < 80) {
      console.log(`\n${file.path}: ${file.coverage}%`);
      console.log('Uncovered lines:', file.uncoveredLines.join(', '));
    }
  });
  
  // Generate test suggestions
  const suggestions = await analyzer.suggestTests();
  console.log('\nSuggested tests:');
  suggestions.forEach(s => console.log(`- ${s}`));
}
```

### Example: Adding tests for uncovered code

```javascript
// Original code with low coverage
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    if (!item.id || !item.price) {  // ❌ Not tested
      throw new Error('Invalid item');
    }
    
    if (item.quantity <= 0) {  // ❌ Not tested
      throw new Error('Quantity must be positive');
    }
    
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce((sum, item) => {
      const discount = item.discount || 0;  // ❌ Not tested
      return sum + (item.price * item.quantity * (1 - discount));
    }, 0);
  }
}

// New tests to improve coverage
describe('ShoppingCart edge cases', () => {
  let cart;
  
  beforeEach(() => {
    cart = new ShoppingCart();
  });

  test('throws error for item without id', () => {
    expect(() => {
      cart.addItem({ price: 10, quantity: 1 });
    }).toThrow('Invalid item');
  });

  test('throws error for negative quantity', () => {
    expect(() => {
      cart.addItem({ id: '1', price: 10, quantity: -1 });
    }).toThrow('Quantity must be positive');
  });

  test('applies discount correctly', () => {
    cart.addItem({ 
      id: '1', 
      price: 100, 
      quantity: 2, 
      discount: 0.1  // 10% discount
    });
    
    expect(cart.getTotal()).toBe(180); // 200 - 20
  });
});
```

## 6. Custom Test Utilities

### Scenario: Domain-specific test helpers

```javascript
// test-utils/e-commerce.js
const { GenericTestUtils } = require('@your-utilities/ai-test-framework');

class ECommerceTestUtils extends GenericTestUtils {
  static generateProduct(overrides = {}) {
    return {
      id: this.faker.datatype.uuid(),
      name: this.faker.commerce.productName(),
      price: parseFloat(this.faker.commerce.price()),
      category: this.faker.commerce.department(),
      inStock: this.faker.datatype.boolean(),
      sku: this.faker.random.alphaNumeric(8).toUpperCase(),
      ...overrides
    };
  }

  static generateOrder(overrides = {}) {
    const items = overrides.items || [
      this.generateProduct(),
      this.generateProduct()
    ];
    
    return {
      orderId: this.faker.datatype.uuid(),
      customerId: this.faker.datatype.uuid(),
      items,
      total: items.reduce((sum, item) => sum + item.price, 0),
      status: 'pending',
      createdAt: this.faker.date.recent(),
      ...overrides
    };
  }

  static async mockPaymentGateway(success = true) {
    return this.mockAPIResponse(
      success ? 
        { transactionId: this.faker.datatype.uuid(), status: 'approved' } :
        { error: 'Payment declined' },
      { status: success ? 200 : 400, delay: 1000 }
    );
  }
}

// Usage in tests
const { ECommerceTestUtils } = require('./test-utils/e-commerce');

test('checkout process with mocked payment', async () => {
  const order = ECommerceTestUtils.generateOrder();
  const payment = await ECommerceTestUtils.mockPaymentGateway(true);
  
  expect(payment.data.status).toBe('approved');
});
```

## 7. Testing Different Environments

### Scenario: Different configs for dev/staging/prod

```javascript
// ai-test.config.js
const environment = process.env.TEST_ENV || 'development';

const configs = {
  development: {
    projectName: 'My App (Dev)',
    coverageThreshold: 70,
    testTimeout: 30000,
    mockExternalServices: true
  },
  
  staging: {
    projectName: 'My App (Staging)',
    coverageThreshold: 80,
    testTimeout: 60000,
    mockExternalServices: false,
    testURL: 'https://staging.myapp.com'
  },
  
  production: {
    projectName: 'My App (Prod)',
    coverageThreshold: 90,
    testTimeout: 120000,
    runSmokeTestsOnly: true,
    alerts: {
      slack: process.env.SLACK_WEBHOOK
    }
  }
};

module.exports = {
  ...configs[environment],
  
  // Environment-specific test selection
  testMatch: environment === 'production' ? 
    ['**/*.smoke.test.js'] : 
    ['**/*.test.js'],
    
  // Environment variables
  globals: {
    __TEST_ENV__: environment,
    __API_URL__: process.env.API_URL || 'http://localhost:3000'
  }
};
```

```bash
# Run for different environments
TEST_ENV=staging npm run test:ai
TEST_ENV=production npm run test:ai
```

## 8. Performance Optimization

### Scenario: Tests are running slowly

```javascript
// ai-test.config.js
module.exports = {
  // Run tests in parallel
  maxWorkers: '50%',  // Use 50% of available CPU cores
  
  // Cache test results
  cache: true,
  cacheDirectory: '/tmp/jest-cache',
  
  // Only run tests for changed files
  onlyChanged: true,
  
  // Skip expensive setup for unit tests
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/*.unit.test.js'],
      testEnvironment: 'node',
      setupFilesAfterEnv: [] // No setup needed
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/src/**/*.integration.test.js'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/test/setup.js']
    }
  ],
  
  // Optimize transforms
  transformIgnorePatterns: [
    'node_modules/(?!(module-to-transform)/)'
  ]
};
```

### Performance monitoring

```javascript
// test-utils/performance.js
class PerformanceMonitor {
  static startTest(testName) {
    global.__testTimings__ = global.__testTimings__ || {};
    global.__testTimings__[testName] = process.hrtime();
  }

  static endTest(testName) {
    const [seconds, nanoseconds] = process.hrtime(global.__testTimings__[testName]);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    if (duration > 1000) {
      console.warn(`⚠️  Slow test detected: ${testName} took ${duration.toFixed(0)}ms`);
    }
    
    return duration;
  }
}

// Usage
beforeEach(() => {
  PerformanceMonitor.startTest(expect.getState().currentTestName);
});

afterEach(() => {
  PerformanceMonitor.endTest(expect.getState().currentTestName);
});
```

## 9. Team Collaboration

### Scenario: Multiple developers working on tests

```javascript
// ai-test.config.js
module.exports = {
  // Assign ownership to test suites
  testOwners: {
    'src/api/**': '@backend-team',
    'src/components/**': '@frontend-team',
    'src/utils/**': '@core-team'
  },
  
  // Custom reporter for team metrics
  reporters: [
    'default',
    ['./reporters/team-reporter.js', {
      outputFile: 'test-results/team-metrics.json'
    }]
  ],
  
  // Notify on failures
  onTestFailure: async (test, error) => {
    const owner = getTestOwner(test.path);
    await notifySlack(`Test failed: ${test.title}\nOwner: ${owner}`);
  }
};
```

### Shared test utilities

```javascript
// team-test-conventions.js
/**
 * Team Testing Conventions
 * 
 * 1. Always use data-testid for E2E tests
 * 2. Mock external services
 * 3. Use factories for test data
 * 4. Follow AAA pattern (Arrange, Act, Assert)
 */

const teamHelpers = {
  // Consistent test data
  createTestUser: (overrides = {}) => ({
    id: 'test-user-123',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  }),
  
  // Consistent assertions
  expectSuccessResponse: (response) => {
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.error).toBeNull();
  },
  
  // Consistent mocking
  mockAuthService: () => {
    jest.mock('../services/auth', () => ({
      authenticate: jest.fn().mockResolvedValue({ token: 'test-token' }),
      authorize: jest.fn().mockResolvedValue(true)
    }));
  }
};

module.exports = teamHelpers;
```

## 10. Troubleshooting Common Issues

### Issue: "Cannot find module" errors

```javascript
// ai-test.config.js
module.exports = {
  // Fix module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  
  // Include all necessary files
  moduleDirectories: ['node_modules', 'src'],
  
  // Resolve these extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json']
};
```

### Issue: Async tests timing out

```javascript
// Increase timeout for specific tests
test('slow API call', async () => {
  jest.setTimeout(10000); // 10 seconds for this test
  
  const result = await slowAPICall();
  expect(result).toBeDefined();
});

// Or globally in config
module.exports = {
  testTimeout: 30000 // 30 seconds for all tests
};
```

### Issue: Memory leaks in tests

```javascript
// Proper cleanup
describe('Component tests', () => {
  let component;
  let mockServer;

  beforeEach(() => {
    mockServer = setupMockServer();
    component = render(<MyComponent />);
  });

  afterEach(() => {
    // Clean up DOM
    component.unmount();
    
    // Close connections
    mockServer.close();
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Clear timers
    jest.clearAllTimers();
  });
  
  // Force garbage collection in watch mode
  afterAll(() => {
    if (global.gc) {
      global.gc();
    }
  });
});
```

### Issue: Flaky tests

```javascript
// Retry flaky tests
module.exports = {
  retryTimes: 3,
  
  // Or per test
  testRetries: {
    'network-tests/**': 3,
    'ui-tests/**': 2
  }
};

// Wait for conditions
const { waitFor } = require('@testing-library/react');

test('async UI update', async () => {
  const { getByText } = render(<AsyncComponent />);
  
  // Wait for element with retry
  await waitFor(() => {
    expect(getByText('Loaded')).toBeInTheDocument();
  }, {
    timeout: 5000,
    interval: 100
  });
});

// Stabilize timing-dependent tests
const stableTest = async (testFn, options = {}) => {
  const { retries = 3, delay = 100 } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      await testFn();
      return; // Success
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delay));
    }
  }
};
```