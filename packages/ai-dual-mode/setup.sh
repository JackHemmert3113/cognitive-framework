#!/bin/bash

# AI Dual Mode Setup Script
# This script sets up the ai-dual-mode project and verifies that everything works correctly.
#
# Usage:
#   ./setup.sh             - Run full setup including examples
#   ./setup.sh --skip-examples - Skip running examples during setup

set -e  # Exit immediately if a command exits with a non-zero status

# Check for command line arguments
RUN_EXAMPLES=true
for arg in "$@"; do
    case $arg in
        --skip-examples)
            RUN_EXAMPLES=false
            shift
            ;;
    esac
done

echo "🚀 Setting up AI Dual Mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)
if [ "$NODE_MAJOR_VERSION" -lt 14 ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please upgrade to v14 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

# Create .env.example file if it doesn't exist
if [ ! -f .env.example ]; then
    echo "📝 Creating .env.example file..."
    cat > .env.example << EOL
# AI Dual Mode Environment Variables

# API Key for OpenAI (required for API mode)
AI_API_KEY=your_openai_api_key_here

# Set to 'true' to use API mode, otherwise IDE mode will be used
USE_API=false
EOL
    echo "✅ Created .env.example file"
fi

# Copy .env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file (please update with your actual API key if needed)"
fi

# Run examples to verify everything works
if [ "$RUN_EXAMPLES" = true ]; then
    echo "🧪 Running test framework example..."
    if npm run example:test; then
        echo "✅ Test framework example ran successfully"
    else
        echo "⚠️ Test framework example encountered issues, but setup will continue"
    fi

    echo "📚 Running documentation example..."
    if npm run example:docs; then
        echo "✅ Documentation example ran successfully"
    else
        echo "⚠️ Documentation example encountered issues, but setup will continue"
    fi
else
    echo "🔄 Skipping examples (use './setup.sh' without '--skip-examples' to run them)"
fi

echo "
🎉 Setup complete! 🎉

Here's what you can do next:

1. Update your .env file with your actual OpenAI API key if you want to use API mode
2. Check out the examples in the 'examples' directory
3. Read the documentation in the 'docs' directory
4. Run tests with 'npm test'

For more information, see the README.md file.
"

exit 0
