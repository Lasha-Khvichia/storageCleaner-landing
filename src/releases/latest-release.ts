/**
 * The one place the site gets release data from: the backend's
 * GET ${RELEASES_API_URL}/api/v1/releases/latest. There is no fallback data:
 * when the backend cannot give a valid release, the result is null.
 */
import { parseApiUrl } from "./api-url.ts";
import { isRelease } from "./release-guard.ts";
import type { Release } from "./types.ts";

const TIMEOUT_MS = 5000;
const REVALIDATE_SECONDS = 60;

/** The latest release, or null on unset env var, 404, network error, timeout or invalid JSON. Never throws. */
export async function getLatestRelease(): Promise<Release | null> {
  const base = parseApiUrl(process.env.RELEASES_API_URL);
  if (base === null) return null;
  try {
    const res = await fetch(`${base}/api/v1/releases/latest`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const body: unknown = await res.json();
    return isRelease(body) ? body : null;
  } catch {
    return null;
  }
}
