/**
 * Agent Instructions for Forge Framework Projects
 */

/**
 * AGENT_INSTRUCTIONS exported API
 * @example
 * AGENT_INSTRUCTIONS();
 */
// Added in v1.0
export const AGENT_INSTRUCTIONS = {
  typescript: {
    title: "TypeScript Command Usage",
    rules: [
      "NEVER use 'npx typescript' - it doesn't exist. Use 'npx tsc' instead.",
      "For type checking, prefer using package.json scripts over direct CLI commands.",
      "If 'check-types' script exists in package.json, use 'pnpm run check-types'.",
      "If no script exists, use 'npx tsc --noEmit' for type checking.",
      "For file-specific checks, use 'npx tsc --noEmit <filepath>'."
    ],
    examples: {
      correct: [
        "pnpm run check-types",
        "npx tsc --noEmit",
        "npx tsc --noEmit src/index.ts"
      ],
      incorrect: [
        "npx typescript --noEmit",
        "typescript --noEmit",
        "npx typescript"
      ]
    }
  },

  packageJson: {
    title: "Package.json Script Standards",
    rules: [
      "All TypeScript projects should have a 'check-types' script.",
      "The 'check-types' script should run 'tsc --noEmit'.",
      "Prefer running scripts with pnpm over direct npx commands."
    ],
    requiredScripts: {
      'check-types': 'tsc --noEmit'
    }
  },

  errorHandling: {
    title: "Common Error Fixes",
    errors: {
      "could not determine executable to run": {
        cause: "Using 'npx typescript' instead of 'npx tsc'",
        fix: "Replace with 'npx tsc' or use 'pnpm run check-types'"
      }
    }
  }
};

/**
 * getAgentInstructions exported API
 * @example
 * getAgentInstructions();
 */
// Added in v1.0
export function getAgentInstructions(context: 'pr-validation' | 'type-checking' | 'all'): string {
  const sections: string[] = [];

  if (context === 'all' || context === 'type-checking') {
    sections.push(`## ${AGENT_INSTRUCTIONS.typescript.title}`);
    sections.push('- ' + AGENT_INSTRUCTIONS.typescript.rules.join('\n- '));
    sections.push('\n### Correct Commands:');
    sections.push(AGENT_INSTRUCTIONS.typescript.examples.correct.map(cmd => `✅ ${cmd}`).join('\n'));
    sections.push('\n### Incorrect Commands:');
    sections.push(AGENT_INSTRUCTIONS.typescript.examples.incorrect.map(cmd => `❌ ${cmd}`).join('\n'));
  }

  if (context === 'all' || context === 'pr-validation') {
    sections.push(`\n## ${AGENT_INSTRUCTIONS.packageJson.title}`);
    sections.push('- ' + AGENT_INSTRUCTIONS.packageJson.rules.join('\n- '));
  }

  return sections.join('\n');
}