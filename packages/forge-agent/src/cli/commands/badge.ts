/**
 * badge.ts - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./badge.ts');
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
 * badgeCommand exported API
 * @example
 * badgeCommand();
 */
// Added in v1.0
export const badgeCommand = new Command('badge')
  .description('Generate README badge for agent compatibility')
  .option('-s, --status <status>', 'Badge status (compatible|needsSetup|incompatible)', 'compatible')
  .action(async (options) => {
    try {
      const rules = await loadAgentRules();
      const badge = rules.badges[options.status as keyof typeof rules.badges];

      if (!badge) {
        console.error(chalk.red(`Invalid status: ${options.status}`));
        console.log(chalk.gray('Valid options: compatible, needsSetup, incompatible'));
        process.exit(1);
      }

      console.log(chalk.blue('\n📛 Add this to your README:\n'));
      console.log(badge.markdown);
      console.log(chalk.gray(`\nBadge URL: ${badge.url}`));

    } catch (error) {
      console.error(chalk.red('Error generating badge:'), error);
      process.exit(1);
    }
  });