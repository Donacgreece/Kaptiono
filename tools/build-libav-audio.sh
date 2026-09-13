#!/usr/bin/env bash
set -euo pipefail

LIBAV_TAG="v6.10.9.0"
LIBAV_COMMIT="c80e885c3461f7bb7ea565c9631b34243ae0dbf1"
LIBAV_VERSION="6.10.9.0"
FFMPEG_VERSION="9.0"
VARIANT="kaptiono-audio-cli"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHE_DIR="${KAPTIONO_LIBAV_CACHE_DIR:-$ROOT/.cache/libav-kaptiono-audio}"
PUBLIC_RUNTIME="$ROOT/vendor/libav"
PUBLIC_SOURCE="$ROOT/third-party-source"
CONFIG_JSON="$ROOT/tools/libav-kaptiono-audio-config.json"
SOURCE_ARCHIVE="libavjs-${LIBAV_VERSION}-kaptiono-audio-source.tar.xz"
RUNTIME_FILES=(
  "libav-${LIBAV_VERSION}-${VARIANT}.js"
  "libav-${LIBAV_VERSION}-${VARIANT}.wasm.js"
  "libav-${LIBAV_VERSION}-${VARIANT}.wasm.wasm"
)

mkdir -p "$PUBLIC_RUNTIME" "$PUBLIC_SOURCE" "$CACHE_DIR"

cache_valid=true
for file in "${RUNTIME_FILES[@]}"; do
  if [ ! -s "$CACHE_DIR/runtime/$file" ]; then cache_valid=false; fi
done
if [ ! -s "$CACHE_DIR/source/$SOURCE_ARCHIVE" ]; then cache_valid=false; fi

if [ "$cache_valid" = true ]; then
  echo "Using cached Kaptiono LibAV/FFmpeg audio runtime"
  mkdir -p "$PUBLIC_RUNTIME" "$PUBLIC_SOURCE"
  cp "$CACHE_DIR/runtime/"* "$PUBLIC_RUNTIME/"
  cp "$CACHE_DIR/source/$SOURCE_ARCHIVE" "$PUBLIC_SOURCE/$SOURCE_ARCHIVE"
  exit 0
fi

if ! command -v emcc >/dev/null 2>&1; then
  echo "Emscripten is required when the LibAV cache is empty." >&2
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
SRC="$WORK/libav.js"

git init "$SRC"
cd "$SRC"
git remote add origin https://github.com/Yahweasel/libav.js.git
git fetch --depth 1 origin "$LIBAV_COMMIT"
git fetch --depth 1 origin "refs/tags/${LIBAV_TAG}:refs/tags/${LIBAV_TAG}"
test "$(git rev-list -n 1 "$LIBAV_TAG")" = "$LIBAV_COMMIT"
git checkout --detach FETCH_HEAD
test "$(git rev-parse HEAD)" = "$LIBAV_COMMIT"
npm ci --no-audit --no-fund
CONFIG_COMPACT="$(tr -d '\r\n' < "$CONFIG_JSON")"
( cd configs && node mkconfig.js "$VARIANT" "$CONFIG_COMPACT" )
CONFIG_DIR="$SRC/configs/configs/$VARIANT"

make -j2 \
  "dist/libav-${LIBAV_VERSION}-${VARIANT}.js" \
  "dist/libav-${LIBAV_VERSION}-${VARIANT}.wasm.js"

WASM_CONFIG="$SRC/build/ffmpeg-${FFMPEG_VERSION}/build-base-${VARIANT}/ffbuild/config.mak"
if [ ! -f "$WASM_CONFIG" ]; then
  echo "FFmpeg configuration record was not produced by the LibAV build." >&2
  exit 1
fi
if grep -Eq '^CONFIG_GPL=(yes|1)$' "$WASM_CONFIG"; then
  echo "GPL mode is active in the LibAV/FFmpeg build. Deployment rejected." >&2
  exit 1
fi
if grep -Eq '^CONFIG_NONFREE=(yes|1)$' "$WASM_CONFIG"; then
  echo "Nonfree mode is active in the LibAV/FFmpeg build. Deployment rejected." >&2
  exit 1
fi
for required_config in \
  CONFIG_AAC_DECODER \
  CONFIG_ALAC_DECODER \
  CONFIG_MOV_DEMUXER \
  CONFIG_WAV_MUXER \
  CONFIG_PCM_S16LE_ENCODER; do
  if ! grep -Eq "^${required_config}=(yes|1)$" "$WASM_CONFIG"; then
    echo "Required LGPL FFmpeg component is not active: ${required_config}" >&2
    exit 1
  fi
