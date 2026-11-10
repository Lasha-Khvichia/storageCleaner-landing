/**
 * Validates RELEASES_API_URL (server-only env var): an https URL without a trailing slash.
 * Plain http is accepted only for this machine (localhost, 127.0.0.1) so a local stub or backend works.
 */
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1"]);

/** The backend base URL, or null when the value is unset or not acceptable. */
export function parseApiUrl(raw: string | undefined): string | null {
  if (!raw || raw.endsWith("/")) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const secure = url.protocol === "https:";
  const local = url.protocol === "http:" && LOOPBACK_HOSTS.has(url.hostname);
  if (!secure && !local) return null;
  if (url.search !== "" || url.hash !== "" || url.username !== "") return null;
  return raw;
}
