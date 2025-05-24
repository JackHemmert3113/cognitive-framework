/**
 * IDE-Driven Example for Forge Framework
 * 
 * This example demonstrates how to use the Forge framework in an IDE-driven approach.
 */

const { DualMode } = require('@forge/dual-mode');
const { TestFramework } = require('@forge/test-framework');

// Initialize the Forge framework components
const dualMode = new DualMode({
  mode: 'ide',
  contextProvider: 'vscode' // or other IDE
});

const testFramework = new TestFramework({
  dualMode
});

// Example usage
async function main() {
  console.log('Starting IDE-driven example...');
  
  // Get IDE context
  const context = await dualMode.getContext();
  console.log('Current IDE context:', context);
  
  // Use the test framework with IDE context
  const testResults = await testFramework.runTests({
    contextType: 'ide',
    testPattern: '**/*.test.js'
  });
  
  console.log('Test results:', testResults);
}

// Run the example
main().catch(error => {
  console.error('Error in IDE-driven example:', error);
});