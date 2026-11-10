import type { Release } from "@/releases/types.ts";
import { formatReleaseDate } from "@/releases/format-release.ts";
import { ALL_RELEASES_URL } from "@/releases/links.ts";

export function SiteFooter({ release }: { release: Release | null }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[var(--sc-content-width)] flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted">
        <p>
          storage<span className="text-gradient font-semibold">Cleaner</span> {release
            ? ` v${release.version} · released ${formatReleaseDate(release.releasedAt)}`
            : ""}
        </p>
        <nav className="flex gap-6" aria-label="Footer">
          <a href={release?.notesUrl ?? ALL_RELEASES_URL} className="hover:text-fg">
            Release notes
          </a>
          <a href={ALL_RELEASES_URL} className="hover:text-fg">
            All versions
          </a>
        </nav>
      </div>
    </footer>
  );
}
