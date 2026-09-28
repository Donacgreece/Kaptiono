# Kaptiono v1.0.1

Released: 2026-09-28

Kaptiono v1.0.1 is a reliability update for Local Whisper transcription on slower devices and longer videos.

## What changed

- Replaced the fixed 90-second Local AI watchdog behavior that could terminate valid long-running transcription.
- Added approximately 30-second outer audio chunks for Local Whisper processing.
- Added real chunk-by-chunk transcription progress with processed and total audio time.
- Added separate watchdog behavior for model loading and active transcription.
- Active Local transcription can continue for substantially longer without being mistaken for a stalled worker.
- Voice Boost retries use the same chunked processing path.
- Updated service-worker and asset cache versioning to ensure the v1.0.1 runtime replaces v1.0.0 cleanly.

## Compatibility

The original video remains on the user's device. Local transcription continues to run in-browser with Whisper/WASM. Cloud High Accuracy behavior is unchanged.

## Version

Application version: `1.0.1`
