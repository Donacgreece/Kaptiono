# LibAV audio fallback compliance record

This file records the controls used for Kaptiono's Safari/WebKit LibAV/FFmpeg WebAssembly audio fallback. It is an engineering compliance record, not legal advice.

## Component boundary

Kaptiono first-party code remains under `PolyForm-Noncommercial-1.0.0`. The LibAV/FFmpeg runtime is distributed separately under `vendor/libav/` and retains its upstream licenses.

## Pinned build

- libav.js release: `v6.10.9.0`
- libav.js commit: `c80e885c3461f7bb7ea565c9631b34243ae0dbf1`
- FFmpeg source: `9.0`
- Emscripten in CI: `6.0.5`
- custom variant: `kaptiono-audio-cli`

## Release guards

The CI build fails if:

- FFmpeg GPL mode is enabled;
- FFmpeg nonfree mode is enabled;
- the AAC decoder, ALAC decoder, MOV/MP4 demuxer, WAV muxer or PCM S16LE encoder is missing;
- the AAC encoder is enabled;
- x264, x265, FDK-AAC, FAAC, LAME, libopus or libvorbis are linked.

The fallback is intentionally decode-focused. Kaptiono does not use this FFmpeg build for H.264 video encoding or AAC audio encoding.

## Corresponding source and replaceability

Every deployment serving the compiled runtime also serves the exact corresponding source archive and preserves a runtime replacement hook through `window.KAPTIONO_LIBAV_BASE`.

See `THIRD_PARTY_SOURCE_OFFER.md` and `LIBAV_RUNTIME_REPLACEMENT.md`.

## Patent separation

Open-source copyright-license compliance does not determine codec patent obligations. See `PATENT_NOTICE.md` before commercial distribution at scale.
