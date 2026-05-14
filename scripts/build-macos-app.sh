#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="Prayer Cards"
BUILD_DIR="$ROOT_DIR/build/macos"
STAGING_ROOT="/private/tmp/prayer-cards-macos-build"
APP_DIR="$STAGING_ROOT/$APP_NAME.app"
LINK_APP_DIR="$BUILD_DIR/$APP_NAME.app"
CONTENTS_DIR="$APP_DIR/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"
WEB_DIR="$RESOURCES_DIR/web"

rm -rf "$APP_DIR" "$LINK_APP_DIR"
mkdir -p "$MACOS_DIR" "$WEB_DIR"

cp "$ROOT_DIR/macos/PrayerCards/Info.plist" "$CONTENTS_DIR/Info.plist"
cp \
  "$ROOT_DIR/index.html" \
  "$ROOT_DIR/styles.css" \
  "$ROOT_DIR/app.js" \
  "$ROOT_DIR/manifest.webmanifest" \
  "$ROOT_DIR/service-worker.js" \
  "$ROOT_DIR/icon.svg" \
  "$WEB_DIR/"
mkdir -p "$WEB_DIR/assets"
cp \
  "$ROOT_DIR/assets/1600037-200.png" \
  "$ROOT_DIR/assets/Tahoe1x1.png.webp" \
  "$ROOT_DIR/assets/image.png" \
  "$ROOT_DIR/assets/timer.svg" \
  "$WEB_DIR/assets/"

if [[ -f "$ROOT_DIR/assets/image.png" ]]; then
  python3 - "$ROOT_DIR/assets/image.png" "$RESOURCES_DIR/AppIcon.icns" <<'PY'
from pathlib import Path
import sys
from PIL import Image

source = Path(sys.argv[1])
destination = Path(sys.argv[2])
image = Image.open(source).convert("RGBA")
image.save(
    destination,
    sizes=[(16, 16), (32, 32), (64, 64), (128, 128), (256, 256), (512, 512), (1024, 1024)],
)
PY
fi

xcrun clang \
  -fobjc-arc \
  -mmacosx-version-min=12.0 \
  "$ROOT_DIR/macos/PrayerCards/main.m" \
  -o "$MACOS_DIR/$APP_NAME" \
  -framework Cocoa \
  -framework WebKit

chmod +x "$MACOS_DIR/$APP_NAME"
xattr -dr com.apple.provenance "$APP_DIR" 2>/dev/null || true
xattr -cr "$APP_DIR" 2>/dev/null || true
codesign --force --deep --sign - "$APP_DIR"
mkdir -p "$BUILD_DIR"
ln -s "$APP_DIR" "$LINK_APP_DIR"

echo "Built $LINK_APP_DIR -> $APP_DIR"
