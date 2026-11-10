/** The two GitHub calls of the sign-in, both server-side. Failures return null; nothing here logs secrets. */
import { CALLBACK_PATH } from "./oauth-flow.ts";

const TIMEOUT_MS = 8000;

/** Exchanges the authorization code (with the PKCE verifier) for an access token. */
export async function exchangeCode(
  config: { clientId: string; clientSecret: string; origin: string },
  code: string,
  verifier: string,
): Promise<string | null> {
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        code_verifier: verifier,
        redirect_uri: `${config.origin}${CALLBACK_PATH}`,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body: unknown = await res.json();
    const token = typeof body === "object" && body !== null ? (body as { access_token?: unknown }).access_token : null;
    return typeof token === "string" && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

/** The signed-in user's numeric id and login. */
export async function fetchGithubUser(token: string): Promise<{ id: number; login: string } | null> {
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "storageCleaner-landing",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { id?: unknown; login?: unknown };
    if (typeof body.id !== "number" || typeof body.login !== "string") return null;
    return { id: body.id, login: body.login };
  } catch {
    return null;
  }
}
