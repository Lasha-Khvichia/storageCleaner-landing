# storageCleaner-landing

The landing page for [storageCleaner](https://github.com/Lasha-Khvichia/storageCleaner), the disk
analyzer and safe cleaner for Windows and Linux. Built with Next.js 16 (App Router), React 19 and
Tailwind CSS 4, in the same Ember colours as the desktop app.

## Status

- **Today:** release data is **mock data** (`src/releases/releases.mock.ts`). Its download links are the
  real GitHub release assets, so every button already downloads the real installer.
- **Planned:** a small backend that serves versions and installers, and an admin site to add and remove
  versions. Only `src/releases/latest-release.ts` will change; the rest of the site keeps the same
  `Release` shape (`src/releases/types.ts`).

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint + tests + production build (the full gate)
npm test           # unit tests only (Node's built-in runner, no extra library)
npm run build && npm start
```

Node 22.18 or newer (the tests run `.ts` files directly).

CI (GitHub Actions) runs only when something is merged into `main`, or by hand from the Actions tab.
Pull requests into `dev` are checked locally with `npm run check`; paste the results in the PR.

## Layout

| Folder | What it holds |
|---|---|
| `src/app/` | The page (`page.tsx`), the HTML shell and metadata (`layout.tsx`), the favicon |
| `src/components/` | Header with the Download menu, hero, sections, footer |
| `src/releases/` | Release data: types, mock data, "latest release", installer suggestion, formatting |
| `src/content/` | Page text that isn't release data: features, safety levels |
| `src/styles/` | **Every style variable** (see below) |
| `tests/` | Unit tests for `src/releases` |

## Styles: one folder

All colours, sizes and shared surfaces live in `src/styles/`:

- `tokens.css`: the raw values, copied unchanged from the app's default Ember theme
  (`storageCleaner/app/src/index.css`).
- `theme.css`: the Tailwind names components use (`bg-surface`, `text-muted`, `bg-accent-500`, `text-safe`...).
- `surfaces.css`: `.glass`, `.btn-primary`, `.text-gradient`, the same as the app.
- `globals.css`: the entry point, imported once in `src/app/layout.tsx`.

Change a value in `tokens.css` and the whole site follows. Components never hard-code colours.

## How the Download menu works

1. `src/app/page.tsx` (server) calls `getLatestRelease()`: the highest version in the data.
2. The header's **Download** button (top right) opens a menu grouped by OS, with every installer of
   that release: Windows setup `.exe`, Linux `.deb`, Linux AppImage. Each item links straight to the file.
3. In the browser, the visitor's OS is read from the user agent, and the matching installer gets a
   "For your system" badge. The hero button offers that installer directly.

## Security headers

`next.config.ts` sends these on every route:

| Header | What it does |
|---|---|
| `Content-Security-Policy` | Only same-origin scripts, styles, images, fonts and connections; no plugins (`object-src 'none'`), no framing (`frame-ancestors 'none'`), forms and `<base>` locked to self. |
| `Strict-Transport-Security` | Browsers use HTTPS only for two years, including subdomains (preload eligible). |
| `X-Content-Type-Options: nosniff` | Stops MIME sniffing. |
| `Referrer-Policy` | Cross-origin requests get only the origin, not the path. |
| `Permissions-Policy` | Disables camera, microphone, geolocation and FLoC. |
| `X-Frame-Options: DENY` | Legacy twin of `frame-ancestors`, for old browsers. |

`poweredByHeader` is off, so no `X-Powered-By: Next.js`.

The CSP is **static** (no nonce), which keeps the page statically rendered; a nonce would force every
request to render dynamically. The price is `'unsafe-inline'` for scripts and styles, because Next.js
inlines its bootstrap script and styles. `'unsafe-eval'` is added only in `next dev`.

**Changing the CSP safely:** edit the `csp` list in `next.config.ts`, add only the exact origin and only
to the directive that needs it (for example an image host goes in `img-src`, never in `default-src`),
then run `npm run build && npm start` and open the page with the browser console open: blocked
resources show as "Refused to load ...". Plain `<a href>` links to other sites need no CSP entry.
