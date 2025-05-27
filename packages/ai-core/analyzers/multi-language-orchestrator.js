/**
 * @cognitive/ai-core/analyzers/multi-language-orchestrator
 * 
 * Orchestrates test analysis across multiple programming languages.
 */

const path = require('path');
const fs = require('fs').promises;

class MultiLanguageOrchestrator {
  constructor(config) {
    this.config = config;
    this.analyzers = {
      javascript: new JavaScriptAnalyzer(),
      typescript: new TypeScriptAnalyzer(),
      python: new PythonAnalyzer(),
      go: new GoAnalyzer(),
      rust: new RustAnalyzer()
    };
  }

  async analyzePolyglotProject(projectPath) {
    console.log('🌐 Analyzing multi-language project...');

    const projectStructure = {
      languages: {},
      services: [],
      integrationPoints: [],
      testStrategy: {}
    };

    // Scan entire project
    const files = await this.getAllFiles(projectPath);

    for (const file of files) {
      const language = this.detectLanguage(file);
      if (language) {
        if (!projectStructure.languages[language]) {
          projectStructure.languages[language] = {
            files: [],
            analyzer: this.analyzers[language],
            testCoverage: 0
          };
        }
        projectStructure.languages[language].files.push(file);
      }
    }

    // Analyze each language separately
    for (const [lang, data] of Object.entries(projectStructure.languages)) {
      const analysis = await data.analyzer.analyze(data.files);
      projectStructure.testStrategy[lang] = analysis;
    }

    // Find integration points
    projectStructure.integrationPoints = await this.findIntegrationPoints(projectStructure);

    return projectStructure;
  }

  async getAllFiles(dir, files = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !this.shouldSkip(entry.name)) {
        await this.getAllFiles(fullPath, files);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  detectLanguage(filePath) {
    const ext = path.extname(filePath);
    const languageMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.go': 'go',
      '.rs': 'rust',
      '.java': 'java',
      '.rb': 'ruby'
    };

    return languageMap[ext];
  }

  shouldSkip(dirName) {
    const skipDirs = ['node_modules', '.git', 'dist', 'build', '__pycache__', 'target'];
    return skipDirs.includes(dirName);
  }

  async findIntegrationPoints(structure) {
    const integrations = [];

    // JavaScript → Python API calls
    if (structure.languages.javascript && structure.languages.python) {
      integrations.push({
        type: 'api-integration',
        from: 'javascript-frontend',
        to: 'python-backend',
        tests: this.generateCrossLanguageTests('js-py')
      });
    }

    // Python ML model → JavaScript API
    if (this.hasPythonML(structure) && structure.languages.javascript) {
      integrations.push({
        type: 'ml-integration',
        from: 'python-model',
        to: 'javascript-api',
        tests: this.generateMLIntegrationTests()
      });
    }

    return integrations;
  }

  hasPythonML(structure) {
    if (!structure.languages.python) return false;

    // Check for ML libraries in Python files
    const mlIndicators = ['tensorflow', 'torch', 'sklearn', 'pandas', 'numpy'];
    return structure.languages.python.files.some(file =>
      mlIndicators.some(lib => file.includes(lib))
    );
  }

  generateCrossLanguageTests(integration) {
    return {
      frontend: 'Test API calls from JS to Python',
      backend: 'Test Python API endpoints',
      contract: 'Test API contract between services',
      integration: 'Test full flow across languages'
    };
  }

  generateMLIntegrationTests() {
    return {
      model: 'Test ML model predictions',
      api: 'Test model serving API',
      validation: 'Test input validation',
      performance: 'Test inference speed'
    };
  }
}

// Language-specific analyzers
class BaseAnalyzer {
  async analyze(files) {
    const analysis = {
      files: files.length,
      testFiles: 0,
      coverage: 0,
      frameworks: [],
      testingNeeds: []
    };

    for (const file of files) {
      if (this.isTestFile(file)) {
        analysis.testFiles++;
      }
    }

    analysis.coverage = (analysis.testFiles / analysis.files * 100).toFixed(1);
    return analysis;
  }

  isTestFile(file) {
    return file.includes('test') || file.includes('spec');
  }
}

class JavaScriptAnalyzer extends BaseAnalyzer {
  async analyze(files) {
    const analysis = await super.analyze(files);

    // Detect frameworks
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8').catch(() => '');
      if (content.includes('react')) analysis.frameworks.push('react');
      if (content.includes('vue')) analysis.frameworks.push('vue');
      if (content.includes('express')) analysis.frameworks.push('express');
    }

    return analysis;
  }
}

class TypeScriptAnalyzer extends JavaScriptAnalyzer {
  // Inherits JavaScript analysis with TS additions
}

class PythonAnalyzer extends BaseAnalyzer {
  async analyze(files) {
    const analysis = await super.analyze(files);

    // Python-specific analysis
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8').catch(() => '');
      if (content.includes('django')) analysis.frameworks.push('django');
      if (content.includes('flask')) analysis.frameworks.push('flask');
      if (content.includes('fastapi')) analysis.frameworks.push('fastapi');
      if (content.includes('pytest')) analysis.frameworks.push('pytest');
    }

    return analysis;
  }

  isTestFile(file) {
    return file.includes('test_') || file.includes('_test.py') || super.isTestFile(file);
  }
}

class GoAnalyzer extends BaseAnalyzer {
  isTestFile(file) {
    return file.endsWith('_test.go');
  }
}

class RustAnalyzer extends BaseAnalyzer {
  async analyze(files) {
    const analysis = await super.analyze(files);

    // Rust tests are often in the same file
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8').catch(() => '');
      if (content.includes('#[cfg(test)]')) {
        analysis.testFiles++;
      }
    }

    return analysis;
  }
}

module.exports = {
  MultiLanguageOrchestrator,
  JavaScriptAnalyzer,
  TypeScriptAnalyzer,
  PythonAnalyzer,
  GoAnalyzer,
  RustAnalyzer
};
