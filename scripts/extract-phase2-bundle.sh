#!/usr/bin/env bash
set -euo pipefail

OUTPUT_FILE="${1:-phase2-bundle.txt}"

PHASE2_FILES=(
  "next.config.ts"
  "pnpm-workspace.yaml"
  "playwright.config.ts"
  "vitest.config.ts"
  "components/Navbar.tsx"
  "components/ProjectsSection.tsx"
  "components/SkillsSection.tsx"
  "components/ContactSection.tsx"
  "components/Footer.tsx"
  "components/Liveactivitybar.tsx"
  "components/CommandPalette.tsx"
  "tests/unit/command-palette.test.ts"
)

: > "$OUTPUT_FILE"
missing=0

for file in "${PHASE2_FILES[@]}"; do
  if [ -f "$file" ]; then
    printf "\n===== FILE: %s =====\n" "$file" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
  else
    echo " ⚠ Missing expected file: $file" >&2
    missing=$((missing + 1))
  fi
done

echo "✓ Bundled ${#PHASE2_FILES[@]} Phase 2 target entries into $OUTPUT_FILE (missing: $missing)."
