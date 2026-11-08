# src/styles — every style variable in one place

| File | Job |
|---|---|
| `tokens.css` | Raw values (`--sc-*`): colours, safety colours, radii, header height, content width. Copied from the desktop app's Ember theme. |
| `theme.css` | Tailwind v4 `@theme` names that point at the tokens: `bg-bg`, `bg-surface`, `bg-surface-raised`, `text-fg`, `text-muted`, `border-line`, `*-accent-*`, `*-positive-*`, `*-neutral-*`, `text-safe` / `review` / `unknown` / `protected`, `rounded-card` / `panel` / `control`. |
| `surfaces.css` | Shared looks: `.glass` (cards, header menu), `.btn-primary` (orange call to action), `.text-gradient` (the "Cleaner" wordmark). |
| `globals.css` | Entry point: imports Tailwind and the three files above; base body styles and background glows. |

## Flow

`src/app/layout.tsx` imports `globals.css` once → Tailwind reads `@theme` → components use the class
names. To restyle the site, change `tokens.css` only.

## Rule

Keep `tokens.css` identical to `storageCleaner/app/src/index.css` (Ember block), so the site and the app
always look the same.
