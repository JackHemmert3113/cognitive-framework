/**
 * @cognitive/ai-core/test-generation/ai-test-framework
 * 
 * Factory function to create AI-enhanced test framework
 */

const { TestFrameworkProcessor } = require('./test-framework-processor');
const { AIDualMode } = require('../adapters/dual-mode');

/**
 * Factory function to create AI-enhanced test framework
 */
function createAITestFramework(config = {}) {
  const processor = new TestFrameworkProcessor();

  return AIDualMode.create('AI Test Framework', processor, {
    mode: config.mode || 'auto',
    config: {
      ide: {
        outputDir: config.outputDir || '.ai-test',
        includeIDESpecific: true
      },
      api: {
        apiKey: config.apiKey || process.env.AI_API_KEY,
        model: config.model || 'gpt-4',
        provider: config.provider || 'openai'
      },
      ci: {
        outputFormat: 'json',
        saveToFile: true,
        outputFile: 'test-analysis.json'
      }
    }
  });
}

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = {
  createAITestFramework
};
