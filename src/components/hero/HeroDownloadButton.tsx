"use client";

import { Download } from "lucide-react";
import type { Release } from "@/releases/types.ts";
import { formatBytes } from "@/releases/format-release.ts";
import { recommendedInstaller } from "@/releases/recommend-installer.ts";
import { OS_NAME } from "../OsIcon";
import { useVisitorOs } from "../use-visitor-os";

/**
 * Main call to action: the installer for the visitor's system when we know
 * it, otherwise a jump to the platform list.
 */
export function HeroDownloadButton({ release }: { release: Release }) {
  const installer = recommendedInstaller(release.installers, useVisitorOs());
  const base = "btn-primary inline-flex h-12 items-center gap-2.5 rounded-full px-7 text-[15px] font-semibold text-white";

  if (!installer) {
    return (
      <a href="#platforms" className={base}>
        <Download className="h-5 w-5" aria-hidden />
        Download for Windows or Linux
      </a>
    );
  }
  return (
    <a href={installer.url} className={base}>
      <Download className="h-5 w-5" aria-hidden />
      Download for {OS_NAME[installer.os]}
      <span className="font-normal text-accent-100">· {formatBytes(installer.sizeBytes)}</span>
    </a>
  );
}
