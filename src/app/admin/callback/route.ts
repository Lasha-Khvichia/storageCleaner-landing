import { NextResponse, type NextRequest } from "next/server";
import { readAdminConfig } from "@/admin/config";
import { ADMIN_COOKIE, OAUTH_COOKIE, cookieOptions } from "@/admin/cookie-options";
import { fetchGithubUser, exchangeCode } from "@/admin/github-api";
import { unpackPending } from "@/admin/oauth-cookie";
import { isAllowedUser } from "@/admin/oauth-flow";
import { statesMatch } from "@/admin/pkce";
import { SESSION_SECONDS, sealSession } from "@/admin/session";

export const dynamic = "force-dynamic";

const page = (status: number, text: string): NextResponse =>
  new NextResponse(`${text}\n`, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

/** Step 2 of the sign-in: check state, trade the code (+ PKCE verifier), allow only the one GitHub id. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const config = readAdminConfig(process.env);
  if (config === null) return page(404, "Admin is not configured.");
  const pending = unpackPending(request.cookies.get(OAUTH_COOKIE)?.value);
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const failed = (status: number, text: string) => {
    const response = page(status, text);
    response.cookies.set(OAUTH_COOKIE, "", cookieOptions(0)); // one use: the pending cookie is always dropped
    return response;
  };
  if (!pending || !code || !statesMatch(pending.state, params.get("state"))) {
    return failed(400, "Sign-in failed: the request could not be verified. Start again at /admin.");
  }
  const token = await exchangeCode(config, code, pending.verifier);
  const user = token === null ? null : await fetchGithubUser(token);
  if (token === null || user === null) return failed(502, "Sign-in failed: GitHub did not answer. Try again.");
  if (!isAllowedUser(user.id, config.userId)) return failed(403, "Not allowed.");
  const session = await sealSession({ userId: user.id, login: user.login, token }, config.sessionKeys);
  const response = NextResponse.redirect(new URL("/admin", config.origin), 303);
  response.cookies.set(OAUTH_COOKIE, "", cookieOptions(0));
  response.cookies.set(ADMIN_COOKIE, session, cookieOptions(SESSION_SECONDS));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
