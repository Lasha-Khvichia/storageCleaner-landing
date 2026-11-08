"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronDown, Download, ExternalLink } from "lucide-react";
import type { OsId, Release } from "@/releases/types.ts";
import { formatReleaseDate } from "@/releases/format-release.ts";
import { recommendedInstaller } from "@/releases/recommend-installer.ts";
import { ALL_RELEASES_URL } from "@/releases/links.ts";
import { OS_NAME } from "../OsIcon";
import { useVisitorOs } from "../use-visitor-os";
import { DownloadMenuItem } from "./DownloadMenuItem";
import { useDismiss } from "./use-dismiss";

const OS_ORDER: OsId[] = ["windows", "linux"];

/** "Download" button (top right of the header) with every installer of the latest release. */
export function DownloadMenu({ release }: { release: Release }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(root, open, close);
  const recommended = recommendedInstaller(release.installers, useVisitorOs());

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-primary flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white"
      >
        <Download className="h-4 w-4" aria-hidden />
        Download
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        // Solid bg-overlay (not .glass): a menu must not show the page through it.
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-[min(25rem,calc(100vw-2rem))] rounded-panel border border-line bg-overlay p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]"
        >
          <div className="flex items-baseline justify-between px-3 pb-2 pt-1.5">
            <span className="text-sm font-semibold">storageCleaner v{release.version}</span>
            <span className="text-xs text-muted">{formatReleaseDate(release.releasedAt)}</span>
          </div>
          {OS_ORDER.map((os) => (
            <div key={os} className="border-t border-line py-1.5">
              <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                {OS_NAME[os]}
              </p>
              {release.installers
                .filter((i) => i.os === os)
                .map((i) => (
                  <DownloadMenuItem key={i.id} installer={i} recommended={i.id === recommended?.id} />
                ))}
            </div>
          ))}
          <a
            href={ALL_RELEASES_URL}
            className="flex items-center justify-between border-t border-line px-3 pb-1.5 pt-3 text-xs text-muted hover:text-fg"
          >
            Release notes and older versions
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      )}
    </div>
  );
}
