# src/components — the parts of the page

| Folder / file | Job |
|---|---|
| `header/SiteHeader.tsx` | Sticky header: logo, section links, Download menu at the top right. |
| `header/DownloadMenu.tsx` | Client component. Button + dropdown with every installer of the latest release, grouped by OS. Closes on outside click and Escape (`use-dismiss.ts`). |
| `header/DownloadMenuItem.tsx` | One installer: icon, name, who it is for, size, direct link; "For your system" badge. |
| `hero/Hero.tsx` | Title, intro, main download button, GitHub link, app preview. |
| `hero/HeroDownloadButton.tsx` | Client component. Offers the installer for the visitor's OS, or jumps to the platform list. |
| `hero/AppPreview.tsx` | A small picture of the app's dashboard built from the design tokens. |
| `sections/` | Features, Safety, Platforms (one card per OS with every installer), Footer, shared heading. |
| `use-visitor-os.ts` | Client hook: the visitor's OS from the user agent (`null` on the server). |
| `OsIcon.tsx` | Small inline mark (lucide-react has no brand icons). |

## Flow

The page passes one `Release` down. Only `DownloadMenu` and `HeroDownloadButton` run in the browser;
everything else renders on the server.

## Who can reach what

All public. No component writes data or calls an API.
