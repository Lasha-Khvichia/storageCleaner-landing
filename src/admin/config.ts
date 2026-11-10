/** Reads every admin env var. Null means "Admin is not configured": no login is offered. */
import { parseApiUrl } from "../releases/api-url.ts";
import { parseSiteUrl } from "../seo/site-url.ts";
import { parseSessionKeys } from "./session-keys.ts";

type Env = Record<string, string | undefined>;

export interface AdminConfig {
  clientId: string;
  clientSecret: string;
  sessionKeys: Uint8Array[];
  /** The only GitHub user id allowed in. */
  userId: number;
  serviceKey: string;
  apiUrl: string;
  /** Public origin of this site; used for redirect_uri and the Origin check. */
  origin: string;
}

const LOCAL_ORIGIN = /^http:\/\/localhost:\d{2,5}$/;

/** SITE_URL, except that outside production a plain http://localhost:PORT is accepted for local OAuth. */
function adminOrigin(env: Env): string {
  const raw = env.SITE_URL;
  if (env.NODE_ENV !== "production" && raw !== undefined && LOCAL_ORIGIN.test(raw)) return raw;
  return parseSiteUrl(raw);
}

export function readAdminConfig(env: Env): AdminConfig | null {
  const sessionKeys = parseSessionKeys(env.ADMIN_SESSION_KEY);
  const apiUrl = parseApiUrl(env.RELEASES_API_URL);
  const idText = env.ADMIN_GITHUB_USER_ID ?? "";
  const userId = /^\d{1,15}$/.test(idText) ? Number(idText) : null;
  const { GITHUB_OAUTH_CLIENT_ID: clientId, GITHUB_OAUTH_CLIENT_SECRET: clientSecret } = env;
  const serviceKey = env.ADMIN_SERVICE_KEY;
  if (!sessionKeys || !apiUrl || userId === null || !clientId || !clientSecret || !serviceKey) return null;
  return { clientId, clientSecret, sessionKeys, userId, serviceKey, apiUrl, origin: adminOrigin(env) };
}
