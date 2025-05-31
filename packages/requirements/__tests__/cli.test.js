/**
 * Cognitive Framework
 *
 * MIT License
 */
'use strict';

const { test } = require('node:test');

const assert = require('node:assert');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'req-cli-'));
}

test('cli processes file with --skip-tests', () => {
  const dir = tmpDir();
  const file = path.join(dir, 'req.md');
  fs.writeFileSync(file, '# Vision VIS-9: CLI\n\n**Owner:** dev\n**Status:** open\n**Priority:** P1\n**Estimate:** 1d\n**Tags:** demo\n**Created:** 2024-01-01\n**Last Updated:** 2024-01-02\n**Team:** core\n\n## Description\ntext');
  const cli = path.resolve(__dirname, '../bin/cli.js');
  const out = spawnSync('node', [cli, file, '--skip-tests', '--format', 'text'], { encoding: 'utf8' });
  assert.strictEqual(out.status, 0);
  assert.match(out.stdout, /Processed requirement VIS-9/);
  fs.rmSync(dir, { recursive: true, force: true });
});
