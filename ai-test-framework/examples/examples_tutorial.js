#!/usr/bin/env node

const readline = require('readline');
const { exec } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * Interactive Tutorial for AI Test Framework
 */
class AITestTutorial {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.steps = [
      {
        title: 'Welcome to AI Test Framework',
        content: `
This interactive tutorial will guide you through the AI Test Framework.

You'll learn how to:
- Set up the framework
- Run tests with AI insights
- Use watch mode
- Interpret results

Press ENTER to continue...`,
        action: null
      },
      {
        title: 'Choose an Example Project',
        content: `
Which example would you like to explore?

1. Simple Project - Basic Node.js with unit tests
2. Monorepo - Multiple packages with shared code  
3. React App - Component and hook testing

Enter your choice (1-3): `,
        action: 'chooseProject'
      },
      {
        title: 'Running Basic Tests',
        content: `
Let's run the AI test suite for your chosen project.

The framework will:
- Discover all test files
- Run tests with progress bars
- Generate coverage reports
- Provide AI insights

Ready to run? (y/n): `,
        action: 'runBasicTest'
      },
      {
        title: 'Understanding the Output',
        content: `
Look at the console output. You should see:

🎨 Colorized results with status icons
📊 Progress bars showing test execution
📈 Coverage percentages for each file
🤖 AI insights at the end

The report is saved in test-results/ai-test-report.md

Press ENTER to view the report...`,
        action: 'viewReport'
      },
      {
        title: 'Watch Mode',
        content: `
Watch mode automatically re-runs tests when files change.

This is perfect for Test-Driven Development (TDD).

Would you like to try watch mode? (y/n): `,
        action: 'tryWatchMode'
      },
      {
        title: 'Customizing Configuration',
        content: `
Each project has an ai-test.config.js file.

You can customize:
- Coverage thresholds
- AI insights
- Watch patterns
- Test environments

Would you like to see the config file? (y/n): `,
        action: 'showConfig'
      },
      {
        title: 'Next Steps',
        content: `
🎉 Congratulations! You've completed the tutorial.

Next steps:
1. Try the framework on your own project
2. Customize the configuration
3. Integrate with your CI/CD pipeline
4. Share feedback and contribute

Thank you for trying AI Test Framework!

Press ENTER to exit...`,
        action: null
      }
    ];
    
    this.currentStep = 0;
    this.selectedProject = null;
  }

  async start() {
    console.clear();
    console.log(chalk.blue.bold('🤖 AI Test Framework - Interactive Tutorial'));
    console.log(chalk.dim('='.repeat(50)));
    console.log();

    await this.runStep();
  }

  async runStep() {
    const step = this.steps[this.currentStep];
    
    console.log(chalk.yellow.bold(`\n${step.title}`));
    console.log(chalk.white(step.content));
    
    if (step.action) {
      await this[step.action]();
    } else {
      await this.waitForEnter();
      this.nextStep();
    }
  }

  async chooseProject() {
    const answer = await this.ask('');
    const projects = ['simple-project', 'monorepo-project', 'react-app'];
    
    if (answer >= 1 && answer <= 3) {
      this.selectedProject = projects[answer - 1];
      console.log(chalk.green(`\n✅ Selected: ${this.selectedProject}`));
      this.nextStep();
    } else {
      console.log(chalk.red('Please enter 1, 2, or 3'));
      await this.chooseProject();
    }
  }

  async runBasicTest() {
    const answer = await this.ask('');
    
    if (answer.toLowerCase() === 'y') {
      console.log(chalk.blue('\n🏃 Running tests...\n'));
      
      await this.executeCommand(
        `cd examples/${this.selectedProject} && npm run test:ai`
      );
      
      this.nextStep();
    } else {
      this.nextStep();
    }
  }

  async viewReport() {
    await this.waitForEnter();
    
    const reportPath = path.join(
      'examples',
      this.selectedProject,
      'test-results',
      'ai-test-report.md'
    );
    
    if (fs.existsSync(reportPath)) {
      const report = fs.readFileSync(reportPath, 'utf8');
      console.log(chalk.gray('\n--- REPORT START ---'));
      console.log(report.substring(0, 500) + '...\n[truncated]');
      console.log(chalk.gray('--- REPORT END ---\n'));
    }
    
    this.nextStep();
  }

  async tryWatchMode() {
    const answer = await this.ask('');
    
    if (answer.toLowerCase() === 'y') {
      console.log(chalk.blue('\n👁️  Starting watch mode...'));
      console.log(chalk.dim('(Press Ctrl+C to stop)\n'));
      
      // Simulate watch mode
      console.log('Watching for file changes...');
      console.log('Edit a file in the project to see tests re-run automatically!');
      console.log('\nPress ENTER to continue...');
      
      await this.waitForEnter();
    }
    
    this.nextStep();
  }

  async showConfig() {
    const answer = await this.ask('');
    
    if (answer.toLowerCase() === 'y') {
      const configPath = path.join(
        'examples',
        this.selectedProject,
        'ai-test.config.js'
      );
      
      if (fs.existsSync(configPath)) {
        const config = fs.readFileSync(configPath, 'utf8');
        console.log(chalk.gray('\n--- CONFIG START ---'));
        console.log(config);
        console.log(chalk.gray('--- CONFIG END ---\n'));
      }
    }
    
    this.nextStep();
  }

  async waitForEnter() {
    return new Promise(resolve => {
      this.rl.question('', resolve);
    });
  }

  async ask(question) {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`Error: ${error.message}`));
          reject(error);
        } else {
          console.log(stdout);
          if (stderr) console.error(chalk.yellow(stderr));
          resolve();
        }
      });
    });
  }

  nextStep() {
    this.currentStep++;
    
    if (this.currentStep < this.steps.length) {
      this.runStep();
    } else {
      this.complete();
    }
  }

  complete() {
    console.log(chalk.green.bold('\n✅ Tutorial Complete!\n'));
    this.rl.close();
    process.exit(0);
  }
}

// Run the tutorial
if (require.main === module) {
  new AITestTutorial().start().catch(console.error);
}

module.exports = AITestTutorial;