/**
 * Example: Using AI Dual Mode for documentation generation
 */

const { AIDualMode } = require('../index');
const fs = require('fs').promises;
const path = require('path');

// Documentation processor
const docProcessor = {
  async analyzeForIDE(files) {
    const analysis = await this.analyzeCodebase(files);
    
    return {
      context: {
        totalFiles: files.length,
        documented: analysis.documented,
        undocumented: analysis.undocumented,
        coverage: analysis.docCoverage,
        complexity: analysis.complexity
      },
      analysis: `# Documentation Analysis

## Coverage
- Files analyzed: ${files.length}
- Documentation coverage: ${analysis.docCoverage}%
- Missing docs: ${analysis.undocumented.length} files

## Priority Files
${analysis.undocumented.slice(0, 5).map(f => `- ${f}`).join('\n')}

## Recommendations
- Add JSDoc comments to all public functions
- Create README files for each module
- Update outdated documentation
`,
      prompts: `- "Generate JSDoc for ${analysis.undocumented[0]}"
- "Create comprehensive README for this project"
- "Update documentation for changed APIs"`
    };
  },
  
  async prepareForAPI(files) {
    const fileContents = await this.readFiles(files.slice(0, 5)); // Limit for API
    
    return {
      messages: [
        {
          role: 'system',
          content: 'You are a documentation expert. Generate clear, comprehensive documentation.'
        },
        {
          role: 'user',
          content: `Generate documentation for these files:\n${JSON.stringify(fileContents, null, 2)}`
        }
      ],
      maxTokens: 3000
    };
  },
  
  async processAIResponse(response, files) {
    return {
      documentation: response,
      filesDocumented: files.length,
      timestamp: new Date().toISOString()
    };
  },
  
  async analyzeCodebase(files) {
    // Simplified analysis
    const documented = files.filter(f => f.includes('.md') || f.includes('README'));
    const undocumented = files.filter(f => !documented.includes(f) && f.endsWith('.js'));
    
    return {
      documented,
      undocumented,
      docCoverage: Math.round((documented.length / files.length) * 100),
      complexity: { average: 5, max: 15 } // Placeholder
    };
  },
  
  async readFiles(files) {
    const contents = {};
    for (const file of files) {
      try {
        contents[file] = await fs.readFile(file, 'utf8');
      } catch (error) {
        contents[file] = 'Unable to read file';
      }
    }
    return contents;
  }
};

// Example usage
async function runExample() {
  const files = [
    'src/index.js',
    'src/utils.js',
    'src/api/users.js',
    'README.md',
    'docs/API.md'
  ];
  
  const docGen = new AIDualMode({
    toolName: 'Documentation Generator',
    processor: docProcessor,
    mode: 'ide' // Force IDE mode for demo
  });
  
  try {
    const result = await docGen.process(files);
    console.log('📚 Documentation analysis complete!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  runExample();
}

module.exports = { docProcessor };
