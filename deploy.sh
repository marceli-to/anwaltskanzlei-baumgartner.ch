#!/bin/zsh
# Deploys the committed state of this repository to staging.anwaltskanzlei-baumgartner.ch
# (Hostpoint) over SSH.
# Run from your Mac: ./deploy.sh  (add --dry-run to only show what would change)
#
# The site is built locally into dist/ and synced to the web root, which Hostpoint
# serves from .../staging.anwaltskanzlei-baumgartner.ch/public. .htaccess comes from
# public/ plus a noindex header for staging; .well-known/ on the server is never deleted.
set -euo pipefail
cd "$(dirname "$0")"

HOST=unofibem@anwaltskanzlei-baumgartner.ch
DEST=/home/unofibem/www/staging.anwaltskanzlei-baumgartner.ch/public
URL=https://staging.anwaltskanzlei-baumgartner.ch

DRY_RUN=()
[[ ${1:-} == --dry-run ]] && DRY_RUN=(--dry-run --itemize-changes)

if [[ -n $(git status --porcelain) ]]; then
  echo "You have uncommitted changes. Commit them first; only committed code is deployed."
  exit 1
fi

# The Mapbox token is not committed, so the build reads it from the local .env
if ! grep -q '^PUBLIC_MAPBOX_TOKEN=pk\.' .env 2>/dev/null; then
  echo "PUBLIC_MAPBOX_TOKEN is missing in .env (see .env.example); the Kontakt map would not load."
  exit 1
fi

export NVM_DIR="$HOME/.nvm"
[[ -s $NVM_DIR/nvm.sh ]] && source "$NVM_DIR/nvm.sh" && nvm use --silent

STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT
# mktemp creates the folder as 700; rsync would copy that onto the web root and lock out the web server.
chmod 755 "$STAGE"

echo "Building $(git rev-parse --short HEAD)…"
git archive HEAD | tar -x -C "$STAGE"
cp .env "$STAGE/.env"
ln -s "$PWD/node_modules" "$STAGE/node_modules"
(cd "$STAGE" && npm run build --silent)

# Keep staging out of search engines (a robots.txt Disallow would hide this header from crawlers)
printf '\n# Staging only (added by deploy.sh)\nHeader set X-Robots-Tag "noindex, nofollow"\n' >> "$STAGE/dist/.htaccess"

# Folders 755, files 644 (macOS ships openrsync, which has no --chmod)
chmod -R u=rwX,go=rX "$STAGE/dist"

echo "Uploading…"
# One connection (one password prompt): the remote side creates the web root before rsync starts
rsync -rlptz --delete "${DRY_RUN[@]}" \
  --rsync-path "mkdir -p '$DEST' && rsync" \
  --filter 'protect /.well-known/' \
  "$STAGE/dist/" "$HOST:$DEST/"

if (( ${#DRY_RUN} )); then
  echo "Dry run only, nothing was changed."
else
  echo "Deployed $(git rev-parse --short HEAD) to $URL"
fi
