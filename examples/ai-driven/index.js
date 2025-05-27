/**
 * AI-Driven Example for Cognitive Framework
 *
 * Demonstrates using the AI test framework in API mode to analyze
 * existing test results and generate new tests.
 */

const { createAITestFramework } = require('@cognitive/test-framework');

// Sample test results that might come from a real test run
const testResults = [
  { name: 'adds numbers', package: 'utils', passed: true, duration: 30, coverage: 85 },
  { name: 'subtract numbers', package: 'utils', passed: false, duration: 120, coverage: 45 },
  { name: 'renders component', package: 'ui', passed: true, duration: 1500, coverage: 60 }
];

async function main() {
  console.log('Starting AI-driven example...');

  // Initialize the framework in API mode. The OpenAI client will be mocked
  // if the dependency is not installed.
  const framework = createAITestFramework({
    mode: 'api',
    provider: 'openai',
    model: 'gpt-4',
    apiKey: 'demo-key'
  });

  const result = await framework.process(testResults);
  console.log('AI framework result:', result);
}

main().catch(error => {
  console.error('Error in AI-driven example:', error);
});
