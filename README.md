# Kaptiono Web Lab 0.4

Browser-only Kaptiono build. Video and audio processing stay on the user's device.

## What changed in 0.4

- Whisper Small is now the default AI model because it gives the best caption quality.
- Base and Tiny remain available as lighter alternatives.
- A clear **Download video with captions** action now appears directly under the main preview player.
- The Export tab now has a large primary burned-in video download button.
- Video export chooses the best browser-supported local format automatically: MP4 when MediaRecorder supports it, otherwise WebM.
- SRT and TXT remain available separately.
- New service-worker cache version avoids stale 0.3 UI.

## Notes

The browser records the rendered preview locally in real time, so a 1 minute video normally needs roughly 1 minute to export. Browser codec support varies by platform.
