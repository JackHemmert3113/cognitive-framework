const fs = require('fs').promises;
const path = require('path');

class SelfAwareAnalyzer {
  constructor(config) {
    this.config = config;
    this.supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.java'];
    this.testPatterns = [
      /\.test\./,
      /\.spec\./,
      /_test\./,
      /test_/,
      /tests?\//
    ];
  }

  async analyzeEverything(projectPath) {
    console.log('🧠 Self-Aware Analysis: Finding ALL code...\n');

    const analysis = {
      files: [],
      statistics: {
        total: 0,
        tested: 0,
        untested: 0,
        testable: 0,
        excluded: 0
      },
      untested: [],
      noExcuses: []
    };

    // Recursively find all files
    await this.scanDirectory(projectPath, analysis);

    // Generate detailed report
    analysis.report = this.generateReport(analysis);

    // Generate actionable list
    if (this.config.noExcuses) {
      await this.generateNoExcusesList(analysis);
    }

    return analysis;
  }

  async scanDirectory(dir, analysis) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!this.shouldSkipDirectory(entry.name)) {
          await this.scanDirectory(fullPath, analysis);
        }
      } else if (entry.isFile()) {
        await this.analyzeFile(fullPath, analysis);
      }
    }
  }

  async analyzeFile(filePath, analysis) {
    const ext = path.extname(filePath);

    if (!this.supportedExtensions.includes(ext)) {
      return;
    }

    const fileInfo = {
      path: filePath,
      name: path.basename(filePath),
      type: this.getFileType(filePath),
      hasTests: false,
      testFiles: [],
      complexity: await this.calculateComplexity(filePath),
      testable: true
    };

    // Check if this is a test file
    if (this.isTestFile(filePath)) {
      analysis.statistics.excluded++;
      return;
    }

    // Check if tests exist
    fileInfo.hasTests = await this.hasTests(filePath);

    if (fileInfo.hasTests) {
      analysis.statistics.tested++;
    } else {
      analysis.statistics.untested++;
      analysis.untested.push(fileInfo);

      if (this.config.noExcuses && fileInfo.testable) {
        analysis.noExcuses.push(fileInfo);
      }
    }

    analysis.statistics.total++;
    analysis.files.push(fileInfo);
  }

  isTestFile(filePath) {
    return this.testPatterns.some(pattern => pattern.test(filePath));
  }

  async hasTests(filePath) {
    // Look for corresponding test files
    const testVariations = [
      filePath.replace(/\.(js|ts|jsx|tsx)$/, '.test.$1'),
      filePath.replace(/\.(js|ts|jsx|tsx)$/, '.spec.$1'),
      path.join(path.dirname(filePath), '__tests__', path.basename(filePath))
    ];

    for (const testPath of testVariations) {
      try {
        await fs.access(testPath);
        return true;
      } catch {}
    }

    return false;
  }

  shouldSkipDirectory(name) {
    const skipDirs = ['node_modules', '.git', 'dist', 'build', 'coverage', '.next'];
    return skipDirs.includes(name);
  }

  getFileType(filePath) {
    if (filePath.includes('component')) return 'component';
    if (filePath.includes('service')) return 'service';
    if (filePath.includes('util')) return 'utility';
    if (filePath.includes('hook')) return 'hook';
    if (filePath.includes('api')) return 'api';
    return 'general';
  }

  async calculateComplexity(filePath) {
    // Simple complexity calculation based on file size and content
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n').length;
    const functions = (content.match(/function|=>/g) || []).length;

    return {
      lines,
      functions,
      score: Math.round((lines + functions * 10) / 100)
    };
  }

  generateReport(analysis) {
    const coverage = (analysis.statistics.tested / analysis.statistics.total * 100).toFixed(1);

    return `
🧠 SELF-AWARE ANALYSIS COMPLETE
==============================

📊 Statistics:
- Total Files: ${analysis.statistics.total}
- Tested: ${analysis.statistics.tested} (${coverage}%)
- Untested: ${analysis.statistics.untested}
- Test Coverage: ${coverage}%

🚨 Untested Files: ${analysis.statistics.untested}

${analysis.untested.slice(0, 10).map(file => 
  `- ${file.path} (${file.type}, complexity: ${file.complexity.score})`
).join('\n')}

${analysis.untested.length > 10 ? `\n... and ${analysis.untested.length - 10} more files` : ''}
`;
  }

  async generateNoExcusesList(analysis) {
    const content = `# NO EXCUSES - Test These Files! 🚨

Generated: ${new Date().toISOString()}
Total Untested Files: ${analysis.noExcuses.length}

## Priority Order (by complexity)

${analysis.noExcuses
  .sort((a, b) => b.complexity.score - a.complexity.score)
  .map((file, index) => `
### ${index + 1}. ${file.name}
- **Path**: ${file.path}
- **Type**: ${file.type}
- **Complexity**: ${file.complexity.score}/10
- **Lines**: ${file.complexity.lines}
- **Functions**: ${file.complexity.functions}
- **Suggested Tests**: ${this.suggestTests(file)}
`).join('\n')}

## How to Use This List

1. Start from the top (highest complexity)
2. For each file, run: \`ai-test-framework generate --file "${analysis.noExcuses[0]?.path}"\`
3. Review and commit the generated tests
4. Move to the next file

No more excuses! Let's get to 100% coverage! 💪
`;

    await fs.writeFile('no-excuses-test-list.md', content);
  }

  suggestTests(file) {
    const suggestions = [];

    switch (file.type) {
      case 'component':
        suggestions.push('Render test', 'User interaction test', 'Props validation');
        break;
      case 'service':
        suggestions.push('Unit tests for each method', 'Integration test', 'Error handling');
        break;
      case 'api':
        suggestions.push('Endpoint tests', 'Authentication tests', 'Error responses');
        break;
      case 'utility':
        suggestions.push('Unit tests for each function', 'Edge cases', 'Type validation');
        break;
      default:
        suggestions.push('Basic functionality', 'Error cases', 'Edge cases');
    }

    return suggestions.join(', ');
  }
}

module.exports = { SelfAwareAnalyzer };
