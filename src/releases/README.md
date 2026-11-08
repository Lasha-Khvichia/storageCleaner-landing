# src/releases — app versions and their installers

The only place the site gets release data from.

| File | Job |
|---|---|
| `types.ts` | `Release` and `Installer`: the shape the planned backend will return. |
| `releases.mock.ts` | **Mock** list of versions until the backend exists. Real GitHub asset URLs and sizes. |
| `latest-release.ts` | `getLatestRelease()`: the highest version (`compareVersions` compares by number). The one function to switch to the backend. |
| `recommend-installer.ts` | `detectOs(userAgent)` and `recommendedInstaller()`: which installer to suggest. |
| `format-release.ts` | `formatBytes` (binary units, like the app) and `formatReleaseDate`. |
| `links.ts` | Fixed links to the GitHub repo and its releases page. |

## Flow

`app/page.tsx` → `getLatestRelease()` → the `Release` goes to the header menu, hero, platforms and
footer → each installer links straight to its file.

## Who can reach what

Public: every visitor sees the latest version and its download links. Nothing here writes data.
Adding or removing versions will be done in the planned admin site, not here.

Tests: `tests/releases.test.ts`. Imports here use explicit `.ts` extensions so Node can run the tests.
