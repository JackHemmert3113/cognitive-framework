/**
 * Cognitive Framework
 *
 * MIT License
 */
/**
 * index.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./index.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
'use strict';

const fs = require('fs').promises;
const path = require('path');

/**
 * ValidationError provides structured information about why validation failed
 * and the path within the requirement tree where the failure occurred.
 */
class ValidationError extends Error {
  constructor(message, path = []) {
    super(message);
    this.name = 'ValidationError';
    this.path = path.join('.');
  }
}

/**
 * RequirementsFramework parses and validates requirements according to the
 * canonical contract. It accepts either structured objects or markdown text and
 * ensures that required metadata is present and that the hierarchy is followed
 * (vision → business value → epic → feature → story → task).
 */
class RequirementsFramework {
  constructor(options = {}) {
    this.options = {
      mode: 'ide-driven',
      outputDir: './.ai',
      ...options
    };

    // child type allowed for each parent type
    this.hierarchy = {
      vision: 'business_value',
      business_value: 'epic',
      epic: 'feature',
      feature: 'story',
      story: 'task',
      task: null
    };

    this.typePrefixes = {
      vision: /^VIS-\d+$/i,
      business_value: /^BV-\d+$/i,
      epic: /^EPIC-\d+$/i,
      feature: /^FEAT-\d+$/i,
      story: /^ST-\d+$/i,
      task: /^TASK-\d+$/i
    };

    this.requiredMetadata = options.requiredMetadata || [
      'owner',
      'status',
      'priority',
      'estimate',
      'tags',
      'created',
      'lastUpdated',
      'team'
    ];
  }

  /**
   * Process a requirement object or markdown text. The returned requirement will
   * include parsed metadata and is validated against the contract hierarchy.
   *
   * @param {object|string} input - Requirement object or markdown text.
   * @returns {Promise<object>} Parsed and validated requirement.
   */
  async process(input) {
    const req =
      typeof input === 'string'
        ? this._parseText(input)
        : this._normalizeObject(input);

    this._validateRecursive(req);

    await this._generateFiles(req);

    return req;
  }

  _parseText(text) {
    const firstLine = text.split('\n')[0];
    const header = firstLine.match(/^(?:#\s*)?(Vision|Business Value|Epic|Feature|Story|Task)\s+(VIS|BV|EPIC|FEAT|ST|TASK)-(\d+):?\s*(.+)$/i);
    if (!header) {
      throw new Error('Unable to determine requirement type and id from text');
    }

    const type = header[1].toLowerCase().replace(' ', '_');
    const id = `${header[2].toUpperCase()}-${header[3]}`;
    const title = header[4].trim();

    const metaLabels = {
      owner: 'Owner',
      status: 'Status',
      priority: 'Priority',
      estimate: 'Estimate',
      tags: 'Tags',
      created: 'Created',
      lastUpdated: 'Last Updated',
      targetDate: 'Target Date',
      team: 'Team'
    };

    const metadata = {};
    for (const [key, label] of Object.entries(metaLabels)) {
      const safe = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\*\\*${safe}:\\*\\*\\s*(.+)`, 'i');
      const m = text.match(re);
      if (m) metadata[key] = m[1].trim();
    }

    const descMatch = text.match(/## Description\n([\s\S]+)/i);
    const description = descMatch ? descMatch[1].trim() : '';

    return { id, type, title, metadata, description };
  }

  _normalizeObject(obj) {
    const type = obj.type ? obj.type.toLowerCase().replace(/\s+/g, '_') : null;
    return { ...obj, type, metadata: obj.metadata || {} };
  }

  _validateRecursive(req, path = []) {
    this._validate(req, path);
    if (Array.isArray(req.children)) {
      for (let i = 0; i < req.children.length; i++) {
        const child = req.children[i];
        this._validateRecursive(child, path.concat(['children', i]));
      }
    }
  }

  _validate(req, path) {
    if (!req.type || !this.typePrefixes[req.type]) {
      throw new ValidationError(`Unknown or missing requirement type: ${req.type}`, path);
    }
    if (!req.id || !this.typePrefixes[req.type].test(req.id)) {
      throw new ValidationError(`Invalid id '${req.id}' for type '${req.type}'`, path);
    }

    const meta = req.metadata || {};
    for (const field of this.requiredMetadata) {
      if (!meta[field]) {
        throw new ValidationError(`Missing metadata field: ${field}`, path.concat(['metadata', field]));
      }
    }

    if (Array.isArray(req.children) && req.children.length) {
      const childType = this.hierarchy[req.type];
      if (!childType) {
        throw new ValidationError(`${req.type} cannot have children`, path);
      }
      for (const child of req.children) {
        if (child.type !== childType) {
          throw new ValidationError(`Child type '${child.type}' invalid for parent '${req.type}'`, path.concat(['children']));
        }
      }
    }
  }

  async _generateFiles(req) {
    const dir = this.options.outputDir;
    await fs.mkdir(dir, { recursive: true });

    const files = {
      [path.join(dir, 'analysis.md')]: this._generateAnalysis(req),
      [path.join(dir, 'acceptance_criteria.md')]: this._generateAcceptanceCriteria(req),
      [path.join(dir, 'PROMPTS.md')]: this._generatePrompts()
    };

    await Promise.all(
      Object.entries(files).map(([f, c]) => fs.writeFile(f, c))
    );
  }

  _generateAnalysis(req) {
    const ts = new Date().toISOString();
    const lines = [
      '# Requirement Analysis',
      `Generated: ${ts}`,
      '',
      `**ID:** ${req.id}`,
      `**Type:** ${req.type}`,
      req.title ? `**Title:** ${req.title}` : '',
      '',
      '## Metadata'
    ];
    for (const [k, v] of Object.entries(req.metadata || {})) {
      lines.push(`- **${k}:** ${v}`);
    }
    lines.push('', '## Description', req.description || '');
    return lines.join('\n');
  }

  _generateAcceptanceCriteria(req) {
    const lines = ['# Acceptance Criteria', ''];
    const walk = r => {
      if (Array.isArray(r.acceptanceCriteria)) {
        for (const c of r.acceptanceCriteria) {
          lines.push(`- ${c}`);
        }
      }
      if (Array.isArray(r.children)) {
        for (const child of r.children) walk(child);
      }
    };
    walk(req);
    return lines.join('\n');
  }

  _generatePrompts() {
    const dir = this.options.outputDir;
    return `# Requirement Prompts\n\n` +
      `## Analyze Requirement\n` +
      '```\n' +
      `Review ${path.join(dir, 'analysis.md')} for key details and summarize.\n` +
      '```\n\n' +
      `## Implement\n` +
      '```\n' +
      `Ensure all points in ${path.join(dir, 'acceptance_criteria.md')} are satisfied.\n` +
      '```\n';
  }
}

let runCLI;
try {
  ({ runCLI } = require('@cognitive/ai-test-framework'));
} catch {
  ({ runCLI } = require('../ai-test-framework'));
}

/**
 * Process a requirement and run the AI test framework.
 * @param {object|string} input Requirement object or markdown text
 * @param {string} [projectPath=process.cwd()] Project directory for tests
 * @param {object} [options] Framework options
 * @returns {Promise<object>} Result with requirement and test output
 */
async function processAndTest(input, projectPath = process.cwd(), options = {}) {
  const rf = new RequirementsFramework(options);
  const requirement = await rf.process(input);
  const testResult = await runCLI([projectPath]);
  return { requirement, testResult };
}

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = {
  RequirementsFramework,
  processAndTest,
  ValidationError
};
