import { test, expect } from "@playwright/test";
import { baseUrl } from "../config";

const url = baseUrl;
test.beforeEach(async ({ page }) => {
	await page.goto(url);
});

test("contains megasense text", async ({ page }) => {
	page.setDefaultTimeout(0);
	await expect(page.getByText("Megasense")).toBeVisible();
});
