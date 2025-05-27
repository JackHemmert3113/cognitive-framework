/**
 * cli.test.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./cli.test.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
const { runCLI } = require('..');
const path = require('path');
const assert = require('node:assert');
const { test } = require('node:test');

test('CLI runner processes project path in IDE mode', async () => {
  const cwd = path.join(__dirname, 'fixtures');
  const result = await runCLI([cwd]);
  assert.strictEqual(result.analyzed, cwd);
  assert.ok(Array.isArray(result.files));
  assert.strictEqual(result.results.code, 0);
});
