/**
 * Cognitive Framework
 *
 * MIT License
 */
/**
 * test-framework-processor.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./test-framework-processor.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
const path = require('path');

/**
 * Test Framework Processor for AI Dual Mode
 */
class TestFrameworkProcessor {
  async analyzeForIDE(testResults) {
    const analysis = this.analyzeTestResults(testResults);

    return {
      context: {
        summary: analysis.summary,
        totalPackages: analysis.packages.length,
        failedPackages: analysis.failedPackages,
        coverage: analysis.coverageStats,
        slowTests: analysis.slowTests,
        criticalIssues: analysis.criticalIssues,
        filePaths: testResults.files || [],
        runnerResults: testResults.results || testResults.runnerResults || {}
      },

      analysis: this.generateMarkdownReport(analysis),

      prompts: this.generateTestPrompts(analysis),

      patterns: `- Follow existing test patterns
- Use Jest for all tests
- Maintain >80% coverage
- Keep tests under 1s`,

      priorities: `1. Fix ${analysis.failedTests.length} failing tests
2. Improve coverage for ${analysis.lowCoverageFiles.length} files
3. Optimize ${analysis.slowTests.length} slow tests`
    };
  }

  async prepareForAPI(testResults) {
    const analysis = this.analyzeTestResults(testResults);

    return {
      messages: [
        {
          role: "system",
          content: `You are a test automation expert. You help improve test suites by:
- Generating missing tests
- Fixing failing tests
- Improving test performance
- Ensuring comprehensive coverage

Follow Jest best practices and maintain consistency with existing test patterns.`
        },
        {
          role: "user",
          content: `Analyze these test results and generate missing tests:

Test Summary:
${JSON.stringify(analysis.summary, null, 2)}

Failed Tests:
${JSON.stringify(analysis.failedTests, null, 2)}

Low Coverage Files:
${JSON.stringify(analysis.lowCoverageFiles, null, 2)}

Generate Jest tests for the files with lowest coverage.`
        }
      ],
      temperature: 0.3,
      maxTokens: 3000,
      responseFormat: { type: "json_object" },
      filePaths: testResults.files || [],
      runnerResults: testResults.results || testResults.runnerResults || {}
    };
  }

  async processAIResponse(aiResponse, testResults) {
    try {
      const suggestions = JSON.parse(aiResponse);

      return {
        generatedTests: suggestions.tests || [],
        fixedTests: suggestions.fixes || [],
        improvements: suggestions.improvements || [],
        estimatedCoverageIncrease: suggestions.coverageIncrease || 0,
        implementationPlan: suggestions.plan || []
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        error: 'Failed to parse AI response',
        rawResponse: aiResponse
      };
    }
  }

  // Helper methods
  analyzeTestResults(results) {
    console.log('analyzeTestResults input type:', typeof results);

    // Ensure results is an array
    if (!results) {
      console.warn('analyzeTestResults received undefined input');
      results = [];
    } else if (!Array.isArray(results)) {
      console.warn('analyzeTestResults received non-array input:', typeof results);
      // Try to extract results array from common result objects
      if (results.results && Array.isArray(results.results)) {
        console.log('Extracting results array from results.results');
        results = results.results;
      } else if (results.tests && Array.isArray(results.tests)) {
        console.log('Extracting results array from results.tests');
        results = results.tests;
      } else if (results.runnerResults && Array.isArray(results.runnerResults)) {
        console.log('Extracting results array from results.runnerResults');
        results = results.runnerResults;
      } else {
        console.warn('Could not extract results array, using empty array');
        results = [];
      }
    }

    const packages = this.groupByPackage(results);
    const failedTests = results.filter(r => r && !r.passed);
    const slowTests = results.filter(r => r && r.duration > 1000);
    const lowCoverageFiles = results.filter(r => r && (r.coverage || 0) < 50);

    return {
      summary: {
        totalTests: results.length,
        passed: results.filter(r => r && r.passed).length,
        failed: failedTests.length,
        averageDuration: this.calculateAverage(results.map(r => r && r.duration || 0)),
        averageCoverage: this.calculateAverage(results.map(r => r && r.coverage || 0))
      },
      packages,
      failedTests,
      slowTests,
      lowCoverageFiles,
      failedPackages: this.getFailedPackages(packages),
      criticalIssues: this.identifyCriticalIssues(results),
      coverageStats: this.calculateCoverageStats(results)
    };
  }

