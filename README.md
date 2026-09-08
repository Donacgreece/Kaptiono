# Kaptiono Web Lab 0.4.1

Browser-only Kaptiono build. Video and audio processing stay on the user's device.

## What changed in 0.4.1

- The Kaptiono logo now really returns to the home screen instead of only scrolling to the top while the home card stays hidden.
- The home hero is rebuilt as a balanced 50/50 desktop grid.
- The copy panel and upload panel now use matching heights and spacing.
- Home feature badges use a symmetric 2x2 grid.
- The privacy note is centered under both columns.
- Responsive behavior keeps the same visual balance on tablet and mobile.
- Service-worker and asset versions were bumped to avoid stale cached UI.

## Existing 0.4 behavior

- Whisper Small is the default AI model.
- Clear local video download with burned-in captions.
- MP4 when supported by MediaRecorder, otherwise WebM.
- SRT and TXT export remain available.
