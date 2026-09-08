# GitHub Pages deploy notes

Push the complete v0.5.1 folder to the existing repository and let the GitHub Pages Action deploy it.

The PWA uses a stable `sw.js` registration plus `version.json` checks. Do not rename or remove either file in future releases. For each new release, bump:
- `APP_VERSION` in `app.js`
- the cache version in `sw.js`
- `version.json`
- asset query versions in `index.html` and `sw.js`

When `kaptiono.com` is connected, keep GitHub Pages HTTPS enabled.
