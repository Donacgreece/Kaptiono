# Changelog

## 0.5.20
- Added Automatic Voice Boost Retry for Whisper results dominated by explicit music markers.
- Voice Boost activates only after the first Whisper pass indicates that the result is primarily music/non-speech.
- Normal successful transcriptions are not processed twice.
- Uses the same already-loaded Whisper model, so no additional AI model is downloaded.
- Added lightweight local DSP for the retry pass: rumble reduction, speech-band emphasis, normalization and gentle dynamic compression.
- The original video and audio are never modified.
- The retry result is accepted only when it clearly recovers more speech than the original result.
- If Voice Boost fails or does not improve recognition, Kaptiono safely keeps the original Whisper transcript.
- Added progress feedback only when Automatic Voice Boost actually triggers.
- Added analytics flags for Voice Boost retry and successful recovery.
- No layout, export, caption styling, AdSense, licensing, PWA, or Coming Soon AI behavior was changed.
- Preserved the permanent full product README byte-for-byte.

## 0.5.19
- Removed the dedicated Contact card from the Support page to keep Support cleaner and less repetitive.
- Kept Contact in the footer with mailto:info@kaptiono.com.
- Kept Support, Roadmap and GitHub footer navigation unchanged.
- Kept the README contact information and commercial licensing contact unchanged.
- No captioning, transcription, export, AI, mobile, PWA, analytics or AdSense behavior was changed.

## 0.5.18
- Added info@kaptiono.com as the official Kaptiono contact address.
- Added a dedicated Contact card to the Support page for feedback, bugs, partnerships and commercial licensing.
- Added compact footer navigation for Support, Roadmap, Contact and GitHub.
- Contact links use mailto:info@kaptiono.com.
- Added a Contact section to the existing full README.
- Added the contact address to the commercial licensing note in the README.
- No captioning, transcription, export, AI, mobile, PWA, analytics or AdSense behavior was changed.

## 0.5.17
- Added a public source-available license notice using PolyForm Noncommercial License 1.0.0.
- Added SPDX identifier PolyForm-Noncommercial-1.0.0.
- Added a Required Notice identifying the Kaptiono copyright holder.
- Clarified that the public license does not grant commercial use.
- Added TRADEMARKS.md to keep the Kaptiono name, logo, icon and brand identity separate from the source-code license.
- Added a licensing section and license badge to the existing full product README.
- Clarified that Kaptiono should be described as source available rather than OSI open source.
- No application, transcription, export, AI, mobile, PWA, analytics, or AdSense behavior was changed.

## 0.5.16
- Rebuilt word-by-word highlight timing around the actual video frame loop.
- Uses requestVideoFrameCallback when available and requestAnimationFrame as fallback.
- Removed dependence on low-frequency timeupdate events for active-word animation.
- Added midpoint timing boundaries to eliminate tiny dead zones between adjacent Whisper words.
- Added a very small visual sync lead to compensate for paint latency.
- Added a deterministic single-active-word engine.
- Added smooth TikTok-style active-word color and subtle scale transitions.
- Updated burned-in video export to use the same active-word timing logic as live preview.
- Added manual caption-edit word realignment so edited caption text no longer leaves stale highlighted words.
- User-added words receive interpolated timing while aligned/replaced words keep their original Whisper timing.
- Kept the v0.5.10-style mobile layout, AdSense, Coming Soon AI states, and transcription engine unchanged.
- Preserved the permanent full product README byte-for-byte.

## 0.5.15
- Removed the Google Analytics / AdSense mention from the visible Home privacy note.
- Home now simply states that video, audio and captions stay on the user's device.
- Kept the AdSense script enabled.
- Kept the more detailed privacy disclosure in the Support section.
- Preserved the permanent full product README unchanged.

## 0.5.14
- Reverted the v0.5.13 mobile Home compression.
- Restored the Home/mobile layout behavior from the earlier v0.5.10-style design.
- Removed the extra short-phone typography reductions that made text too small on iPhone.
- Kept all newer functionality, including AdSense and the Coming Soon states for Large v3 Turbo and Enhanced.
- Left Caption Studio, transcription, export, roadmap, and PWA logic unchanged.
- Preserved the permanent full product README unchanged.

## 0.5.13
- Reworked Home sizing around the actual device viewport instead of fixed mobile heights.
- The full Home card now targets the visible phone viewport using small viewport units, including browsers with dynamic address bars.
- The footer is intentionally placed below the first Home screen, so the landing card itself should not require scrolling.
- Added compact scaling for short phones without shrinking the Caption Studio/editor.
- Added a dedicated mobile-landscape layout that uses two columns instead of stacking oversized blocks.
- Reduced Home-only spacing, typography, upload-area sizing, badge sizing, and privacy-note height responsively.
- Shortened the Home privacy note while keeping the detailed privacy wording in Support.
- No transcription, export, AI model, AdSense, roadmap, or editor logic was changed.
- Preserved the permanent full product README unchanged.

## 0.5.12
- Temporarily disabled Whisper Large v3 Turbo after real-world browser testing showed unreliable loading and long idle failures.
- Kept Large v3 Turbo visible in the model selector as High Accuracy · Coming Soon.
- Temporarily disabled Enhanced after real-world browser testing showed unreliable second-model loading.
- Kept Enhanced visible as a muted, non-clickable Coming Soon preview.
- Added hard runtime guards so stale browser state cannot activate either unfinished feature.
- Removed the Enhanced worker from the service-worker shell cache while the feature is unavailable.
- Added the requested Google AdSense loader for publisher ca-pub-9529892005549874.
- Updated privacy-facing copy to reflect that Google Analytics and Google AdSense are also loaded by the page.
- Preserved the permanent full product README unchanged.

## 0.5.11
- Added optional Whisper Large v3 Turbo as High Accuracy mode for powerful desktop/laptop devices.
- Kept Whisper Small as the default Recommended model.
- Added optional Enhanced mode, OFF by default and marked Experimental.
- Enhanced performs a second multilingual local AI pass using a small instruction model to repair likely ASR word-recognition mistakes from context.
- Enhanced does not upload transcript, audio, captions, or video.
- Added conservative hallucination guards and token alignment so corrected words retain Whisper timing wherever possible.
- If Enhanced fails, runs out of memory, or produces an unsafe rewrite, Kaptiono preserves the original Whisper transcript instead of failing caption generation.
- Added a five-stage progress flow when Enhanced is enabled.
- Added mobile and high-memory warnings for Large v3 Turbo.
- Preserved the permanent full product README unchanged.

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
