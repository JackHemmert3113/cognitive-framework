/**
 * End-to-End Example for Cognitive Framework
 *
 * Demonstrates processing a requirement and running tests in dual mode.
 *
 * MIT License
 */

const path = require('path');
const { processAndTest } = require('@cognitive/requirements');

async function main() {
  const requirementPath = path.join(__dirname, 'REQ-demo.md');
  const projectPath = path.join(__dirname, 'project');
  const result = await processAndTest(requirementPath, projectPath, {
    outputDir: path.join(projectPath, '.ai')
  });
  console.log('Requirement processed:', result.requirement.id);
  console.log('Test exit code:', result.testResult.results.code);
}

main().catch(err => {
  console.error('End-to-end example failed:', err);
});
