# Kaptiono Web Lab 0.1

Experimental browser-only edition of Kaptiono for GitHub Pages.

## What this first build tests

- Local video selection, no media upload to a processing server
- Browser-side audio decoding and 16 kHz resampling
- Multilingual Whisper Tiny transcription with Transformers.js
- WebGPU when available, WASM fallback
- Real transcription progress by audio chunk
- Same-language captions by default, no translation
- Creator-style live caption preview
- Caption text editing
- 8 visual presets
- Greek uppercase without tonos
- Local SRT and TXT export
- Experimental real-time WebM burn-in export on supported Chromium browsers
- PWA manifest and service worker
- Responsive desktop/mobile interface

## Privacy model

The selected video remains a local `File`/blob in the browser. The app does not POST the video to a Kaptiono backend. On first AI use, the browser downloads the Transformers.js runtime and Whisper model files from public CDNs/Hugging Face. Inference then runs on the user's device.

## Important prototype limits

This is a Web Lab, not a replacement for Kaptiono Desktop yet.

- The first model load can be large and slow.
- Long videos can consume significant RAM on mobile because browser audio decoding is still done in memory in this prototype.
- WebGPU support varies by browser/device. WASM is the fallback.
- Experimental video export is WebM and happens in real time. MP4/WebCodecs export is intentionally left for the next milestone.
- iPhone/Safari needs dedicated testing.

## Run locally

Because the app uses ES modules and a Web Worker, serve the folder over HTTP instead of opening `index.html` directly.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a repository, for example `kaptiono-web`.
2. Copy the contents of this folder to the repository root.
3. Push to the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions**.
6. The included workflow `.github/workflows/pages.yml` will deploy the site.

No Node/Python build step is required on GitHub Pages for this prototype.

## Recommended first tests

1. Chrome or Edge on Windows, 10–30 second Greek MP4.
2. Chrome or Edge on Windows, 1–3 minute English MP4.
3. Android Chrome, short Greek vertical video.
4. Test once with WebGPU and once on a device/browser that falls back to WASM.
5. Compare transcript, caption timing, UI responsiveness and battery/temperature.

## Technology

- Static HTML/CSS/JavaScript
- Transformers.js 3.8.1
- `onnx-community/whisper-tiny`
- ONNX Runtime Web via Transformers.js
- Web Audio API
- Canvas + MediaRecorder for experimental WebM export
- PWA service worker

## License

No project license is included in this Web Lab package yet. Choose the intended license before treating a public repository as an open-source release.
