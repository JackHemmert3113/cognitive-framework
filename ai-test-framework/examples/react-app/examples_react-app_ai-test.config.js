module.exports = {
  projectName: 'React Todo App',
  projectType: 'single',
  packageManager: 'npm',
  testRunner: 'jest',
  coverageThreshold: 90,
  aiInsightsEnabled: true,

  // React-specific configuration
  testEnvironment: 'jsdom',
  
  // Additional setup files for React
  setupFiles: [
    '<rootDir>/src/setupTests.js'
  ],

  // Transform configuration for JSX
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  // Module name mapping for CSS modules
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },

  // Coverage configuration specific to React
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/setupTests.js'
  ]
};