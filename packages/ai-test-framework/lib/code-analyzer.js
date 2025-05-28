/**
 * Cognitive Framework
 *
 * MIT License
 */

// Simple code analysis utilities
'use strict';

const fs = require('fs');

/**
 * Analyze basic metrics about a JavaScript file.
 * @param {string} file - Path to the file to analyze.
 * @returns {object} Basic statistics about the file.
 */
function analyzeCode(file) {
  const code = fs.readFileSync(file, 'utf8');
  const lines = code.split(/\r?\n/);
  return {
    file,
    lines: lines.length,
    functions: (code.match(/function\s+\w+|=>\s*{|async\s+\w+/g) || []).length,
    classes: (code.match(/class\s+\w+/g) || []).length,
    exports: (code.match(/module\.exports|export\s+(default|const|function|class)/g) || []).length,
    comments: (code.match(/\/\/|\/\*|\*\//g) || []).length
  };
}

module.exports = { analyzeCode };
