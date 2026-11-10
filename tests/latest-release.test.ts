import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { getLatestRelease } from "../src/releases/latest-release.ts";
import { sampleRelease } from "./sample-release.ts";

const realFetch = globalThis.fetch;
let requested: string[] = [];

function stubFetch(respond: () => Response | Promise<Response>): void {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    requested.push(String(input));
    return respond();
  }) as typeof fetch;
}

beforeEach(() => {
  requested = [];
  process.env.RELEASES_API_URL = "https://api.example.com";
});

afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.RELEASES_API_URL;
});

test("200 with a valid release returns it, from the versioned route", async () => {
  stubFetch(() => Response.json(sampleRelease()));
  assert.deepEqual(await getLatestRelease(), sampleRelease());
  assert.deepEqual(requested, ["https://api.example.com/api/v1/releases/latest"]);
});

test("404 returns null", async () => {
  stubFetch(() => Response.json({ statusCode: 404, message: "none", error: "Not Found" }, { status: 404 }));
  assert.equal(await getLatestRelease(), null);
});

test("invalid JSON or a wrong shape returns null", async () => {
  stubFetch(() => new Response("<html>oops", { status: 200 }));
  assert.equal(await getLatestRelease(), null);
  stubFetch(() => Response.json({ version: "1.0.0" }));
  assert.equal(await getLatestRelease(), null);
});

test("a timeout or network error returns null", async () => {
  stubFetch(() => Promise.reject(new DOMException("The operation timed out", "TimeoutError")));
  assert.equal(await getLatestRelease(), null);
  stubFetch(() => Promise.reject(new TypeError("fetch failed")));
  assert.equal(await getLatestRelease(), null);
});

test("an unset or invalid RELEASES_API_URL returns null without calling the network", async () => {
  stubFetch(() => Response.json(sampleRelease()));
  delete process.env.RELEASES_API_URL;
  assert.equal(await getLatestRelease(), null);
  process.env.RELEASES_API_URL = "http://api.example.com";
  assert.equal(await getLatestRelease(), null);
  assert.deepEqual(requested, []);
});
