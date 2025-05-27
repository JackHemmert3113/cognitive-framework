/**
 * TSConfig Validator
 */

import fs from 'fs';
import path from 'path';
import { ValidationIssue, TsConfigValidationResult } from '../types';

/**
 * validateTsConfig exported API
 * @example
 * validateTsConfig();
 */
// Added in v1.0
export async function validateTsConfig(projectPath: string): Promise<TsConfigValidationResult> {
  const issues: ValidationIssue[] = [];
  const fixes: string[] = [];
  let tsconfig: any = null;

  // Check for tsconfig.json in expected locations
  const possiblePaths = [
    path.join(projectPath, 'tsconfig.json'),
    path.join(projectPath, 'src', 'tsconfig.json'), // Too deep!
    path.join(projectPath, 'config', 'tsconfig.json') // Non-standard
  ];

  let tsconfigPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      tsconfigPath = p;
      break;
    }
  }

  if (!tsconfigPath) {
    issues.push({
      type: 'missing-file',
      message: 'No tsconfig.json found',
      fix: 'Create tsconfig.json in project root'
    });

    fixes.push(`Create tsconfig.json with:
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`);
  } else {
    // Check if tsconfig is in the wrong location
    const relativePath = path.relative(projectPath, tsconfigPath);
    if (relativePath !== 'tsconfig.json') {
      issues.push({
        type: 'incorrect-command',
        message: `tsconfig.json is in non-standard location: ${relativePath}`,
        fix: 'Move tsconfig.json to project root'
      });

      fixes.push(`mv ${relativePath} tsconfig.json`);
    }

    // Parse and validate tsconfig content
    try {
      const content = fs.readFileSync(tsconfigPath, 'utf-8');
      tsconfig = JSON.parse(content);

      // Check for required fields
      if (!tsconfig.compilerOptions) {
        issues.push({
          type: 'missing-file',
          message: 'tsconfig.json missing compilerOptions',
          fix: 'Add compilerOptions section'
        });
      }

      if (!tsconfig.include || tsconfig.include.length === 0) {
        issues.push({
          type: 'missing-file',
          message: 'tsconfig.json missing include array',
          fix: 'Add include: ["src/**/*"] or appropriate paths'
        });
      }

      // Check for common misconfigurations
      if (tsconfig.compilerOptions?.module === 'esnext' && !tsconfig.compilerOptions?.moduleResolution) {
        issues.push({
          type: 'incorrect-command',
          message: 'Using "module": "esnext" without specifying moduleResolution',
          fix: 'Add "moduleResolution": "bundler" or "node"'
        });
      }

    } catch (error) {
      issues.push({
        type: 'incorrect-command',
        message: 'Invalid JSON in tsconfig.json',
        fix: 'Fix JSON syntax errors in tsconfig.json'
      });
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    fixes,
    tsconfig
  };
}