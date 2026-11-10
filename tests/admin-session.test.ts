import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { parseSessionKeys } from "../src/admin/session-keys.ts";
import { SESSION_SECONDS, openSession, sealSession } from "../src/admin/session.ts";

const key = () => new Uint8Array(randomBytes(32));
const who = { userId: 189664952, login: "octo", token: "gho_secret_token" };

test("a sealed session opens again with the same data", async () => {
  const keys = [key()];
  const sealed = await sealSession(who, keys);
  assert.deepEqual(await openSession(sealed, keys), who);
  assert.ok(!sealed.includes("gho_secret_token"), "the token is not readable in the cookie");
});

test("a tampered or missing cookie is rejected", async () => {
  const keys = [key()];
  const sealed = await sealSession(who, keys);
  const flipped = `${sealed.slice(0, -2)}${sealed.endsWith("AA") ? "BB" : "AA"}`;
  assert.equal(await openSession(flipped, keys), null);
  assert.equal(await openSession("garbage", keys), null);
  assert.equal(await openSession(undefined, keys), null);
});

test("a session older than 8 hours is rejected", async () => {
  const keys = [key()];
  const start = Date.now();
  const sealed = await sealSession(who, keys, start);
  assert.notEqual(await openSession(sealed, keys, start + (SESSION_SECONDS - 5) * 1000), null);
  assert.equal(await openSession(sealed, keys, start + (SESSION_SECONDS + 5) * 1000), null);
});

test("key rotation: the old key still opens, the new first key seals", async () => {
  const oldKey = key();
  const newKey = key();
  const sealedOld = await sealSession(who, [oldKey]);
  assert.notEqual(await openSession(sealedOld, [newKey, oldKey]), null);
  assert.equal(await openSession(sealedOld, [newKey]), null);
  const sealedNew = await sealSession(who, [newKey, oldKey]);
  assert.notEqual(await openSession(sealedNew, [newKey]), null);
  assert.equal(await openSession(sealedNew, [oldKey]), null);
});

test("session keys must be 32 bytes of base64, comma separated for rotation", () => {
  const a = randomBytes(32).toString("base64");
  const b = randomBytes(32).toString("base64");
  assert.equal(parseSessionKeys(a)?.length, 1);
  assert.equal(parseSessionKeys(`${a}, ${b}`)?.length, 2);
  assert.equal(parseSessionKeys(randomBytes(16).toString("base64")), null);
  assert.equal(parseSessionKeys(`${a},`), null);
  assert.equal(parseSessionKeys("not base64!"), null);
  assert.equal(parseSessionKeys(undefined), null);
});
