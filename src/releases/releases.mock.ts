/**
 * MOCK data until the backend exists (planned: a small API + an admin site
 * to add and remove versions). The links are the real GitHub release
 * assets of storageCleaner, so every download button already works.
 */
import { SOURCE_URL as REPO } from "./links.ts";
import type { Installer, Release } from "./types.ts";

function installers(version: string, sizes: [number, number, number]): Installer[] {
  const asset = (file: string) => `${REPO}/releases/download/v${version}/${file}`;
  const files = {
    nsis: `storageCleaner_${version}_x64-setup.exe`,
    deb: `storageCleaner_${version}_amd64.deb`,
    appimage: `storageCleaner_${version}_amd64.AppImage`,
  };
  return [
    {
      id: "windows-nsis",
      os: "windows",
      kind: "nsis",
      label: "Windows installer",
      detail: "Windows 10 and 11 · 64-bit",
      fileName: files.nsis,
      sizeBytes: sizes[0],
      url: asset(files.nsis),
    },
    {
      id: "linux-deb",
      os: "linux",
      kind: "deb",
      label: ".deb package",
      detail: "Ubuntu, Debian, Linux Mint",
      fileName: files.deb,
      sizeBytes: sizes[1],
      url: asset(files.deb),
    },
    {
      id: "linux-appimage",
      os: "linux",
      kind: "appimage",
      label: "AppImage",
      detail: "Any Linux distribution, no install",
      fileName: files.appimage,
      sizeBytes: sizes[2],
      url: asset(files.appimage),
    },
  ];
}

export const RELEASES_MOCK: Release[] = [
  {
    version: "0.3.1",
    releasedAt: "2026-11-08T14:01:31Z",
    notesUrl: `${REPO}/releases/tag/v0.3.1`,
    installers: installers("0.3.1", [3348507, 4924352, 83245560]),
  },
  {
    version: "0.3.0",
    releasedAt: "2026-11-08T13:11:44Z",
    notesUrl: `${REPO}/releases/tag/v0.3.0`,
    installers: installers("0.3.0", [3350635, 4925140, 83249656]),
  },
];
