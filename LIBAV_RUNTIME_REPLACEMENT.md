# Replacing the Kaptiono LibAV / FFmpeg audio runtime

Kaptiono first-party code is licensed separately from the LibAV/FFmpeg WebAssembly audio fallback.

## Default runtime

- libav.js: 6.10.9.0
- pinned upstream commit: `c80e885c3461f7bb7ea565c9631b34243ae0dbf1`
- FFmpeg: 9.0
- variant: `kaptiono-audio-cli`
- build recipe: `tools/build-libav-audio.sh`
- variant configuration: `tools/libav-kaptiono-audio-config.json`

The production files are served separately under `vendor/libav/` and the exact corresponding source is served under `third-party-source/`.

## Compatible replacement

A compatible rebuilt runtime can replace the files under `vendor/libav/` without changing Kaptiono first-party source.

For development or a separately hosted compatible build, define this global before Kaptiono requests the fallback runtime:

```html
<script>
window.KAPTIONO_LIBAV_BASE = '/my-compatible-libav-runtime/'
</script>
```

The target directory must expose compatible files using the version and variant filenames expected by Kaptiono.

The fallback is lazy-loaded only when normal browser audio decoding fails. Kaptiono does not prohibit inspection, modification, reverse engineering or replacement of this separate runtime to the extent required to exercise rights granted by the LGPL.

This document describes the technical component boundary and is not legal advice.
