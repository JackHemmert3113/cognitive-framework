#!/usr/bin/env node
/**
 * Cognitive Framework
 *
 * MIT License
 */

// Simple wrapper to invoke the requirements CLI from the monorepo root
'use strict';

(async () => {
  let runCLI;
  try {
    ({ runCLI } = require('@cognitive/requirements/bin/cli'));
  } catch {
    ({ runCLI } = require('../packages/requirements/bin/cli'));
  }

  try {
    const result = await runCLI();
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
