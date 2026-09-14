# Third-party corresponding source

Kaptiono distributes a separately loaded LibAV/FFmpeg WebAssembly audio fallback for browser compatibility.

## Runtime

- libav.js: v6.10.9.0
- pinned upstream commit: `c80e885c3461f7bb7ea565c9631b34243ae0dbf1`
- FFmpeg: 9.0
- Kaptiono variant: `kaptiono-audio-cli`
- production runtime: `vendor/libav/`

## Corresponding source

The same production deployment that serves the compiled runtime also serves:

`third-party-source/libavjs-6.10.9.0-kaptiono-audio-source.tar.xz`

The archive contains the exact pinned libav.js source, the FFmpeg 9.0 source archive used by the build, emfiberthreads source produced by the libav.js build, Kaptiono's custom variant configuration, generated FFmpeg configuration, final `ffmpeg-config.mak`, the reproducible build script and a record of direct FFmpeg source changes.

Kaptiono applies no direct patch to the pristine FFmpeg 9.0 source archive. The runtime is deliberately separate and replaceable. See `LIBAV_RUNTIME_REPLACEMENT.md`.

This source availability is provided for third-party license compliance. It is not legal advice.
