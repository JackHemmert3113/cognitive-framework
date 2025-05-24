#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

/**
 * CLI tool to initialize AI Test Framework in a project
 */
class AITestCLI {
  constructor() {
    this.questions = [
      {
        name: 'projectName',
        message: 'What is your project name?',
        default: path.basename(process.cwd())
      },
      {
        name: 'projectType',
        message: 'What type of project is this?',
        choices: ['monorepo', 'single', 'microservices'],
        default: 'single'
      },
      {
        name: 'packageManager',
        message: 'Which package manager do you use?',
        choices: ['npm', 'yarn', 'pnpm'],
        default: 'npm'
      },
      {
        name: 'testRunner',
        message: 'Which test runner do you use?',
        choices: ['jest', 'vitest', 'mocha', 'other'],
        default: 'jest'
      },
      {
        name: 'coverageThreshold',
        message: 'What should be the minimum coverage threshold?',
        default: 80
      }
    ];
  }

  async run() {
    console.log('🤖 AI Test Framework Setup\n');
    
    // For demo purposes, using defaults
    const config = {
      projectName: path.basename(process.cwd()),
      projectType: 'single',
      packageManager: 'npm',
      testRunner: 'jest',
      coverageThreshold: 80
    };

    await this.createConfigFile(config);
    await this.updatePackageJson(config);
    await this.createExampleTest();

    console.log('\n✅ AI Test Framework initialized!');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm run test:ai');
    console.log('\nHappy testing! 🎉');
  }

  async createConfigFile(config) {
    const configContent = `/**
 * AI Test Framework Configuration
 * Generated on ${new Date().toISOString()}
 */
module.exports = {
  projectName: '${config.projectName}',
  projectType: '${config.projectType}',
  packageManager: '${config.packageManager}',
  testRunner: '${config.testRunner}',
  coverageThreshold: ${config.coverageThreshold},
  
  // Enable AI insights
  aiInsightsEnabled: true,
  
  // Custom test utilities (optional)
  // customUtils: './test/utils',
  
  // Package configuration (for monorepos)
  // packages: {
  //   'web-app': { path: 'packages/web' },
  //   'api': { path: 'packages/api' }
  // }
};
`;

    await writeFile('ai-test.config.js', configContent);
    console.log('✅ Created ai-test.config.js');
  }

  async updatePackageJson(config) {
    const pkgPath = path.join(process.cwd(), 'package.json');
    let pkg = {};

    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch {
      pkg = { name: config.projectName, version: '1.0.0' };
    }

    // Add scripts
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['test:ai'] = 'ai-test';
    pkg.scripts['test:coverage'] = `${config.packageManager} test -- --coverage`;

    // Add dev dependencies
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.devDependencies['@your-org/ai-test-framework'] = '^1.0.0';

    await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('✅ Updated package.json');
  }

  async createExampleTest() {
    const testDir = path.join(process.cwd(), '__tests__');
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const exampleTest = `/**
 * Example test using AI Test Framework
 */
const { GenericTestUtils } = require('@your-org/ai-test-framework');

describe('Example Test Suite', () => {
  test('should generate test data', () => {
    const user = GenericTestUtils.generateUser();
    
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(GenericTestUtils.validateEmail(user.email)).toBe(true);
  });

  test('should mock API responses', async () => {
    const mockData = { message: 'Success' };
    const response = await GenericTestUtils.mockAPIResponse(mockData);
    
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });
});
`;

    await writeFile(path.join(testDir, 'example.test.js'), exampleTest);
    console.log('✅ Created example test');
  }
}

// Run CLI
if (require.main === module) {
  new AITestCLI().run().catch(console.error);
}

module.exports = AITestCLI;
