# GitHub Pages deployment notes

Kaptiono production is deployed from the `main` branch through GitHub Actions and GitHub Pages.

## Production flow

1. Validate the release locally.
2. Push the complete release source to `main`.
3. Let the Pages workflow build or restore the pinned LibAV runtime.
4. Let the workflow validate the release and assemble `site-dist`.
5. Deploy the generated artifact to GitHub Pages.
6. Verify https://kaptiono.com/ and the public pages after deployment.
7. Publish the matching Git tag, GitHub Release, ZIP archive and SHA-256 checksum.

## Versioned application files

For every new production version, update all version references consistently:

- `APP_VERSION` in `app.js`
- Cache version and versioned asset references in `sw.js`
- `version.json`
- Asset query versions in HTML files
- GitHub Actions release validation
- Changelog and release notes

Do not publish a new tag until those references agree.

## PWA update safety

The PWA depends on a stable `sw.js` registration and `version.json` checks. Do not rename or remove either file without a planned migration.

Installed clients use the application update flow rather than an unconditional reload. Preserve that behavior during deployment changes.

## Custom domain

Production domain: https://kaptiono.com/

Keep GitHub Pages HTTPS enabled. Preserve the Search Console verification file at the site root unless ownership verification is intentionally migrated to another supported method.

## Search discovery

Keep these files in the production artifact:

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- Search Console verification file

Public product, partnership and legal pages referenced by the sitemap must remain crawlable through normal links.

## README policy

`README.md` is the permanent public product and repository presentation for Kaptiono. Do not replace it with per-version hotfix notes.

Use:

- `CHANGELOG.md` for release history
- `../releases/RELEASE_NOTES_vX.Y.Z.md` for release-specific notes
- GitHub Releases for immutable production archives
- `../releases/RELEASE_PROCESS.md` for release and rollback procedure
