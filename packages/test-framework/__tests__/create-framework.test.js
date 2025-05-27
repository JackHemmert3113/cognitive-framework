const fs = require('fs');
const os = require('os');
const path = require('path');

// Mock the incorrect relative import used inside createAITestFramework
jest.mock('../../adapters/dual-mode', () => require('../../ai-core/adapters/dual-mode'));

const { createAITestFramework } = require('../../ai-core/test-generation');

const testResults = require('./fixtures/test-results.json');

describe('createAITestFramework integration', () => {
  test('generates context files for a sample project', async () => {
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-test-'));
    const framework = createAITestFramework({ mode: 'ide', outputDir });

    const result = await framework.process(testResults);

    expect(result.mode).toBe('ide');
    expect(result.status).toBe('success');

    const expected = [
      'context.json',
      'analysis.md',
      'prompts.md',
      'copilot-guide.md',
      'cursor-hints.json'
    ];

    for (const file of expected) {
      expect(fs.existsSync(path.join(outputDir, file))).toBe(true);
    }
  });
});
