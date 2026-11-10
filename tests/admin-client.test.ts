import { test } from "node:test";
import assert from "node:assert/strict";
import { isSyncStatus } from "../src/admin/admin-guard.ts";
import { callBackend, callBackendPage, type BackendAccess } from "../src/admin/api-client.ts";

const access: BackendAccess = { apiUrl: "https://api.example", serviceKey: "SERVICE-KEY-123", token: "gho_TOKEN_456" };
const status = { running: false, startedAt: null, finishedAt: null, result: null, counts: { added: 0, updated: 0, skipped: 0 } };

function stub(response: Response | Error) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchFn: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init: init ?? {} });
    if (response instanceof Error) throw response;
    return response.clone();
  };
  return { calls, fetchFn };
}

test("a good answer is returned and both credentials are sent as headers", async () => {
  const { calls, fetchFn } = stub(Response.json(status));
  const result = await callBackend(access, { method: "GET", path: "/sync-status", guard: isSyncStatus, fetchFn });
  assert.deepEqual(result, { ok: true, data: status });
  assert.equal(calls[0]?.url, "https://api.example/api/v1/admin/sync-status");
  const headers = calls[0]?.init.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer SERVICE-KEY-123");
  assert.equal(headers["X-GitHub-Token"], "gho_TOKEN_456");
});

test("error statuses become plain messages without credentials", async () => {
  const expected: Record<number, RegExp> = {
    401: /service key/i,
    403: /not allowed/i,
    404: /not found|switched off/i,
    429: /too many/i,
    503: /GitHub/,
    500: /error \(500\)/,
  };
  for (const [code, pattern] of Object.entries(expected)) {
    const { fetchFn } = stub(new Response("SERVICE-KEY-123 gho_TOKEN_456", { status: Number(code) }));
    const result = await callBackend(access, { method: "GET", path: "/audit", guard: isSyncStatus, fetchFn });
    assert.equal(result.ok, false);
    if (result.ok) continue;
    assert.equal(result.status, Number(code));
    assert.match(result.message, pattern);
    assert.doesNotMatch(result.message, /SERVICE-KEY-123|gho_TOKEN_456/);
  }
});

test("a network failure or a malformed answer is reported, not thrown", async () => {
  const down = await callBackend(access, {
    method: "GET",
    path: "/sync-status",
    guard: isSyncStatus,
    fetchFn: stub(new Error("connect ECONNREFUSED with SERVICE-KEY-123")).fetchFn,
  });
  assert.equal(down.ok, false);
  if (!down.ok) assert.doesNotMatch(down.message, /SERVICE-KEY-123/);
  const odd = await callBackend(access, {
    method: "GET",
    path: "/sync-status",
    guard: isSyncStatus,
    fetchFn: stub(Response.json({ running: "maybe" })).fetchFn,
  });
  assert.equal(odd.ok, false);
});

test("callBackendPage returns the items and the X-Total-Count", async () => {
  const guard = (v: unknown): v is number[] => Array.isArray(v);
  const { fetchFn } = stub(Response.json([1, 2], { headers: { "X-Total-Count": "236" } }));
  const result = await callBackendPage(access, { method: "GET", path: "/audit?page=1&pageSize=20", guard, fetchFn });
  assert.deepEqual(result, { ok: true, data: { items: [1, 2], total: 236 } });
});

test("callBackendPage rejects a missing or invalid X-Total-Count", async () => {
  const guard = (v: unknown): v is number[] => Array.isArray(v);
  for (const header of [undefined, "", "-1", "abc", "1.5", "1234567890"]) {
    const headers: Record<string, string> = header === undefined ? {} : { "X-Total-Count": header };
    const { fetchFn } = stub(Response.json([], { headers }));
    const result = await callBackendPage(access, { method: "GET", path: "/audit", guard, fetchFn });
    assert.deepEqual(result, { ok: false, status: 502, message: "The backend sent an answer the site does not understand." });
  }
});
