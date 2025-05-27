/**
 * rules.ts - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./rules.ts');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
import { Command } from 'commander';
import chalk from 'chalk';
import { loadAgentRules } from '../../helpers/rules-loader';

/**
 * rulesCommand exported API
 * @example
 * rulesCommand();
 */
// Added in v1.0
export const rulesCommand = new Command('rules')
  .description('Display current agent compatibility rules')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    try {
      const rules = await loadAgentRules();

      if (options.json) {
        console.log(JSON.stringify(rules, null, 2));
        return;
      }

      console.log(chalk.blue('\n📋 Forge Framework Agent Rules\n'));
      console.log(chalk.gray(`Version: ${rules.version}`));
      console.log(chalk.gray(`Last Updated: ${rules.lastUpdated}\n`));

      console.log(chalk.yellow('🚫 Forbidden Commands:'));
      rules.rules.typescript.commands.forbidden.forEach(cmd => {
        console.log(chalk.red(`  ❌ ${cmd.pattern}`));
        console.log(chalk.gray(`     Reason: ${cmd.reason}`));
        console.log(chalk.green(`     Fix: ${cmd.fix}\n`));
      });

      console.log(chalk.yellow('✅ Preferred Commands:'));
      rules.rules.typescript.commands.preferred.forEach(pref => {
        console.log(chalk.green(`  ${pref.action}:`));
        pref.commands.forEach(cmd => {
          console.log(chalk.gray(`    • ${cmd}`));
        });
        console.log();
      });

    } catch (error) {
      console.error(chalk.red('Error loading rules:'), error);
      process.exit(1);
    }
  });