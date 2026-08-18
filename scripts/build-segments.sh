#!/usr/bin/env bash
# Stage 1 of 2: turn the six source clips into lossless PNG intermediates.
#
#   concat pair -> mpdecimate -> lossless PNG intermediate
#
# ENCODING IS DELIBERATELY NOT DONE HERE. ffmpeg 6.1 writes AVIF files that
# carry a valid `ftypavif` header and that NO browser will decode — verified
# against Chromium, Chrome, Edge, Firefox and WebKit, every one of which
# decoded the sibling WebP from the same run. The files even pass an ffmpeg
# SSIM check, because ffmpeg happily reads back its own broken output. Run
# `node scripts/encode-segments.mjs <scratchpad>` afterwards; it goes through
# sharp/libheif and produces AVIF that actually paints.
set -euo pipefail

SP="${SP:?set SP to the scratchpad dir}"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
FF="$REPO/node_modules/ffmpeg-static/ffmpeg.exe"
FP="$REPO/node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe"

OUT="$REPO/public/assets/lab/seg"
W_FRAMES=90
T_FRAMES=60

build () {
  local NAME=$1 C1=$2 C2=$3
  echo "════════ SEGMENT $NAME  ($C1 + $C2) ════════"

  # 1 — concat. Both sources are h264 1920x1080 24fps, so a stream copy is safe.
  printf "file '%s'\nfile '%s'\n" "$SP/$C1" "$SP/$C2" > "$SP/seg-$NAME.txt"
  "$FF" -v error -f concat -safe 0 -i "$SP/seg-$NAME.txt" -c copy -y "$SP/seg-$NAME-raw.mp4"

  # 2 — drop the padding frames. Generative clips are often N fps of unique
  #     content padded up to the container rate; sampling off the pads puts
  #     identical stills side by side and the scrub visibly hitches.
  "$FF" -v error -i "$SP/seg-$NAME-raw.mp4" -vf "mpdecimate,setpts=N/24/TB" \
        -an -c:v libx264 -crf 16 -y "$SP/seg-$NAME.mp4"

  local RAW UNI DUR
  RAW=$("$FP" -v error -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$SP/seg-$NAME-raw.mp4")
  UNI=$("$FP" -v error -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$SP/seg-$NAME.mp4")
  DUR=$(awk -v u="$UNI" 'BEGIN{printf "%.4f", u/24}')
  echo "  frames: $RAW raw -> $UNI unique (${DUR}s)"

  # 3 — lossless intermediates, one per breakpoint
  local WFPS TFPS
  WFPS=$(awk -v n=$W_FRAMES -v d="$DUR" 'BEGIN{printf "%.5f", n/d}')
  TFPS=$(awk -v n=$T_FRAMES -v d="$DUR" 'BEGIN{printf "%.5f", n/d}')

  rm -rf "$SP/png-$NAME-w" "$SP/png-$NAME-t"
  mkdir -p "$SP/png-$NAME-w" "$SP/png-$NAME-t"
  "$FF" -v error -i "$SP/seg-$NAME.mp4" \
     -vf "fps=$WFPS,scale=1600:900:flags=lanczos" -frames:v $W_FRAMES \
     "$SP/png-$NAME-w/f_%03d.png"
  "$FF" -v error -i "$SP/seg-$NAME.mp4" \
     -vf "fps=$TFPS,scale=900:1600:force_original_aspect_ratio=increase:flags=lanczos,crop=900:1600" \
     -frames:v $T_FRAMES "$SP/png-$NAME-t/f_%03d.png"
  echo "  png: $(ls "$SP/png-$NAME-w" | wc -l) wide, $(ls "$SP/png-$NAME-t" | wc -l) tall"

  # 4 — encoding is NOT done here. See the note at the bottom of this file.
}

build a clip1.mp4 clip2.mp4
build b clip3.mp4 clip4b.mp4
build c clip5.mp4 clip6.mp4

echo
echo "════════ TOTALS ════════"
for N in a b c; do
  for V in w t; do
    A=$(du -sb "$OUT/$N/$V"/*.avif | awk '{s+=$1} END{print s}')
    W=$(du -sb "$OUT/$N/$V"/*.webp | awk '{s+=$1} END{print s}')
    awk -v n="$N/$V" -v a="$A" -v w="$W" 'BEGIN{printf "%-6s avif %8.2f MB   webp %8.2f MB\n", n, a/1048576, w/1048576}'
  done
done
echo "BUILD COMPLETE"
