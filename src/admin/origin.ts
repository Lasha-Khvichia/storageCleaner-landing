/** CSRF defence for Server Actions, on top of Next.js's own check: Origin and Host must be this site. */
interface HeaderReader {
  get(name: string): string | null;
}

export function isSameOrigin(headers: HeaderReader, siteOrigin: string): boolean {
  const origin = headers.get("origin");
  if (origin !== siteOrigin) return false;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  return host === new URL(siteOrigin).host;
}
