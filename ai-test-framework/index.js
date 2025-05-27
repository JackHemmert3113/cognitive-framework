/**
 * AI Test Framework - Main Entry Point
 * Support everything, force nothing
 */

const { PlanningEngine } = require('./lib/planning-engine');
const { CodeAnalyzer } = require('./lib/code-analyzer');
const { TestGenerator } = require('./lib/test-generator');
const { MultiLanguageOrchestrator } = require('./lib/multi-language-orchestrator');
const { RequirementsAnalyzer } = require('./lib/requirements-analyzer');
const { SelfAwareAnalyzer } = require('./lib/self-aware-analyzer');
const { ReportGenerator } = require('./lib/report-generator');
const { ConfigLoader } = require('./lib/config-loader');

class AITestFramework {
  constructor(config = {}) {
    this.config = ConfigLoader.load(config);
    this.initializeComponents();
  }

  initializeComponents() {
    this.planner = new PlanningEngine(this.config);
    this.codeAnalyzer = new CodeAnalyzer(this.config);
    this.testGenerator = new TestGenerator(this.config);
    this.languageOrchestrator = new MultiLanguageOrchestrator(this.config);
    this.requirementsAnalyzer = new RequirementsAnalyzer(this.config);
    this.selfAwareAnalyzer = new SelfAwareAnalyzer(this.config);
    this.reportGenerator = new ReportGenerator(this.config);
  }

  async analyze(projectPath = process.cwd()) {
    console.log('🔍 Analyzing project...\n');

    // 1. Create plan if complex task
    const plan = await this.planner.createPlan({
      task: 'analyze-and-test',
      projectPath
    });

    // 2. Detect languages and frameworks
    const projectStructure = await this.languageOrchestrator.analyzePolyglotProject(projectPath);
    
    // 3. Analyze requirements if they exist
    const requirements = await this.requirementsAnalyzer.analyze(projectPath);
    
    // 4. Self-aware code analysis
    const codeAnalysis = await this.selfAwareAnalyzer.analyzeEverything(projectPath);
    
    // 5. Map requirements to code
    const mapping = await this.mapRequirementsToCode(requirements, codeAnalysis);
    
    return {
      plan,
      projectStructure,
      requirements,
      codeAnalysis,
      mapping
    };
  }

  async generateTests(analysis, options = {}) {
    console.log('🧪 Generating tests...\n');

    const tests = {
      generated: [],
      suggested: [],
      skipped: []
    };

    // Generate tests based on analysis
    for (const item of analysis.codeAnalysis.untested) {
      try {
        const testSuite = await this.testGenerator.generate(item, {
          requirements: this.findRelatedRequirements(item, analysis.requirements),
          language: item.language,
          framework: item.framework,
          ...options
        });

        tests.generated.push(testSuite);
      } catch (error) {
        tests.skipped.push({
          item,
          reason: error.message
        });
      }
    }

    return tests;
  }

  async run(command = 'analyze', options = {}) {
    try {
      switch (command) {
        case 'analyze':
          return await this.analyze(options.path);
          
        case 'generate':
          const analysis = await this.analyze(options.path);
          return await this.generateTests(analysis, options);
          
        case 'self-aware':
          return await this.selfAwareAnalyzer.analyzeEverything(options.path);
          
        case 'requirements':
          return await this.requirementsAnalyzer.analyze(options.path);
          
        case 'report':
          const fullAnalysis = await this.analyze(options.path);
          return await this.reportGenerator.generate(fullAnalysis);
          
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }

  // Helper methods
  async mapRequirementsToCode(requirements, codeAnalysis) {
    const mapping = new Map();
    
    for (const req of requirements.stories || []) {
      const relatedCode = this.findRelatedCode(req, codeAnalysis);
      mapping.set(req.id, relatedCode);
    }
    
    return mapping;
  }

  findRelatedRequirements(codeItem, requirements) {
    return requirements.stories?.filter(story => 
      this.isRelated(story, codeItem)
    ) || [];
  }

  findRelatedCode(requirement, codeAnalysis) {
    return codeAnalysis.files.filter(file =>
      this.isRelated(requirement, file)
    );
  }

  isRelated(item1, item2) {
    // Smart matching logic - could use AI here
    return true; // Simplified
  }
}

module.exports = AITestFramework;
