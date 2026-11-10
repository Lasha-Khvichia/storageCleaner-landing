/**
 * The admin session: an encrypted JWT (jose, alg "dir", enc A256GCM) in the __Host-sc_admin cookie.
 * The GitHub access token lives only inside it, so it never reaches the browser in readable form.
 */
import { EncryptJWT, jwtDecrypt } from "jose";

export const SESSION_SECONDS = 8 * 60 * 60;

export interface AdminSession {
  userId: number;
  login: string;
  /** The user's GitHub access token. Server-side only. */
  token: string;
}

/** Encrypts with the first key. `nowMs` is for tests. */
export async function sealSession(session: AdminSession, keys: Uint8Array[], nowMs = Date.now()): Promise<string> {
  const iat = Math.floor(nowMs / 1000);
  return new EncryptJWT({ uid: session.userId, login: session.login, tok: session.token })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt(iat)
    .setExpirationTime(iat + SESSION_SECONDS)
    .encrypt(keys[0]);
}

/** The session, or null when the cookie is missing, tampered with, expired or sealed with an unknown key. */
export async function openSession(
  cookie: string | undefined,
  keys: Uint8Array[],
  nowMs = Date.now(),
): Promise<AdminSession | null> {
  if (!cookie) return null;
  for (const key of keys) {
    try {
      const { payload } = await jwtDecrypt(cookie, key, {
        currentDate: new Date(nowMs),
        keyManagementAlgorithms: ["dir"],
        contentEncryptionAlgorithms: ["A256GCM"],
        requiredClaims: ["exp", "iat"],
      });
      const { uid, login, tok } = payload;
      if (typeof uid !== "number" || typeof login !== "string" || typeof tok !== "string") return null;
      return { userId: uid, login, token: tok };
    } catch {
      continue;
    }
  }
  return null;
}
