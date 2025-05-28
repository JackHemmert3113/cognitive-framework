#!/usr/bin/env node
/**
 * Cognitive Framework
 *
 * MIT License
 */
'use strict';

const { analyzeCode } = require('./lib/code-analyzer');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node analyze-code.js <file>');
  process.exit(1);
}

try {
  const stats = analyzeCode(file);
  console.log(`\n📊 Analysis of ${stats.file}:`);
  console.log(`- Lines: ${stats.lines}`);
  console.log(`- Functions: ${stats.functions}`);
  console.log(`- Classes: ${stats.classes}`);
  console.log(`- Exports: ${stats.exports}`);
  console.log(`- Comments: ${stats.comments}`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
