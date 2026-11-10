/** Cookie names and flags. The __Host- prefix forces Secure, Path=/ and no Domain. */
export const ADMIN_COOKIE = "__Host-sc_admin";
export const OAUTH_COOKIE = "__Host-sc_oauth";
export const OAUTH_SECONDS = 10 * 60;

export function cookieOptions(maxAge: number) {
  return { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge };
}
