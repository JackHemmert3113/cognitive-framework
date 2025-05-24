const chokidar = require('chokidar');
const path = require('path');
const debounce = require('lodash.debounce');
const colors = require('./colors');

/**
 * Watch mode for continuous testing
 */
class TestWatcher {
  constructor(orchestrator, options = {}) {
    this.orchestrator = orchestrator;
    this.options = {
      patterns: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
      ignore: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/.git/**'],
      debounce: 1000,
      clearScreen: true,
      ...options
    };
    
    this.watcher = null;
    this.isRunning = false;
    this.runQueue = new Set();
  }

  start() {
    console.log(colors.ai('🤖 AI Test Framework - Watch Mode'));
    console.log(colors.dim('Watching for file changes...\n'));

    // Initialize watcher
    this.watcher = chokidar.watch(this.options.patterns, {
      ignored: this.options.ignore,
      persistent: true,
      ignoreInitial: true
    });

    // Debounced test runner
    const runTests = debounce(async () => {
      if (this.isRunning) return;
      
      this.isRunning = true;
      const files = Array.from(this.runQueue);
      this.runQueue.clear();

      if (this.options.clearScreen) {
        console.clear();
      }

      console.log(colors.info(`\n${colors.icon('running')} Running tests...`));
      console.log(colors.dim(`Changed files: ${files.join(', ')}\n`));

      try {
        // Determine which packages to test based on changed files
        const affectedPackages = this.getAffectedPackages(files);
        
        if (affectedPackages.length > 0) {
          await this.orchestrator.runTests(affectedPackages);
        } else {
          await this.orchestrator.run();
        }
      } catch (error) {
        console.error(colors.error(`\n${colors.icon('error')} Test run failed:`), error);
      }

      this.isRunning = false;
      console.log(colors.dim('\nWaiting for changes...\n'));
    }, this.options.debounce);

    // Watch events
    this.watcher
      .on('add', filepath => this.handleFileChange('added', filepath, runTests))
      .on('change', filepath => this.handleFileChange('changed', filepath, runTests))
      .on('unlink', filepath => this.handleFileChange('deleted', filepath, runTests));

    // Initial test run
    runTests();

    // Handle exit
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());

    // Keep process alive
    process.stdin.resume();
  }

  handleFileChange(event, filepath, runTests) {
    const relPath = path.relative(process.cwd(), filepath);
    
    // Skip if it's a test result file
    if (relPath.includes('test-results')) return;
    
    console.log(colors.dim(`${event}: ${relPath}`));
    this.runQueue.add(relPath);
    runTests();
  }

  getAffectedPackages(files) {
    const packages = new Set();
    
    for (const file of files) {
      // Check if file belongs to a specific package
      const match = file.match(/packages\/([^\/]+)\//);
      if (match) {
        packages.add(match[1]);
      }
    }
    
    return Array.from(packages);
  }

  stop() {
    console.log(colors.info('\n\nStopping watch mode...'));
    
    if (this.watcher) {
      this.watcher.close();
    }
    
    process.exit(0);
  }
}

module.exports = TestWatcher;
