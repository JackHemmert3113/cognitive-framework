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
const { RequirementsFramework, processAndTest } = require('..');

async function runCLI(args = process.argv.slice(2)) {
  const opts = { outputDir: null, skipTests: false, format: 'json' };
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    switch (a) {
      case '--help':
      case '-h':
        console.log(`Usage: cogreq [options] <requirement-file> [project]\n\n` +
          `Options:\n` +
          `  --output-dir <dir>  Directory for generated context files\n` +
          `  --skip-tests        Process requirement without running tests\n` +
          `  --format <fmt>      Output format (json|text)\n` +
          `  -h, --help          Show help`);
        return;
      case '--output-dir':
        opts.outputDir = args[++i];
        break;
      case '--skip-tests':
        opts.skipTests = true;
        break;
      case '--format':
        opts.format = args[++i] || 'json';
        break;
      default:
        if (a.startsWith('-')) {
          console.error(`Unknown option ${a}`);
          process.exit(1);
        }
        positional.push(a);
    }
  }

  const reqFile = positional[0];
  const projectPath = positional[1] || process.cwd();
  if (!reqFile) {
    console.error('Usage: cogreq [options] <requirement-file> [project]');
    process.exit(1);
  }

  const input = await fs.readFile(reqFile, 'utf8');

  const options = {};
  if (opts.outputDir) options.outputDir = opts.outputDir;

  if (opts.skipTests) {
    const rf = new RequirementsFramework(options);
    const req = await rf.process(input);
    if (opts.format === 'json') {
      console.log(JSON.stringify(req, null, 2));
    } else {
      console.log(`Processed requirement ${req.id}`);
    }
    return { requirement: req };
  }

  const result = await processAndTest(input, projectPath, options);
  if (opts.format === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Processed requirement ${result.requirement.id}`);
    console.log(result.testResult);
  }
  return result;
}

if (require.main === module) {
  runCLI().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runCLI };

