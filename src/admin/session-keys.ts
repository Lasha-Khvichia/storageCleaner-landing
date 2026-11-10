/**
 * ADMIN_SESSION_KEY: one or more base64 keys of exactly 32 bytes, comma separated.
 * The first key encrypts new sessions; every key is accepted for reading (rotation).
 */
const KEY_BYTES = 32;

/** The decoded keys, or null when the value is unset or any key is malformed or the wrong length. */
export function parseSessionKeys(raw: string | undefined): Uint8Array[] | null {
  if (!raw) return null;
  const parts = raw.split(",").map((part) => part.trim());
  const keys: Uint8Array[] = [];
  for (const part of parts) {
    if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(part)) return null;
    const bytes = new Uint8Array(Buffer.from(part, "base64"));
    if (bytes.length !== KEY_BYTES) return null;
    keys.push(bytes);
  }
  return keys;
}
