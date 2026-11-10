import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { readAdminConfig } from "../src/admin/config.ts";
import { packPending, unpackPending } from "../src/admin/oauth-cookie.ts";
import { authorizeUrl, isAllowedUser } from "../src/admin/oauth-flow.ts";
import { challengeS256, randomToken, statesMatch } from "../src/admin/pkce.ts";
import { isSameOrigin } from "../src/admin/origin.ts";

test("state must match exactly; missing or wrong state is rejected", () => {
  const state = randomToken();
  assert.equal(statesMatch(state, state), true);
  assert.equal(statesMatch(state, randomToken()), false);
  assert.equal(statesMatch(state, null), false);
  assert.equal(statesMatch(undefined, state), false);
  assert.equal(statesMatch(state, state.slice(1)), false);
});

test("the pending cookie round-trips and rejects malformed values", () => {
  const pending = { state: randomToken(), verifier: randomToken() };
  assert.deepEqual(unpackPending(packPending(pending)), pending);
  for (const bad of [undefined, "", "a", "a.b.c", ".b", "a."]) assert.equal(unpackPending(bad), null);
});

test("the PKCE challenge is base64url(SHA-256(verifier))", () => {
  const verifier = randomToken();
  assert.equal(challengeS256(verifier), createHash("sha256").update(verifier).digest("base64url"));
  // RFC 7636 appendix B example
  assert.equal(
    challengeS256("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"),
    "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
  );
});

test("the authorize URL carries state, S256 challenge, redirect_uri and no scope", () => {
  const url = new URL(authorizeUrl("client123", "https://site.example", "st", "ch"));
  assert.equal(url.origin + url.pathname, "https://github.com/login/oauth/authorize");
  assert.equal(url.searchParams.get("client_id"), "client123");
  assert.equal(url.searchParams.get("redirect_uri"), "https://site.example/admin/callback");
  assert.equal(url.searchParams.get("state"), "st");
  assert.equal(url.searchParams.get("code_challenge"), "ch");
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.equal(url.searchParams.has("scope"), false);
});

test("only the one numeric GitHub id is allowed", () => {
  assert.equal(isAllowedUser(189664952, 189664952), true);
  assert.equal(isAllowedUser(189664953, 189664952), false);
  assert.equal(isAllowedUser(Number.NaN, 189664952), false);
});

test("Server Actions need the site's own Origin and Host", () => {
  const site = "https://site.example";
  const headers = (h: Record<string, string>) => ({ get: (name: string) => h[name] ?? null });
  assert.equal(isSameOrigin(headers({ origin: site, host: "site.example" }), site), true);
  assert.equal(isSameOrigin(headers({ origin: "https://evil.example", host: "site.example" }), site), false);
  assert.equal(isSameOrigin(headers({ host: "site.example" }), site), false);
  assert.equal(isSameOrigin(headers({ origin: site, host: "evil.example" }), site), false);
  assert.equal(isSameOrigin(headers({ origin: site, host: "x", "x-forwarded-host": "site.example" }), site), true);
});

test("admin config is null unless every variable is valid", () => {
  const env = {
    GITHUB_OAUTH_CLIENT_ID: "id",
    GITHUB_OAUTH_CLIENT_SECRET: "secret",
    ADMIN_SESSION_KEY: randomBytes(32).toString("base64"),
    ADMIN_GITHUB_USER_ID: "189664952",
    ADMIN_SERVICE_KEY: "svc",
    RELEASES_API_URL: "https://api.example",
  };
  assert.equal(readAdminConfig(env)?.userId, 189664952);
  assert.equal(readAdminConfig({}), null);
  for (const name of Object.keys(env)) assert.equal(readAdminConfig({ ...env, [name]: undefined }), null, name);
  assert.equal(readAdminConfig({ ...env, ADMIN_GITHUB_USER_ID: "octocat" }), null);
});
