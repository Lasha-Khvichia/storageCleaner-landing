import Image from "next/image";
import type { Release } from "@/releases/types.ts";
import { ALL_RELEASES_URL } from "@/releases/links.ts";
import { DownloadMenu } from "./DownloadMenu";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#safety", label: "Safety" },
  { href: "#platforms", label: "Windows & Linux" },
];

/** Sticky header: logo left, section links, Download menu top right. */
export function SiteHeader({ release }: { release: Release | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[var(--sc-header-height)] max-w-[var(--sc-content-width)] items-center gap-8 px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="storageCleaner home">
          <Image src="/logo.png" alt="" width={32} height={32} className="rounded-[10px]" priority />
          <span className="text-[15px] font-bold tracking-tight">
            storage<span className="text-gradient">Cleaner</span>
          </span>
        </a>
        <nav className="hidden flex-1 items-center gap-6 text-sm text-muted md:flex" aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-fg">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto">
          {release ? (
            <DownloadMenu release={release} />
          ) : (
            <a href={ALL_RELEASES_URL} className="btn-primary flex h-10 items-center rounded-full px-5 text-sm font-semibold text-white">
              Releases on GitHub
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
