/**
 * Which installer to suggest for the visitor's system, from the browser's
 * user agent. Only a suggestion: the menu always lists every installer.
 */
import type { Installer, OsId } from "./types.ts";

export function detectOs(userAgent: string): OsId | null {
  const ua = userAgent.toLowerCase();
  // Android reports "Linux" too, but can't run these installers.
  if (ua.includes("android")) return null;
  if (ua.includes("windows")) return "windows";
  if (ua.includes("linux") || ua.includes("x11")) return "linux";
  return null;
}

/** The first installer for that OS: the setup.exe on Windows, the .deb on Linux. */
export function recommendedInstaller(installers: Installer[], os: OsId | null): Installer | null {
  if (!os) return null;
  return installers.find((i) => i.os === os) ?? null;
}
