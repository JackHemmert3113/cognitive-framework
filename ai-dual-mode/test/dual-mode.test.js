/**
 * Comprehensive tests for AI Dual Mode
 * Tests cover AIDualMode and its three mode classes: IDEMode, APIMode, and CIMode
 */

const { AIDualMode, IDEMode, APIMode, CIMode } = require('../index');
const fs = require('fs').promises;
const path = require('path');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('mock file content')
  }
}));

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mock AI response' } }]
        })
      }
    }
  }));
});

// Create a mock processor for testing
const createMockProcessor = () => ({
  analyzeForIDE: jest.fn().mockResolvedValue({
    context: { summary: 'Test summary' },
    analysis: 'Test analysis'
  }),
  prepareForAPI: jest.fn().mockResolvedValue({
    messages: [{ role: 'user', content: 'Test message' }]
  }),
  processAIResponse: jest.fn().mockResolvedValue({
    result: 'Processed response'
  }),
  analyzeForCI: jest.fn().mockResolvedValue({
    context: { summary: 'CI summary', issues: [] }
  })
});

describe('AIDualMode', () => {
  // Save and restore environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.AI_API_KEY;
    delete process.env.AI_MODE;
    delete process.env.CI;
    delete process.env.GITHUB_ACTIONS;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  /**
   * Tests for AIDualMode instance creation with various options
   */
  describe('Instance Creation', () => {
    // Test default constructor options
    test('creates instance with default options', () => {
      // Comment: Validates that AIDualMode can be instantiated with default options
      const dualMode = new AIDualMode();

      expect(dualMode.toolName).toBe('AI Tool');
      expect(dualMode.version).toBe('1.0.0');
      expect(dualMode.config).toEqual({});
      expect(dualMode.mode).toBe('ide'); // Default mode
      expect(dualMode.processor).toBeUndefined();
      expect(dualMode.modeHandler).toBeNull();
    });

    // Test custom constructor options
    test('creates instance with custom options', () => {
      // Comment: Validates that AIDualMode properly uses custom options when provided
      const processor = createMockProcessor();
      const options = {
        toolName: 'Custom Tool',
        version: '2.0.0',
        config: { custom: 'value' },
        mode: 'api',
        processor
      };

      const dualMode = new AIDualMode(options);

      expect(dualMode.toolName).toBe('Custom Tool');
      expect(dualMode.version).toBe('2.0.0');
      expect(dualMode.config).toEqual({ custom: 'value' });
      expect(dualMode.mode).toBe('api');
      expect(dualMode.processor).toBe(processor);
    });

    // Test static factory method
    test('creates instance using static factory method', () => {
      // Comment: Validates that the static create method works correctly
      const processor = createMockProcessor();
      const dualMode = AIDualMode.create('Factory Tool', processor, { version: '3.0.0' });

      expect(dualMode.toolName).toBe('Factory Tool');
      expect(dualMode.processor).toBe(processor);
      expect(dualMode.version).toBe('3.0.0');
      expect(dualMode).toBeInstanceOf(AIDualMode);
    });
  });

  /**
   * Tests for mode detection logic
   */
  describe('Mode Detection', () => {
    // Test explicit mode
    test('uses explicit mode when provided', () => {
      // Comment: Validates that explicitly provided mode takes precedence
      const dualMode = new AIDualMode({ mode: 'ci' });
      expect(dualMode.mode).toBe('ci');

      // Should ignore environment variables when explicit mode is provided
      process.env.AI_API_KEY = 'test-key';
      const dualMode2 = new AIDualMode({ mode: 'ide' });
      expect(dualMode2.mode).toBe('ide');
    });

    // Test API mode detection via environment variable
    test('detects API mode from AI_API_KEY environment variable', () => {
      // Comment: Validates that presence of API key in env triggers API mode
      process.env.AI_API_KEY = 'test-key';
      const dualMode = new AIDualMode();
      expect(dualMode.mode).toBe('api');
    });

    // Test API mode detection via AI_MODE environment variable
    test('detects API mode from AI_MODE environment variable', () => {
      // Comment: Validates that AI_MODE env variable can set the mode
      process.env.AI_MODE = 'api';
      const dualMode = new AIDualMode();
      expect(dualMode.mode).toBe('api');
    });

    // Test API mode detection via config
    test('detects API mode from config', () => {
      // Comment: Validates that API key in config triggers API mode
      const dualMode = new AIDualMode({
        config: { api: { apiKey: 'config-key' } }
      });
      expect(dualMode.mode).toBe('api');
    });

    // Test CI mode detection
    test('detects CI mode from environment variables', () => {
      // Comment: Validates that CI environment variables trigger CI mode
      process.env.CI = 'true';
      const dualMode = new AIDualMode();
      expect(dualMode.mode).toBe('ci');

      delete process.env.CI;
      process.env.GITHUB_ACTIONS = 'true';
      const dualMode2 = new AIDualMode();
      expect(dualMode2.mode).toBe('ci');
    });

    // Test default to IDE mode
    test('defaults to IDE mode when no indicators present', () => {
      // Comment: Validates that IDE mode is the default when no other indicators are present
      const dualMode = new AIDualMode();
      expect(dualMode.mode).toBe('ide');
    });
  });

  /**
   * Tests for initialization and mode handler creation
   */
  describe('Initialization', () => {
    test('initializes with IDE mode handler', async () => {
      // Comment: Validates that initialize() creates the correct mode handler for IDE mode
      const dualMode = new AIDualMode({ mode: 'ide' });
      await dualMode.initialize();

      expect(dualMode.modeHandler).toBeInstanceOf(IDEMode);
    });

    test('initializes with API mode handler', async () => {
      // Comment: Validates that initialize() creates the correct mode handler for API mode
      const dualMode = new AIDualMode({ 
        mode: 'api',
        config: { api: { apiKey: 'test-key' } }
      });

      // Mock the OpenAI initialization
      const originalInitializeProvider = APIMode.prototype.initializeProvider;
      APIMode.prototype.initializeProvider = jest.fn();

      await dualMode.initialize();

      expect(dualMode.modeHandler).toBeInstanceOf(APIMode);

      // Restore original method
      APIMode.prototype.initializeProvider = originalInitializeProvider;
    });

    test('initializes with CI mode handler', async () => {
      // Comment: Validates that initialize() creates the correct mode handler for CI mode
      const dualMode = new AIDualMode({ mode: 'ci' });
      await dualMode.initialize();

      expect(dualMode.modeHandler).toBeInstanceOf(CIMode);
    });

    test('throws error for unknown mode', async () => {
      // Comment: Validates that initialize() throws an error for unknown modes
      const dualMode = new AIDualMode({ mode: 'unknown' });

      await expect(dualMode.initialize()).rejects.toThrow('Unknown mode: unknown');
    });
  });

  /**
   * Tests for processor validation
   */
  describe('Processor Validation', () => {
    test('throws error when no processor is provided', async () => {
      // Comment: Validates that process() throws an error when no processor is provided
      const dualMode = new AIDualMode();

      await expect(dualMode.process({})).rejects.toThrow('No processor provided');
    });

    test('automatically initializes if not already initialized', async () => {
      // Comment: Validates that process() calls initialize() if not already initialized
      const processor = createMockProcessor();
      const dualMode = new AIDualMode({ 
        processor,
        mode: 'ide'
      });

      const initializeSpy = jest.spyOn(dualMode, 'initialize');

      await dualMode.process({});

      expect(initializeSpy).toHaveBeenCalled();
      expect(dualMode.modeHandler).toBeInstanceOf(IDEMode);
    });

    test('uses existing mode handler if already initialized', async () => {
      // Comment: Validates that process() doesn't reinitialize if already initialized
      const processor = createMockProcessor();
      const dualMode = new AIDualMode({ 
        processor,
        mode: 'ide'
      });

      await dualMode.initialize();
      const initializeSpy = jest.spyOn(dualMode, 'initialize');

      await dualMode.process({});

      expect(initializeSpy).not.toHaveBeenCalled();
    });
  });

  /**
   * Tests for process method
   */
  describe('Process Method', () => {
    test('delegates processing to mode handler', async () => {
      // Comment: Validates that process() delegates to the mode handler's process method
      const processor = createMockProcessor();
      const dualMode = new AIDualMode({ 
        processor,
        mode: 'ide'
      });

      await dualMode.initialize();
      const processSpy = jest.spyOn(dualMode.modeHandler, 'process');

      await dualMode.process({ data: 'test' });

      expect(processSpy).toHaveBeenCalledWith({ data: 'test' }, processor);
    });
  });
});

