import { test, expect } from "@playwright/test";
import { baseUrl } from "../config";

const url = baseUrl

test("contains Megasense text", async ({ page }) => {
  await page.goto(url);

  await expect(page.getByText("Megasense")).toBeVisible();
});

// test("creating a new category", async ({ page }) => {
//   await page.goto(url);

//   await page.click("text=Categories");

//   await page.click("text=Manage");

//   await page.click("text=Add New Category");

//   await page.fill("input[name=name]", "New category");

//   await page.click("text=Create");

//   await expect(page.getByText("New category")).toBeVisible();
// });
