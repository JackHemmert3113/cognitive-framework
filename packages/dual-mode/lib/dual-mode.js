/**
 * dual-mode.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./dual-mode.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
'use strict';

/**
 * DualMode class for handling both IDE and API modes
 */
class DualMode {
  /**
   * Create a new DualMode instance
   * 
   * @param {string} name - Name of the tool
   * @param {Object} processor - Processor implementation
   * @param {Object} options - Configuration options
   * @param {string} [options.mode='auto'] - Mode to use ('ide', 'api', or 'auto')
   * @param {string} [options.outputDir='.ai'] - Directory for IDE context files
   * @param {string} [options.provider='openai'] - AI provider to use
   * @param {string} [options.apiKey] - API key for direct AI integration
   * @param {string} [options.apiEndpoint] - Custom API endpoint URL
   * @param {Object} [options.apiOptions] - Additional options for the AI provider
   * @returns {DualMode} - A new DualMode instance
   */
  static create(name, processor, options = {}) {
    // Support both new and old API formats
    if (typeof name === 'object' && !processor) {
      options = name;
      processor = options.processor;
      name = options.name;
    }

    return new DualMode(name, processor, options);
  }

  /**
   * Constructor for DualMode
   * 
   * @param {string} name - Name of the tool
   * @param {Object} processor - Processor implementation
   * @param {Object} options - Configuration options
   */
  constructor(name, processor, options = {}) {
    this.name = name;
    this.processor = processor;
    this.options = {
      mode: options.mode || 'auto',
      outputDir: options.outputDir || '.ai',
      provider: options.provider || 'openai',
      apiKey: options.apiKey,
      apiEndpoint: options.apiEndpoint,
      apiOptions: options.apiOptions || {}
    };
  }

  /**
   * Detect the current mode based on environment
   * 
   * @returns {string} - The detected mode ('ide' or 'api')
   */
  detectMode() {
    // If mode is explicitly set, use that
    if (this.options.mode === 'ide' || this.options.mode === 'api') {
      return this.options.mode;
    }

    // Auto-detect mode
    // Check for common IDE environment variables or conditions
    if (process.env.VSCODE_PID || process.env.JETBRAINS_IDE || process.env.FORCE_IDE_MODE) {
      return 'ide';
    }

    // Check if API key is available
    if (this.options.apiKey || process.env.OPENAI_API_KEY || process.env.AI_API_KEY) {
      return 'api';
    }

    // Default to IDE mode if can't determine
    return 'ide';
  }

  /**
   * Process data in the appropriate mode
   * 
   * @param {any} data - The data to process
   * @returns {Promise<any>} - The processing result
   */
  async process(data) {
    const mode = this.detectMode();

    if (mode === 'ide') {
      return this.processInIDEMode(data);
    } else {
      return this.processInAPIMode(data);
    }
  }

  /**
   * Process data in IDE mode (generates context files)
   * 
   * @param {any} data - The data to process
   * @returns {Promise<any>} - The processing result
   */
  async processInIDEMode(data) {
    if (!this.processor.analyzeForIDE) {
      throw new Error(`Processor for ${this.name} does not implement analyzeForIDE method`);
    }

    const result = await this.processor.analyzeForIDE(data);
    
    // Generate context files in the output directory
    // This would involve file system operations to write the context, analysis, and prompts
    // to files in the specified output directory
    
    return result;
  }

  /**
   * Process data in API mode (calls AI directly)
   * 
   * @param {any} data - The data to process
   * @returns {Promise<any>} - The processing result
   */
  async processInAPIMode(data) {
    if (!this.processor.prepareForAPI) {
      throw new Error(`Processor for ${this.name} does not implement prepareForAPI method`);
    }
    
    if (!this.processor.processAIResponse) {
      throw new Error(`Processor for ${this.name} does not implement processAIResponse method`);
    }

    const prepared = await this.processor.prepareForAPI(data);
    
    // Call the AI API with the prepared data
    // This would involve making an HTTP request to the AI provider's API
    const aiResponse = await this.callAIAPI(prepared);
    
    // Process the AI response
    return this.processor.processAIResponse(aiResponse, data);
  }

  /**
   * Call the AI API with the prepared data
   * 
   * @param {Object} prepared - The prepared data for the AI API
   * @returns {Promise<any>} - The AI API response
   */
  async callAIAPI(prepared) {
    // This is a placeholder for the actual API call
    // In a real implementation, this would make an HTTP request to the AI provider's API
    
    // For now, just return a mock response
    return {
      choices: [
        {
          message: {
            content: "This is a mock AI response"
          }
        }
      ]
    };
  }
}

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = { DualMode };
