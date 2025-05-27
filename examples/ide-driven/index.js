/**
 * IDE-Driven Example for Cognitive Framework
 *
 * Shows how to generate IDE context files using the AI test framework.
 */

const { createAITestFramework } = require('@cognitive/test-framework');

// Minimal test result data for demonstration
const testResults = [
  { name: 'adds numbers', package: 'utils', passed: true, duration: 30, coverage: 85 }
];

async function main() {
  console.log('Starting IDE-driven example...');

  // Initialize the framework in IDE mode. Context files will be written
  // to the configured output directory.
  const framework = createAITestFramework({
    mode: 'ide',
    outputDir: '.ai-test'
  });

  const result = await framework.process(testResults);
  console.log('Context generated at', framework.config.ide.outputDir);
  console.log('Result summary:', result);
}

main().catch(error => {
  console.error('Error in IDE-driven example:', error);
});
