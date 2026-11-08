# src/content — page text that isn't release data

| File | Job |
|---|---|
| `features.ts` | The six feature cards (icon, title, text). Matches the app's README. |
| `safety-levels.ts` | The four safety ratings with their colours (Tailwind names from `src/styles/theme.css`), worded as in the app's Settings. |

Used by `components/sections/Features.tsx` and `Safety.tsx`. Static, public, no access rules.
