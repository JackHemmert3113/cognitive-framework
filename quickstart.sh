cat > quickstart.sh << 'EOF'
#!/bin/bash

# Cognitive Framework Quick Start Guide
# Last Updated: 2025-05-26 19:04:28 UTC

echo "🚀 Cognitive Framework Quick Start"
echo "=============================="
echo ""
echo "Welcome to the agent-first development ecosystem!"
echo ""
echo "📦 Available Modules:"
echo "-------------------"
echo "1. @cognitive/agent-core - Universal AI agents for ANY project"
echo "2. @cognitive/cognitive-test-framework - AI-powered test generation"
echo ""
echo "🔧 Installation Options:"
echo "----------------------"
echo ""
echo "Option 1: Just AI Agents (Recommended for new projects)"
echo "  npm install @cognitive/agent-core"
echo ""
echo "Option 2: AI Testing Only"
echo "  npm install @cognitive/cognitive-test-framework"
echo ""
echo "Option 3: Everything"
echo "  npm install @cognitive/agent-core @cognitive/cognitive-test-framework"
echo ""
echo "💡 Quick Example:"
echo "---------------"
echo 'const { agentCore } = require("@cognitive/agent-core");'
echo ''
echo '// Use natural language'
echo 'const result = await agentCore.query("Help me build something");'
echo ""
echo "📚 Documentation:"
echo "---------------"
echo "- Architecture: docs/ARCHITECTURE.md"
echo "- Philosophy: docs/agent-first/MANIFESTO.md"
echo "- Adoption Guide: docs/ADOPTING_COGNITIVE.md"
echo ""
echo "🎯 Your Projects Can Use This:"
echo "-----------------------------"
echo "- adaptive-wellness: Health insights with AI"
echo "- sparkflow: AI-powered code generation"
echo "- home-automation: Natural language device control"
echo ""
echo "Test it: node test.js"
echo ""
EOF

chmod +x quickstart.sh && echo "✅ Created quickstart.sh in root directory"
