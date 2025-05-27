/**
 * @cognitive/ai-core/adapters
 * 
 * Adapters for various AI models and services.
 */

const { AIDualMode, IDEMode, APIMode, CIMode } = require('./dual-mode');
const { validateProcessor, validateConfig } = require('./validation');

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = {
  AIDualMode,
  IDEMode,
  APIMode,
  CIMode,
  validateProcessor,
  validateConfig
};
