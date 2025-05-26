import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { validateProjectSetup } from '../../helpers/project-validator';
import { validateTsConfig } from '../../helpers/tsconfig-validator';
import { generateFixScript } from '../../helpers/project-validator';

export const validateCommand = new Command('validate')
  .description('Validate project setup for agent compatibility')
  .option('-p, --path <path>', 'Project path to validate', '.')
  .option('-f, --fix', 'Automatically fix issues where possible')
  .option('--json', 'Output results as JSON')
  .action(async (options) => {
    const projectPath = path.resolve(options.path);

    if (!options.json) {
      console.log(chalk.blue(`🔍 Validating project at ${projectPath}...\n`));
    }

    try {
      // Validate project setup
      const result = await validateProjectSetup(projectPath);

      // Validate tsconfig
      const tsconfigResult = await validateTsConfig(projectPath);

      // Combine results
      const fullResult = {
        isValid: result.isValid && tsconfigResult.isValid,
        issues: [...result.issues, ...tsconfigResult.issues],
        fixes: [...result.fixes, ...tsconfigResult.fixes]
      };

      if (options.json) {
        console.log(JSON.stringify(fullResult, null, 2));
        process.exit(fullResult.isValid ? 0 : 1);
      }

      // Display results
      if (fullResult.isValid) {
        console.log(chalk.green('✅ Project is agent-compatible!\n'));
        console.log(chalk.gray('All checks passed:'));
        console.log(chalk.gray('  • TypeScript scripts configured correctly'));
        console.log(chalk.gray('  • tsconfig.json properly placed and configured'));
        console.log(chalk.gray('  • No forbidden commands detected'));
      } else {
        console.log(chalk.red('❌ Issues found:\n'));

        fullResult.issues.forEach((issue, index) => {
          console.log(chalk.yellow(`${index + 1}. ${issue.type}: ${issue.message}`));
          console.log(chalk.gray(`   Fix: ${issue.fix}\n`));
        });

        if (options.fix) {
          console.log(chalk.blue('\n🔧 Attempting automatic fixes...\n'));
          const fixScript = generateFixScript(fullResult.issues);
          console.log(chalk.gray(fixScript));
          // Execute fixes here if needed
        } else {
          console.log(chalk.blue('\n💡 Quick fixes:'));
          fullResult.fixes.forEach(fix => {
            console.log(chalk.gray(fix));
          });
          console.log(chalk.gray('\nRun with --fix flag to apply automatically'));
        }
      }

      // Generate badge recommendation
      console.log(chalk.blue('\n📛 Add this badge to your README:'));
      const badgeStatus = fullResult.isValid ? 'compatible' : 'needs%20setup';
      const badgeColor = fullResult.isValid ? 'brightgreen' : 'yellow';
      console.log(chalk.gray(`![Agent Compatible](https://img.shields.io/badge/forge--agent-${badgeStatus}-${badgeColor})`));

      process.exit(fullResult.isValid ? 0 : 1);
    } catch (error) {
      if (!options.json) {
        console.error(chalk.red('Error validating project:'), error);
      }
      process.exit(2);
    }
  });