#!/usr/bin/env bash
# Guards the pages that are live evidence in an active Meta App Review.
#
#   /privacy/  /terms/  /data-deletion/  must stay BYTE-IDENTICAL.
#   /social/   may only change additively — its Meta + YouTube sections and
#              legal links must survive verbatim.
#
# Run after every task, and before every push:  bash scripts/verify-legal.sh
# Exits non-zero on any regression.

set -uo pipefail
cd "$(dirname "$0")/.."
FAIL=0
say() { printf "  %-58s %s\n" "$1" "$2"; }

echo "── Byte-identical legal pages ────────────────────────────────"
# Baselines captured 2026-07-16, after the Meta App Review pages shipped.
check_hash() {
  local path="$1" want="$2" got
  got="$(git hash-object "$path" 2>/dev/null)"
  if [ "$got" = "$want" ]; then say "$path" "ok"; else
    say "$path" "*** CHANGED ***"; FAIL=1
  fi
}
check_hash public/privacy/index.html       f5ebd0c8b5592f5177bc47a1cb16547080b6de90
check_hash public/terms/index.html         8879b475eacd0c6c20d0f5d3a20308482373b9ca
check_hash public/data-deletion/index.html a3c6f5841ad69c3dc2af8d0f4f3525cbdfe5e47f

echo
echo "── /privacy/ Meta content ────────────────────────────────────"
for s in pages_show_list pages_read_engagement pages_manage_posts read_insights \
         instagram_basic instagram_content_publish instagram_manage_insights \
         "Meta Platform" "business_tools"; do
  if grep -q "$s" public/privacy/index.html; then say "$s" "ok"; else say "$s" "*** LOST ***"; FAIL=1; fi
done

echo
echo "── /social/ Meta + YouTube content (additive-only page) ──────"
for s in "Facebook Page" "Instagram Business" "Meta Platform" \
         "facebook.com/terms.php" "business_tools" \
         "youtube.com/t/terms" "myaccount.google.com/permissions" \
         "/privacy/" "/terms/" "/data-deletion/"; do
  if grep -q "$s" public/social/index.html; then say "$s" "ok"; else say "$s" "*** LOST ***"; FAIL=1; fi
done

echo
if [ "$FAIL" -eq 0 ]; then
  echo "PASS — Meta App Review evidence intact."
else
  echo "FAIL — do not push. Restore with:  git checkout -- public/privacy public/terms public/data-deletion"
fi
exit "$FAIL"
