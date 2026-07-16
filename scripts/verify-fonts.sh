#!/usr/bin/env bash
# Guards against faux-bold rendering on `font-display` (Archivo Black).
#
#   Archivo Black is loaded single-weight (index.html requests
#   `family=Archivo+Black` with no weight axis). Applying ANY font-weight
#   utility alongside `font-display` in the same className makes the browser
#   synthesize faux-bold, which smears the face.
#
# Run after every task, and before every push:  bash scripts/verify-fonts.sh
# Exits non-zero on any regression.

set -uo pipefail
cd "$(dirname "$0")/.."
FAIL=0
say() { printf "  %-58s %s\n" "$1" "$2"; }

echo "── font-display faux-bold guard ──────────────────────────────"

BAD_WEIGHTS='font-(bold|semibold|extrabold|black|medium)'

# Find className attributes (single or double quoted) that contain both
# `font-display` and one of the banned weight utilities, in either order.
MATCHES="$(grep -rnoE "className=[\"'][^\"']*[\"']" src/ \
  | grep -E "font-display" \
  | grep -E "$BAD_WEIGHTS")"

if [ -z "$MATCHES" ]; then
  say "font-display + font-weight co-occurrence" "ok"
else
  while IFS= read -r line; do
    say "$line" "*** FAUX-BOLD ***"
  done <<< "$MATCHES"
  FAIL=1
fi

echo
if [ "$FAIL" -eq 0 ]; then
  echo "PASS — no font-display + font-weight utility collisions."
else
  echo "FAIL — remove the font-weight utility from any className listed above."
fi
exit "$FAIL"
