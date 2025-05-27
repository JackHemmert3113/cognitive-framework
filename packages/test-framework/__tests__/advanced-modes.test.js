const { createAITestFramework } = require('..');
const assert = require('node:assert');
const { test } = require('node:test');
const Module = require('module');
const fs = require('fs');
const os = require('os');
const path = require('path');

const testResults = require('./fixtures/test-results.json');

// Helper to mock the openai package
function withMockedOpenAI(fn) {
  const originalLoad = Module._load;
  const originalResolve = Module._resolveFilename;
  Module._load = function(request, parent, isMain) {
    if (request === 'openai') {
      return require('./mocks/openai');
    }
    return originalLoad(request, parent, isMain);
  };
  Module._resolveFilename = function(request, parent, isMain) {
    if (request === 'openai') {
      return path.join(__dirname, 'mocks', 'openai.js');
    }
    return originalResolve.call(Module, request, parent, isMain);
  };
  return fn().finally(() => {
    Module._load = originalLoad;
    Module._resolveFilename = originalResolve;
  });
}

test('AI framework executes in API mode', async () => {
  await withMockedOpenAI(async () => {
    const framework = createAITestFramework({ mode: 'api', apiKey: 'dummy' });
    const result = await framework.process(testResults);
    assert.strictEqual(result.mode, 'api');
    assert.strictEqual(result.status, 'success');
    assert.deepStrictEqual(result.result.generatedTests, ['mock-test']);
  });
});

test('API mode fails without OpenAI module', async () => {
  const framework = createAITestFramework({ mode: 'api', apiKey: 'dummy' });
  const result = await framework.process(testResults);
  assert.strictEqual(result.status, 'success');
  assert.ok(result.result.error);
});

test('API mode fails without API key', async () => {
  const framework = createAITestFramework({ mode: 'api' });
  await assert.rejects(framework.process(testResults), /API key required/);
});

test('CI mode outputs JSON summary', async () => {
  const framework = createAITestFramework({ mode: 'ci' });
  const tmpFile = path.join(os.tmpdir(), `ci-${Date.now()}.json`);
  framework.config.ci.outputFile = tmpFile;

  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => { logs.push(args.join(' ')); };
  try {
    const result = await framework.process(testResults);
    assert.strictEqual(result.mode, 'ci');
    assert.strictEqual(result.status, 'success');
    assert.ok(logs.some(l => l.includes('CI Mode')));
    assert.ok(fs.existsSync(tmpFile));
  } finally {
    console.log = originalLog;
    fs.unlinkSync(tmpFile);
  }
});
