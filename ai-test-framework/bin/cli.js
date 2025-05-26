#!/usr/bin/env node

/**
 * AI Test Framework CLI
 */

const { Command } = require('commander');
const AITestFramework = require('../index');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('ai-test-framework')
  .description('AI-powered test framework that supports everything, forces nothing')
  .version(packageJson.version);

// Main analyze command
program
  .command('analyze')
  .description('Analyze project and identify testing needs')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('--self-aware', 'Run self-aware analysis')
  .option('--requirements', 'Analyze requirements only')
  .action(async (options) => {
    const framework = new AITestFramework();

    if (options.selfAware) {
      const results = await framework.run('self-aware', options);
      console.log(results);
    } else if (options.requirements) {
      const results = await framework.run('requirements', options);
      console.log(results);
    } else {
      const results = await framework.run('analyze', options);
      console.log(results);
    }
  });

// Generate tests command
program
  .command('generate')
  .description('Generate tests based on analysis')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('--mode <mode>', 'Generation mode (ide/api)', 'ide')
  .option('--force', 'Generate even if tests exist')
  .option('--dry-run', 'Show what would be generated')
  .action(async (options) => {
    const framework = new AITestFramework({ mode: options.mode });
    const results = await framework.run('generate', options);

    if (options.dryRun) {
      console.log('🔍 Dry run - would generate:');
      console.log(results);
    } else {
      console.log('✅ Tests generated:', results.generated.length);
      console.log('⚠️  Skipped:', results.skipped.length);
    }
  });

// No excuses mode
program
  .command('no-excuses')
  .description('Find ALL code without tests - no excuses!')
  .action(async () => {
    const framework = new AITestFramework();
    const results = await framework.run('self-aware', {
      path: process.cwd(),
      noExcuses: true
    });

    console.log('\n🚨 NO EXCUSES MODE ACTIVATED! 🚨\n');
    console.log(results.summary);
    console.log('\nCheck no-excuses-test-list.md for what to do next');
  });

// Report command
program
  .command('report')
  .description('Generate comprehensive testing report')
  .option('-f, --format <format>', 'Output format (md/html/json)', 'md')
  .action(async (options) => {
    const framework = new AITestFramework();
    const results = await framework.run('report', options);
    console.log('📊 Report generated:', results.outputFile);
  });

program.parse();