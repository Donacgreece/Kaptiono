# Changelog

## 0.5.40
- Added live Cloud High Accuracy daily availability in the AI model area.
- Added Cloud quota preflight so a video is not started when the remaining daily Cloud time is insufficient.
- Added server quota synchronization after each Cloud transcription and daily reset awareness.
- Added support for the Cloudflare Worker D1 quota endpoint and audio-duration quota accounting.

## 0.5.38
- Added a polished opt-in privacy banner with Accept Analytics, Reject optional and detailed privacy settings.
- Google Analytics now stays unloaded until explicit Analytics consent is granted, with consent revocation available from the footer.
- Removed unconditional Google AdSense loading so advertising tags do not run before a compliant advertising consent flow is available.
- Added bilingual Privacy Policy, Cookie Policy and Terms of Use pages with responsive desktop and mobile layouts.
- Reworked the footer into balanced primary and legal link groups, including persistent Privacy Preferences access.
- Added Privacy, Cookies and Terms URLs to sitemap.xml and the new privacy/legal assets to the PWA application shell.

## 0.5.37
- Clarified the Local AI download alternative as "Smaller Local model or Cloud".
- The alternative action now returns the user to the model selector instead of silently switching models.
- Keeps the alternative available for Tiny when Cloud is available, and adapts the label when Cloud quota is unavailable.

## 0.5.36
- Added first-time confirmation before downloading a Local Whisper model.
- Shows an approximate download size for Small, Base and Tiny before any model download starts.
- Offers a smaller Local model directly from the confirmation dialog.
- Skips the prompt when the selected model is already present in persistent browser cache.

## 0.5.35
- Rebalanced the desktop roadmap to four items in every lane.
- Made all roadmap cards and item rows symmetrical on desktop.
- Folded the Full Offline Mode goal into the PWA offline foundation and moved Social Safe Zones to Exploring.

## 0.5.34
- Added two user-selectable burned-in video export modes.
- Social Compatible is the default and recommended H.264/AAC MP4 path for TikTok, Reels and Shorts.
- Fast Export restores the quicker browser MediaRecorder path for users who prioritize export speed.
- Export mode is synchronized across preview and Export tab, saved locally, and tracked separately in analytics events.

## 0.5.33
- Replaced the primary real-time MediaRecorder export with deterministic Mediabunny/WebCodecs MP4 transcoding.
- Burned-in exports now target H.264 video, AAC audio, constant 30/60 fps, 2-second keyframes and non-fragmented fast-start MP4 output for better TikTok/Reels/Shorts compatibility.
- Social export preserves portrait videos up to 1080x1920 and landscape videos up to 1920x1080.
- Kept the legacy MediaRecorder path as an automatic compatibility fallback when the social MP4 pipeline is unavailable.

## 0.5.32
- Detects Cloudflare Workers AI daily quota exhaustion specifically via account-limited error 3036.
- Automatically switches back to Whisper Small Local when the daily Cloud allocation is exhausted.
- Disables the Cloud model until the next 00:00 UTC reset and re-enables it automatically afterwards.
- Persists Cloud availability state locally across refreshes and restores it when the daily quota resets.

## 0.5.31
- Removed the repeated privacy note from the phone homepage.
- Rebalanced the phone viewport so the upload area fills the remaining space naturally.
- Kept the footer below the initial viewport so it appears only after a small scroll.

## 0.5.30
- Updated the homepage hero copy to the new Local or Cloud AI message.
- Added mobile bilingual layout stabilization so switching EL/EN keeps text blocks at a consistent height and avoids visible page jumping.

## 0.5.29
- Reworked the homepage hero copy to be shorter and more direct.
- Kept the existing Google Analytics integration unchanged.

## 0.5.28
- Removed the Privacy-first pill from the header for a cleaner top navigation.
- Balanced the three Support principle cards so their copy has a similar visual length.
- Kept the existing mobile and AI model selector refinements from v0.5.27.

## 0.5.27
- Shortened the homepage privacy explanation for a cleaner three-line mobile layout.
- Replaced the native AI model dropdown with a clearer custom picker so only LOCAL or CLOUD is bold and appears at the end.
- Reordered models to put the recommended Local option first and Cloud High Accuracy second.

## 0.5.26
- Restored a roomier mobile homepage layout without reducing heading sizes.
- Rebalanced the desktop hero and upload area so both sides feel visually symmetrical.
- Clarified AI model order and labeling with clearer LOCAL, CLOUD and RECOMMENDED wording.

## 0.5.25

- Rebalanced the homepage so the full main experience fits inside the initial viewport on desktop and mobile.
- Reduced the oversized video drop area without reducing mobile headline or body text sizes.
- Tightened homepage spacing so scrolling is mainly reserved for the footer.

## 0.5.24
- Shortened the Home privacy note for a cleaner mobile layout.
- Greek copy now reads: **«Το video μένει στη συσκευή σου. Μόνο το audio αποστέλλεται στο Cloud mode.»**
- Updated the matching English privacy note.
- No transcription, Cloud High Accuracy, Local Whisper, export, styling, analytics, AdSense, PWA, licensing or other application behavior was changed.

## 0.5.23
- Enabled Whisper Large v3 Turbo as a selectable **Cloud High Accuracy** model instead of a Coming Soon local model.
- Added direct browser integration with the Kaptiono Cloudflare transcription Worker at `kaptiono-transcribe.donacgreece.workers.dev`.
- Cloud mode keeps the original video on-device, extracts 16 kHz mono audio locally, converts it to WAV, and sends only that audio for transcription.
- Added multilingual Cloud language mapping for Greek, English, Spanish, French, German and Italian, plus Auto Detect.
- Cloud mode uses one full-audio request with no client-side chunking or retry splitting.
- Added Cloud-specific progress, engine status, timeout/error handling and analytics events for real-world testing.
- Updated privacy-facing Home, Support, FAQ and README copy so the optional cloud audio path is explicit.
- Local Whisper Small remains the default Recommended model. Base and Tiny remain local.
- Enhanced remains Coming Soon and disabled.
- Export, caption styling, word highlight, Voice Boost for local models, PWA behavior, licensing and AdSense behavior remain unchanged.

## 0.5.21
- Refined the mobile footer only.
- Moved Support, Roadmap, Contact and GitHub to the first mobile footer row.
- Centered the mobile footer and increased link tap areas.
- Replaced the long mobile metadata line with a compact "Kaptiono · Free · Local · Private" label and a separate version line.
- Added a subtle divider above the footer.
- Reduced the mobile gap between the main content and footer.
- Desktop footer layout remains unchanged.
- No captioning, transcription, Voice Boost, export, AI, PWA, analytics, AdSense or licensing behavior was changed.
- Preserved the permanent full product README byte-for-byte.

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
