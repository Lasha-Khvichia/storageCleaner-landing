import type { Release } from "@/releases/types.ts";
import { SOURCE_URL } from "@/releases/links.ts";
import { GitHubIcon } from "../GitHubIcon";
import { AppPreview } from "./AppPreview";
import { HeroDownloadButton } from "./HeroDownloadButton";

export function Hero({ release }: { release: Release }) {
  return (
    <section id="top" className="mx-auto grid max-w-[var(--sc-content-width)] items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
      <div>
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-positive-300" />
          v{release.version} · now on Windows and Linux
        </p>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          See what fills your disk.
          <br />
          <span className="text-gradient">Free it safely.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          storageCleaner scans whole drives, shows exactly what uses your space, and tells you what is safe to delete,
          with a reason for every file. Deletes go to the trash, and system folders are never touched.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <HeroDownloadButton release={release} />
          <a
            href={SOURCE_URL}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-surface px-6 text-[15px] font-medium text-fg transition-colors hover:bg-surface-raised"
          >
            <GitHubIcon />
            Source on GitHub
          </a>
        </div>
        <p className="mt-4 text-xs text-muted">Free and open source · MIT license</p>
      </div>
      <AppPreview />
    </section>
  );
}
