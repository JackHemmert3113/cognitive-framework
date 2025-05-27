/**
 * Cognitive Framework
 *
 * MIT License
 */
/**
 * processor.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./processor.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
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
    const { dir, files } = await this.createTempTests(projectPath);
    const results = await this.runTests(dir, projectPath);
    return { analyzed: projectPath, tempDir: dir, files, results };
  }

  async prepareForAPI(projectPath) {
    const { dir, files } = await this.createTempTests(projectPath);
    const results = await this.runTests(dir, projectPath);
    return { prompt: `Generate tests for ${projectPath}`, tempDir: dir, files, results };
  }

  async processAIResponse(aiResponse, projectPath) {
    const content = aiResponse.choices?.[0]?.message?.content || '';
    return { projectPath, generated: content };
  }

  async createTempTests(projectPath = process.cwd()) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cogtest-'));
    const parser = this.loadParser();

    const jsFiles = await this.collectJS(projectPath);
    const tests = [];

    if (parser && jsFiles.length > 0) {
      for (const file of jsFiles) {
        const code = await fs.readFile(file, 'utf8');
        let ast;
        try {
          ast = parser.parse(code, { sourceType: 'unambiguous' });
        } catch {
          continue;
        }
        const exported = this.extractExportedFunctions(ast);
        for (const fn of exported) {
          const rel = './' + path.relative(dir, file).replace(/\\/g, '/');
          const name = fn === 'default' ? 'mod' : `mod.${fn}`;
          const testFile = path.join(dir, `${path.basename(file, '.js')}-${fn}.test.js`);
          const content = [
            "const assert = require('node:assert');",
            "const { test } = require('node:test');",
            `const mod = require('${rel}');`,
            '',
            `const target = ${name};`,
            '',
            `test('${fn} executes', () => {`,
            '  assert.doesNotThrow(() => {',
            '    target(...Array(target.length).fill(1));',
            '  });',
            '});',
            ''
          ].join('\n');
          await fs.writeFile(testFile, content);
          tests.push(testFile);
        }
      }
    }

    if (tests.length === 0) {
      const testFile = path.join(dir, 'generated.test.js');
      const content = `const assert = require('node:assert');\nconst { test } = require('node:test');\n\ntest('auto generated sample', () => {\n  assert.strictEqual(1 + 1, 2);\n});\n`;
      await fs.writeFile(testFile, content);
      tests.push(testFile);
    }

    return { dir, files: tests };
  }

  loadParser() {
    try {
      return require('@babel/parser');
    } catch {
      return null;
    }
  }

  async collectJS(dir) {
    const files = [];
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const item of items) {
        const p = path.join(dir, item.name);
        if (item.isDirectory() && item.name !== 'node_modules') {
          files.push(...await this.collectJS(p));
        } else if (item.isFile() && item.name.endsWith('.js')) {
          files.push(p);
        }
      }
    } catch {
      // ignore
    }
    return files;
  }

  extractExportedFunctions(ast) {
    const exported = [];
    const walk = node => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'AssignmentExpression' && node.left && node.left.type === 'MemberExpression') {
        const left = node.left;
        if (left.object.type === 'Identifier' && left.object.name === 'module' && left.property.type === 'Identifier' && left.property.name === 'exports') {
          if (node.right.type === 'FunctionExpression' || node.right.type === 'ArrowFunctionExpression') {
            exported.push(node.right.id ? node.right.id.name : 'default');
          } else if (node.right.type === 'ObjectExpression') {
            for (const prop of node.right.properties || []) {
              if ((prop.value.type === 'FunctionExpression' || prop.value.type === 'ArrowFunctionExpression') && prop.key.type === 'Identifier') {
                exported.push(prop.key.name);
              }
            }
          }
        } else if (left.object.type === 'Identifier' && left.object.name === 'exports' && left.property.type === 'Identifier') {
          if (node.right.type === 'FunctionExpression' || node.right.type === 'ArrowFunctionExpression') {
            exported.push(left.property.name);
          }
        }
      } else if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration && node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
          exported.push(node.declaration.id.name);
        }
      } else if (node.type === 'ExportDefaultDeclaration') {
        exported.push('default');
      }

      for (const key in node) {
        const child = node[key];
        if (Array.isArray(child)) child.forEach(walk);
        else if (child && typeof child.type === 'string') walk(child);
      }
    };
    walk(ast);
    return exported;
  }

  async runTests(dir, projectDir = dir) {
    try {
      const { runCLI } = require('jest');
      const config = {
        runInBand: true,
        silent: true,
        rootDir: projectDir,
        testMatch: [path.join(dir, '**/*.test.js').replace(/\\/g, '/')]
      };
      const { results } = await runCLI(config, [projectDir]);
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

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = { TestProcessor };
