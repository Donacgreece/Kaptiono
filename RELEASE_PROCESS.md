# Kaptiono Release Process

Kaptiono uses semantic versioning and immutable production release tags.

## Production release requirements

Each production release should contain:

1. A version recorded in `version.json`.
2. Matching version references in application assets and validation rules.
3. A clean commit on `main`.
4. An annotated Git tag such as `v1.0.0`.
5. A GitHub Release attached to the same tag.
6. A release ZIP archive.
7. A SHA-256 checksum file for the ZIP.
8. Release notes describing user-visible and operational changes.

## Tag immutability

After a production tag is published, do not move or rewrite it. If production code changes, create the next semantic version.

This keeps GitHub Releases useful as rollback points and makes downloaded archives reproducible.

## Rollback procedure

To inspect or restore a previous production version:

```bash
git fetch --tags
git checkout v1.0.0
```

Validate the release before deployment. Return to `main` for normal development:

```bash
git checkout main
git pull --ff-only origin main
```

## Archive verification

Release ZIP files are accompanied by a SHA-256 checksum. Verify an archive before using it as a rollback source.
