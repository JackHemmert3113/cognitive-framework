/**
 * Cognitive Framework
 *
 * MIT License
 */
/**
 * framework.test.js - Requirements Framework tests
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('node:assert');
const { test } = require('node:test');

const { RequirementsFramework } = require('..');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'req-'));
}

test('valid requirement creates context files', async () => {
  const dir = tmpDir();
  const outputDir = path.join(dir, '.ai');
  const rf = new RequirementsFramework({ outputDir });

  const req = {
    id: 'VIS-1',
    type: 'vision',
    title: 'Demo Vision',
    description: 'desc',
    metadata: {
      owner: 'dev',
      status: 'open',
      priority: 'P1',
      estimate: '1d',
      tags: 'demo',
      created: '2024-01-01',
      lastUpdated: '2024-01-02',
      team: 'core'
    }
  };

  const result = await rf.process(req);
  assert.strictEqual(result.id, 'VIS-1');

  const files = ['analysis.md', 'acceptance_criteria.md', 'PROMPTS.md'];
  for (const file of files) {
    assert.ok(fs.existsSync(path.join(outputDir, file)), `${file} missing`);
  }

  fs.rmSync(dir, { recursive: true, force: true });
});

test('missing metadata causes validation error', async () => {
  const dir = tmpDir();
  const rf = new RequirementsFramework({ outputDir: dir });
  const bad = { id: 'VIS-1', type: 'vision', metadata: {}, description: '' };
  await assert.rejects(() => rf.process(bad), /Missing metadata field: owner/);
  fs.rmSync(dir, { recursive: true, force: true });
});
