#!/usr/bin/env bash
# Copies each skill's references from the documents they are built from.
# The documents are the source of truth: edit them, then run this script.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../.." && pwd)"

refs="$here/product-document-review/references"
rm -rf "$refs" && mkdir -p "$refs"
cp "$repo/bizdev/product-document/guide.md"    "$refs/guide.md"
cp -R "$repo/bizdev/product-document/template" "$refs/template"
cp -R "$repo/bizdev/product-document/example"  "$refs/example"
cp "$repo/shared/words.md"                     "$refs/words.md"
cp "$repo/shared/matrix.md"                    "$refs/matrix.md"
cp "$repo/shared/writing.md"                   "$refs/writing.md"
echo "built: $refs"

refs="$here/product-document-intake/references"
rm -rf "$refs" && mkdir -p "$refs"
cp "$repo/bizdev/product-document/guide.md"    "$refs/guide.md"
cp "$repo/bizdev/product-document/review.md"   "$refs/review.md"
cp -R "$repo/bizdev/product-document/template" "$refs/template"
cp -R "$repo/bizdev/product-document/example"  "$refs/example"
cp "$repo/shared/words.md"                     "$refs/words.md"
cp "$repo/shared/matrix.md"                    "$refs/matrix.md"
cp "$repo/shared/writing.md"                   "$refs/writing.md"
echo "built: $refs"
