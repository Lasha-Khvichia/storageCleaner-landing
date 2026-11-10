# src/content — page text that isn't release data

| File | Job |
|---|---|
| `features.ts` | The six feature cards (icon, title, text). Matches the app's README. |
| `safety-levels.ts` | The four safety ratings with their colours (Tailwind names from `src/styles/theme.css`), worded as in the app's Settings. |

Used by `components/sections/Features.tsx` and `Safety.tsx`. Static, public, no access rules.

`faq.ts` is the single source for the FAQ section (`components/sections/Faq.tsx`) and the `FAQPage` JSON-LD
(`src/seo/json-ld.ts`). Only facts the site or the app already states; never claim open source.
