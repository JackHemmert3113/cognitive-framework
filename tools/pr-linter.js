#!/usr/bin/env node
/**
 * PR Linter for Cognitive Framework
 * Checks for required documentation files and file-level JSDoc headers.
 * Also prints emoji usage summary per file.
 *
 * MIT License
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const requiredDocs = ['README.md', 'MODES.md'];
const targetEmojis = ['🚀', '🔍', '🧪'];

let hasError = false;

requiredDocs.forEach(doc => {
  const docPath = path.join(repoRoot, doc);
  if (!fs.existsSync(docPath)) {
    console.error(`Missing required doc: ${doc}`);
    hasError = true;
  }
});

const emojiSummary = {};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      checkJs(full);
    }
  }
}

function checkJs(file) {
  const content = fs.readFileSync(file, 'utf8');
  const header = content.split(/\r?\n/).slice(0, 10).join('\n');
  if (!header.includes('/**')) {
    console.error(`Missing file header in: ${path.relative(repoRoot, file)}`);
    hasError = true;
  }
  const counts = {};
  for (const emoji of targetEmojis) {
    const match = content.match(new RegExp(emoji, 'g'));
    counts[emoji] = match ? match.length : 0;
  }
  emojiSummary[path.relative(repoRoot, file)] = counts;
}

walk(repoRoot);

console.log('Emoji usage summary:');
for (const [file, counts] of Object.entries(emojiSummary)) {
  const parts = targetEmojis.map(e => `${e} ${counts[e]}`);
  console.log(` - ${file}: ${parts.join(', ')}`);
}

if (hasError) {
  console.error('PR Linter found issues.');
  process.exitCode = 1;
}
