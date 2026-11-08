// Run with `npm test` (Node's built-in runner; Node 22.18+ runs .ts directly).
import { test } from "node:test";
import assert from "node:assert/strict";
import { compareVersions, getLatestRelease, newestRelease } from "../src/releases/latest-release.ts";
import { detectOs, recommendedInstaller } from "../src/releases/recommend-installer.ts";
import { formatBytes } from "../src/releases/format-release.ts";
import { RELEASES_MOCK } from "../src/releases/releases.mock.ts";

test("versions compare by number, not as text", () => {
  assert.ok(compareVersions("0.3.10", "0.3.9") > 0);
  assert.ok(compareVersions("1.0.0", "0.99.99") > 0);
  assert.equal(compareVersions("0.3.1", "0.3.1"), 0);
});

test("the latest release is the highest version, wherever it is in the list", async () => {
  const shuffled = [...RELEASES_MOCK].reverse();
  assert.equal(newestRelease(shuffled)?.version, "0.3.1");
  assert.equal(newestRelease([]), null);
  assert.equal((await getLatestRelease()).version, "0.3.1");
});

test("every release offers all three installers with GitHub download links", () => {
  for (const r of RELEASES_MOCK) {
    assert.deepEqual(r.installers.map((i) => i.id), ["windows-nsis", "linux-deb", "linux-appimage"]);
    for (const i of r.installers) {
      assert.ok(i.url.startsWith(`https://github.com/Lasha-Khvichia/storageCleaner/releases/download/v${r.version}/`));
      assert.ok(i.url.endsWith(i.fileName));
      assert.ok(i.sizeBytes > 0);
    }
  }
});

test("the visitor's OS picks the matching installer", () => {
  const installers = RELEASES_MOCK[0].installers;
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
