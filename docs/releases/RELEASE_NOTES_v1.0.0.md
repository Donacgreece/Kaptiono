# Kaptiono v1.0.0

Kaptiono v1.0.0 is the first stable production release of the browser-based AI subtitle workflow.

## Highlights

- Local Whisper subtitle generation in the browser
- Optional Cloud High Accuracy transcription with quota awareness
- Caption Studio with live editing, presets and manual styling controls
- SRT and TXT export
- Burned-in video export with Social Compatible and Fast Export modes
- No watermark
- Mobile and desktop PWA experience
- User-visible PWA update flow and improved install-state handling
- Safari and WebKit audio compatibility fallback using a separate LibAV / FFmpeg WebAssembly runtime
- Automatic EL/EN interface selection based on device language with remembered manual preference
- Privacy, Cookies and Terms pages with consent-aware analytics
- About product page and Partners page
- Unified product, project, legal and business navigation
- Search Console verification, sitemap, robots.txt, structured data and llms.txt

## Privacy model

The original video remains on the user's device. Local Whisper processing remains on-device. If Cloud High Accuracy is selected, only the extracted audio required for transcription is sent through the Kaptiono Cloud transcription service.

## Production URLs

Application: https://kaptiono.com/

Product overview: https://kaptiono.com/about/

Partners: https://kaptiono.com/partners/

## License

Kaptiono is source available under the PolyForm Noncommercial License 1.0.0. Third-party components retain their own licenses. See the repository licensing and third-party notice files for details.
