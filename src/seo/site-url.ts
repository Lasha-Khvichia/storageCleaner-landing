/**
 * The public address of the site, from the server-only env var SITE_URL.
 * Used for metadataBase, canonical links, the sitemap, robots.txt and JSON-LD.
 */
export const DEFAULT_SITE_URL = "https://storagecleanerweb.vercel.app";

/** An https origin with no path, query, hash or trailing slash; otherwise the default. */
export function parseSiteUrl(raw: string | undefined): string {
  if (!raw) return DEFAULT_SITE_URL;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return DEFAULT_SITE_URL;
  }
  const plain = url.protocol === "https:" && url.pathname === "/" && url.search === "" && url.hash === "";
  if (!plain || raw.endsWith("/") || url.username !== "") return DEFAULT_SITE_URL;
  return raw;
}

export const SITE_URL = parseSiteUrl(process.env.SITE_URL);
