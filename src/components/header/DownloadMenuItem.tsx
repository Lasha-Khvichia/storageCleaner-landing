import { Download } from "lucide-react";
import type { Installer } from "@/releases/types.ts";
import { formatBytes } from "@/releases/format-release.ts";
import { OsIcon } from "../OsIcon";

/** One installer in the download menu: a direct link to the file. */
export function DownloadMenuItem({ installer, recommended }: { installer: Installer; recommended: boolean }) {
  return (
    <a
      href={installer.url}
      role="menuitem"
      className="group flex items-center gap-3 rounded-control px-3 py-2.5 transition-colors hover:bg-surface-raised focus-visible:bg-surface-raised focus-visible:outline-none"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-surface-raised text-accent-300">
        <OsIcon os={installer.os} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-fg">
          {installer.label}
          {recommended && (
            <span className="rounded-full bg-positive-950 px-2 py-0.5 text-[10px] font-semibold text-positive-300">
              For your system
            </span>
          )}
        </span>
        <span className="block truncate text-xs text-muted">{installer.detail}</span>
      </span>
      <span className="shrink-0 text-xs tabular-nums text-muted">{formatBytes(installer.sizeBytes)}</span>
      <Download className="h-4 w-4 shrink-0 text-neutral-500 transition-colors group-hover:text-accent-400" aria-hidden />
    </a>
  );
}
