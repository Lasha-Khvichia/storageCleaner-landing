/**
 * The one place the site gets release data from.
 * Today: the mock list. Tomorrow: the backend API (same Release shape).
 */
import { RELEASES_MOCK } from "./releases.mock.ts";
import type { Release } from "./types.ts";

/** Compare "1.2.10" and "1.10.0" by number, not as text. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** The highest version in a list, or null for an empty list. */
export function newestRelease(releases: Release[]): Release | null {
  return releases.reduce<Release | null>(
    (best, r) => (best === null || compareVersions(r.version, best.version) > 0 ? r : best),
    null,
  );
}

export async function getLatestRelease(): Promise<Release> {
  const latest = newestRelease(RELEASES_MOCK);
  if (!latest) throw new Error("No releases available");
  return latest;
}
