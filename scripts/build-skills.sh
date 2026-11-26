#!/usr/bin/env bash
# Rebuilds every skill's references/ across all sections from the source docs.
set -euo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
found=0

for script in "$repo"/*/skills/build.sh; do
  [ -f "$script" ] || continue
  found=$((found + 1))
  bash "$script"
done

if [ "$found" -eq 0 ]; then
  echo "no section skills/build.sh scripts found" >&2
  exit 1
fi
