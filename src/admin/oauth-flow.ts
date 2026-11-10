/** The pure parts of the GitHub OAuth flow (the network calls are in github-api.ts). */
export const CALLBACK_PATH = "/admin/callback";

/** The GitHub authorize URL: code flow + state + PKCE S256, no scopes (the public profile is enough). */
export function authorizeUrl(clientId: string, origin: string, state: string, challenge: string): string {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${origin}${CALLBACK_PATH}`);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("allow_signup", "false");
  return url.toString();
}

/** Allowlist by the numeric GitHub id (logins can be renamed and re-registered). */
export function isAllowedUser(id: number, allowedId: number): boolean {
  return Number.isSafeInteger(id) && id === allowedId;
}
