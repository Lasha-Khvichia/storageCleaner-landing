import { test } from "node:test";
import assert from "node:assert/strict";
import { isAdminRelease, isAdminReleaseList, isAuditList, isSyncStatus } from "../src/admin/admin-guard.ts";
import { sampleRelease } from "./sample-release.ts";

const NOW = "2026-11-10T12:00:00.000Z";

function adminRelease() {
  return {
    id: 7,
    version: "0.3.1",
    prerelease: null,
    releasedAt: NOW,
    notesUrl: "https://github.com/o/r/releases/tag/v0.3.1",
    hidden: false,
    removedAt: null,
    githubReleaseId: 99,
    createdAt: NOW,
    updatedAt: NOW,
    installers: sampleRelease().installers,
  };
}

test("an admin release passes, and each broken field fails", () => {
  assert.equal(isAdminRelease(adminRelease()), true);
  assert.equal(isAdminRelease({ ...adminRelease(), removedAt: NOW, githubReleaseId: null, prerelease: "beta.1" }), true);
  for (const patch of [
    { id: "7" },
    { version: "" },
    { hidden: "no" },
    { removedAt: "not a date" },
    { githubReleaseId: 1.5 },
    { installers: [{}] },
  ]) {
    assert.equal(isAdminRelease({ ...adminRelease(), ...patch }), false, JSON.stringify(patch));
  }
  assert.equal(isAdminRelease(null), false);
});

test("a release list must be an array of admin releases", () => {
  assert.equal(isAdminReleaseList([adminRelease()]), true);
  assert.equal(isAdminReleaseList([]), true);
  assert.equal(isAdminReleaseList({}), false);
  assert.equal(isAdminReleaseList([{ id: 1 }]), false);
});

test("audit entries need a known action", () => {
  const entry = { id: 1, at: NOW, githubUserId: 5, githubLogin: "octo", action: "hide", releaseId: 7, detail: null };
  assert.equal(isAuditList([entry]), true);
  assert.equal(isAuditList([{ ...entry, action: "sync", releaseId: null, detail: "ok" }]), true);
  assert.equal(isAuditList([{ ...entry, action: "delete" }]), false);
  assert.equal(isAuditList([{ ...entry, githubLogin: "" }]), false);
  assert.equal(isAuditList("nope"), false);
});

test("sync status checks its counts", () => {
  const status = { running: false, startedAt: NOW, finishedAt: NOW, result: "ok", counts: { added: 1, updated: 0, skipped: 2 } };
  assert.equal(isSyncStatus(status), true);
  assert.equal(isSyncStatus({ ...status, startedAt: null, finishedAt: null, result: null }), true);
  assert.equal(isSyncStatus({ ...status, counts: { added: -1, updated: 0, skipped: 0 } }), false);
  assert.equal(isSyncStatus({ ...status, counts: undefined }), false);
  assert.equal(isSyncStatus({ ...status, running: "yes" }), false);
});
