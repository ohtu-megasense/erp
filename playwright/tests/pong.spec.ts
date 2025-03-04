import { test, expect } from "@playwright/test";

const url = "http://frontend:5173";

test("contains Megasense text", async ({ page }) => {
  await page.goto(url);

  await expect(page.getByText("Megasense")).toBeVisible();
});
