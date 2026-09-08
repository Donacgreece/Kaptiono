# Kaptiono Web Lab v0.5.3

## What changed
- PWA update lifecycle rebuilt so installed copies check for a new release on launch, when returning to the app, when connectivity returns, and every minute while open.
- New service workers activate immediately and old Kaptiono caches are removed.
- If no video is being edited, a new release reloads automatically. If an editing session is active, Kaptiono shows a compact Update button instead of destroying the project state.
- Android install banner uses the browser-native PWA install prompt when available.
- iPhone/iPad install banner opens a dedicated Add to Home Screen instructions modal.
- Install prompts are hidden automatically when Kaptiono is already running as an installed PWA.
- SEO/discovery copy added in v0.5.0 was moved from the home screen into Support so the mobile landing page remains compact.
- All moved Support/SEO/FAQ content is now bilingual through the existing EL/EN switch.
- Support is again a clean standalone in-app view instead of appearing below homepage discovery sections.

## Update note
Once v0.5.3 is loaded at least once in an existing installed PWA, future releases can use the new automatic update flow.
