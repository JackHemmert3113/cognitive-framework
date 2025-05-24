const { DualMode } = require('@forge/dual-mode');

// Define a simple processor
const processor = {
  // For IDE mode
  async analyzeForIDE(data) {
    return {
      context: { 
        type: 'analysis',
        data: data
      },
      analysis: "# Analysis Results\n\nThis is a simple analysis of the provided data.",
      prompts: "What insights can you provide about this data?"
    };
  },
  
  // For API mode
  async prepareForAPI(data) {
    return {
      messages: [
        { role: "system", content: "You are a helpful assistant that analyzes data." },
        { role: "user", content: `Please analyze this data: ${JSON.stringify(data)}` }
      ]
    };
  },
  
  async processAIResponse(response, originalData) {
    // Extract the content from the AI response
    const content = response.choices[0].message.content;
    
    return {
      originalData,
      aiAnalysis: content,
      timestamp: new Date().toISOString()
    };
  }
};

// Create a dual-mode tool
const myTool = DualMode.create('MyTool', processor, {
  mode: 'auto',  // 'ide', 'api', or 'auto'
  // Additional configuration options
  outputDir: '.ai/my-tool',
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

// Example usage
async function main() {
  const data = {
    id: 123,
    name: "Sample Project",
    metrics: {
      lines: 1000,
      files: 25,
      complexity: "medium"
    }
  };
  
  console.log("Processing data...");
  
  try {
    // Use it - mode is automatically detected
    const result = await myTool.process(data);
    
    console.log("Processing complete!");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error processing data:", error);
  }
}

main();