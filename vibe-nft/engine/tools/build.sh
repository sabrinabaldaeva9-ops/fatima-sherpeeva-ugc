#!/usr/bin/env bash
# Production build for one NFT → vibe-nft/assets/<id>/
#   PW_REQUIRE=<package.json next to node_modules with playwright-core> tools/build.sh <nft-id> [workdir]
# Needs: node, chromium, python3 (numpy, pillow), ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/.."
ID=$1; W=${2:-/tmp/vibe-nft-build}/$ID; OUT=../assets/$ID
mkdir -p "$W" "$OUT"

# master 2048: all passes → transparent PNG + on-backdrop PNG
node tools/render.mjs "$ID" "$W/still" 2048 still
python3 tools/composite.py "$W/still" "$OUT/master_2048.png"
cp "$W/still/beauty_still.png" "$OUT/master_velvet_2048.png"
# marketplace 1000 (Getgems image): on the brand backdrop, lanczos downscale
python3 -c "from PIL import Image; Image.open('$W/still/beauty_still.png').convert('RGB').resize((1000,1000), Image.LANCZOS).save('$OUT/marketplace_1000.png', optimize=True)"

# seamless loop: LOOP s × 30 fps at 1000 px, beauty pass only
LOOP=$(node -e "import('./objects/$ID.js').then(m=>console.log(m.LOOP))")
N=$((LOOP*30))
node tools/render.mjs "$ID" "$W/loop" 1000 "$N" beauty
ffmpeg -y -loglevel error -framerate 30 -i "$W/loop/beauty_%03d.png" -c:v libx264 -pix_fmt yuv420p -crf 16 -preset slow -movflags +faststart "$OUT/animation_1000.mp4"
ls -la "$OUT"
