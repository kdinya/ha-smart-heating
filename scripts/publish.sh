#!/usr/bin/env bash
#
# Re-publish the CURRENT version in place so that HACS "Redownload" picks up
# the latest code from main.
#
# Why this is needed: HACS installs a repository from its latest GitHub
# *release*, i.e. from the commit the tag points at -- not from the tip of
# main. Pushing commits to main alone therefore changes nothing for HACS
# users. This script moves the existing tag onto the tip of main and
# refreshes the release that uses that tag.
#
# Usage:
#   GH_TOKEN=<token with repo scope> ./scripts/publish.sh
#   GH_TOKEN=<token> ./scripts/publish.sh --keep-build      # do not bump CARD_BUILD
#
# After running, in Home Assistant:
#   HACS -> Smart Heating -> ... -> Redownload -> pick the same version
#   -> restart Home Assistant -> hard-refresh the browser (Ctrl/Cmd+Shift+R).
#
set -euo pipefail

REPO="kdinya/ha-smart-heating"
INIT="custom_components/smart_heating/__init__.py"
MANIFEST="custom_components/smart_heating/manifest.json"
BUMP_BUILD=1

for arg in "$@"; do
  case "$arg" in
    --keep-build) BUMP_BUILD=0 ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

cd "$(dirname "$0")/.."

: "${GH_TOKEN:?set GH_TOKEN to a GitHub token with repo scope}"

VERSION="$(python3 -c "import json;print(json.load(open('$MANIFEST'))['version'])")"
TAG="v$VERSION"

# 1. Keep the packaged card and the root mirror byte-identical.
cp custom_components/smart_heating/www/smart-heating-card.js www/smart-heating-card.js

# 2. Bump the cache-busting build marker so Lovelace re-registers the resource
#    with a new query string and browsers refetch the card.
if [ "$BUMP_BUILD" -eq 1 ]; then
  python3 - "$INIT" <<'PY'
import re
import sys

path = sys.argv[1]
text = open(path).read()
match = re.search(r'CARD_BUILD = "([A-Za-z0-9._-]*?)(\d+)"', text)
if not match:
    sys.exit("CARD_BUILD not found or has no numeric suffix")
new = f'CARD_BUILD = "{match.group(1)}{int(match.group(2)) + 1}"'
open(path, "w").write(text[: match.start()] + new + text[match.end() :])
print("->", new)
PY
fi

# 3. Fail fast if the repository contract is broken.
python3 -m pytest tests/ -q

# 4. Commit whatever changed and push main.
if ! git diff --quiet; then
  git add -A
  git commit -m "chore: refresh $TAG release payload"
fi
git push origin HEAD:main

# 5. Move the tag onto the tip of main. The release keeps its name and simply
#    follows the tag, so HACS now downloads the current code.
git tag -f "$TAG"
git push -f origin "refs/tags/$TAG"

# 6. Touch the release so its timestamp changes and HACS metadata refreshes.
API="https://api.github.com/repos/$REPO"
SHA="$(git rev-parse HEAD)"
RELEASE_ID="$(curl -fsS -H "Authorization: Bearer $GH_TOKEN" "$API/releases/tags/$TAG" \
  | python3 -c "import json,sys;print(json.load(sys.stdin)['id'])" 2>/dev/null || true)"
if [ -z "$RELEASE_ID" ]; then
  # First publish of this version: create the release HACS will install from.
  curl -fsS -X POST -H "Authorization: Bearer $GH_TOKEN" -H "Content-Type: application/json" \
    "$API/releases" \
    -d "$(python3 -c "
import json
print(json.dumps({'tag_name': '$TAG', 'name': '$TAG', 'body': 'See CHANGELOG.md.'}))
")" >/dev/null
  echo "Created release $TAG -> $SHA"
  exit 0
fi
curl -fsS -X PATCH -H "Authorization: Bearer $GH_TOKEN" \
  -H "Content-Type: application/json" \
  "$API/releases/$RELEASE_ID" \
  -d "$(python3 -c "
import json, sys
print(json.dumps({'body': 'Release $TAG refreshed in place. Points at commit $SHA.'}))
")" >/dev/null

echo "Published $TAG -> $SHA"
