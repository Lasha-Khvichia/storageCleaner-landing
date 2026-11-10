// Run with `npm test` (Node's built-in runner; Node 22.18+ runs .ts directly).
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectOs, recommendedInstaller } from "../src/releases/recommend-installer.ts";
import { formatBytes } from "../src/releases/format-release.ts";
import { sampleRelease } from "./sample-release.ts";

test("the visitor's OS picks the matching installer", () => {
  const installers = sampleRelease().installers;
  const win = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130";
  const linux = "Mozilla/5.0 (X11; Linux x86_64) Chrome/130";
  const android = "Mozilla/5.0 (Linux; Android 14) Chrome/130";
  const mac = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)";
  assert.equal(recommendedInstaller(installers, detectOs(win))?.id, "windows-nsis");
  assert.equal(recommendedInstaller(installers, detectOs(linux))?.id, "linux-deb");
  assert.equal(detectOs(android), null);
  assert.equal(recommendedInstaller(installers, detectOs(mac)), null);
});

test("sizes use binary units like the app", () => {
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(3348507), "3.2 MB");
  assert.equal(formatBytes(83245560), "79.4 MB");
});
