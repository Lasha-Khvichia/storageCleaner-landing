import { NextResponse } from "next/server";
import { readAdminConfig } from "@/admin/config";
import { OAUTH_COOKIE, OAUTH_SECONDS, cookieOptions } from "@/admin/cookie-options";
import { authorizeUrl } from "@/admin/oauth-flow";
import { packPending } from "@/admin/oauth-cookie";
import { challengeS256, randomToken } from "@/admin/pkce";

export const dynamic = "force-dynamic";

/** Step 1 of the sign-in: remember state + PKCE verifier in a 10-minute cookie, then go to GitHub. */
export function GET(): Response {
  const config = readAdminConfig(process.env);
  if (config === null) return new Response(null, { status: 303, headers: { Location: "/admin" } });
  const state = randomToken();
  const verifier = randomToken();
  const response = NextResponse.redirect(authorizeUrl(config.clientId, config.origin, state, challengeS256(verifier)), 302);
  response.cookies.set(OAUTH_COOKIE, packPending({ state, verifier }), cookieOptions(OAUTH_SECONDS));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
