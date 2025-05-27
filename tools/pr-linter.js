/**
 * pr-linter.js - Cognitive Framework module
 * Auto generated documentation block.
 *
 * @example
 * // require or import
 * const mod = require('./pr-linter.js');
 */
// Added in v1.0

// 🚀 Quick Start
// 🔍 Internal Design
// 🧪 Tests
// ⚙️ Config
// 💡 Helpers or utilities
#!/usr/bin/env node
/**
 * PR Linter for Cognitive Framework
 *
 * Ensures required docs exist, validates file level headers,
 * and summarizes emoji usage.
 *
 * MIT License
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const requiredDocs = ['README.md', 'MODES.md'];
const targetEmojis = ['🚀', '🔍', '🧪', '⚙️'];

let hasError = false;
const emojiCounts = Object.fromEntries(targetEmojis.map(e => [e, 0]));

function checkRequiredDocs() {
  for (const doc of requiredDocs) {
    const docPath = path.join(repoRoot, doc);
    if (!fs.existsSync(docPath)) {
      console.error(`❌ Missing file: ${doc}`);
      console.error(`Create a placeholder using tools/templates/${doc}.template.md`);
      hasError = true;
    }
  }
}

function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    console.warn(`⚠️ Could not read: ${path.relative(repoRoot, dir)}`);
    return;
  }

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
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (err) {
    console.warn(`⚠️ Could not read: ${path.relative(repoRoot, file)}`);
    return;
  }
  const lines = content.split(/\r?\n/).slice(0, 10);
  const firstNonEmpty = lines.find(l => l.trim().length > 0);
  if (!firstNonEmpty || !firstNonEmpty.trim().startsWith('/**')) {
    console.error(`❌ Missing header: ${path.relative(repoRoot, file)}`);
    hasError = true;
  } else {
    console.log(`✅ Valid header: ${path.relative(repoRoot, file)}`);
  }

  for (const emoji of targetEmojis) {
    const match = content.match(new RegExp(emoji, 'g'));
    if (match) emojiCounts[emoji] += match.length;
  }
}

function printEmojiSummary() {
  console.log('Emoji usage summary:');
  for (const e of targetEmojis) {
    console.log(` ${e} ${emojiCounts[e]}`);
  }
}

checkRequiredDocs();
walk(repoRoot);
printEmojiSummary();

if (hasError) {
  console.error('PR Linter found issues.');
  process.exit(1);
} else {
  console.log('✅ PR Linter Passed');
  process.exit(0);
}