/**
 * Tests for IDEMode class
 */
describe('IDEMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('constructor sets default and custom options', () => {
    // Comment: Validates that IDEMode constructor properly sets options
    const defaultMode = new IDEMode();
    expect(defaultMode.outputDir).toBe('.ai');

    const customMode = new IDEMode({ 
      toolName: 'Custom IDE Tool',
      outputDir: 'custom-dir'
    });
    expect(customMode.toolName).toBe('Custom IDE Tool');
    expect(customMode.outputDir).toBe('custom-dir');
  });

  test('process throws error if processor lacks analyzeForIDE method', async () => {
    // Comment: Validates that IDEMode requires the processor to have analyzeForIDE method
    const ideMode = new IDEMode();
    const invalidProcessor = {};

    await expect(ideMode.process({}, invalidProcessor))
      .rejects.toThrow('Processor must implement analyzeForIDE method');
  });

  test('process validates processed data', async () => {
    // Comment: Validates that IDEMode checks the processed data structure
    const ideMode = new IDEMode();
    const processor = {
      analyzeForIDE: jest.fn().mockResolvedValue({
        // Missing required fields
      })
    };

    await expect(ideMode.process({}, processor))
      .rejects.toThrow('Processor must return a context object');

    processor.analyzeForIDE = jest.fn().mockResolvedValue({
      context: {}
      // Still missing analysis
    });

    await expect(ideMode.process({}, processor))
      .rejects.toThrow('Processor must return an analysis string');
  });

  test('process generates context files', async () => {
    // Comment: Validates that IDEMode generates the expected files
    const ideMode = new IDEMode({ toolName: 'Test Tool' });
    const processor = {
      analyzeForIDE: jest.fn().mockResolvedValue({
        context: { summary: 'Test summary' },
        analysis: 'Test analysis',
        prompts: 'Test prompts'
      })
    };

    const result = await ideMode.process({}, processor);

    // Check that mkdir was called
    expect(fs.mkdir).toHaveBeenCalledWith('.ai', { recursive: true });

    // Check that writeFile was called for each expected file
    expect(fs.writeFile).toHaveBeenCalledTimes(5); // 5 files total
    expect(fs.writeFile).toHaveBeenCalledWith(
      '.ai/context.json',
      expect.stringContaining('"tool": "Test Tool"')
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      '.ai/analysis.md',
      expect.stringContaining('Test analysis')
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      '.ai/prompts.md',
      expect.stringContaining('AI Assistant Prompts')
    );

    // Check result structure
    expect(result.mode).toBe('ide');
    expect(result.status).toBe('success');
    expect(result.files.length).toBe(5);
    expect(result.instructions).toContain('AI Context Files Generated Successfully');
  });

  test('respects includeIDESpecific option', async () => {
    // Comment: Validates that IDEMode respects the includeIDESpecific option
    const ideMode = new IDEMode({ 
      toolName: 'Test Tool',
      includeIDESpecific: false
    });
    const processor = {
      analyzeForIDE: jest.fn().mockResolvedValue({
        context: { summary: 'Test summary' },
        analysis: 'Test analysis',
        prompts: 'Test prompts'
      })
    };

    const result = await ideMode.process({}, processor);

    // Should only write 3 files instead of 5
    expect(fs.writeFile).toHaveBeenCalledTimes(3);
    expect(result.files.length).toBe(3);
  });
});

