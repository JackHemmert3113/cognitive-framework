/**
 * Standard package.json template for Forge Framework projects
 */

import { PackageJsonTemplate } from '../types';

export const FORGE_PACKAGE_SCRIPTS: PackageJsonTemplate = {
  scripts: {
    // Type checking - REQUIRED for agent compatibility
    'check-types': 'tsc --noEmit',
    'check-types:watch': 'tsc --noEmit --watch',

    // Building
    'build': 'tsc',
    'build:watch': 'tsc --watch',

    // Development
    'dev': 'tsx watch src/index.ts',
    'start': 'node dist/index.js',

    // Testing
    'test': 'jest',
    'test:watch': 'jest --watch',

    // Linting
    'lint': 'eslint src --ext .ts,.tsx',
    'lint:fix': 'eslint src --ext .ts,.tsx --fix',

    // Pre-commit checks
    'precommit': 'pnpm run check-types && pnpm run lint && pnpm run test'
  },
  devDependencies: {
    'typescript': '^5.0.0',
    '@types/node': '^20.0.0'
  }
};

export function mergePackageScripts(
  existing: any,
  template: PackageJsonTemplate = FORGE_PACKAGE_SCRIPTS
): any {
  return {
    ...existing,
    scripts: {
      ...template.scripts,
      ...existing.scripts // Preserve custom scripts
    },
    devDependencies: {
      ...template.devDependencies,
      ...existing.devDependencies
    }
  };
}