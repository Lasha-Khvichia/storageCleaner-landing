# src/releases — app versions and their installers

The only place the site gets release data from.

| File | Job |
|---|---|
| `types.ts` | `Release` and `Installer`: the shape the backend returns. |
| `latest-release.ts` | `getLatestRelease()`: fetches the backend, returns `Release | null`. Never throws. |
| `api-url.ts` | `parseApiUrl()`: validates `RELEASES_API_URL` (https, no trailing slash; http only for localhost). |
| `release-guard.ts` | `isRelease()`: runtime type guard for the backend JSON (fields, `os`/`kind`, https URLs). |
| `recommend-installer.ts` | `detectOs(userAgent)` and `recommendedInstaller()`: which installer to suggest. |
| `format-release.ts` | `formatBytes` (binary units, like the app) and `formatReleaseDate`. |
| `links.ts` | The fixed link to the public `storageCleaner-releases` repo (`ALL_RELEASES_URL`). |

## Flow

1. `app/page.tsx` calls `getLatestRelease()` on the server.
2. It reads `RELEASES_API_URL` through `parseApiUrl()`; unset or invalid gives `null`.
3. `fetch(${base}/api/v1/releases/latest)` with `next: { revalidate: 60 }` and a 5 s timeout.
4. Not OK (404, 5xx), network error, timeout or invalid JSON gives `null`; otherwise `isRelease()` must
   pass, or the result is `null`.
5. The page passes `Release | null` to the header menu, hero, platforms and footer. With `null` they show
   a link to `ALL_RELEASES_URL` and "downloads temporarily unavailable". There is no fallback data.

## Who can reach what

Public: every visitor sees the latest version and its download links. Nothing here writes data.
Adding or removing versions will be done in the planned admin site, not here.

Tests: `tests/releases.test.ts`. Imports here use explicit `.ts` extensions so Node can run the tests.
