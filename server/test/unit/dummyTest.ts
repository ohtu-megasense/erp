import { test } from "node:test";
import assert from "node:assert";

// On running node:test with typescript
// https://github.com/nodejs/help/issues/3902

test("dummy test", () => {
  assert.strictEqual(1, 1);
});
