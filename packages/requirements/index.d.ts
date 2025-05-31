/**
 * Cognitive Framework
 *
 * MIT License
 */

export type RequirementType =
  | 'vision'
  | 'business_value'
  | 'epic'
  | 'feature'
  | 'story'
  | 'task';

export interface Requirement {
  id: string;
  type: RequirementType;
  title?: string;
  description?: string;
  metadata?: Record<string, string>;
  acceptanceCriteria?: string[];
  children?: Requirement[];
}

export interface RequirementsFrameworkOptions {
  mode?: 'ide-driven' | 'api-driven';
  outputDir?: string;
  requiredMetadata?: string[];
}

export declare class ValidationError extends Error {
  path: string;
  constructor(message: string, path?: string[]);
}

export declare class RequirementsFramework {
  constructor(options?: RequirementsFrameworkOptions);
  process(input: Requirement | string): Promise<Requirement>;
}

export declare function processAndTest(
  input: Requirement | string,
  projectPath?: string,
  options?: RequirementsFrameworkOptions
): Promise<{ requirement: Requirement; testResult: any }>;
