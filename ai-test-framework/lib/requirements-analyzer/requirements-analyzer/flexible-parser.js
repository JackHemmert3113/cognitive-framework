/**
 * Flexible Requirements Parser
 * Support everything, force nothing
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class FlexibleRequirementsParser {
  constructor() {
    this.parsers = {
      traditional: new TraditionalStoryParser(),
      gherkin: new GherkinParser(),
      markdown: new MarkdownParser(),
      yaml: new YamlParser(),
      natural: new NaturalLanguageParser()
    };
  }

  async parseRequirement(file) {
    const content = await fs.readFile(file, 'utf8');
    const format = this.detectFormat(content, file);

    console.log(`📝 Parsing ${format} format: ${path.basename(file)}`);

    const parser = this.parsers[format] || this.parsers.natural;
    return parser.parse(content, file);
  }

  detectFormat(content, filename) {
    // Check file extension
    if (filename.endsWith('.feature')) return 'gherkin';
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return 'yaml';

    // Check content patterns
    if (/Feature:.*Scenario:/is.test(content)) return 'gherkin';
    if (/As a.*I want.*So that/is.test(content)) return 'traditional';
    if (/^#+ /m.test(content)) return 'markdown';

    // Default to natural language
    return 'natural';
  }
}

class TraditionalStoryParser {
  parse(content, file) {
    const story = {
      type: 'traditional',
      file: file,
      persona: this.extract(content, /As an?\s+(.+?)\s+I want/i),
      want: this.extract(content, /I want\s+(.+?)\s+So that/i),
      benefit: this.extract(content, /So that\s+(.+?)$/im),
      acceptanceCriteria: this.extractCriteria(content),
      content: content
    };

    return story;
  }

  extract(content, pattern) {
    const match = content.match(pattern);
    return match ? match[1].trim() : null;
  }

  extractCriteria(content) {
    const criteria = [];

    // Look for AC section
    const acSection = content.match(/Acceptance Criteria:?\s*([\s\S]+?)(?=\n#|\n\n[A-Z]|$)/i);
    if (acSection) {
      const lines = acSection[1].split('\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.match(/^acceptance criteria/i)) {
          criteria.push(trimmed.replace(/^[-*•]\s*/, ''));
        }
      });
    }

    return criteria;
  }
}

class GherkinParser {
  parse(content, file) {
    // In real implementation, would use @cucumber/gherkin
    // Simplified version here
    const feature = {
      type: 'gherkin',
      file: file,
      feature: this.extract(content, /Feature:\s*(.+)/),
      scenarios: this.extractScenarios(content),
      content: content
    };

    return feature;
  }

  extract(content, pattern) {
    const match = content.match(pattern);
    return match ? match[1].trim() : null;
  }

  extractScenarios(content) {
    const scenarios = [];
    const scenarioMatches = content.matchAll(/Scenario:\s*(.+)/g);

    for (const match of scenarioMatches) {
      scenarios.push({
        name: match[1],
        steps: [] // Would parse Given/When/Then in real implementation
      });
    }

    return scenarios;
  }
}

class MarkdownParser {
  parse(content, file) {
    return {
      type: 'markdown',
      file: file,
      title: this.extractTitle(content),
      sections: this.extractSections(content),
      content: content
    };
  }

  extractTitle(content) {
    const match = content.match(/^#\s+(.+)/m);
    return match ? match[1] : 'Untitled';
  }

  extractSections(content) {
    const sections = [];
    const sectionMatches = content.matchAll(/^##\s+(.+)/gm);

    for (const match of sectionMatches) {
      sections.push(match[1]);
    }

    return sections;
  }
}

class YamlParser {
  parse(content, file) {
    try {
      const data = yaml.load(content);
      return {
        type: 'yaml',
        file: file,
        data: data,
        content: content
      };
    } catch (error) {
      return {
        type: 'yaml',
        file: file,
        error: error.message,
        content: content
      };
    }
  }
}

class NaturalLanguageParser {
  async parse(content, file) {
    // Use AI to extract structure from natural language
    const prompt = `
Extract test requirements from this text:

${content}

Return as JSON with:
- what: What functionality is described
- who: Who will use it
- why: Why it's needed
- testable_requirements: Array of things that need testing
- technical_notes: Any technical details mentioned
`;

    // This would use AI in production
    return {
      type: 'natural',
      file: file,
      content: content,
      extracted: await this.extractWithAI(prompt)
    };
  }

  async extractWithAI(prompt) {
    // Placeholder for AI extraction
    // In real implementation, this would call OpenAI or similar
    return {
      what: 'Extracted functionality',
      who: 'Extracted user',
      why: 'Extracted benefit',
      testable_requirements: []
    };
  }
}

module.exports = {
  FlexibleRequirementsParser,
  TraditionalStoryParser,
  GherkinParser,
  MarkdownParser,
  YamlParser,
  NaturalLanguageParser
};