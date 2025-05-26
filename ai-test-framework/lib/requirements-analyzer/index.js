const fs = require('fs').promises;
const path = require('path');
const { FlexibleRequirementsParser } = require('./flexible-parser');

class RequirementsAnalyzer {
  constructor(config) {
    this.config = config;
    this.parser = new FlexibleRequirementsParser();
    this.requirementPaths = config.requirements?.locations || [
      'requirements/**/*',
      'stories/**/*',
      'docs/requirements/**/*',
      '.github/issues/**/*'
    ];
  }

  async analyze(projectPath) {
    console.log('📋 Analyzing requirements...');

    const analysis = {
      format: 'mixed', // Can have multiple formats
      requirements: [],
      coverage: {
        total: 0,
        withTests: 0,
        withoutTests: 0,
        percentage: 0
      },
      hierarchy: {}
    };

    // Find all requirement files
    const files = await this.findRequirementFiles(projectPath);

    // Parse each file
    for (const file of files) {
      try {
        const requirement = await this.parser.parseRequirement(file);
        analysis.requirements.push(requirement);
      } catch (error) {
        console.warn(`⚠️  Could not parse ${file}: ${error.message}`);
      }
    }

    // Build hierarchy
    analysis.hierarchy = this.buildHierarchy(analysis.requirements);

    // Calculate coverage
    analysis.coverage = await this.calculateCoverage(analysis.requirements);

    return analysis;
  }

  async findRequirementFiles(projectPath) {
    const files = [];

    for (const pattern of this.requirementPaths) {
      const globPattern = path.join(projectPath, pattern);
      // In real implementation, use glob package
      // For now, simplified version
      try {
        const dir = path.dirname(globPattern);
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isFile()) {
            files.push(path.join(dir, entry.name));
          }
        }
      } catch (error) {
        // Directory doesn't exist, skip
      }
    }

    return files;
  }

  buildHierarchy(requirements) {
    const hierarchy = {
      vision: [],
      epics: [],
      stories: [],
      tasks: []
    };

    for (const req of requirements) {
      const level = this.detectLevel(req);
      hierarchy[level].push(req);
    }

    return hierarchy;
  }

  detectLevel(requirement) {
    // Simple heuristic - could be improved
    if (requirement.content?.includes('vision')) return 'vision';
    if (requirement.content?.includes('epic')) return 'epics';
    if (requirement.type === 'traditional' || requirement.type === 'gherkin') return 'stories';
    return 'tasks';
  }

  async calculateCoverage(requirements) {
    let withTests = 0;
    let withoutTests = 0;

    for (const req of requirements) {
      if (await this.hasTests(req)) {
        withTests++;
      } else {
        withoutTests++;
      }
    }

    const total = requirements.length;
    const percentage = total > 0 ? (withTests / total * 100).toFixed(1) : 0;

    return {
      total,
      withTests,
      withoutTests,
      percentage
    };
  }

  async hasTests(requirement) {
    // Check if tests exist for this requirement
    // Simplified - in real implementation, would check actual test files
    return Math.random() > 0.5; // Placeholder
  }
}

module.exports = { RequirementsAnalyzer };