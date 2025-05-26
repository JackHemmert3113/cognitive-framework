# @forge/agent API Reference

## Functions

### `validateProjectSetup(projectPath: string): Promise<ValidationResult>`
Validates a project for agent compatibility.

**Parameters:**
- `projectPath` - Path to the project directory

**Returns:**
```typescript
{
  isValid: boolean;
  issues: ValidationIssue[];
  fixes: string[];
}