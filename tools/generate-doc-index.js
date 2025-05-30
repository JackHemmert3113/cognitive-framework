#!/usr/bin/env node
/**
 * generate-doc-index.js - Cognitive Framework module
 *
 * Generates docs/MASTER_DOC_INDEX.md linking to all markdown files in the repo.
 *
 * MIT License
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const output = path.join(repoRoot, 'docs', 'MASTER_DOC_INDEX.md');

function findMarkdownFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function getTitle(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      return trimmed.replace(/^#+\s*/, '').trim();
    }
  }
  return path.basename(file);
}

function generate() {
  const files = findMarkdownFiles(repoRoot).sort();
  let md = '<!--\nMIT License\n-->\n';
  md += '# Master Documentation Index\n\n';
  for (const file of files) {
    const rel = path.relative(repoRoot, file);
    const title = getTitle(file);
    md += `- [${title}](${rel})\n`;
  }
  fs.writeFileSync(output, md, 'utf8');
  console.log(`Updated ${output}`);
}

if (require.main === module) {
  generate();
}
