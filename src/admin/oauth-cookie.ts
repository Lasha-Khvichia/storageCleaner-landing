/** The short-lived __Host-sc_oauth cookie value: `<state>.<verifier>` (both base64url, so no dots inside). */
export interface OauthPending {
  state: string;
  verifier: string;
}

export function packPending(pending: OauthPending): string {
  return `${pending.state}.${pending.verifier}`;
}

export function unpackPending(raw: string | undefined): OauthPending | null {
  if (!raw) return null;
  const parts = raw.split(".");
  const [state, verifier] = parts;
  if (parts.length !== 2 || !state || !verifier) return null;
  return { state, verifier };
}
