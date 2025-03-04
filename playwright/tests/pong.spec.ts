import { test, expect } from "@playwright/test";

const url = "http://localhost:5173";

test("contains pong text", async ({ page }) => {
  await page.goto(url);

  await expect(page.getByText("pong")).toBeVisible();
});

test("creating a new category", async ({ page }) => {
  await page.goto(url);

  await page.click("text=Categories");

  await page.click("text=Manage");

  await page.click("text=Add New Category");

  await page.fill("input[name=name]", "New category");

  await page.click("text=Create");

  await expect(page.getByText("New category")).toBeVisible();
});
