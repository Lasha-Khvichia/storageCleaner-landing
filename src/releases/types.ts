/**
 * The shape of app versions and their installers. Today they come from
 * the backend API (GET /api/v1/releases/latest). release-guard.ts checks it at runtime.
 */

export type OsId = "windows" | "linux";

export type InstallerKind = "nsis" | "deb" | "appimage";

export interface Installer {
  /** Stable id, e.g. "linux-deb". */
  id: string;
  os: OsId;
  kind: InstallerKind;
  /** Short name shown in the menu, e.g. ".deb package". */
  label: string;
  /** Who it is for, e.g. "Ubuntu, Debian, Linux Mint". */
  detail: string;
  fileName: string;
  sizeBytes: number;
  /** Direct download link (today: the GitHub release asset). */
  url: string;
}

export interface Release {
  /** Semantic version without the "v", e.g. "0.3.1". */
  version: string;
  /** ISO 8601 timestamp. */
  releasedAt: string;
  /** Release notes page. */
  notesUrl: string;
  installers: Installer[];
}
