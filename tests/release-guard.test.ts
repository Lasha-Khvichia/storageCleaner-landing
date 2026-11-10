import { test } from "node:test";
import assert from "node:assert/strict";
import { isRelease } from "../src/releases/release-guard.ts";
import { parseApiUrl } from "../src/releases/api-url.ts";
import { sampleRelease } from "./sample-release.ts";

test("a valid release passes the guard", () => {
  assert.equal(isRelease(sampleRelease()), true);
});

test("a missing field is rejected", () => {
  const { notesUrl: _omitted, ...rest } = sampleRelease();
  assert.equal(isRelease(rest), false);
  assert.equal(isRelease(null), false);
  assert.equal(isRelease({ ...sampleRelease(), installers: "none" }), false);
});

test("an unknown os or kind is rejected", () => {
  const r = sampleRelease();
  assert.equal(isRelease({ ...r, installers: [{ ...r.installers[0], os: "macos" }] }), false);
  assert.equal(isRelease({ ...r, installers: [{ ...r.installers[0], kind: "dmg" }] }), false);
});

test("an http download or notes URL is rejected", () => {
  const r = sampleRelease();
  assert.equal(isRelease({ ...r, installers: [{ ...r.installers[0], url: "http://example.com/a.exe" }] }), false);
  assert.equal(isRelease({ ...r, notesUrl: "http://example.com/notes" }), false);
  assert.equal(isRelease({ ...r, notesUrl: "javascript:alert(1)" }), false);
});

test("RELEASES_API_URL: https without trailing slash; http only for this machine", () => {
  assert.equal(parseApiUrl("https://api.example.com"), "https://api.example.com");
  assert.equal(parseApiUrl("http://127.0.0.1:4000"), "http://127.0.0.1:4000");
  assert.equal(parseApiUrl("http://api.example.com"), null);
  assert.equal(parseApiUrl("https://api.example.com/"), null);
  assert.equal(parseApiUrl("not a url"), null);
  assert.equal(parseApiUrl(undefined), null);
  assert.equal(parseApiUrl(""), null);
});
