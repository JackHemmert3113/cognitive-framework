#!/usr/bin/env node
/**
 * Cognitive Framework
 *
 * MIT License
 */
"use strict";

const path = require("path");
const { createAITestFramework } = require("./index");

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npm run analyze <file>");
    process.exit(1);
  }

  const resolved = path.resolve(file);
  const testResults = {
    projectPath: resolved,
    files: [resolved]
  };

  const framework = createAITestFramework({ mode: "ide" });
  const result = await framework.process(testResults);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
