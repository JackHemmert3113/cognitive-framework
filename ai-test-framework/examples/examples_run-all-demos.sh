#!/bin/bash

# AI Test Framework - Demo Runner
# Runs all examples to showcase the framework

echo "🤖 AI Test Framework - Demo Runner"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Run simple project
echo -e "${BLUE}1. Running Simple Project Example${NC}"
echo "-----------------------------------"
cd simple-project
npm install --silent
npm run test:ai
cd ..
echo ""

# Run monorepo project
echo -e "${BLUE}2. Running Monorepo Example${NC}"
echo "----------------------------"
cd monorepo-project
npm install --silent
npm run test:ai
cd ..
echo ""

# Run React app
echo -e "${BLUE}3. Running React App Example${NC}"
echo "-----------------------------"
cd react-app
npm install --silent
npm run test:ai
cd ..
echo ""

# Summary
echo -e "${GREEN}✅ All demos completed!${NC}"
echo ""
echo "📊 Check each project's test-results/ directory for detailed reports"
echo "💡 Try running with --watch flag for development mode"
echo ""