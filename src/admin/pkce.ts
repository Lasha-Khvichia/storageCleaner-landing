/** PKCE (RFC 7636, method S256) and the OAuth `state` value. */
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/** 32 random bytes as base64url (43 characters; the dot-free alphabet is relied on by oauth-cookie.ts). */
export function randomToken(): string {
  return randomBytes(32).toString("base64url");
}

/** base64url(SHA-256(verifier)). */
export function challengeS256(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

/** Constant-time comparison; false when either value is missing or the lengths differ. */
export function statesMatch(expected: string | undefined, actual: string | null | undefined): boolean {
  if (!expected || !actual) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && timingSafeEqual(a, b);
}
