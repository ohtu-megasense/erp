import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/testing/reset");
  expect(response.status()).toBe(200);
});

test("dummy test", async ({ page }) => {
  await page.goto("/categories/manage");
  await expect(page.getByText("Megasense")).toBeVisible();
});

test("category with 2 properties can be created", async ({ page }) => {
  await page.goto("/categories/manage");

  await page.locator("input").first().fill("New category");

  await page.click("text=Add property");
  await page.locator("input").nth(1).fill("Property1");

  await page.click("text=Add property");
  await page.locator("input").nth(2).fill("Property2");

  await expect(page.locator("input")).toHaveCount(3);

  await page.click("button:has-text('Create')");

  await expect(page.getByText("New category created")).toBeVisible();
});

test("items can be added to a category", async ({ page }) => {
  await page.goto("/categories/manage");

  await page.getByTestId("category-name-input").fill("Test Category 1234");

  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("Test property 1");

  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-2").click();
  await page.getByTestId("add-property-input-2").fill("Test property 2");

  await page.getByTestId("create-category-button").click();

  await page.getByTestId("add-item-button").click();

  await page
    .getByRole("textbox", { name: "Test property 1" })
    .fill("Test property 1 value");

  await page
    .getByRole("textbox", { name: "Test property 2" })
    .fill("Test property 2 value");

  await page.getByRole("button", { name: "+ Add" }).click();

  await expect(
    page.getByRole("cell", { name: "Test property 1 value" })
  ).toBeVisible();

  await expect(
    page.getByRole("cell", { name: "Test property 2 value" })
  ).toBeVisible();
});
