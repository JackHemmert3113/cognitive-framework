/**
 * @cognitive/ai-core/test-generation
 * 
 * AI-powered tools for generating and managing tests.
 */

const { TestFrameworkProcessor } = require('./test-framework-processor');
const { createAITestFramework } = require('./ai-test-framework');

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = {
  TestFrameworkProcessor,
  createAITestFramework
};
