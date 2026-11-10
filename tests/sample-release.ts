import type { Installer, Release } from "../src/releases/types.ts";

/** Test input only (not app data): a valid Release as the backend would send it. */
export function sampleRelease(): Release {
  const file = (name: string) => `https://example.com/downloads/${name}`;
  const make = (id: string, os: Installer["os"], kind: Installer["kind"], name: string): Installer => ({
    id,
    os,
    kind,
    label: name,
    detail: "test",
    fileName: name,
    sizeBytes: 1024,
    url: file(name),
  });
  return {
    version: "1.2.3",
    releasedAt: "2026-11-01T10:00:00.000Z",
    notesUrl: "https://example.com/notes",
    installers: [
      make("windows-nsis", "windows", "nsis", "app-setup.exe"),
      make("linux-deb", "linux", "deb", "app.deb"),
      make("linux-appimage", "linux", "appimage", "app.AppImage"),
    ],
  };
}
