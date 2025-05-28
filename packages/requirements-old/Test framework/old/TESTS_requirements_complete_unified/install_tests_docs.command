#!/bin/bash
# install_tests_docs.command

echo "🔁 Installing test documentation into ./requirements/..."

# Set working directories
SOURCE_DIR="./docs/requirements"
TARGET_DIR="./requirements"

# Create target if it doesn't exist
mkdir -p "$TARGET_DIR"

# Move each subfolder from docs/requirements to requirements/
for SUBDIR in epics features stories tasks acceptance-criteria vision business-value; do
  if [ -d "$SOURCE_DIR/$SUBDIR" ]; then
    mkdir -p "$TARGET_DIR/$SUBDIR"
    mv "$SOURCE_DIR/$SUBDIR"/*.md "$TARGET_DIR/$SUBDIR/" 2>/dev/null
    echo "✅ Moved $SUBDIR files."
  fi
done

# Move index and README files
for FILE in README.md TESTS.index.md TESTS.02_index.md TESTS.03_index.md TESTS.04_index.md TESTS.05_index.md; do
  if [ -f "$SOURCE_DIR/$FILE" ]; then
    mv "$SOURCE_DIR/$FILE" "$TARGET_DIR/"
    echo "✅ Moved $FILE."
  fi
done

# Remove the now-empty docs directory
rm -rf ./docs
echo "🧹 Removed docs directory."

# Prompt to remove ZIP file
echo ""
read -p "🗑️  Do you want to delete the original ZIP file? (y/n): " confirm
if [[ $confirm == [yY] ]]; then
  ZIP_FILE="TESTS_requirements_all.zip"
  if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
    echo "🗑️  Deleted $ZIP_FILE."
  else
    echo "⚠️  ZIP file not found in current directory."
  fi
else
  echo "❎ Keeping ZIP file."
fi

echo "✅ All done! Your files are now in ./requirements/"
