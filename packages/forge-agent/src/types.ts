/**
 * Type definitions for @forge/agent
 */

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  fixes: string[];
}

export interface ValidationIssue {
  type: 'missing-script' | 'incorrect-command' | 'missing-file';
  message: string;
  fix: string;
}

export interface TsConfigValidationResult extends ValidationResult {
  tsconfig?: any;
}

export interface ScriptCheckResult {
  hasCheckTypes: boolean;
  missingScripts: string[];
}

export interface CommandOptions {
  file?: string;
  watch?: boolean;
  strict?: boolean;
}

export interface ForbiddenCheckResult {
  forbidden: boolean;
  reason?: string;
  fix?: string;
}

export interface AgentRules {
  version: string;
  lastUpdated: string;
  rules: {
    typescript: TypeScriptRules;
    projectStructure: ProjectStructureRules;
    errorPatterns: ErrorPatterns;
  };
  agentGuidelines: AgentGuidelines;
  badges: BadgeDefinitions;
}

export interface TypeScriptRules {
  priority: 'critical' | 'high' | 'medium' | 'low';
  commands: {
    forbidden: Array<{
      pattern: string;
      reason: string;
      fix: string;
    }>;
    preferred: Array<{
      action: string;
      commands: string[];
    }>;
  };
  packageJsonRequirements: {
    scripts: Record<string, {
      required: boolean;
      value: string;
      description: string;
    }>;
  };
}

export interface ProjectStructureRules {
  priority: 'critical' | 'high' | 'medium' | 'low';
  requiredFiles: Array<{
    path: string;
    location: string;
    reason: string;
  }>;
  tsconfigRules: {
    requiredFields: string[];
    recommendedCompilerOptions: Record<string, any>;
  };
}

export interface ErrorPatterns {
  recognizedErrors: Array<{
    pattern: string;
    cause: string;
    fixes: string[];
  }>;
}

export interface AgentGuidelines {
  general: string[];
  beforeTypeCheck: string[];
  onError: string[];
}

export interface BadgeDefinitions {
  compatible: Badge;
  needsSetup: Badge;
  incompatible: Badge;
}

export interface Badge {
  markdown: string;
  url: string;
}

export interface PackageJsonTemplate {
  scripts: Record<string, string>;
  devDependencies?: Record<string, string>;
}