/**
 * Tests for APIMode class
 */
describe('APIMode', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.AI_API_KEY;

    // Mock the OpenAI initialization
    APIMode.prototype.initializeProvider = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('constructor requires API key', () => {
    // Comment: Validates that APIMode requires an API key
    expect(() => new APIMode()).toThrow('API key required for API mode');

    // Should work with config API key
    const apiMode = new APIMode({ apiKey: 'test-key' });
    expect(apiMode.apiKey).toBe('test-key');

    // Should work with environment variable
    process.env.AI_API_KEY = 'env-key';
    const apiMode2 = new APIMode();
    expect(apiMode2.apiKey).toBe('env-key');
  });

  test('constructor sets default and custom options', () => {
    // Comment: Validates that APIMode constructor properly sets options
    const apiMode = new APIMode({ 
      apiKey: 'test-key',
      toolName: 'API Tool',
      provider: 'openai'
    });

    expect(apiMode.toolName).toBe('API Tool');
    expect(apiMode.provider).toBe('openai');
  });

  test('process throws error if processor lacks required methods', async () => {
    // Comment: Validates that APIMode requires the processor to have specific methods
    const apiMode = new APIMode({ apiKey: 'test-key' });

    // Missing prepareForAPI
    const processor1 = {
      processAIResponse: jest.fn()
    };
    await expect(apiMode.process({}, processor1))
      .rejects.toThrow('Processor must implement prepareForAPI method');

    // Missing processAIResponse
    const processor2 = {
      prepareForAPI: jest.fn()
    };
    await expect(apiMode.process({}, processor2))
      .rejects.toThrow('Processor must implement processAIResponse method');
  });

  test('process validates prepared data', async () => {
    // Comment: Validates that APIMode checks the prepared data structure
    const apiMode = new APIMode({ apiKey: 'test-key' });

    // Missing messages
    const processor1 = {
      prepareForAPI: jest.fn().mockResolvedValue({}),
      processAIResponse: jest.fn()
    };
    const result1 = await apiMode.process({}, processor1);
    expect(result1.status).toBe('error');
    expect(result1.error).toContain('prepareForAPI must return an object with messages array');

    // Empty messages array
    const processor2 = {
      prepareForAPI: jest.fn().mockResolvedValue({ messages: [] }),
      processAIResponse: jest.fn()
    };
    const result2 = await apiMode.process({}, processor2);
    expect(result2.status).toBe('error');
    expect(result2.error).toContain('messages array cannot be empty');
  });

  test('process calls AI and processes response', async () => {
    // Comment: Validates the full API processing flow
    // Restore the original method and mock it for this test
    APIMode.prototype.initializeProvider = jest.fn();
    APIMode.prototype.callAI = jest.fn().mockResolvedValue('AI response');

    const apiMode = new APIMode({ apiKey: 'test-key' });
    const processor = {
      prepareForAPI: jest.fn().mockResolvedValue({ 
        messages: [{ role: 'user', content: 'test' }]
      }),
      processAIResponse: jest.fn().mockResolvedValue({ result: 'processed' })
    };

    const result = await apiMode.process({ data: 'test' }, processor);

    expect(processor.prepareForAPI).toHaveBeenCalledWith({ data: 'test' });
    expect(apiMode.callAI).toHaveBeenCalledWith({ 
      messages: [{ role: 'user', content: 'test' }]
    });
    expect(processor.processAIResponse).toHaveBeenCalledWith('AI response', { data: 'test' });

    expect(result.mode).toBe('api');
    expect(result.status).toBe('success');
    expect(result.result).toEqual({ result: 'processed' });
    expect(result.metadata).toBeDefined();
  });

  test('process handles errors gracefully', async () => {
    // Comment: Validates that APIMode handles errors properly
    const apiMode = new APIMode({ apiKey: 'test-key' });
    const processor = {
      prepareForAPI: jest.fn().mockRejectedValue(new Error('Test error')),
      processAIResponse: jest.fn()
    };

    const result = await apiMode.process({}, processor);

    expect(result.mode).toBe('api');
    expect(result.status).toBe('error');
    expect(result.error).toBe('Test error');
  });
});

