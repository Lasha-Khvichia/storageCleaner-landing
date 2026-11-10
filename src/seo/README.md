# src/seo — search and share-preview helpers

| File | Job |
|---|---|
| `site-url.ts` | `SITE_URL` from the env var of the same name, validated (https origin, no trailing slash), with the default. |
| `site-info.ts` | Name, description and Ember brand colours shared by metadata, share image and JSON-LD. |
| `json-ld.ts` | Builders for `SoftwareApplication` (live release fields only when known) and `FAQPage`; `serializeJsonLd` escapes `<`. |
| `JsonLd.tsx` | Renders one `<script type="application/ld+json">`. |
| `og-image.tsx` | Draws the 1200x630 share image; used by `app/opengraph-image.tsx` and `app/twitter-image.tsx`. |

Start at `src/app/layout.tsx`. Everything is public; nothing here reads user input.
