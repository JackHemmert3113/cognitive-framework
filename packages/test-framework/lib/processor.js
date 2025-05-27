'use strict';

/**
 * TestProcessor - minimal AI-powered testing processor.
 * In IDE mode it performs a simple analysis, while in API mode it
 * prepares a prompt for an AI service and processes the mock response.
 */
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

class TestProcessor {
  async analyzeForIDE(projectPath) {
    const { dir, files } = await this.createTempTests();
    const results = await this.runTests(dir);
    return { analyzed: projectPath, tempDir: dir, files, results };
  }

  async prepareForAPI(projectPath) {
    const { dir, files } = await this.createTempTests();
    const results = await this.runTests(dir);
    return { prompt: `Generate tests for ${projectPath}`, tempDir: dir, files, results };
  }

  async processAIResponse(aiResponse, projectPath) {
    const content = aiResponse.choices?.[0]?.message?.content || '';
    return { projectPath, generated: content };
  }

  async createTempTests() {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cogtest-'));
    const testFile = path.join(dir, 'generated.test.js');
    const content = `const assert = require('node:assert');\nconst { test } = require('node:test');\n\ntest('auto generated sample', () => {\n  assert.strictEqual(1 + 1, 2);\n});\n`;
    await fs.writeFile(testFile, content);
    return { dir, files: [testFile] };
  }

  async runTests(dir) {
    try {
      const { runCLI } = require('jest');
      const { results } = await runCLI(
        { runInBand: true, silent: true, rootDir: dir, testMatch: ['**/*.test.js'] },
        [dir]
      );
      return { code: results.success ? 0 : 1, results };
    } catch {
      return this.runNodeTests(dir);
    }
  }

  runNodeTests(dir) {
    return new Promise(resolve => {
      const child = spawn(process.execPath, ['--test'], { cwd: dir });
      let output = '';
      child.stdout.on('data', d => (output += d));
      child.stderr.on('data', d => (output += d));
      child.on('close', code => resolve({ code, output }));
    });
  }
}

module.exports = { TestProcessor };
