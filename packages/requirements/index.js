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

    this.requiredMetadata = [
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
    return req;
  }

  _parseText(text) {
    const header = text.match(/^#?\s*(Vision|Business Value|Epic|Feature|Story|Task)\s+(VIS|BV|EPIC|FEAT|ST|TASK)-(\d+):?\s*(.+)$/i);
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
      const m = text.match(new RegExp(`\*\*${label}:\*\*\s*(.+)`, 'i'));
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

  _validateRecursive(req) {
    this._validate(req);
    if (Array.isArray(req.children)) {
      for (const child of req.children) {
        this._validateRecursive(child);
      }
    }
  }

  _validate(req) {
    if (!req.type || !this.typePrefixes[req.type]) {
      throw new Error(`Unknown or missing requirement type: ${req.type}`);
    }
    if (!req.id || !this.typePrefixes[req.type].test(req.id)) {
      throw new Error(`Invalid id '${req.id}' for type '${req.type}'`);
    }

    const meta = req.metadata || {};
    for (const field of this.requiredMetadata) {
      if (!meta[field]) {
        throw new Error(`Missing metadata field: ${field}`);
      }
    }

    if (Array.isArray(req.children) && req.children.length) {
      const childType = this.hierarchy[req.type];
      if (!childType) {
        throw new Error(`${req.type} cannot have children`);
      }
      for (const child of req.children) {
        if (child.type !== childType) {
          throw new Error(`Child type '${child.type}' invalid for parent '${req.type}'`);
        }
      }
    }
  }
}

/**
 * exported exported API
 * @example
 * exported();
 */
// Added in v1.0
module.exports = {
  RequirementsFramework
};
