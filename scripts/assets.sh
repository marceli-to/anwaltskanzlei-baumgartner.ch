#!/bin/zsh
# Renders the favicons, app icons and the Open Graph image in public/ from the HTML sources in
# scripts/assets/ with headless Chrome and ImageMagick. Run with `npm run assets` after changing them
# (needs `npm install`, for the fonts).
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="file://$PWD/scripts/assets"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

shot() { # url width height out
  "$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --default-background-color=00000000 --allow-file-access-from-files --virtual-time-budget=3000 \
    --window-size="$2,$3" --screenshot="$4" "$1" 2>/dev/null
}

shot "$SRC/icon.html?shape=circle" 1024 1024 "$TMP/circle.png"
shot "$SRC/icon.html" 1024 1024 "$TMP/square.png"
shot "$SRC/og.html" 1200 630 public/og.png

# Round on transparent for the browser tab, full-bleed squares where the system rounds the corners
magick "$TMP/circle.png" -resize 96x96 public/favicon.png
magick "$TMP/circle.png" -define icon:auto-resize=48,32,16 public/favicon.ico
magick "$TMP/square.png" -resize 180x180 public/apple-touch-icon.png
magick "$TMP/square.png" -resize 192x192 public/icon-192.png
magick "$TMP/square.png" -resize 512x512 public/icon-512.png
echo "Wrote favicon.png, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png and og.png to public/"
