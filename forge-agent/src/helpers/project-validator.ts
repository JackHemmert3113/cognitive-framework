/**
 * Project Validator for AI Agents
 */

import fs from 'fs';
import path from 'path';
import { ValidationResult, ValidationIssue, ScriptCheckResult } from '../types';
import { TYPESCRIPT_COMMANDS } from './typescript-commands';

export async function validateProjectSetup(projectPath: string): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];
  const fixes: string[] = [];

  // Check package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const { hasCheckTypes, missingScripts } = hasRecommendedScripts(packageJson);

    if (!hasCheckTypes) {
      issues.push({
        type: 'missing-script',
        message: 'Missing "check-types" script in package.json',
        fix: 'Add "check-types": "tsc --noEmit" to scripts section'
      });

      fixes.push(`Add to package.json scripts:
{
  "scripts": {
    "check-types": "tsc --noEmit"
  }
}`);
    }
  } else {
    issues.push({
      type: 'missing-file',
      message: 'Missing package.json file',
      fix: 'Create a package.json file with pnpm init'
    });
  }

  // Check tsconfig.json
  const tsconfigPath = path.join(projectPath, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    issues.push({
      type: 'missing-file',
      message: 'Missing tsconfig.json file',
      fix: 'Create a tsconfig.json file with appropriate settings'
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
    fixes
  };
}

export function hasRecommendedScripts(packageJson: any): ScriptCheckResult {
  const scripts = packageJson.scripts || {};
  const missingScripts: string[] = [];

  Object.entries(TYPESCRIPT_COMMANDS.recommendedScripts).forEach(([name, command]) => {
    if (!scripts[name] || scripts[name] !== command) {
      missingScripts.push(name);
    }
  });

  return {
    hasCheckTypes: !!scripts['check-types'],
    missingScripts
  };
}

export function generateFixScript(issues: ValidationIssue[]): string {
  const fixes: string[] = [];

  for (const issue of issues) {
    if (issue.type === 'missing-script') {
      fixes.push(`
# Fix: ${issue.message}
pnpm pkg set scripts.check-types="tsc --noEmit"
`);
    }
  }

  return fixes.join('\n');
}