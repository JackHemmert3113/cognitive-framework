/**
 * Example: Using AI Dual Mode with a test framework
 */

const { AIDualMode } = require('../index');

// Define the test framework processor
const testProcessor = {
  async analyzeForIDE(testResults) {
    // Analyze test results for IDE context
    const analysis = {
      totalTests: testResults.length,
      passed: testResults.filter(t => t.passed).length,
      failed: testResults.filter(t => !t.passed).length,
      coverage: this.calculateAverageCoverage(testResults)
    };
    
    return {
      context: {
        summary: `${analysis.totalTests} tests run, ${analysis.failed} failures`,
        coverage: analysis.coverage,
        failedTests: testResults.filter(t => !t.passed),
        slowTests: testResults.filter(t => t.duration > 1000)
      },
      analysis: `# Test Results Analysis

## Summary
- Total Tests: ${analysis.totalTests}
- Passed: ${analysis.passed}
- Failed: ${analysis.failed}
- Coverage: ${analysis.coverage}%

## Issues
${analysis.failed > 0 ? '- Failed tests need attention\n' : ''}
${analysis.coverage < 80 ? '- Coverage below 80% threshold\n' : ''}
`,
      prompts: `- "Generate tests for uncovered code"
- "Fix the ${analysis.failed} failing tests"
- "Optimize tests taking >1s"`
    };
  },
  
  async prepareForAPI(testResults) {
    return {
      messages: [
        {
          role: 'system',
          content: 'You are a test automation expert. Analyze test results and suggest improvements.'
        },
        {
          role: 'user',
          content: `Analyze these test results and suggest missing tests:\n${JSON.stringify(testResults, null, 2)}`
        }
      ],
      temperature: 0.3,
      responseFormat: { type: "json_object" }
    };
  },
  
  async processAIResponse(response, originalData) {
    const suggestions = JSON.parse(response);
    return {
      suggestions: suggestions.tests,
      improvements: suggestions.improvements,
      estimatedCoverageGain: suggestions.coverageGain
    };
  },
  
  calculateAverageCoverage(results) {
    const coverages = results.map(r => r.coverage || 0);
    return Math.round(coverages.reduce((a, b) => a + b, 0) / coverages.length);
  }
};

// Example usage
async function runExample() {
  // Sample test results
  const testResults = [
    { name: 'auth.test.js', passed: true, duration: 234, coverage: 85 },
    { name: 'api.test.js', passed: false, duration: 1567, coverage: 45 },
    { name: 'utils.test.js', passed: true, duration: 89, coverage: 92 }
  ];
  
  // Create dual mode instance
  const tester = AIDualMode.create('Test Analyzer', testProcessor, {
    mode: process.env.USE_API ? 'api' : 'ide',
    config: {
      ide: { outputDir: '.ai-test' },
      api: { 
        apiKey: process.env.AI_API_KEY,
        model: 'gpt-3.5-turbo'
      }
    }
  });
  
  try {
    const result = await tester.process(testResults);
    console.log('\n✅ Processing complete!');
    console.log(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  runExample();
}

module.exports = { testProcessor };
