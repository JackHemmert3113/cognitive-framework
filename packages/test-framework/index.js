'use strict';

const { TestProcessor } = require('./lib/processor');
const { runCLI } = require('./bin/cli');
let createAITestFramework;
try {
  ({ createAITestFramework } = require('@cognitive/ai-core/test-generation'));
} catch {
  ({ createAITestFramework } = require('../ai-core/test-generation'));
}

module.exports = {
  TestProcessor,
  runCLI,
  createAITestFramework
};
