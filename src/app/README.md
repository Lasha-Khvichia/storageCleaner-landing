# src/app — Next.js App Router entry

| File | Job |
|---|---|
| `layout.tsx` | HTML shell, page title and description, imports `src/styles/globals.css` once. |
| `page.tsx` | The landing page (server component): loads the latest release once and passes it to every section. |
| `icon.png` | Favicon: the app's own icon (from `storageCleaner/app/src-tauri/icons`). |

One public route: `/`. No API routes yet; the planned backend will be a separate service.
