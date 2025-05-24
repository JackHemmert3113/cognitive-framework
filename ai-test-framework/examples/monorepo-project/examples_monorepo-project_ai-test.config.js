module.exports = {
  projectName: 'Monorepo Example',
  projectType: 'monorepo',
  packageManager: 'npm',
  testRunner: 'jest',
  coverageThreshold: 80,
  aiInsightsEnabled: true,
  
  packages: {
    'shared': { 
      path: 'packages/shared',
      type: 'library'
    },
    'api': { 
      path: 'packages/api',
      type: 'node'
    },
    'web-app': { 
      path: 'packages/web-app',
      type: 'react'
    }
  },

  // Custom test patterns for different package types
  testPatterns: {
    library: ['**/*.test.js', '**/*.spec.js'],
    node: ['**/*.test.js', '**/*.integration.js'],
    react: ['**/*.test.{js,jsx}', '**/*.test.tsx']
  },

  // Watch mode configuration
  watchOptions: {
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**'
    ]
  }
};