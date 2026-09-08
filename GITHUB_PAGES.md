# GitHub Pages quick deploy

The repository root must contain `index.html`.

The included GitHub Actions workflow is already configured for Pages.

After pushing to `main`:

1. Repository → Settings → Pages
2. Source: GitHub Actions
3. Wait for the `Deploy Kaptiono Web Lab to GitHub Pages` workflow to finish
4. Open the Pages URL shown by GitHub

## Notes

GitHub Pages only serves the static application. It does not process video or run Whisper. AI inference is performed in the visitor's browser.

The browser still downloads the AI model from Hugging Face the first time it is needed. That is not a video upload.
