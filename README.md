# Kaptiono Web Lab v0.5.5

Hotfix release for transcription on custom domains while HTTPS is still provisioning.

## Fixed
- Whisper no longer crashes when the browser Cache API is unavailable.
- Browser model cache is used only when the current context supports it.
- On temporary HTTP custom-domain access, transcription continues without persistent browser cache.
- A clear compatibility note explains that the AI model may need to download again until HTTPS is active.
- PWA/static cache version bumped to 0.5.5.

The Google Analytics configuration and all v0.5.4 features remain included.
