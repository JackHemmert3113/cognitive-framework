const { TestProcessor } = require('../lib/processor');

describe('TestProcessor', () => {
  test('analyzeForIDE returns analyzed path', async () => {
    const processor = new TestProcessor();
    const result = await processor.analyzeForIDE('my-project');
    expect(result).toEqual({ analyzed: 'my-project' });
  });

  test('processAIResponse maps ai output', async () => {
    const processor = new TestProcessor();
    const response = { choices: [{ message: { content: 'test content' } }] };
    const result = await processor.processAIResponse(response, 'path');
    expect(result).toEqual({ projectPath: 'path', generated: 'test content' });
  });
});
