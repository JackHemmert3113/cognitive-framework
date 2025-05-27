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