  generateMarkdownReport(analysis) {
    return `# Test Framework Analysis Report
Generated: ${new Date().toISOString()}

## 📊 Overall Summary
- **Total Tests**: ${analysis.summary.totalTests}
- **Pass Rate**: ${((analysis.summary.passed / analysis.summary.totalTests) * 100).toFixed(1)}%
- **Average Coverage**: ${analysis.summary.averageCoverage.toFixed(1)}%
- **Average Duration**: ${analysis.summary.averageDuration.toFixed(0)}ms

## 🚨 Critical Issues
${analysis.criticalIssues.map(issue => `- ${issue}`).join('\n') || '- No critical issues found'}

## 📦 Package Breakdown
${Object.entries(analysis.packages).map(([pkg, data]) => `
### ${pkg}
- Tests: ${data.tests} (${data.failed} failed)
- Coverage: ${data.coverage}%
- Status: ${data.failed > 0 ? '❌ FAILING' : '✅ PASSING'}
`).join('\n')}

## 🐌 Slow Tests (>1s)
${analysis.slowTests.map(t => `- ${t.name}: ${t.duration}ms`).join('\n') || '- No slow tests'}

## 📉 Low Coverage Files (<50%)
${analysis.lowCoverageFiles.map(f => `- ${f.name}: ${f.coverage}%`).join('\n') || '- All files have adequate coverage'}

## 💡 Recommendations
1. ${analysis.failedTests.length > 0 ? `Fix ${analysis.failedTests.length} failing tests` : 'All tests passing ✅'}
2. ${analysis.lowCoverageFiles.length > 0 ? `Improve coverage for ${analysis.lowCoverageFiles.length} files` : 'Coverage is good ✅'}
3. ${analysis.slowTests.length > 0 ? `Optimize ${analysis.slowTests.length} slow tests` : 'Performance is good ✅'}
`;
  }

  generateTestPrompts(analysis) {
    const prompts = [`# Test-Specific AI Prompts

## Quick Fixes
`];

    if (analysis.failedTests.length > 0) {
      prompts.push(`### Fix Failing Tests
\`\`\`
Review the failing tests in context.json and provide fixes:
${analysis.failedTests.slice(0, 3).map(t => `- ${t.name}`).join('\n')}
\`\`\``);
    }

    if (analysis.lowCoverageFiles.length > 0) {
      prompts.push(`### Generate Missing Tests
\`\`\`
Generate Jest tests for these low-coverage files:
${analysis.lowCoverageFiles.slice(0, 3).map(f => `- ${f.name} (${f.coverage}% coverage)`).join('\n')}
\`\`\``);
    }

    if (analysis.slowTests.length > 0) {
      prompts.push(`### Optimize Slow Tests
\`\`\`
Suggest optimizations for these slow tests:
${analysis.slowTests.slice(0, 3).map(t => `- ${t.name} (${t.duration}ms)`).join('\n')}
\`\`\``);
    }

    prompts.push(`
## Advanced Prompts

- "Generate integration tests for the API endpoints"
- "Add error handling tests for edge cases"
- "Create snapshot tests for React components"
- "Generate mock implementations for external services"
`);

    return prompts.join('\n\n');
  }

  // Utility methods
  groupByPackage(results) {
    console.log('groupByPackage input type:', typeof results, Array.isArray(results) ? 'is array' : 'not an array');
    console.log('groupByPackage input value:', JSON.stringify(results, null, 2));

    // Ensure results is an array
    if (!results || !Array.isArray(results)) {
      console.warn('groupByPackage received non-array input:', results);
      return {}; // Return empty object as fallback
    }

    return results.reduce((acc, test) => {
      const pkg = test && test.packageName || 'unknown';
      if (!acc[pkg]) {
        acc[pkg] = { tests: 0, passed: 0, failed: 0, coverage: [] };
      }
      acc[pkg].tests++;
      if (test && test.passed) acc[pkg].passed++;
      else acc[pkg].failed++;
      if (test && test.coverage) acc[pkg].coverage.push(test.coverage);
      return acc;
    }, {});
  }

  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  getFailedPackages(packages) {
    return Object.entries(packages)
      .filter(([_, data]) => data.failed > 0)
      .map(([name]) => name);
  }

  identifyCriticalIssues(results) {
    const issues = [];

    // Ensure results is an array
    if (!Array.isArray(results) || results.length === 0) {
      issues.push('No test results available for analysis');
      return issues;
    }

    const failureRate = results.filter(r => r && !r.passed).length / results.length;

    if (failureRate > 0.2) {
      issues.push(`High failure rate: ${(failureRate * 100).toFixed(1)}% of tests failing`);
    }

    const avgCoverage = this.calculateAverage(results.map(r => r && r.coverage || 0));
    if (avgCoverage < 60) {
      issues.push(`Low overall coverage: ${avgCoverage.toFixed(1)}%`);
    }

    return issues;
  }

  calculateCoverageStats(results) {
    // Ensure results is an array
    if (!Array.isArray(results) || results.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        below80: 0
      };
    }

    const coverages = results.map(r => r && r.coverage || 0);
    return {
      average: this.calculateAverage(coverages),
      min: coverages.length > 0 ? Math.min(...coverages) : 0,
      max: coverages.length > 0 ? Math.max(...coverages) : 0,
      below80: coverages.filter(c => c < 80).length
    };
  }
}

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = {
  TestFrameworkProcessor
};
