#!/usr/bin/env node
'use strict';

let DualMode;
try {
  ({ DualMode } = require('@cognitive/dual-mode'));
} catch {
  ({ DualMode } = require('../../dual-mode'));
}
const { TestProcessor } = require('../lib/processor');

/**
 * Run the test framework CLI.
 * Processes the given project path in IDE or API mode.
 */
function runCLI(args = process.argv.slice(2)) {
  const projectPath = args[0] || process.cwd();
  const mode = process.env.TEST_FRAMEWORK_MODE || 'ide';
  const tool = DualMode.create('test-framework', new TestProcessor(), { mode });
  return tool.process(projectPath);
}

if (require.main === module) {
  runCLI().then(result => {
    console.log(JSON.stringify(result, null, 2));
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runCLI };
