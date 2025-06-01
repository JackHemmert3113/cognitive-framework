#!/usr/bin/env node
/**
 * Cognitive Framework
 *
 * MIT License
 */
"use strict";
const fs = require('fs/promises');
const path = require('path');
const REQ_REGEX = /(VIS|BV|EPIC|FEAT|ST|TASK|AC|REQ)-\d+/g;

async function collectRequirements(dir) {
  const result = new Map();
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.name.endsWith('.md')) {
        const content = await fs.readFile(full, 'utf8');
        const matches = content.match(REQ_REGEX);
        if (matches) {
          for (const id of matches) {
            if (!result.has(id)) result.set(id, full);
          }
        }
      }
    }
  }
  try {
    await walk(dir);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  return result;
}

async function collectTests(dir) {
  const result = new Map();
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.name.endsWith('.js') || e.name.endsWith('.ts')) {
        const content = await fs.readFile(full, 'utf8');
        const matches = content.match(REQ_REGEX);
        if (matches) {
          for (const id of matches) {
            if (!result.has(id)) result.set(id, []);
            result.get(id).push(full);
          }
        }
      }
    }
  }
  await walk(dir);
  return result;
}

async function main() {
  const requirementsDir = path.join('packages', 'requirements-old');
  const testsDir = '.';

  const requirements = await collectRequirements(requirementsDir);
  const tests = await collectTests(testsDir);

  const missingTests = [];
  for (const [id, file] of requirements.entries()) {
    if (!tests.has(id)) missingTests.push({ id, requirement: file });
  }

  const missingRequirements = [];
  for (const [id, files] of tests.entries()) {
    if (!requirements.has(id)) missingRequirements.push({ id, tests: files });
  }

  const genReqDir = path.join(requirementsDir, 'generated');
  await fs.mkdir(genReqDir, { recursive: true });
  const generatedRequirements = [];
  let counter = 1;
  for (const item of missingRequirements) {
    const genId = `ST-AUTO-${String(counter).padStart(3, '0')}`;
    counter++;
    const file = path.join(genReqDir, `${genId}.md`);
    const today = new Date().toISOString().split('T')[0];
    const content = `# Story ${genId}: Generated from tests\n\n**Owner:** [TBD]\n**Status:** Draft\n**Priority:** Medium\n**Estimate:** [TBD]\n**Tags:** auto\n**Created:** ${today}\n**Last Updated:** ${today}\n**Team:** [TBD]\n\n## Description\nGenerated based on tests:\n${item.tests.map(t => '- ' + t).join('\n')}\n`;
    await fs.writeFile(file, content);
    generatedRequirements.push(file);
  }

  const genTestDir = path.join('generated-tests');
  await fs.mkdir(genTestDir, { recursive: true });
  const generatedTests = [];
  for (const item of missingTests) {
    const id = item.id;
    const fileName = path.join(genTestDir, `${id}.test.js`);
    const content = `// Auto-generated test stub for ${id}\nconst { test } = require('node:test');\n\ntest('${id} - needs implementation', () => {\n  // TODO: implement tests for requirement ${id}\n});\n`;
    await fs.writeFile(fileName, content);
    generatedTests.push(fileName);
  }

  const summary = { generatedRequirements, generatedTests };
  await fs.writeFile('audit-summary.json', JSON.stringify(summary, null, 2));
  console.log('Audit complete. See audit-summary.json for details.');
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
