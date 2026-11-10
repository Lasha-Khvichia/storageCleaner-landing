import { test } from "node:test";
import assert from "node:assert/strict";
import { adminHref, clampPage, lastPage, pageNumbers, parsePageParam, showingText } from "../src/admin/paging.ts";

test("page params: only 1 to 5 digits and at least 1 count", () => {
  assert.equal(parsePageParam("3"), 3);
  assert.equal(parsePageParam("99999"), 99999);
  for (const bad of [undefined, "", "0", "-1", "1.5", "abc", "100000", "007x", ["2", "3"]]) {
    assert.equal(parsePageParam(bad), 1);
  }
  assert.equal(parsePageParam("007"), 7);
});

test("last page is at least 1", () => {
  assert.equal(lastPage(0), 1);
  assert.equal(lastPage(20), 1);
  assert.equal(lastPage(21), 2);
  assert.equal(lastPage(236), 12);
});

test("clamp goes to the last page only when the list is not empty", () => {
  assert.equal(clampPage(5, 236), 5);
  assert.equal(clampPage(13, 236), 12);
  assert.equal(clampPage(3, 0), 3);
  assert.equal(clampPage(1, 5), 1);
});

test("href keeps the other param and leaves out page 1", () => {
  assert.equal(adminHref({ versions: 1, audit: 1 }), "/admin");
  assert.equal(adminHref({ versions: 2, audit: 1 }), "/admin?versions=2");
  assert.equal(adminHref({ versions: 1, audit: 4 }), "/admin?audit=4");
  assert.equal(adminHref({ versions: 2, audit: 3 }), "/admin?versions=2&audit=3");
});

test("page numbers: first, last, current +-1, gaps", () => {
  assert.deepEqual(pageNumbers(1, 1), [1]);
  assert.deepEqual(pageNumbers(1, 3), [1, 2, 3]);
  assert.deepEqual(pageNumbers(1, 12), [1, 2, "gap", 12]);
  assert.deepEqual(pageNumbers(6, 12), [1, "gap", 5, 6, 7, "gap", 12]);
  assert.deepEqual(pageNumbers(4, 12), [1, "gap", 3, 4, 5, "gap", 12]);
  assert.deepEqual(pageNumbers(12, 12), [1, "gap", 11, 12]);
});

test("showing text", () => {
  assert.equal(showingText(1, 0), "No entries");
  assert.equal(showingText(2, 236), "Showing 21–40 of 236");
  assert.equal(showingText(12, 236), "Showing 221–236 of 236");
  assert.equal(showingText(1, 5), "Showing 1–5 of 5");
});
