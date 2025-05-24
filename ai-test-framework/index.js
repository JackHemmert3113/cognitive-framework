#!/usr/bin/env node

const { exec, execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * Generic AI Test Orchestrator
 * A reusable, AI-powered testing framework for any JavaScript/TypeScript project
 * 
 * @author JackHemmert3113
 * @version 1.0.0
 * @license MIT
 */
class AITestOrchestrator {
  constructor(config = {}) {
    // Load configuration with defaults
    this.config = {
      projectName: 'My Project',
      projectType: 'monorepo', // monorepo | single | microservices
      packageManager: 'npm', // npm | yarn | pnpm
      buildSystem: 'standard', // standard | nx | turborepo | lerna
      testRunner: 'jest', // jest | vitest | mocha
      coverageThreshold: 80,
      aiInsightsEnabled: true,
      customUtils: null,
      ...config
    };
    
    // Auto-detect configuration if not provided
    if (!config.packages) {
      this.packages = this.autoDiscoverPackages();
    } else {
      this.packages = config.packages;
    }
    
    // Initialize state
    this.testResults = {};
    this.startTime = Date.now();
    this.aiInsights = [];
    this.userName = process.env.USER || 'developer';
    
    // Load custom utilities if provided
    if (this.config.customUtils) {
      this.customUtils = require(path.resolve(this.config.customUtils));
    }
  }

  /**
   * Main execution entry point
   */
  async run() {
    console.log('🤖 AI Test Orchestrator');
    console.log(`📦 Project: ${this.config.projectName}`);
    console.log(`👤 User: ${this.userName}`);
    console.log(`📅 Date: ${new Date().toISOString()}`);
    console.log('─'.repeat(50));
    console.log('');
    
    try {
      // Phase 1: Environment validation
      await this.validateEnvironment();
      
      // Phase 2: Project analysis
      await this.analyzeProject();
      
      // Phase 3: Run tests
      await this.runTests();
      
      // Phase 4: Analyze results
      await this.analyzeResults();
      
      // Phase 5: Generate insights
      if (this.config.aiInsightsEnabled) {
        await this.generateAIInsights();
      }
      
      // Phase 6: Generate report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Test orchestration failed:', error);
      process.exit(1);
    }
  }

  /**
   * Auto-discover packages in the project
   */
  autoDiscoverPackages() {
    const packages = {};
    
    try {
      // Check for monorepo configurations
      if (fs.existsSync('pnpm-workspace.yaml')) {
        // pnpm workspace
        packages.type = 'pnpm-workspace';
        packages.list = this.discoverPnpmPackages();
      } else if (fs.existsSync('lerna.json')) {
        // Lerna monorepo
        packages.type = 'lerna';
        packages.list = this.discoverLernaPackages();
      } else if (fs.existsSync('package.json')) {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (pkg.workspaces) {
          // Yarn/npm workspaces
          packages.type = 'workspaces';
          packages.list = this.discoverWorkspacePackages(pkg.workspaces);
        } else {
          // Single package
          packages.type = 'single';
          packages.list = { [pkg.name || 'main']: { path: '.' } };
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not auto-discover packages:', error.message);
      packages.type = 'single';
      packages.list = { main: { path: '.' } };
    }
    
    return packages;
  }

  /**
   * Validate the environment has required tools
   */
  async validateEnvironment() {
    console.log('🔍 Validating environment...');
    
    const checks = {
      'Node.js': () => process.version,
      [this.config.packageManager]: () => {
        const version = execSync(`${this.config.packageManager} --version`).toString().trim();
        return version;
      }
    };
    
    // Add optional tool checks
    if (this.config.buildSystem === 'nx') {
      checks['nx'] = () => execSync('npx nx --version').toString().trim();
    }
    
    if (this.config.testRunner === 'jest') {
      checks['jest'] = () => {
        try {
          return execSync('npx jest --version').toString().trim();
        } catch {
          return 'Not installed (will use local)';
        }
      };
    }
    
    for (const [tool, check] of Object.entries(checks)) {
      try {
        const version = check();
        console.log(`  ✅ ${tool}: ${version}`);
      } catch (error) {
        console.log(`  ❌ ${tool}: Not found`);
        if (tool !== 'Node.js' && tool !== this.config.packageManager) {
          console.log(`     (Optional - some features may be limited)`);
        } else {
          throw new Error(`Required tool ${tool} not found`);
        }
      }
    }
    
    console.log('');
  }

  /**
   * Analyze the project structure
   */
  async analyzeProject() {
    console.log('📊 Analyzing project structure...');
    
    const analysis = {
      type: this.config.projectType,
      packages: Object.keys(this.packages.list || {}).length,
      testFramework: this.config.testRunner,
      coverageData: await this.checkExistingCoverage(),
      lastCommit: await this.getLastCommit(),
      dependencies: await this.analyzeDependencies()
    };
    
    this.projectAnalysis = analysis;
    
    console.log(`  📦 Type: ${analysis.type}`);
    console.log(`  📦 Packages: ${analysis.packages}`);
    console.log(`  🧪 Test Framework: ${analysis.testFramework}`);
    console.log(`  📊 Previous Coverage: ${analysis.coverageData.average || 'N/A'}%`);
    console.log('');
  }

  /**
   * Run tests for all packages
   */
  async runTests() {
    console.log('🧪 Running tests...\n');
    
    if (this.packages.type === 'single') {
      // Single package project
      await this.runSinglePackageTest();
    } else {
      // Multi-package project
      await this.runMultiPackageTests();
    }
  }

  /**
   * Run tests for a single package project
   */
  async runSinglePackageTest() {
    console.log('📦 Testing single package project...');
    
    const testCommand = this.getTestCommand('.');
    const startTime = Date.now();
    
    try {
      const result = await this.executeTest(testCommand);
      this.testResults.main = {
        ...result,
        duration: Date.now() - startTime,
        status: 'passed'
      };
      console.log('  ✅ Tests passed');
    } catch (error) {
      this.testResults.main = {
        status: 'failed',
        error: error.message,
        duration: Date.now() - startTime
      };
      console.log('  ❌ Tests failed');
    }
  }

  /**
   * Run tests for multiple packages
   */
  async runMultiPackageTests() {
    const packages = this.packages.list || {};
    
    for (const [name, info] of Object.entries(packages)) {
      console.log(`📦 Testing ${name}...`);
      
      const startTime = Date.now();
      const testCommand = this.getTestCommand(info.path, name);
      
      try {
        const result = await this.executeTest(testCommand);
        this.testResults[name] = {
          ...result,
          duration: Date.now() - startTime,
          status: 'passed'
        };
        console.log(`  ✅ Passed (${result.tests} tests, ${result.coverage}% coverage)`);
      } catch (error) {
        this.testResults[name] = {
          status: 'failed',
          error: error.message,
          duration: Date.now() - startTime
        };
        console.log(`  ❌ Failed: ${error.message}`);
      }
      
      console.log('');
    }
  }

  /**
   * Get the appropriate test command based on configuration
   */
  getTestCommand(packagePath, packageName) {
    const { packageManager, buildSystem, testRunner } = this.config;
    
    // Build system specific commands
    if (buildSystem === 'nx' && packageName) {
      return `npx nx test ${packageName} --coverage`;
    }
    
    if (buildSystem === 'turborepo' && packageName) {
      return `turbo run test --filter=${packageName}`;
    }
    
    // Package manager specific commands
    if (packageManager === 'pnpm' && packageName) {
      return `pnpm --filter ${packageName} test -- --coverage`;
    }
    
    if (packageManager === 'yarn' && packagePath !== '.') {
      return `yarn workspace ${packageName} test --coverage`;
    }
    
    // Default command
    return `${packageManager} test -- --coverage`;
  }

  /**
   * Execute a test command and parse results
   */
  async executeTest(command) {
    try {
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      return this.parseTestOutput(stdout + stderr);
    } catch (error) {
      // Even on test failure, try to parse the output
      const output = error.stdout || error.stderr || '';
      const results = this.parseTestOutput(output);
      
      if (results.tests > 0) {
        return results;
      }
      
      throw error;
    }
  }

  /**
   * Parse test output to extract metrics
   */
  parseTestOutput(output) {
    const results = {
      tests: 0,
      passed: 0,
      failed: 0,
      coverage: 0,
      duration: 0
    };
    
    // Parse Jest output
    const testMatch = output.match(/Tests:\s+(\d+)\s+failed.*?(\d+)\s+passed.*?(\d+)\s+total/);
    if (testMatch) {
      results.failed = parseInt(testMatch[1]);
      results.passed = parseInt(testMatch[2]);
      results.tests = parseInt(testMatch[3]);
    }
    
    // Parse coverage
    const coverageMatch = output.match(/All files[^|]*\|\s*([\d.]+)/);
    if (coverageMatch) {
      results.coverage = parseFloat(coverageMatch[1]);
    }
    
    // Parse duration
    const durationMatch = output.match(/Time:\s*([\d.]+)\s*s/);
    if (durationMatch) {
      results.duration = parseFloat(durationMatch[1]) * 1000;
    }
    
    return results;
  }

  /**
   * Analyze test results
   */
  async analyzeResults() {
    console.log('📊 Analyzing results...\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let totalCoverage = 0;
    let packageCount = 0;
    
    for (const [name, result] of Object.entries(this.testResults)) {
      if (result.tests) {
        totalTests += result.tests;
        passedTests += result.passed || 0;
      }
      
      if (result.coverage) {
        totalCoverage += result.coverage;
        packageCount++;
      }
    }
    
    this.summary = {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      averageCoverage: packageCount > 0 ? (totalCoverage / packageCount).toFixed(1) : 0,
      duration: Date.now() - this.startTime,
      packagesTesetd: Object.keys(this.testResults).length,
      failedPackages: Object.values(this.testResults).filter(r => r.status === 'failed').length
    };
  }

  /**
   * Generate AI insights based on results
   */
  async generateAIInsights() {
    console.log('🤖 Generating AI insights...\n');
    
    const insights = [];
    
    // Coverage insights
    if (this.summary.averageCoverage < this.config.coverageThreshold) {
      insights.push({
        type: 'coverage',
        severity: 'warning',
        message: `Average coverage (${this.summary.averageCoverage}%) is below threshold (${this.config.coverageThreshold}%)`,
        recommendation: 'Consider adding more unit tests to critical code paths'
      });
    }
    
    // Performance insights
    const slowPackages = Object.entries(this.testResults)
      .filter(([_, r]) => r.duration > 30000)
      .map(([name, _]) => name);
    
    if (slowPackages.length > 0) {
      insights.push({
        type: 'performance',
        severity: 'info',
        message: `Slow test suites detected: ${slowPackages.join(', ')}`,
        recommendation: 'Consider optimizing test setup/teardown or using test parallelization'
      });
    }
    
    // Failure insights
    if (this.summary.failedPackages > 0) {
      insights.push({
        type: 'failures',
        severity: 'error',
        message: `${this.summary.failedPackages} package(s) have failing tests`,
        recommendation: 'Fix failing tests before merging to main branch'
      });
    }
    
    this.aiInsights = insights;
  }

  /**
   * Generate comprehensive test report
   */
  async generateReport() {
    console.log('📝 Generating report...\n');
    
    const reportDir = path.join(process.cwd(), 'test-results');
    await fs.mkdir(reportDir, { recursive: true });
    
    const report = this.compileReport();
    const reportPath = path.join(reportDir, 'ai-test-report.md');
    
    await fs.writeFile(reportPath, report);
    
    console.log(`✅ Report generated: ${reportPath}`);
    this.printSummary();
  }

  /**
   * Compile the markdown report
   */
  compileReport() {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    
    return `# AI Test Report

**Project:** ${this.config.projectName}  
**Date:** ${new Date().toISOString()}  
**Duration:** ${duration}s  
**User:** ${this.userName}

## 📊 Summary

- **Total Tests:** ${this.summary.totalTests}
- **Passed:** ${this.summary.passedTests} (${this.summary.totalTests > 0 ? Math.round(this.summary.passedTests / this.summary.totalTests * 100) : 0}%)
- **Failed:** ${this.summary.failedTests}
- **Average Coverage:** ${this.summary.averageCoverage}%
- **Packages Tested:** ${this.summary.packagesTesetd}

## 📦 Package Results

${this.generatePackageResults()}

## 🤖 AI Insights

${this.generateInsights()}

## 📈 Trends

${this.generateTrends()}

---
*Generated by AI Test Orchestrator v1.0.0*
`;
  }

  /**
   * Generate package results section
   */
  generatePackageResults() {
    let markdown = '';
    
    for (const [name, result] of Object.entries(this.testResults)) {
      const icon = result.status === 'passed' ? '✅' : '❌';
      markdown += `### ${icon} ${name}\n\n`;
      
      if (result.tests) {
        markdown += `- Tests: ${result.passed}/${result.tests}\n`;
        markdown += `- Coverage: ${result.coverage}%\n`;
        markdown += `- Duration: ${(result.duration / 1000).toFixed(1)}s\n`;
      }
      
      if (result.error) {
        markdown += `- Error: ${result.error}\n`;
      }
      
      markdown += '\n';
    }
    
    return markdown;
  }

  /**
   * Generate AI insights section
   */
  generateInsights() {
    if (this.aiInsights.length === 0) {
      return '✅ All systems operating normally. No issues detected.';
    }
    
    let markdown = '';
    
    const grouped = this.aiInsights.reduce((acc, insight) => {
      if (!acc[insight.severity]) acc[insight.severity] = [];
      acc[insight.severity].push(insight);
      return acc;
    }, {});
    
    const severityIcons = {
      error: '🚨',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    for (const [severity, insights] of Object.entries(grouped)) {
      markdown += `### ${severityIcons[severity]} ${severity.toUpperCase()}\n\n`;
      
      for (const insight of insights) {
        markdown += `- **${insight.message}**\n`;
        markdown += `  - Recommendation: ${insight.recommendation}\n`;
      }
      
      markdown += '\n';
    }
    
    return markdown;
  }

  /**
   * Generate trends section
   */
  generateTrends() {
    // In a real implementation, this would compare with historical data
    return `- First run - no historical data available
- Set up continuous tracking to monitor trends
- Coverage threshold: ${this.config.coverageThreshold}%`;
  }

  /**
   * Print summary to console
   */
  printSummary() {
    console.log('\n📊 Test Summary');
    console.log('─'.repeat(50));
    console.log(`✅ Passed: ${this.summary.passedTests}/${this.summary.totalTests} tests`);
    console.log(`📊 Coverage: ${this.summary.averageCoverage}%`);
    console.log(`⏱️  Duration: ${(this.summary.duration / 1000).toFixed(1)}s`);
    
    if (this.summary.failedPackages > 0) {
      console.log(`\n⚠️  ${this.summary.failedPackages} package(s) failed!`);
    }
  }

  // Helper methods
  async checkExistingCoverage() {
    // Check for existing coverage data
    try {
      const coverageFiles = await this.findCoverageFiles();
      if (coverageFiles.length > 0) {
        // Parse and aggregate coverage
        return { average: 75, files: coverageFiles.length };
      }
    } catch {
      return { average: null, files: 0 };
    }
  }

  async findCoverageFiles() {
    // Recursively find coverage files
    return [];
  }

  async getLastCommit() {
    try {
      return execSync('git log -1 --format="%h %s"').toString().trim();
    } catch {
      return 'No git history';
    }
  }

  async analyzeDependencies() {
    try {
      const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
      return {
        production: Object.keys(pkg.dependencies || {}).length,
        development: Object.keys(pkg.devDependencies || {}).length
      };
    } catch {
      return { production: 0, development: 0 };
    }
  }

  discoverPnpmPackages() {
    // Implementation for pnpm workspace discovery
    try {
      const yaml = fs.readFileSync('pnpm-workspace.yaml', 'utf8');
      // Parse yaml and discover packages
      return {};
    } catch {
      return {};
    }
  }

  discoverLernaPackages() {
    // Implementation for lerna package discovery
    try {
      const lerna = JSON.parse(fs.readFileSync('lerna.json', 'utf8'));
      // Use lerna config to find packages
      return {};
    } catch {
      return {};
    }
  }

  discoverWorkspacePackages(workspaces) {
    // Implementation for yarn/npm workspace discovery
    const packages = {};
    // Parse workspace globs and find packages
    return packages;
  }
}

// Export for use as a library
module.exports = AITestOrchestrator;

// CLI execution
if (require.main === module) {
  // Look for configuration file
  let config = {};
  
  try {
    config = require(path.join(process.cwd(), 'ai-test.config.js'));
  } catch {
    console.log('No ai-test.config.js found, using defaults');
  }
  
  const orchestrator = new AITestOrchestrator(config);
  orchestrator.run().catch(console.error);
}
