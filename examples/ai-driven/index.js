/**
 * AI-Driven Example for Cognitive Framework
 * 
 * This example demonstrates how to use the Cognitive framework in an AI-driven approach.
 */

const { adapters, testGeneration } = require('@cognitive/ai-core');
const { AIDualMode: DualMode } = adapters;
const { TestFramework } = testGeneration;

// Initialize the Cognitive framework components
const dualMode = new DualMode({
  mode: 'ai',
  modelProvider: 'openai',
  modelConfig: {
    model: 'gpt-4',
    temperature: 0.7
  }
});

const testFramework = new TestFramework({
  dualMode
});

// Example usage
async function main() {
  console.log('Starting AI-driven example...');

  // Generate test cases using AI
  const generatedTests = await dualMode.generateContent({
    prompt: 'Generate unit tests for a user authentication module',
    outputFormat: 'javascript'
  });

  console.log('AI-generated tests:', generatedTests);

  // Run the generated tests
  const testResults = await testFramework.runTests({
    contextType: 'ai',
    testContent: generatedTests
  });

  console.log('Test results:', testResults);
}

// Run the example
main().catch(error => {
  console.error('Error in AI-driven example:', error);
});
