/**
 * Default Configuration
 * Support everything, force nothing
 */

module.exports = {
  // Project detection
  project: {
    type: 'auto', // auto-detect project type
    languages: ['javascript', 'typescript', 'python'],
    frameworks: ['react', 'vue', 'angular', 'express', 'fastapi']
  },

  // Requirements support
  requirements: {
    formats: ['traditional', 'gherkin', 'markdown', 'yaml', 'natural'],
    locations: [
      'requirements/**/*',
      'stories/**/*',
      'docs/requirements/**/*',
      '.github/issues/**/*'
    ],
    preferredFormat: null, // no preference, support all
    hierarchy: ['vision', 'epic', 'story', 'task']
  },

  // Test generation
  testGeneration: {
    strategy: 'modern', // Testing Trophy, not Pyramid
    distribution: {
      integration: 40,
      component: 30,
      e2e: 20,
      unit: 10
    },

    tools: {
      javascript: {
        runner: 'vitest',
        component: '@testing-library/react',
        e2e: 'playwright',
        api: 'supertest'
      },
      python: {
        runner: 'pytest',
        api: 'fastapi.testclient',
        ml: 'pytest-ml'
      }
    }
  },

  // AI configuration
  ai: {
    mode: 'auto', // auto-detect IDE vs API
    provider: process.env.AI_PROVIDER || 'openai',
    model: process.env.AI_MODEL || 'gpt-4',

    ide: {
      generateAutomation: true,
      supportedIDEs: ['vscode', 'cursor', 'jetbrains']
    },

    features: {
      generateTests: true,
      explainFailures: true,
      suggestImprovements: true,
      validateRequirements: true
    }
  },

  // Self-aware mode
  selfAware: {
    enabled: true,
    noExcuses: true,
    scanEverything: true,
    reportUntested: true
  },

  // Output configuration
  output: {
    testLocation: 'alongside', // tests next to source
    structure: {
      unit: '{name}.test.{ext}',
      component: '{name}.test.{ext}',
      integration: '{name}.integration.test.{ext}',
      e2e: 'e2e/{feature}/{name}.e2e.test.{ext}'
    }
  }
};