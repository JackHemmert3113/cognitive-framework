#!/usr/bin/env node
/**
 * Cognitive Framework
 *
 * MIT License
 */
/**
 * cli.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./cli.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
'use strict';

const fs = require('fs/promises');
const { processAndTest } = require('..');

async function runCLI(args = process.argv.slice(2)) {
  const reqFile = args[0];
  const projectPath = args[1] || process.cwd();
  if (!reqFile) {
    console.error('Usage: cogreq <requirement-file> [project]');
    process.exit(1);
  }
  const input = await fs.readFile(reqFile, 'utf8');
  const result = await processAndTest(input, projectPath);
  return result;
}

if (require.main === module) {
  runCLI().then(r => {
    console.log(JSON.stringify(r, null, 2));
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runCLI };

