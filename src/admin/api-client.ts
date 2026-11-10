/**
 * One server-side call to the backend's admin API. Sends the service key and the admin's GitHub token,
 * validates the answer, and turns every failure into a plain message that never contains a credential.
 */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string };

export interface BackendAccess {
  apiUrl: string;
  serviceKey: string;
  /** The signed-in admin's GitHub token. */
  token: string;
}

const MESSAGES: Record<number, string> = {
  400: "The backend rejected the request.",
  401: "The backend did not accept the site's service key. Check ADMIN_SERVICE_KEY on both sides.",
  403: "This GitHub account is not allowed to use the admin.",
  404: "Not found, or admin is switched off on the backend.",
  429: "Too many requests. Wait about 30 seconds and try again.",
  503: "The backend could not reach GitHub. Try again in a moment.",
};

export function messageForStatus(status: number): string {
  return MESSAGES[status] ?? `The backend answered with an error (${status}).`;
}

export interface CallOptions<T> {
  method: "GET" | "POST" | "PATCH";
  path: string;
  guard: (value: unknown) => value is T;
  body?: unknown;
  timeoutMs?: number;
  /** Replaceable in tests. */
  fetchFn?: typeof fetch;
}

const NOT_UNDERSTOOD = "The backend sent an answer the site does not understand.";

type Sent<T> = { ok: true; data: T; res: Response } | { ok: false; status: number; message: string };

async function send<T>(access: BackendAccess, options: CallOptions<T>): Promise<Sent<T>> {
  const { method, path, guard, body, timeoutMs = 15000, fetchFn = fetch } = options;
  try {
    const res = await fetchFn(`${access.apiUrl}/api/v1/admin${path}`, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access.serviceKey}`,
        "X-GitHub-Token": access.token,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return { ok: false, status: res.status, message: messageForStatus(res.status) };
    const data: unknown = await res.json();
    if (!guard(data)) return { ok: false, status: 502, message: NOT_UNDERSTOOD };
    return { ok: true, data, res };
  } catch {
    return { ok: false, status: 0, message: "The backend did not answer in time. It may be waking up; try again." };
  }
}

export async function callBackend<T>(access: BackendAccess, options: CallOptions<T>): Promise<ApiResult<T>> {
  const sent = await send(access, options);
  return sent.ok ? { ok: true, data: sent.data } : sent;
}

/** Like `callBackend` for a paged list: also reads the row count from the `X-Total-Count` header. */
export async function callBackendPage<T>(
  access: BackendAccess,
  options: CallOptions<T[]>,
): Promise<ApiResult<{ items: T[]; total: number }>> {
  const sent = await send(access, options);
  if (!sent.ok) return sent;
  const header = sent.res.headers.get("X-Total-Count");
  if (header === null || !/^[0-9]{1,9}$/.test(header)) return { ok: false, status: 502, message: NOT_UNDERSTOOD };
  return { ok: true, data: { items: sent.data, total: Number(header) } };
}
