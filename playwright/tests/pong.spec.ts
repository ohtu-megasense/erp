import { test, expect } from "@playwright/test";

const url = "http://frontend:5173";

test("contains Megasense text", async ({ page }) => {
  await page.goto(url);

  await expect(page.getByText("Megasense")).toBeVisible();
});

test("creating a new category", async ({ page }) => {
  await page.goto(url);

  await page.click("text=Categories");

  await page.click("text=Manage");

  await page.locator("input").first().fill("New category");

  await page.click("text=Create");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const lastCategorySection = page.locator("div").filter({ hasText: "New Category" }).last();
  await expect(lastCategorySection).toBeVisible({ timeout: 10000 });
});
