# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Landing page for storageCleaner (Next.js 16 App Router, React 19, Tailwind 4, TypeScript 5.9). The
desktop app lives in the sibling repo `../storageCleaner`.

## Commands

```bash
npm run dev          # local server on :3000
npm run check        # the full gate: typecheck + lint + test + build
npm test             # node --test tests/ (Node's runner, runs .ts directly; no test library)
node --test tests/releases.test.ts --test-name-pattern "latest"   # one test
```

CI (`.github/workflows/ci.yml`) runs `npm run check` **only on a merge to `main`** (or manually,
`workflow_dispatch`); Nick's decision 2026-11-09. PRs into `dev` get no CI: run `npm run check` locally
and paste the results in the PR body.

## Architecture

- **One data source:** everything about versions comes from `src/releases/latest-release.ts`
  (`getLatestRelease()`), called once in the server component `src/app/page.tsx` and passed down. It
  fetches the backend (`RELEASES_API_URL`, server-only), validates the JSON with `release-guard.ts` and
  returns `Release | null`. **No mock, fixture or sample data anywhere in the app** (Nick, 2026-11-10);
  on any failure the components show the "downloads unavailable" fallback linking to GitHub. Tests build
  their own inline `Release` objects (`tests/sample-release.ts`).
- **`src/app/page.tsx` keeps `export const revalidate = 60`** (2026-11-11): without it, a build that got no
  release (backend asleep or env var missing) froze the fallback on the live site until the next deploy.
  The build output must show `/` with `Revalidate 1m`.
- **The backend contract** is `GET /api/v1/releases/latest` = the `Release` type exactly. Change both
  sides together. Hosting: Vercel (Hobby now, Pro once commercial).
- **Visitor OS:** `useVisitorOs()` reads the user agent with `useSyncExternalStore` (server snapshot
  `null`), so the first client render matches the server HTML. Only it decides the "For your system"
  badge and the hero button.
- **Imports inside `src/releases` and from `tests/` use explicit `.ts` extensions**, because Node's
  test runner loads those files directly (`allowImportingTsExtensions` is on). Other folders use `@/`.

## Styles

All design variables are in `src/styles/` (see its README). `tokens.css` must stay identical to the
app's Ember theme (`../storageCleaner/app/src/index.css`). Use the Tailwind names from `theme.css`;
never hard-code a colour in a component.

## Rules

- 100-line hard limit per frontend file (hook-enforced). Split into subcomponents, hooks or content files.
- The app is closed source: never link the private app repo (`Lasha-Khvichia/storageCleaner`) or mention a license on the site. Downloads and release links go to `Lasha-Khvichia/storageCleaner-releases`.
- Keep each folder's `README.md` current when you change it.
- Security headers live in `next.config.ts`. Any new external origin (font, image, script, API) must be added to the CSP there on purpose, to the narrowest directive.
- Planned next (not built yet): a backend serving versions/installers and an admin site to add and
  remove versions. Ask Nick before choosing its stack.
