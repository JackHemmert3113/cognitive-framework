/**
 * create-framework.test.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./create-framework.test.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('node:assert');
const { test } = require('node:test');

const { createAITestFramework } = require('..');

const testResults = require('./fixtures/test-results.json');

test('createAITestFramework generates context files for a sample project', async () => {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-test-'));
  const framework = createAITestFramework({ mode: 'ide', outputDir });

  const result = await framework.process(testResults);

  assert.strictEqual(result.mode, 'ide');
  assert.strictEqual(result.status, 'success');

  const expected = [
    'context.json',
    'analysis.md',
    'prompts.md',
    'copilot-guide.md',
    'cursor-hints.json'
  ];

  for (const file of expected) {
    assert.ok(fs.existsSync(path.join(outputDir, file)));
  }
});
