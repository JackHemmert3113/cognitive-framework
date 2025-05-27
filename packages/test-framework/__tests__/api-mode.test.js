const { createAITestFramework } = require('..');
const Module = require('module');
const path = require('path');
const fs = require('fs');
const os = require('os');
const assert = require('node:assert');
const { test } = require('node:test');

const testResults = require('./fixtures/test-results.json');

function withMockedOpenAI(fn) {
  const origLoad = Module._load;
  const origResolve = Module._resolveFilename;
  Module._load = function(request, parent, isMain) {
    if (request === 'openai') {
      return require('./mocks/openai');
    }
    return origLoad(request, parent, isMain);
  };
  Module._resolveFilename = function(request, parent, isMain) {
    if (request === 'openai') {
      return path.join(__dirname, 'mocks', 'openai.js');
    }
    return origResolve.call(Module, request, parent, isMain);
  };
  return fn().finally(() => {
    Module._load = origLoad;
    Module._resolveFilename = origResolve;
  });
}

test('API mode succeeds with mocked OpenAI client', async () => {
  await withMockedOpenAI(async () => {
    const framework = createAITestFramework({ mode: 'api', apiKey: 'dummy' });
    const result = await framework.process(testResults);
    assert.strictEqual(result.mode, 'api');
    assert.strictEqual(result.status, 'success');
    assert.deepStrictEqual(result.result.generatedTests, ['mock-test']);
  });
});

test('API mode fails when API key missing', async () => {
  const framework = createAITestFramework({ mode: 'api' });
  await assert.rejects(framework.process(testResults), /API key required/);
});

test('CI mode writes output to file', async () => {
  const framework = createAITestFramework({ mode: 'ci' });
  const tmpFile = path.join(os.tmpdir(), `ci-${Date.now()}.json`);
  framework.config.ci.outputFile = tmpFile;
  const result = await framework.process(testResults);
  assert.strictEqual(result.mode, 'ci');
  assert.strictEqual(result.status, 'success');
  assert.ok(fs.existsSync(tmpFile));
  fs.unlinkSync(tmpFile);
});
