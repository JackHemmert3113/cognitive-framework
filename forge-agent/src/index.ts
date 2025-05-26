/**
 * @forge/agent - AI Agent Compatibility Tools
 *
 * Main entry point for programmatic usage
 */

export * from './helpers/typescript-commands';
export * from './helpers/agent-instructions';
export * from './helpers/project-validator';
export * from './helpers/tsconfig-validator';
export * from './helpers/rules-loader';
export * from './templates/package-json-template';

// Re-export types
export type {
  ValidationResult,
  ValidationIssue,
  AgentRules,
  TypeScriptRules,
  ProjectStructureRules,
  ErrorPatterns,
  AgentGuidelines,
  BadgeDefinitions,
  Badge,
  CommandOptions,
  ForbiddenCheckResult,
  TsConfigValidationResult,
  ScriptCheckResult
} from './types';