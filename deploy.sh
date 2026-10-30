#!/bin/zsh
# Deploys the committed state of this repository to Hostpoint over SSH.
# Run from your Mac:
#   ./deploy.sh               staging.anwaltskanzlei-baumgartner.ch
#   ./deploy.sh production    anwaltskanzlei-baumgartner.ch
# Add --dry-run to only show what would change.
#
# The site is built locally into dist/ and synced to the web root, which Hostpoint
# serves from .../<domain>/public. .htaccess comes from public/ (plus a noindex header
# on staging); .well-known/ on the server is never deleted.
set -euo pipefail
cd "$(dirname "$0")"

HOST=unofibem@anwaltskanzlei-baumgartner.ch
TARGET=staging
DRY_RUN=()
for arg in "$@"; do
  case $arg in
    staging|production) TARGET=$arg ;;
    --dry-run) DRY_RUN=(--dry-run --itemize-changes) ;;
    *) echo "Usage: ./deploy.sh [staging|production] [--dry-run]"; exit 1 ;;
  esac
done

if [[ $TARGET == production ]]; then
  DOMAIN=anwaltskanzlei-baumgartner.ch
else
  DOMAIN=staging.anwaltskanzlei-baumgartner.ch
fi
DEST=/home/unofibem/www/$DOMAIN/public
URL=https://$DOMAIN

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

# Keep staging out of search engines: a noindex header on every response, and a robots.txt
# that blocks all crawlers instead of pointing them to the production sitemap
if [[ $TARGET == staging ]]; then
  printf '\n# Staging only (added by deploy.sh)\nHeader set X-Robots-Tag "noindex, nofollow"\n' >> "$STAGE/dist/.htaccess"
  printf 'User-agent: *\nDisallow: /\n' > "$STAGE/dist/robots.txt"
fi

# Folders 755, files 644 (macOS ships openrsync, which has no --chmod)
chmod -R u=rwX,go=rX "$STAGE/dist"

echo "Uploading to $TARGET…"
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
