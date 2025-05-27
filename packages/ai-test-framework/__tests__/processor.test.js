/**
 * Cognitive Framework
 *
 * MIT License
 */
/**
 * processor.test.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./processor.test.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
const { TestProcessor } = require('../lib/processor');
const assert = require('node:assert');
const { test } = require('node:test');

test('TestProcessor analyzeForIDE returns analyzed path', async () => {
  const processor = new TestProcessor();
  const result = await processor.analyzeForIDE('my-project');
  assert.strictEqual(result.analyzed, 'my-project');
  assert.ok(Array.isArray(result.files));
  assert.ok(result.files.length > 0);
  assert.ok(result.tempDir);
  assert.strictEqual(result.results.code, 0);
});

test('TestProcessor processAIResponse maps ai output', async () => {
  const processor = new TestProcessor();
  const response = { choices: [{ message: { content: 'test content' } }] };
  const result = await processor.processAIResponse(response, 'path');
  assert.deepStrictEqual(result, { projectPath: 'path', generated: 'test content' });
});
