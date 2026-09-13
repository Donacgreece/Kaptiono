# Kaptiono licensing scope

## First-party Kaptiono material

Unless a file or section is identified as third-party material, original Kaptiono code and documentation are made available under:

`SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0`

The PolyForm Noncommercial license applies only to Kaptiono-owned material. It does not replace, narrow or expand rights granted by third-party licenses.

## Other third-party browser components

Kaptiono also uses third-party browser software such as Mediabunny and Hugging Face Transformers.js. Those components retain their own upstream licenses and are not relicensed under PolyForm. Model weights loaded by the Local AI workflow retain the license terms published by their respective model repositories/cards. See `THIRD_PARTY_NOTICES.md`.

## Safari/WebKit LibAV audio fallback

Kaptiono includes a separately loaded `libav.js` / FFmpeg WebAssembly runtime used only as an audio-decoding fallback when browser-native and WebCodecs paths cannot decode source audio reliably.

The production fallback is intentionally kept separate from Kaptiono first-party JavaScript under `vendor/libav/`. The runtime remains subject to its upstream licenses, including LGPL-2.1-or-later terms for the FFmpeg library portions and 0BSD terms for applicable libav.js wrapper material.

Kaptiono's own source remains under PolyForm-Noncommercial-1.0.0. The third-party runtime is not relicensed under PolyForm.

The fallback build is decode-focused. It enables MP4/MOV demuxing, AAC/ALAC decoding, resampling and PCM/WAV output. It deliberately disables GPL and nonfree FFmpeg modes, does not enable AAC encoding, and rejects external codec libraries such as x264, x265, FDK-AAC and FAAC in the release build.

To preserve a clear LGPL component boundary, the production deployment:

- serves the LibAV/FFmpeg runtime as separate replaceable JavaScript/WebAssembly files;
- publishes the exact corresponding source and build configuration under `third-party-source/`;
- publishes the LGPL and 0BSD license texts under `THIRD_PARTY_LICENSES/`;
- documents how a compatible modified runtime can replace the distributed runtime;
- does not prohibit reverse engineering, modification or replacement of the separate LGPL component to the extent needed to exercise LGPL rights.

See `THIRD_PARTY_NOTICES.md`, `THIRD_PARTY_SOURCE_OFFER.md`, `LIBAV_RUNTIME_REPLACEMENT.md` and `PATENT_NOTICE.md`.

This file is an engineering compliance record, not legal advice.
