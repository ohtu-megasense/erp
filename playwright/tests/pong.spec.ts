import { test, expect } from "@playwright/test";

const url = "http://localhost:5173";

test("contains pong text", async ({ page }) => {
  await page.goto(url);

  await expect(page.getByText("pong")).toBeVisible();
});
