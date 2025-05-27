class OpenAI {
  constructor() {}
  chat = {
    completions: {
      create: async () => ({
        choices: [{ message: { content: JSON.stringify({ tests: ['mock-test'] }) } }]
      })
    }
  };
}
module.exports = OpenAI;
