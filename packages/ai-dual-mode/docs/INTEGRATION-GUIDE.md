# AI Dual Mode Integration Guide

This guide shows how to integrate `ai-dual-mode` into your existing projects to add AI-enhanced capabilities with both IDE and API modes.

## Table of Contents

1. [Installation](#installation)
2. [Basic Integration](#basic-integration)
3. [Complete Example: Cognitive Test Framework](#complete-example-cognitive-test-framework)
4. [Integration Patterns](#integration-patterns)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Installation

### Local Development (Recommended for private projects)

```bash
# From your project directory
npm install ../ai-dual-mode

# Or use absolute path
npm install /home/JackHemmert3113/Utilities/ai-dual-mode
```

### From npm (when published)

```bash
npm install ai-dual-mode
```

### As a Git dependency

```json
{
  "dependencies": {
    "ai-dual-mode": "github:JackHemmert3113/ai-dual-mode"
  }
}
```

## Basic Integration

### Step 1: Create Your Processor

The processor defines how your tool analyzes data for both IDE and API modes:

```javascript
const myProcessor = {
  // Required for IDE mode
  async analyzeForIDE(data) {
    // Analyze your data
    const analysis = performAnalysis(data);
    
    return {
      context: {
        // Structured data for AI to understand
        summary: analysis.summary,
        metrics: analysis.metrics,
        issues: analysis.issues
      },
      analysis: `# Analysis Report
      
## Summary
${analysis.summary}

## Key Findings
${analysis.findings}
`,
      prompts: `- "Fix the critical issues in ${analysis.mainFile}"
- "Improve performance based on metrics"
- "Generate tests for uncovered code"`
    };
  },
  
  // Required for API mode (both methods)
  async prepareForAPI(data) {
    return {
      messages: [
        {
          role: "system",
          content: "You are an expert assistant for this tool"
        },
        {
          role: "user",
          content: `Analyze this data and suggest improvements: ${JSON.stringify(data)}`
        }
      ],
      temperature: 0.3,
      maxTokens: 2000
    };
  },
  
  async processAIResponse(aiResponse, originalData) {
    // Process the AI's response
    return {
      suggestions: parseAISuggestions(aiResponse),
      generatedCode: extractCode(aiResponse),
      nextSteps: extractActionItems(aiResponse)
    };
  }
};
```

### Step 2: Create the Dual Mode Instance

```javascript
const { AIDualMode } = require('ai-dual-mode');

const myTool = AIDualMode.create('My Tool Name', myProcessor, {
  // Optional configuration
  config: {
    ide: {
      outputDir: '.ai-mytool'  // Custom output directory
    },
    api: {
      model: 'gpt-4',
      provider: 'openai'
    }
  }
});
```

### Step 3: Use in Your Application

```javascript
async function runMyTool(data) {
  try {
    const result = await myTool.process(data);
    
    if (result.mode === 'ide') {
      console.log(result.instructions);
      // Files have been generated for IDE
    } else if (result.mode === 'api') {
      console.log('AI Suggestions:', result.result);
      // Use the AI-generated content
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Complete Example: Cognitive Test Framework

Here's how to integrate `ai-dual-mode` into the `@cognitive/test-framework` project:

### 1. Update package.json

```json
{
  "name": "@cognitive/test-framework",
  "version": "2.0.0",
  "description": "Monorepo test framework with AI assistance",
  "dependencies": {
    "ai-dual-mode": "file:../ai-dual-mode",
    "jest": "^29.0.0",
    "glob": "^8.0.0"
  }
}
```

### 2. Create AI Integration Module

```javascript
// packages/test-framework/lib/ai-integration.js
const { AIDualMode } = require('ai-dual-mode');
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
        criticalIssues: analysis.criticalIssues
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
      responseFormat: { type: "json_object" }
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
    const packages = this.groupByPackage(results);
    const failedTests = results.filter(r => !r.passed);
    const slowTests = results.filter(r => r.duration > 1000);
    const lowCoverageFiles = results.filter(r => (r.coverage || 0) < 50);
    
    return {
      summary: {
        totalTests: results.length,
        passed: results.filter(r => r.passed).length,
        failed: failedTests.length,
        averageDuration: this.calculateAverage(results.map(r => r.duration)),
        averageCoverage: this.calculateAverage(results.map(r => r.coverage || 0))
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
    return results.reduce((acc, test) => {
      const pkg = test.package || 'unknown';
      if (!acc[pkg]) {
        acc[pkg] = { tests: 0, passed: 0, failed: 0, coverage: [] };
      }
      acc[pkg].tests++;
      if (test.passed) acc[pkg].passed++;
      else acc[pkg].failed++;
      if (test.coverage) acc[pkg].coverage.push(test.coverage);
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
    const failureRate = results.filter(r => !r.passed).length / results.length;
    
    if (failureRate > 0.2) {
      issues.push(`High failure rate: ${(failureRate * 100).toFixed(1)}% of tests failing`);
    }
    
    const avgCoverage = this.calculateAverage(results.map(r => r.coverage || 0));
    if (avgCoverage < 60) {
      issues.push(`Low overall coverage: ${avgCoverage.toFixed(1)}%`);
    }
    
    return issues;
  }
  
  calculateCoverageStats(results) {
    const coverages = results.map(r => r.coverage || 0);
    return {
      average: this.calculateAverage(coverages),
      min: Math.min(...coverages),
      max: Math.max(...coverages),
      below80: coverages.filter(c => c < 80).length
    };
  }
}

/**
 * Factory function to create AI-enhanced test framework
 */
function createAITestFramework(config = {}) {
  const processor = new TestFrameworkProcessor();
  
  return AIDualMode.create('AI Test Framework', processor, {
    mode: config.mode || 'auto',
    config: {
      ide: {
        outputDir: config.outputDir || '.ai-test',
        includeIDESpecific: true
      },
      api: {
        apiKey: config.apiKey || process.env.AI_API_KEY,
        model: config.model || 'gpt-4',
        provider: config.provider || 'openai'
      },
      ci: {
        outputFormat: 'json',
        saveToFile: true,
        outputFile: 'test-analysis.json'
      }
    }
  });
}

module.exports = {
  TestFrameworkProcessor,
  createAITestFramework
};
```

### 3. Update Main Test Runner

```javascript
// packages/test-framework/index.js
#!/usr/bin/env node

const { runTests } = require('./lib/runner');
const { createAITestFramework } = require('./lib/ai-integration');
const { program } = require('commander');

program
  .name('ai-test')
  .description('AI-enhanced monorepo test framework')
  .version('2.0.0')
  .option('-p, --pattern <pattern>', 'test file pattern', '**/*.test.js')
  .option('-w, --watch', 'watch mode')
  .option('--coverage', 'collect coverage')
  .option('--ai', 'enable AI analysis')
  .option('--ai-mode <mode>', 'AI mode: ide, api, or auto', 'auto')
  .option('--ai-output <dir>', 'AI output directory', '.ai-test')
  .parse();

async function main() {
  const options = program.opts();
  
  // Run tests first
  console.log('🧪 Running tests...\n');
  const testResults = await runTests({
    pattern: options.pattern,
    watch: options.watch,
    coverage: options.coverage
  });
  
  // If AI is enabled, analyze results
  if (options.ai) {
    console.log('\n🤖 Running AI analysis...\n');
    
    const aiFramework = createAITestFramework({
      mode: options.aiMode,
      outputDir: options.aiOutput
    });
    
    try {
      const aiResult = await aiFramework.process(testResults);
      
      if (aiResult.mode === 'ide') {
        console.log(aiResult.instructions);
      } else if (aiResult.mode === 'api') {
        console.log('✅ AI Analysis Complete!');
        console.log('\nGenerated Tests:', aiResult.result.generatedTests.length);
        console.log('Suggested Fixes:', aiResult.result.fixedTests.length);
        console.log('Improvements:', aiResult.result.improvements.length);
        
        // Optionally save generated tests
        if (aiResult.result.generatedTests.length > 0) {
          await saveGeneratedTests(aiResult.result.generatedTests);
        }
      }
    } catch (error) {
      console.error('❌ AI Analysis failed:', error.message);
    }
  }
  
  // Exit with appropriate code
  const hasFailures = testResults.some(r => !r.passed);
  process.exit(hasFailures ? 1 : 0);
}

async function saveGeneratedTests(tests) {
  const fs = require('fs').promises;
  const path = require('path');
  
  for (const test of tests) {
    const filePath = path.join('generated-tests', test.filename);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, test.content);
    console.log(`📝 Generated: ${filePath}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
```

### 4. Usage Examples

```bash
# Run tests with IDE mode AI analysis
npm test -- --ai

# Run tests with API mode (generates new tests)
AI_API_KEY=your-key npm test -- --ai --ai-mode api

# Run in CI with AI analysis
CI=true npm test -- --ai

# Custom output directory
npm test -- --ai --ai-output .test-analysis
```

## Integration Patterns

### Pattern 1: CLI Tool Enhancement

```javascript
// Add AI capabilities to existing CLI tool
const { AIDualMode } = require('ai-dual-mode');
const existingCLI = require('./cli');

const processor = {
  async analyzeForIDE(cliOutput) {
    return {
      context: { output: cliOutput, timestamp: new Date() },
      analysis: `# CLI Analysis\n\n${formatOutput(cliOutput)}`,
      prompts: "Suggest improvements for this CLI output"
    };
  }
};

existingCLI.addCommand('analyze')
  .description('Analyze with AI')
  .action(async (options) => {
    const output = await existingCLI.run(options);
    const ai = AIDualMode.create('CLI Analyzer', processor);
    await ai.process(output);
  });
```

### Pattern 2: Library Enhancement

```javascript
// Enhance existing library with AI
class MyLibrary {
  constructor(options = {}) {
    this.config = options;
    
    // Add AI capabilities
    if (options.enableAI) {
      this.ai = AIDualMode.create('MyLibrary AI', {
        async analyzeForIDE(data) {
          return this.generateAnalysis(data);
        }
      });
    }
  }
  
  async process(data) {
    const result = await this.doProcessing(data);
    
    // Optionally run AI analysis
    if (this.ai) {
      await this.ai.process(result);
    }
    
    return result;
  }
}
```

### Pattern 3: Plugin Architecture

```javascript
// Create AI plugin for existing system
class AIPlugin {
  constructor(dualModeConfig) {
    this.ai = AIDualMode.create('Plugin AI', this.createProcessor());
  }
  
  createProcessor() {
    return {
      async analyzeForIDE(data) {
        // Plugin-specific analysis
      },
      async prepareForAPI(data) {
        // Plugin-specific API prep
      },
      async processAIResponse(response) {
        // Plugin-specific response handling
      }
    };
  }
  
  async onDataReceived(data) {
    return this.ai.process(data);
  }
}

// Register plugin
app.registerPlugin(new AIPlugin());
```

## Best Practices

### 1. Environment Configuration

```javascript
// Use environment variables for flexibility
const config = {
  mode: process.env.AI_MODE || 'auto',
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL || 'gpt-4',
  outputDir: process.env.AI_OUTPUT_DIR || '.ai'
};
```

### 2. Error Handling

```javascript
try {
  const result = await aiTool.process(data);
  // Handle success
} catch (error) {
  if (error.message.includes('API key')) {
    console.log('💡 No API key found. Generated context files for IDE instead.');
  } else {
    console.error('Error:', error.message);
  }
}
```

### 3. Progressive Enhancement

```javascript
// Make AI optional - tool works without it
class MyTool {
  async run(data) {
    const result = await this.process(data);
    
    // Try AI enhancement if available
    if (this.ai && !process.env.DISABLE_AI) {
      try {
        await this.ai.process(result);
      } catch (error) {
        // AI failed, but tool continues
        console.warn('AI enhancement skipped:', error.message);
      }
    }
    
    return result;
  }
}
```

### 4. Custom Output Directories

```javascript
// Use tool-specific directories to avoid conflicts
const ai = AIDualMode.create('My Tool', processor, {
  config: {
    ide: {
      outputDir: `.ai-${toolName.toLowerCase().replace(/\s+/g, '-')}`
    }
  }
});
```

## Troubleshooting

### Common Issues

**1. Module not found**
```bash
# Ensure path is correct
npm install ../ai-dual-mode

# Or use absolute path
npm install /full/path/to/ai-dual-mode
```

**2. API key not working**
```bash
# Check environment variable
echo $AI_API_KEY

# Or set in code
const ai = AIDualMode.create('Tool', processor, {
  config: {
    api: { apiKey: 'your-key-here' }
  }
});
```

**3. IDE files not generated**
```javascript
// Check mode detection
console.log('Current mode:', ai.mode);

// Force IDE mode
const ai = AIDualMode.create('Tool', processor, {
  mode: 'ide'
});
```

**4. Processor errors**
```javascript
// Validate processor has required methods
const processor = {
  async analyzeForIDE(data) {
    // Required for IDE mode
    return {
      context: {},      // Required
      analysis: "",     // Required
      prompts: ""       // Optional
    };
  }
};
```

### Debug Mode

```javascript
// Enable debug logging
process.env.DEBUG = 'ai-dual-mode:*';

// Or in code
const ai = AIDualMode.create('Tool', processor, {
  debug: true
});
```

## Advanced Integration

### Custom Providers

```javascript
// Coming soon: Custom AI provider
const ai = AIDualMode.create('Tool', processor, {
  config: {
    api: {
      provider: 'custom',
      endpoint: 'https://my-ai-api.com',
      handler: async (messages) => {
        // Custom API logic
      }
    }
  }
});
```

### Streaming Responses

```javascript
// Coming soon: Streaming support
const ai = AIDualMode.create('Tool', processor, {
  config: {
    api: {
      stream: true,
      onChunk: (chunk) => {
        process.stdout.write(chunk);
      }
    }
  }
});
```

## Support

- 📧 Email: JackHemmert3113@github.com
- 🐛 Issues: [GitHub Issues](https://github.com/JackHemmert3113/ai-dual-mode/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/JackHemmert3113/ai-dual-mode/discussions)

---

Created by JackHemmert3113 | Last updated: 2025-05-24