done
if grep -Eq '^CONFIG_AAC_ENCODER=(yes|1)$' "$WASM_CONFIG"; then
  echo "AAC encoding is not required by Kaptiono's decode-only fallback. Deployment rejected." >&2
  exit 1
fi
if grep -Eq '^CONFIG_(LIBX264|LIBX265|LIBFDK_AAC|LIBFAAC|LIBMP3LAME|LIBOPUS|LIBVORBIS)=(yes|1)$' "$WASM_CONFIG"; then
  echo "Forbidden external/GPL/nonfree codec library detected in LibAV build." >&2
  exit 1
fi

echo "FFmpeg LGPL decode-only configuration guards passed."

for file in "${RUNTIME_FILES[@]}"; do
  test -s "$SRC/dist/$file"
  cp "$SRC/dist/$file" "$PUBLIC_RUNTIME/$file"
done

SOURCE_STAGE="$WORK/source-stage"
mkdir -p "$SOURCE_STAGE"
git archive --format=tar.gz --prefix="libav.js-${LIBAV_TAG}/" HEAD > "$SOURCE_STAGE/libav.js-${LIBAV_TAG}.tar.gz"
test -s "$SRC/build/ffmpeg-${FFMPEG_VERSION}.tar.xz"
cp "$SRC/build/ffmpeg-${FFMPEG_VERSION}.tar.xz" "$SOURCE_STAGE/ffmpeg-${FFMPEG_VERSION}.tar.xz"
EMFIBER_SOURCE="$(find "$SRC/build" -maxdepth 1 -type f -name 'emfiberthreads-*.tar.*' -print -quit)"
if [ -z "$EMFIBER_SOURCE" ] || [ ! -s "$EMFIBER_SOURCE" ]; then
  echo "emfiberthreads corresponding source archive was not produced by the LibAV build." >&2
  exit 1
fi
cp "$EMFIBER_SOURCE" "$SOURCE_STAGE/"
cp "$CONFIG_JSON" "$SOURCE_STAGE/kaptiono-libav-audio-config.json"
cp -R "$CONFIG_DIR" "$SOURCE_STAGE/generated-${VARIANT}-config"
cp "$WASM_CONFIG" "$SOURCE_STAGE/ffmpeg-config.mak"
cp "$ROOT/tools/build-libav-audio.sh" "$SOURCE_STAGE/build-libav-audio.sh"
cat > "$SOURCE_STAGE/kaptiono-ffmpeg-changes.diff" <<'DIFF'
# Kaptiono direct changes to FFmpeg 9.0
#
# Kaptiono applies no direct patch to the pristine FFmpeg 9.0 source archive.
# This file is intentionally empty apart from this explanatory notice.
# The exact libav.js source, generated configuration and build recipe are
# included beside this file in the corresponding-source archive.
DIFF
cat > "$SOURCE_STAGE/README.txt" <<README
Kaptiono LibAV/FFmpeg WASM Audio Fallback corresponding source

libav.js: ${LIBAV_TAG} (${LIBAV_COMMIT})
FFmpeg: ${FFMPEG_VERSION}
Variant: ${VARIANT}
Emscripten: 6.0.5

This source bundle accompanies the separately loaded LGPL LibAV/FFmpeg runtime
used only when the browser's native/WebCodecs audio decoders cannot decode the
source audio. The custom build is decode-focused. It enables AAC/ALAC decode,
MP4/MOV demuxing, resampling, and WAV/PCM output. GPL and nonfree modes are
disabled, AAC encoding is intentionally excluded, and no x264/x265/FDK-AAC/
FAAC/LAME/libopus/libvorbis libraries are linked.
README

tar -C "$SOURCE_STAGE" -cJf "$PUBLIC_SOURCE/$SOURCE_ARCHIVE" .

rm -rf "$CACHE_DIR/runtime" "$CACHE_DIR/source"
mkdir -p "$CACHE_DIR/runtime" "$CACHE_DIR/source"
cp "$PUBLIC_RUNTIME/"* "$CACHE_DIR/runtime/"
cp "$PUBLIC_SOURCE/$SOURCE_ARCHIVE" "$CACHE_DIR/source/$SOURCE_ARCHIVE"

echo "Kaptiono LibAV/FFmpeg WASM audio fallback built with LGPL-only, decode-focused configuration."