/**
 * Tests for CIMode class
 */
describe('CIMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to prevent output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('constructor sets default and custom options', () => {
    // Comment: Validates that CIMode constructor properly sets options
    const defaultMode = new CIMode();
    expect(defaultMode.outputFormat).toBe('json');

    const customMode = new CIMode({ 
      toolName: 'CI Tool',
      outputFormat: 'yaml'
    });
    expect(customMode.toolName).toBe('CI Tool');
    expect(customMode.outputFormat).toBe('yaml');
  });

  test('process uses analyzeForCI or falls back to analyzeForIDE', async () => {
    // Comment: Validates that CIMode can use either analyzeForCI or analyzeForIDE
    const ciMode = new CIMode();

    // Processor with analyzeForCI
    const processor1 = {
      analyzeForCI: jest.fn().mockResolvedValue({
        context: { summary: 'CI summary', issues: [] }
      })
    };

    await ciMode.process({}, processor1);
    expect(processor1.analyzeForCI).toHaveBeenCalled();

    // Processor with only analyzeForIDE
    const processor2 = {
      analyzeForIDE: jest.fn().mockResolvedValue({
        context: { summary: 'IDE summary' },
        analysis: 'Analysis'
      })
    };

    await ciMode.process({}, processor2);
    expect(processor2.analyzeForIDE).toHaveBeenCalled();
  });

  test('process throws error if processor lacks required methods', async () => {
    // Comment: Validates that CIMode requires the processor to have specific methods
    const ciMode = new CIMode();
    const invalidProcessor = {};

    await expect(ciMode.process({}, invalidProcessor))
      .rejects.toThrow('Processor must implement analyzeForCI or analyzeForIDE method');
  });

  test('process formats output for CI', async () => {
    // Comment: Validates that CIMode formats the output correctly
    const ciMode = new CIMode({ toolName: 'CI Tool' });
    const processor = {
      analyzeForCI: jest.fn().mockResolvedValue({
        context: { 
          summary: 'CI summary',
          issues: [{ severity: 'warning', message: 'Test warning' }],
          metrics: { coverage: 80 }
        }
      })
    };

    const result = await ciMode.process({}, processor);

    expect(result.mode).toBe('ci');
    expect(result.status).toBe('success');
    expect(result.tool).toBe('CI Tool');
    expect(result.summary).toBe('CI summary');
    expect(result.issues).toEqual([{ severity: 'warning', message: 'Test warning' }]);
    expect(result.metrics).toEqual({ coverage: 80 });
    expect(result.passed).toBe(true);
  });

  test('process determines passed status based on critical issues', async () => {
    // Comment: Validates that CIMode determines passed status correctly
    const ciMode = new CIMode();

    // No critical issues
    const processor1 = {
      analyzeForCI: jest.fn().mockResolvedValue({
        context: { 
          issues: [{ severity: 'warning', message: 'Test warning' }]
        }
      })
    };

    const result1 = await ciMode.process({}, processor1);
    expect(result1.passed).toBe(true);

    // With critical issues
    const processor2 = {
      analyzeForCI: jest.fn().mockResolvedValue({
        context: { 
          issues: [{ severity: 'critical', message: 'Critical error' }]
        }
      })
    };

    const result2 = await ciMode.process({}, processor2);
    expect(result2.passed).toBe(false);
  });

  test('process saves output to file if configured', async () => {
    // Comment: Validates that CIMode saves output to file when configured
    const ciMode = new CIMode({ 
      saveToFile: true,
      outputFile: 'custom-output.json'
    });

    const processor = {
      analyzeForCI: jest.fn().mockResolvedValue({
        context: { summary: 'CI summary' }
      })
    };

    await ciMode.process({}, processor);

    expect(fs.writeFile).toHaveBeenCalledWith(
      'custom-output.json',
      expect.any(String)
    );
  });
});
