const { runCLI } = require('..');
const path = require('path');
const assert = require('node:assert');
const { test } = require('node:test');

test('CLI runner processes project path in IDE mode', async () => {
  const cwd = path.join(__dirname, 'fixtures');
  const result = await runCLI([cwd]);
  assert.deepStrictEqual(result, { analyzed: cwd });
});
