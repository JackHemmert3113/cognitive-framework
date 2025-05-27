/**
 * Cognitive Framework
 *
 * MIT License
 */
/**
 * index.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./index.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
'use strict';

const { TestProcessor } = require('./lib/processor');
const { runCLI } = require('./bin/cli');
let createAITestFramework;
try {
  ({ createAITestFramework } = require('@cognitive/ai-core/test-generation'));
} catch {
  ({ createAITestFramework } = require('../ai-core/test-generation'));
}

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = {
  TestProcessor,
  runCLI,
  createAITestFramework
};
