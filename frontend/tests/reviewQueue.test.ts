import assert from "node:assert/strict";
import test from "node:test";
import { firstReviewItemAfter } from "../src/lib/reviewQueue.ts";

test("continues after the current document when it has left the refreshed queue", () => {
  assert.equal(firstReviewItemAfter([{ id: 1 }, { id: 3 }], 2)?.id, 3);
});

test("returns no successor when the current document is last", () => {
  assert.equal(firstReviewItemAfter([{ id: 1 }, { id: 2 }], 2), undefined);
});

test("starts at the first item when no document is selected", () => {
  assert.equal(firstReviewItemAfter([{ id: 1 }, { id: 2 }], undefined)?.id, 1);
});
