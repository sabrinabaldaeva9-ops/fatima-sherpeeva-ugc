#!/usr/bin/env bash
# Full ORBIT HEART export. Needs: node + playwright-core, chromium, python3 (numpy, pillow), ffmpeg.
#   PW_REQUIRE=/path/to/package.json-next-to-node_modules  tools/build-orbit-heart.sh <workdir>
set -euo pipefail
cd "$(dirname "$0")"
W=${1:-/tmp/orbit-heart-build}; OUT=../orbit-heart/exports
mkdir -p "$W" "$OUT/layers"

# 1) 2048 master stills ---------------------------------------------------
node render-orbit-heart.mjs "$W/still" 2048 still all
python3 composite.py "$W/still" "$W/still_c"
cp "$W/still_c/still.png"            "$OUT/orbit-heart_master_2048.png"
cp "$W/still/beauty_still.png"       "$OUT/orbit-heart_on-dark_2048.png"
cp "$W/still/fx_still.png"           "$OUT/layers/glow-shadow_2048.png"
for L in heart ring minis; do
  node render-orbit-heart.mjs "$W/l_$L" 2048 still $L
  python3 composite.py "$W/l_$L" "$W/l_${L}_c"
  cp "$W/l_${L}_c/still_body.png" "$OUT/layers/${L}_2048.png"
done

# 2) 3 s seamless loop, 90 frames @30fps, 1024 --------------------------------
node render-orbit-heart.mjs "$W/loop" 1024 90 all
python3 composite.py "$W/loop" "$W/loop_c"
for f in "$W"/loop_c/[0-9][0-9][0-9].png; do b=$(basename "$f" .png); mv "$f" "$W/loop_c/a_$b.png"; done

ffmpeg -y -loglevel error -framerate 30 -i "$W/loop_c/a_%03d.png" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 26 -auto-alt-ref 0 "$OUT/orbit-heart_loop_1024_alpha.webm"
# Telegram video-sticker spec: WebM VP9 alpha, 512 px, <=3 s, 30 fps, <=256 KB
ffmpeg -y -loglevel error -framerate 30 -i "$W/loop_c/a_%03d.png" -vf scale=512:512:flags=lanczos -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 40 -an -auto-alt-ref 0 "$OUT/orbit-heart_telegram_512.webm"
ffmpeg -y -loglevel error -framerate 30 -i "$W/loop/beauty_%03d.png" -c:v libx264 -pix_fmt yuv420p -crf 14 -movflags +faststart "$OUT/orbit-heart_loop_1024_dark.mp4"
cp "$W/loop_c/a_000.png" "$OUT/orbit-heart_frame_000.png"
ls -la "$OUT" "$OUT/layers"
