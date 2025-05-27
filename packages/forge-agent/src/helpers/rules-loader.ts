/**
 * Agent Rules Loader
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  AgentRules,
  Badge,
  ForbiddenCheckResult
} from '../types';

let cachedRules: AgentRules | null = null;

/**
 * loadAgentRules exported API
 * @example
 * loadAgentRules();
 */
// Added in v1.0
export async function loadAgentRules(): Promise<AgentRules> {
  if (cachedRules) {
    return cachedRules;
  }

  const rulesPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../agent-rules.json'
  );

  try {
    const rulesJson = await fs.promises.readFile(rulesPath, 'utf-8');
    cachedRules = JSON.parse(rulesJson);
    return cachedRules!;
  } catch (error) {
    throw new Error(`Failed to load agent rules: ${error}`);
  }
}

/**
 * getPreferredCommand exported API
 * @example
 * getPreferredCommand();
 */
// Added in v1.0
export async function getPreferredCommand(action: string): Promise<string | null> {
  const rules = await loadAgentRules();
  const preferred = rules.rules.typescript.commands.preferred.find(
    p => p.action === action
  );

  return preferred ? preferred.commands[0] : null;
}

/**
 * isForbiddenCommand exported API
 * @example
 * isForbiddenCommand();
 */
// Added in v1.0
export async function isForbiddenCommand(command: string): Promise<ForbiddenCheckResult> {
  const rules = await loadAgentRules();

  for (const forbidden of rules.rules.typescript.commands.forbidden) {
    if (command.includes(forbidden.pattern)) {
      return {
        forbidden: true,
        reason: forbidden.reason,
        fix: forbidden.fix
      };
    }
  }

  return { forbidden: false };
}

/**
 * getBadge exported API
 * @example
 * getBadge();
 */
// Added in v1.0
export async function getBadge(status: 'compatible' | 'needsSetup' | 'incompatible'): Promise<Badge> {
  const rules = await loadAgentRules();
  return rules.badges[status];
}

/**
 * getErrorFix exported API
 * @example
 * getErrorFix();
 */
// Added in v1.0
export async function getErrorFix(errorMessage: string): Promise<{
  pattern: string;
  cause: string;
  fixes: string[];
} | null> {
  const rules = await loadAgentRules();

  for (const error of rules.rules.errorPatterns.recognizedErrors) {
    if (errorMessage.includes(error.pattern)) {
      return error;
    }
  }

  return null;
}