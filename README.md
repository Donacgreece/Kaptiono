# Kaptiono Web Lab v0.5.6

Critical transcription hotfix.

## Root cause fixed
The app was still creating the Whisper worker with the hard-coded URL:

`whisper-worker.js?v=0.4.0`

That meant browsers could keep serving an old worker even after the main app had been upgraded to v0.5.5. The old worker forced Browser Cache and failed on the temporary non-HTTPS custom domain.

## Fixes
- Whisper worker now uses the current `APP_VERSION` as its cache-busting query.
- The v0.5.6 PWA shell includes the matching versioned Whisper worker.
- Browser AI cache is enabled only in a secure HTTPS context.
- On temporary HTTP access, Kaptiono uses WASM without persistent model cache.
- HTTPS notice now correctly explains which PWA features require HTTPS.

Google Analytics and all previous features remain included.
