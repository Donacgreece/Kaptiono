# Third-party notices

Kaptiono first-party code is licensed separately under `PolyForm-Noncommercial-1.0.0`. Nothing in that license relicenses or overrides the third-party materials listed here.

## libav.js / FFmpeg WebAssembly audio fallback

Purpose: local fallback decoding for Safari/WebKit and other browsers when the normal audio extraction path cannot decode an MP4/MOV audio track.

Production configuration:

- libav.js: 6.10.9.0
- pinned libav.js commit: `c80e885c3461f7bb7ea565c9631b34243ae0dbf1`
- FFmpeg source: 9.0
- Kaptiono variant: `kaptiono-audio-cli`
- Runtime path: `vendor/libav/`
- Corresponding source: `third-party-source/libavjs-6.10.9.0-kaptiono-audio-source.tar.xz`

Licensing:

- FFmpeg library portions used by this build remain under applicable LGPL-2.1-or-later terms.
- Applicable libav.js wrapper material retains upstream 0BSD notices.
- emfiberthreads material included by the libav.js toolchain retains its upstream 0BSD terms.

License copies:

- `THIRD_PARTY_LICENSES/LGPL-2.1.txt`
- `THIRD_PARTY_LICENSES/LIBAVJS-0BSD.txt`
- `THIRD_PARTY_LICENSES/EMFIBERTHREADS-0BSD.txt`

The Kaptiono build configuration rejects FFmpeg GPL and nonfree modes and rejects external x264/x265, FDK-AAC, FAAC, LAME, libopus and libvorbis libraries. AAC encoding is not enabled in this fallback. It is used for decode only.

The WebAssembly runtime is loaded lazily and remains a separate replaceable component. See `LIBAV_RUNTIME_REPLACEMENT.md` for replacement instructions and `THIRD_PARTY_SOURCE_OFFER.md` for corresponding-source information.

## Mediabunny

Kaptiono loads Mediabunny 1.55.7 from jsDelivr for browser-side media parsing and audio/video processing. Mediabunny is a third-party project distributed under MPL-2.0 and remains under its upstream license. Kaptiono does not relicense Mediabunny under PolyForm.

Upstream project: https://github.com/Vanilagy/mediabunny

License copy: `THIRD_PARTY_LICENSES/MPL-2.0.txt`

## Transformers.js and model providers

Kaptiono's Local AI path uses Hugging Face Transformers.js 3.8.1, which is distributed under Apache-2.0, together with separately distributed model files. The Transformers.js license copy is provided at `THIRD_PARTY_LICENSES/Apache-2.0.txt`. Model weights retain the license and terms stated by their respective upstream model repositories/cards. Kaptiono's first-party license does not alter those rights.

This notice is informational and is not legal advice.
