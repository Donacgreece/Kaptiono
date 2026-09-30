# Kaptiono v1.0.3

Released: 2026-09-30

## Caption timing editor

Kaptiono v1.0.3 adds direct subtitle timing correction while preserving the text-edit persistence introduced in v1.0.2.

### New

- Editable Start and End timecodes for every caption.
- Millisecond-level timing values using `m:ss.SSS` or `h:mm:ss.SSS`.
- A draggable caption timeline directly under the video preview.
- Drag a caption block to move it earlier or later without changing its duration.
- Drag the left or right edge of a caption block to adjust its start or end time.
- Timeline zoom from 0.75x to 4x for finer timing work.
- Clicking a caption or its preview button seeks the video to that caption.
- Overlap warnings highlight captions whose time ranges intersect.

### Persistence and safety

- Manual timing changes retime the caption's word timestamps and synchronize them back to the working transcript.
- Manually timed captions are stored as protected timing groups so later design reflow does not silently discard the corrected timing.
- Existing manual spelling and wording corrections remain synchronized with timing edits.
- Caption timing is clamped to the video duration and captions keep a minimum safe duration.
- PWA cache and asset metadata were updated to v1.0.3 so the new editor code is loaded reliably.

The original video remains on-device for Local workflows. This release does not change Cloud High Accuracy data handling.
