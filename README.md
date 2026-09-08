# Kaptiono Web Lab 0.3

Experimental browser-only Kaptiono build. Video and audio processing stay on the user's device.

## What changed in 0.3

- High quality Whisper Small timestamped model option, with Base and Tiny alternatives.
- Greek is selected explicitly by default in the Greek UI, instead of relying on short-clip auto detection.
- Whisper receives continuous audio with context-aware chunking and overlap instead of independent 25 second chunks.
- Audio extraction uses Mediabunny + WebCodecs first, designed to work with MP4/MOV media on modern Safari/iPhone.
- Web Audio remains a fallback.
- Desktop Caption Studio control model ported to the web build: 8 presets and 6 settings panels.
- Full live caption reflow when words-per-caption, speed, width or line count changes.
- New service-worker cache version to avoid stale 0.1 code.

## Test target

1. Windows Edge/Chrome with Whisper Small + Greek.
2. iPhone Safari 26.x with Whisper Base + Greek first.
3. If Base is stable on the iPhone, test Small.

The first model load can be large. Model files are cached by the browser where supported.
