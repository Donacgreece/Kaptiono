# Kaptiono v1.0.2

Released: 2026-09-30

Kaptiono v1.0.2 is a caption-editing reliability update. Manual subtitle corrections now remain intact when the user changes caption design or layout settings.

## What changed

- Fixed corrected caption text reverting to the original Whisper transcript after applying a design preset.
- Manual edits are synchronized into the working timed-word transcript as the user types.
- Before any layout reflow, Kaptiono commits the current edited captions as the new source text.
- Caption reflow can still react to preset, width, max-word, max-line and pacing changes without losing spelling or wording corrections.
- Updated application, asset and service-worker versioning to v1.0.2.

## Behavior

The corrected transcript is now the canonical working transcript for the current project. Design changes can reorganize caption boundaries when required, but they no longer restore the original unedited Whisper wording.

## Version

Application version: `1.0.2`
