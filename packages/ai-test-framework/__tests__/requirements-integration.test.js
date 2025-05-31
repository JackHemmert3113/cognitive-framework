/**
 * Cognitive Framework
 *
 * MIT License
 */
/**
 * requirements-integration.test.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./requirements-integration.test.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
const { processAndTest } = require('../../requirements');
const path = require('path');
const assert = require('node:assert');
const { test } = require('node:test');

const requirement = {
  id: 'TASK-1',
  type: 'task',
  title: 'demo',
  metadata: {
    owner: 'tester',
    status: 'open',
    priority: 'low',
    estimate: '1h',
    tags: 'demo',
    created: '2024-01-01',
    lastUpdated: '2024-01-01',
    team: 'dev'
  },
  acceptanceCriteria: ['works']
};

test('processAndTest returns requirement and test result', async () => {
  const project = path.join(__dirname, 'fixtures');
  const result = await processAndTest(requirement, project);
  assert.strictEqual(result.requirement.id, 'TASK-1');
  assert.strictEqual(result.testResult.analyzed, project);
  assert.strictEqual(result.testResult.results.code, 0);
});

