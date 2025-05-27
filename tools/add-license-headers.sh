#!/bin/bash
# Adds MIT license headers to JavaScript files under packages/ if missing.

header="/**\n * Cognitive Framework\n *\n * MIT License\n */\n"

find packages -name "*.js" | while read -r file; do
  if ! grep -m1 -q "MIT License" "$file"; then
    if head -n 1 "$file" | grep -q "^#!/"; then
      # Keep shebang on first line
      tail_content=$(tail -n +2 "$file")
      {
        echo "$(head -n 1 "$file")"
        printf '%b' "$header"
        echo "$tail_content"
      } > "$file.tmp" && mv "$file.tmp" "$file"
    else
      {
        printf '%b' "$header"
        cat "$file"
      } > "$file.tmp" && mv "$file.tmp" "$file"
    fi
  fi
done
