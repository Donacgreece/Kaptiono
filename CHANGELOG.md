# Changelog

## 0.5.10
- Added immediate visual acknowledgement when video export is clicked.
- Added an export status panel directly below the player, so quick export no longer appears frozen.
- Added accurate export stages: Preparing video, Rendering captions, and Finalizing file.
- Uses real video playback/render progress during the rendering stage instead of fake percentages.
- Added an indeterminate progress animation only for stages where the browser cannot provide a meaningful percentage.
- Download buttons are disabled during an active export to prevent accidental double exports.
- Added clear local-processing and keep-this-page-open messaging in Greek and English.
- Added completed and failed export states.
- Preserved the permanent full product README unchanged.

## 0.5.9
- Replaced the simple Support roadmap block with a dedicated Product Roadmap view.
- Added Now, Next, Later and Exploring roadmap lanes with creator-focused feature directions.
- Added clear wording that roadmap items are direction, not promised delivery dates.
- Added optional support context explaining what community support helps fund.
- Added a branded Kaptiono boot splash with no artificial minimum delay.
- Kept PWA background/theme colors aligned with the app splash.
- Preserved the permanent full product README unchanged.

Release-specific changes belong here. The main `README.md` is the permanent product README and must not be replaced by release notes.

## 0.5.8

- Unified live-preview and export caption metrics.
- Video export now respects letter spacing, rotation, text opacity, shadow, box padding, alignment and word highlighting.
- Export line height, outline scaling and caption box geometry now match the live player much more closely.
- Fade and pop entry animation are reproduced in burned-in export.
- Fixed quoted font-family handling in Canvas export.
- Preserved the full product-facing README.

## 0.5.7

- Added clear staged progress for local AI loading, transcription and caption generation.
