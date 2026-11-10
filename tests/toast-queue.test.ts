import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addToast, dismissToast, EMPTY_QUEUE, MAX_TOASTS } from "../src/app/admin/_components/toast-queue.ts";

describe("toast queue", () => {
  it("puts the newest toast first and gives unique ids", () => {
    const queue = addToast(addToast(EMPTY_QUEUE, true, "one"), false, "two");
    assert.deepEqual(queue.items.map((t) => t.message), ["two", "one"]);
    assert.notEqual(queue.items[0].id, queue.items[1].id);
    assert.equal(queue.items[0].ok, false);
  });

  it("keeps at most the maximum, dropping the oldest", () => {
    let queue = EMPTY_QUEUE;
    for (let i = 1; i <= MAX_TOASTS + 2; i += 1) queue = addToast(queue, true, `m${i}`);
    assert.equal(queue.items.length, MAX_TOASTS);
    assert.equal(queue.items[0].message, `m${MAX_TOASTS + 2}`);
    assert.equal(queue.items.at(-1)?.message, "m3");
  });

  it("never reuses an id after a dismiss", () => {
    const first = addToast(EMPTY_QUEUE, true, "a");
    const emptied = dismissToast(first, first.items[0].id);
    assert.equal(emptied.items.length, 0);
    assert.notEqual(addToast(emptied, true, "b").items[0].id, first.items[0].id);
  });

  it("ignores an unknown id", () => {
    const queue = addToast(EMPTY_QUEUE, true, "a");
    assert.deepEqual(dismissToast(queue, 999), queue);
  });
});
