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
#
# ═══════════════════════════════════════════════════════════════════════════
# WHAT THIS REBUILDS, AND WHY IT NOW REFUSES TO RUN WITHOUT A FLAG
#
# Running this overwrites the frame sets under public/assets/lab/seg, which are
# committed, shipped and measured. Two defects were found in the film AFTER
# this script last ran, and BOTH were fixed by changing the pipeline's INPUT
# rather than the pipeline itself. Until 2026-08-20 neither correction was
# recorded anywhere except a commit message, so re-running this script was a
# one-keystroke way to put both defects silently back onto the page.
#
# They are encoded below. The flag exists so that a rebuild is a decision.
#
# ── CORRECTION 1 · SEGMENT A TAKES THE CLIP-2 REROLL ── commit e413171
#    The original clip 2 carried an illuminated sign reading "NADUV" over the
#    mall entrance, around frames 58-68: invented signage, on a client's page.
#    Two variants were re-rolled without it, and variant B ships on the stated
#    tiebreak — 0 near-duplicate frames against A's 1. Its facade is plain
#    unmarked stone across the whole entrance approach.
#
#    This file said `clip2.mp4` until 2026-08-20. It says `clip2b.mp4` now.
#    Running the old line puts the invented sign back into segment A.
#
# ── CORRECTION 2 · CLIP 3 IS TRIMMED TO 87 FRAMES ── commit 740f64c
#    Clip 3 and clip 4b were both anchored to the same still (s5b), but clip 3
#    OVERSHOOTS it. Clip 3's frame 87 matches clip 4b's first frame at distance
#    1.30; clip 3's LAST frame is at 26.78 — twenty times further away. Joining
#    the two whole therefore teleports the camera 34 frames, 1.42s, backwards
#    away from the machine, exactly at the segment-B join. It is not a stutter
#    and not a reversed camera: it is a seam mismatch, and it lands on the
#    film's peak moment.
#
#    Trimming clip 3 to its first 87 frames closes it. Segment B becomes
#    208 raw -> 207 unique, 8.63s, with 0 backward pairs on the direction pass,
#    down from 1. Untrimmed, this script rebuilds the 1.42s jump.
#
# ── HOW THE TRIM CHANGES THE JOIN ──
#    An untrimmed pair is still joined with a stream copy, exactly as before. A
#    trimmed pair cannot be: the cut has to land on an exact frame mid-stream,
#    which a keyframe-aligned copy will not do. So a trimmed pair goes through
#    the concat FILTER and is re-encoded once at crf 16 on the way into
#    seg-<n>-raw.mp4. Segments A and C never take that path and are entirely
#    unaffected by this change.
#
# ── NOT VERIFIED BY EXECUTION ──
#    Both corrections were transcribed from the commits named above on
#    2026-08-20 and have NOT been re-run: the shipped sequences were already
#    correct and verified, and re-running risked them for no gain. THE SHIPPED
#    FRAMES UNDER public/assets/lab/seg ARE THE REFERENCE, not this script's
#    output. If you do rebuild, diff against them before committing anything.
#    The one number here that is independently evidenced is segment B's 208 raw
#    frames, and this script now checks it and complains out loud if it differs.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

GUARD=""
for a in "$@"; do
  [ "$a" = "--i-know-what-this-rebuilds" ] && GUARD=1
done

if [ -z "$GUARD" ]; then
  cat >&2 <<'REFUSED'

REFUSED — build-segments.sh rebuilds assets that are already shipped.

  This overwrites the frame sets under public/assets/lab/seg. Those are
  committed, are what /concepts/lab actually paints, and were measured at
  65.9 MB peak / 60 fps / 0 frames over 20ms. Nothing about the page needs
  them rebuilt, and regenerating them can only move those numbers.

  It also needs the six source clips in $SP, which are NOT in the repo. They
  are re-downloadable from the Higgsfield account at no credit cost;
  regenerating them instead loses the takes that were chosen on measured
  tiebreaks.

  Two corrections are baked into this file and were nearly lost once already:
    · segment A takes clip2b.mp4, the reroll WITHOUT the "NADUV" signage
    · clip 3 is trimmed to 87 frames, or the segment-B seam jumps 1.42s
  Read the header before you override this.

  If you mean it:
      SP=/path/to/scratchpad ./scripts/build-segments.sh --i-know-what-this-rebuilds

REFUSED
  exit 2
fi

SP="${SP:?set SP to the scratchpad dir}"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
FF="$REPO/node_modules/ffmpeg-static/ffmpeg.exe"
FP="$REPO/node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe"

OUT="$REPO/public/assets/lab/seg"
W_FRAMES=90
T_FRAMES=60

# build <name> <clip1> <clip2> [trim1_frames] [expect_raw]
#   trim1_frames  keep only the first N frames of <clip1>. 0 = the whole clip.
#   expect_raw    complain if the joined raw frame count is not this. 0 = skip.
build () {
  local NAME=$1 C1=$2 C2=$3 TRIM1=${4:-0} EXPECT=${5:-0}
  local NOTE=""
  [ "$TRIM1" -gt 0 ] && NOTE=", $C1 trimmed to ${TRIM1}f"
  echo "════════ SEGMENT $NAME  ($C1 + $C2$NOTE) ════════"

  # 1 — join the pair.
  if [ "$TRIM1" -gt 0 ]; then
    # Trimmed join. The cut lands on an exact frame, so a stream copy is not
    # available here. One re-encode at crf 16. See CORRECTION 2 in the header.
    "$FF" -v error -i "$SP/$C1" -i "$SP/$C2" -filter_complex \
      "[0:v]trim=end_frame=$TRIM1,setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1[v]" \
      -map "[v]" -an -c:v libx264 -crf 16 -y "$SP/seg-$NAME-raw.mp4"
  else
    # Both sources are h264 1920x1080 24fps, so a stream copy is safe.
    printf "file '%s'\nfile '%s'\n" "$SP/$C1" "$SP/$C2" > "$SP/seg-$NAME.txt"
    "$FF" -v error -f concat -safe 0 -i "$SP/seg-$NAME.txt" -c copy -y "$SP/seg-$NAME-raw.mp4"
  fi

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

  if [ "$EXPECT" -gt 0 ] && [ "$RAW" != "$EXPECT" ]; then
    echo "  !! EXPECTED $EXPECT RAW FRAMES, GOT $RAW." >&2
    echo "     Segment $NAME is not the shape the shipped film was cut from." >&2
    echo "     Check that $C1 is the right take and that the trim applied." >&2
  fi

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

  # 4 — encoding is NOT done here. See the note at the top of this file.
}

# clip2b, NOT clip2 — CORRECTION 1.  clip 3 trimmed to 87 — CORRECTION 2.
build a clip1.mp4 clip2b.mp4
build b clip3.mp4 clip4b.mp4 87 208
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
