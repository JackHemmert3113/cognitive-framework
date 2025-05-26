/**
 * TypeScript Command Helper for AI Agents
 */

import { CommandOptions } from '../types';

export const TYPESCRIPT_COMMANDS = {
  // Type checking commands
  typeCheck: {
    all: 'npx tsc --noEmit',
    file: (filepath: string) => `npx tsc --noEmit ${filepath}`,
    watch: 'npx tsc --noEmit --watch',
    strict: 'npx tsc --noEmit --strict'
  },

  // Build commands
  build: {
    default: 'npx tsc',
    watch: 'npx tsc --watch',
    clean: 'rm -rf dist && npx tsc'
  },

  // Package.json script recommendations
  recommendedScripts: {
    'check-types': 'tsc --noEmit',
    'check-types:watch': 'tsc --noEmit --watch',
    'build': 'tsc',
    'build:watch': 'tsc --watch'
  }
} as const;

export function getTypeScriptCommand(operation: 'typeCheck' | 'build', options?: CommandOptions): string {
  if (operation === 'typeCheck') {
    if (options?.file) {
      return TYPESCRIPT_COMMANDS.typeCheck.file(options.file);
    }
    if (options?.watch) {
      return TYPESCRIPT_COMMANDS.typeCheck.watch;
    }
    if (options?.strict) {
      return TYPESCRIPT_COMMANDS.typeCheck.strict;
    }
    return TYPESCRIPT_COMMANDS.typeCheck.all;
  }

  if (operation === 'build') {
    if (options?.watch) {
      return TYPESCRIPT_COMMANDS.build.watch;
    }
    return TYPESCRIPT_COMMANDS.build.default;
  }

  return TYPESCRIPT_COMMANDS.typeCheck.all;
}