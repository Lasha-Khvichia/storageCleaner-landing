# src/app — Next.js App Router entry

| File | Job |
|---|---|
| `layout.tsx` | HTML shell, page title and description, imports `src/styles/globals.css` once. |
| `page.tsx` | The landing page (server component): loads the latest release once and passes it to every section. `export const revalidate = 60` rebuilds it at most every 60 s. |
| `icon.png` | Favicon: the app's own icon (from `storageCleaner/app/src-tauri/icons`). |

One public route: `/`. No API routes; release data comes from the separate backend (`RELEASES_API_URL`).

**Why the page sets `revalidate` itself:** a fetch's own `revalidate` only counts if the fetch ran. When a
build gets no release (Render's free backend asleep past the 5 s timeout, or the env var missing), the page
would otherwise stay static with the "downloads unavailable" fallback until the next deploy. With the
page-level `revalidate = 60`, the next visit after 60 s rebuilds it in the background and picks up the
release. Keep the number equal to `REVALIDATE_SECONDS` in `src/releases/latest-release.ts`.

## SEO files (all use `SITE_URL` from `src/seo/site-url.ts`)

| File | Job |
|---|---|
| `layout.tsx` | `metadataBase`, title template, description, canonical, robots, Open Graph, Twitter card, `viewport` theme colour. |
| `opengraph-image.tsx`, `twitter-image.tsx` | The 1200x630 share image (`next/og`, drawn by `src/seo/og-image.tsx`), with the live version when a release exists. Revalidate 60 s. |
| `robots.ts` | Allow all, `Disallow: /admin`, sitemap link. |
| `sitemap.ts` | The home page; `lastModified` is the latest release date when known. |
| `manifest.ts` | Web app manifest (name, Ember colours, logo). |

`page.tsx` also renders two JSON-LD blocks (`SoftwareApplication`, `FAQPage`) and the FAQ section. Public, no access rules.
