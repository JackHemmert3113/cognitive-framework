/**
 * Validation utilities for AI Dual Mode
 */

function validateProcessor(processor) {
  const errors = [];
  
  if (!processor || typeof processor !== 'object') {
    errors.push('Processor must be an object');
    return errors;
  }
  
  // Check for at least one required method
  const hasMethods = processor.analyzeForIDE || 
                    processor.prepareForAPI || 
                    processor.analyzeForCI;
                    
  if (!hasMethods) {
    errors.push('Processor must implement at least one method: analyzeForIDE, prepareForAPI, or analyzeForCI');
  }
  
  // Validate method types
  const methods = ['analyzeForIDE', 'prepareForAPI', 'processAIResponse', 'analyzeForCI'];
  methods.forEach(method => {
    if (processor[method] && typeof processor[method] !== 'function') {
      errors.push(`${method} must be a function`);
    }
  });
  
  return errors;
}

function validateConfig(config, mode) {
  const errors = [];
  
  if (mode === 'api' && !config.api?.apiKey && !process.env.AI_API_KEY) {
    errors.push('API mode requires an API key via config.api.apiKey or AI_API_KEY env var');
  }
  
  return errors;
}

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = {
  validateProcessor,
  validateConfig
};
