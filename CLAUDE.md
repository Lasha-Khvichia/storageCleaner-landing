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
  (`getLatestRelease()`), called once in the server component `src/app/page.tsx` and passed down.
  Today it reads `releases.mock.ts`; the planned backend returns the same `Release` shape
  (`types.ts`), so only that function changes. Never import the mock file from a component.
- **Mock links are real:** the mock uses the actual GitHub release asset URLs and sizes. When a new
  app version ships, add it to the mock with its real sizes (`gh release view vX.Y.Z -R
  Lasha-Khvichia/storageCleaner --json assets`). Never invent numbers.
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
- Keep each folder's `README.md` current when you change it.
- Planned next (not built yet): a backend serving versions/installers and an admin site to add and
  remove versions. Ask Nick before choosing its stack.
