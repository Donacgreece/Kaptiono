# Kaptiono v1.0.4

Released: 2026-10-01

## Fixed

- Improved audio reliability in downloaded caption videos.
- Social Compatible export avoids unnecessary AAC re-encoding where possible.
- Exported audio duration is validated before the file is downloaded.
- Added a safe fallback path when audio is missing or materially shorter than the source.
- Fast Export flushes pending audio data before recorder shutdown.
- Updated Mediabunny to 1.61.0, including upstream audio/conversion fixes released after the previously pinned 1.55.7.
