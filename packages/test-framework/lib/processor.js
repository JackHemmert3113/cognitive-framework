'use strict';

/**
 * TestProcessor - minimal AI-powered testing processor.
 * In IDE mode it performs a simple analysis, while in API mode it
 * prepares a prompt for an AI service and processes the mock response.
 */
class TestProcessor {
  async analyzeForIDE(projectPath) {
    return { analyzed: projectPath };
  }

  async prepareForAPI(projectPath) {
    return { prompt: `Generate tests for ${projectPath}` };
  }

  async processAIResponse(aiResponse, projectPath) {
    const content = aiResponse.choices?.[0]?.message?.content || '';
    return { projectPath, generated: content };
  }
}

module.exports = { TestProcessor };
