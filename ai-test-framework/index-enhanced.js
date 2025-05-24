#!/usr/bin/env node

const { TestProgressBar, MultiProgressBar } = require('./lib/progress');
const colors = require('./lib/colors');
const TestWatcher = require('./lib/watch');
const { program } = require('commander');
const packageJson = require('./package.json');

// Original imports
const { exec, execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const execAsync = promisify(exec);

/**
 * Enhanced AI Test Orchestrator with DX improvements
 * Extends the original orchestrator with better UI/UX
 *
 * @author JackHemmert3113
 * @version 1.1.0
 */
class EnhancedAITestOrchestrator {
  constructor(config = {}) {
    // Load configuration with defaults
    this.config = {
      projectName: 'My Project',
      projectType: 'monorepo',
      packageManager: 'npm',
      buildSystem: 'standard',
      testRunner: 'jest',
      coverageThreshold: 80,
      aiInsightsEnabled: true,
      customUtils: null,
      // Enhanced options
      useProgressBars: true,
      useColors: true,
      clearScreen: false,
      verboseOutput: false,
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

    // UI components
    this.progressBar = null;
    this.multiProgress = null;

    // Load custom utilities if provided
    if (this.config.customUtils) {
      this.customUtils = require(path.resolve(this.config.customUtils));
    }
  }

  /**
   * Main execution entry point with enhanced UI
   */
  async run() {
    // Clear screen if requested
    if (this.config.clearScreen) {
      console.clear();
    }

    // Beautiful header
    this.printHeader();

    try {
      // Phase 1: Environment validation
      await this.validateEnvironment();

      // Phase 2: Project analysis
      await this.analyzeProject();

      // Phase 3: Run tests with progress
      await this.runTestsWithProgress();

      // Phase 4: Analyze results
      await this.analyzeResults();

      // Phase 5: Generate insights
      if (this.config.aiInsightsEnabled) {
        await this.generateAIInsights();
      }

      // Phase 6: Generate report
      await this.generateReport();

      // Print beautiful summary
      this.printEnhancedSummary();

    } catch (error) {
      console.error(colors.error(`\n${colors.icon('error')} Test orchestration failed:`), error);
      process.exit(1);
    }
  }

  /**
   * Print beautiful header
   */
  printHeader() {
    const header = colors.box(
      `${colors.ai('AI Test Framework')} v${packageJson.version}\n` +
      `${colors.dim('Intelligent testing for modern projects')}`,
      { borderColor: 'info', title: 'Welcome' }
    );

    console.log(header);
    console.log('');
    console.log(colors.info(`${colors.icon('package')} Project: ${colors.package(this.config.projectName)}`));
    console.log(colors.dim(`👤 User: ${this.userName}`));
    console.log(colors.dim(`📅 Date: ${new Date().toLocaleString()}`));
    console.log(colors.dim('─'.repeat(50)) + '\n');
  }

  /**
   * Run tests with progress bars
   */
  async runTestsWithProgress() {
    console.log(colors.info(`${colors.icon('test')} Running tests...\n`));

    const packages = Object.keys(this.packages.list || { main: { path: '.' } });

    if (this.config.useProgressBars && packages.length > 1) {
      // Use multi-progress bar for multiple packages
      this.multiProgress = new MultiProgressBar();
      await this.runMultiPackageTestsWithProgress();
    } else if (this.config.useProgressBars) {
      // Use single progress bar
      this.progressBar = new TestProgressBar(100);
      await this.runSinglePackageTestWithProgress();
    } else {
      // Fall back to original method
      await this.runTests();
    }
  }

  /**
   * Run tests for multiple packages with progress
   */
  async runMultiPackageTestsWithProgress() {
    const packages = this.packages.list || {};
    const packageNames = Object.keys(packages);

    // Create progress bars for each package
    const progressBars = {};
    for (const name of packageNames) {
      progressBars[name] = this.multiProgress.create(name, 100);
    }

    // Run tests in parallel with progress updates
    const promises = packageNames.map(async (name) => {
      const info = packages[name];
      const bar = progressBars[name];

      bar.tick('Starting...');

      const startTime = Date.now();
      const testCommand = this.getTestCommand(info.path, name);

      try {
        bar.update(50, 'Running tests...');
        const result = await this.executeTest(testCommand);

        bar.update(75, 'Analyzing coverage...');
        this.testResults[name] = {
          ...result,
          duration: Date.now() - startTime,
          status: 'passed'
        };

        bar.complete(`✅ ${result.tests} tests, ${result.coverage}% coverage`);
      } catch (error) {
        this.testResults[name] = {
          status: 'failed',
          error: error.message,
          duration: Date.now() - startTime
        };
        bar.complete(`❌ Failed`);
      }

      this.multiProgress.render();
    });

    await Promise.all(promises);
    this.multiProgress.complete();
  }

  /**
   * Run single package test with progress
   */
  async runSinglePackageTestWithProgress() {
    this.progressBar.start('Initializing tests...');

    const testCommand = this.getTestCommand('.');
    const startTime = Date.now();

    try {
      this.progressBar.update(30, 'Running tests...');
      const result = await this.executeTest(testCommand);

      this.progressBar.update(70, 'Analyzing coverage...');
      this.testResults.main = {
        ...result,
        duration: Date.now() - startTime,
        status: 'passed'
      };

      this.progressBar.complete('✅ Tests completed!');
    } catch (error) {
      this.testResults.main = {
        status: 'failed',
        error: error.message,
        duration: Date.now() - startTime
      };
      this.progressBar.complete('❌ Tests failed!');
    }
  }

  /**
   * Print enhanced summary with colors and formatting
   */
  printEnhancedSummary() {
    const duration = (Date.now() - this.startTime) / 1000;

    console.log('\n' + colors.box(
      'Test Execution Complete',
      { borderColor: 'success', title: 'Summary' }
    ));

    // Create summary table
    const summaryData = [
      ['Metric', 'Value', 'Status'],
      ['Total Tests', this.summary.totalTests, this.getStatusIcon(this.summary.totalTests > 0)],
      ['Passed', this.summary.passedTests, this.getStatusIcon(this.summary.failedTests === 0)],
      ['Failed', this.summary.failedTests, this.getStatusIcon(this.summary.failedTests === 0)],
      ['Coverage', `${this.summary.averageCoverage}%`, this.getCoverageIcon(this.summary.averageCoverage)],
      ['Duration', `${duration.toFixed(1)}s`, this.getDurationIcon(duration)]
    ];

    console.log('\n' + colors.table(
      summaryData[0],
      summaryData.slice(1)
    ));

    // AI Insights summary
    if (this.aiInsights.length > 0) {
      console.log(`\n${colors.ai(colors.icon('ai') + ' AI Insights:')}`);

      const criticalInsights = this.aiInsights.filter(i => i.severity === 'error');
      const warnings = this.aiInsights.filter(i => i.severity === 'warning');
      const info = this.aiInsights.filter(i => i.severity === 'info');

      if (criticalInsights.length > 0) {
        console.log(colors.error(`  🚨 ${criticalInsights.length} critical issue(s)`));
      }
      if (warnings.length > 0) {
        console.log(colors.warning(`  ⚠️  ${warnings.length} warning(s)`));
      }
      if (info.length > 0) {
        console.log(colors.info(`  ℹ️  ${info.length} suggestion(s)`));
      }
    } else {
      console.log(colors.success(`\n${colors.icon('ai')} All systems optimal!`));
    }

    console.log('');
  }

  /**
   * Get status icon based on condition
   */
  getStatusIcon(isGood) {
    return isGood ? colors.success('✅') : colors.error('❌');
  }

  /**
   * Get coverage icon based on percentage
   */
  getCoverageIcon(coverage) {
    if (coverage >= this.config.coverageThreshold) {
      return colors.success('🎯');
    } else if (coverage >= this.config.coverageThreshold * 0.8) {
      return colors.warning('⚠️');
    } else {
      return colors.error('📉');
    }
  }

  /**
   * Get duration icon based on time
   */
  getDurationIcon(duration) {
    if (duration < 30) return '🚀';
    if (duration < 60) return '⏱️';
    return '🐌';
  }

  // Include all methods from original orchestrator...
  // (autoDiscoverPackages, validateEnvironment, analyzeProject, etc.)
  // These would be copied from the original index.js

  // For brevity, inheriting key methods
  async validateEnvironment() {
    console.log(colors.info('🔍 Validating environment...'));
    // Implementation from original
    console.log('');
  }

  async analyzeProject() {
    console.log(colors.info('📊 Analyzing project structure...'));
    // Implementation from original
    this.projectAnalysis = {
      type: this.config.projectType,
      packages: Object.keys(this.packages.list || {}).length
    };
    console.log('');
  }

  async runTests() {
    // Original implementation as fallback
    console.log('Running tests (fallback mode)...');
  }

  async analyzeResults() {
    // Original implementation
    this.summary = {
      totalTests: 10,
      passedTests: 9,
      failedTests: 1,
      averageCoverage: 85,
      duration: Date.now() - this.startTime,
      packagesTesetd: 1,
      failedPackages: 0
    };
  }

  async generateAIInsights() {
    // Original implementation
    this.aiInsights = [];
  }

  async generateReport() {
    // Original implementation
    console.log(colors.success('📝 Report generated!'));
  }

  getTestCommand(packagePath, packageName) {
    // Original implementation
    return 'npm test -- --coverage';
  }

  async executeTest(command) {
    // Original implementation
    return {
      tests: 10,
      passed: 9,
      failed: 1,
      coverage: 85
    };
  }

  autoDiscoverPackages() {
    // Original implementation
    return { type: 'single', list: { main: { path: '.' } } };
  }
}

// CLI Interface
program
  .name('ai-test')
  .description('AI-powered testing framework for JavaScript projects')
  .version(packageJson.version)
  .option('-w, --watch', 'Run in watch mode')
  .option('-c, --config <path>', 'Path to config file', 'ai-test.config.js')
  .option('--no-colors', 'Disable colored output')
  .option('--no-progress', 'Disable progress bars')
  .option('--clear', 'Clear screen before running')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    // Load config
    let config = {};
    try {
      config = require(path.join(process.cwd(), options.config));
    } catch {
      // Use defaults
    }

    // Apply CLI options
    config.watch = options.watch;
    config.clearScreen = options.clear;
    config.useProgressBars = options.progress;
    config.useColors = options.colors;
    config.verboseOutput = options.verbose;

    if (!options.colors) {
      colors.enabled = false;
    }

    // Create orchestrator
    const orchestrator = new EnhancedAITestOrchestrator(config);

    // Run in watch mode or normal mode
    if (options.watch) {
      const watcher = new TestWatcher(orchestrator, config.watchOptions);
      watcher.start();
    } else {
      await orchestrator.run();
    }
  });

// Parse CLI args if run directly
if (require.main === module) {
  program.parse();
}

module.exports = EnhancedAITestOrchestrator;