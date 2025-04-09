import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
	const response = await request.post("/api/testing/reset");
	expect(response.status()).toBe(200);
});

test("dummy test", async ({ page }) => {
	await page.goto("/categories/inventory");
	await expect(page.getByText("Megasense")).toBeVisible();
});

test("category with 2 properties can be created", async ({ page }) => {
	await page.goto("/categories/inventory");

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
	await page.goto("/categories/inventory");

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
		page.getByRole("cell", { name: "Test property 1 value" }),
	).toBeVisible();

	await expect(
		page.getByRole("cell", { name: "Test property 2 value" }),
	).toBeVisible();
});

test("category can be renamed", async ({ page }) => {
	await page.goto("/categories/inventory");
	await page.getByTestId("category-name-input").fill("Example 1");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-1").click();
	await page.getByTestId("add-property-input-1").fill("Ex 1");
	await page.getByTestId("create-category-button").click();
	await page.getByTestId("edit-category-button").click();
	await page.getByRole("textbox").fill("Renamed Example");
	await page.getByTestId("save-category-button").click();
	await page.getByText("Save").click();
	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Renamed ExampleNo items added$/ })
			.nth(2),
	).toBeVisible();
})

test("cancelling rename doesnt change name", async ({ page }) => {
	await page.goto("/categories/inventory");
	await page.getByTestId("category-name-input").fill("Example 1");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-1").click();
	await page.getByTestId("add-property-input-1").fill("Ex 1");
	await page.getByTestId("create-category-button").click();
	await page.getByTestId("edit-category-button").click();
	await page.getByRole("textbox").fill("Renamed Example");
	await page.getByTestId("save-category-button").click();
	await page.getByRole('button', { name: 'Cancel' }).click();
	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Example 1No items added$/ })
			.nth(2),
	).toBeVisible();
})

test("deleting category deletes category", async ({ page }) => {
	await page.goto("/categories/inventory");
	await page.getByTestId("category-name-input").fill("Example 1");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-1").click();
	await page.getByTestId("add-property-input-1").fill("Ex 1");
	await page.getByTestId("create-category-button").click();
	await page.getByTestId("edit-category-button").click();
	await page.getByTestId("delete-category-button").click();
	await page.getByRole('button', { name: 'Save' }).click();
	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Example 1No items added$/ })
			.nth(2),
	).toHaveCount(0)
})

test("cancelling category deletion doesnt delete", async ({ page }) => {
	await page.goto("/categories/inventory");
	await page.getByTestId("category-name-input").fill("Example 1");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-1").click();
	await page.getByTestId("add-property-input-1").fill("Ex 1");
	await page.getByTestId("create-category-button").click();
	await page.getByTestId("edit-category-button").click();
	await page.getByTestId("delete-category-button").click();
	await page.getByRole('button', { name: 'Cancel' }).click();
	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Example 1No items added$/ })
			.nth(2),
	).toBeVisible();
})

test("test", async ({ page }) => {
	await page.goto("/categories/inventory");
	await page.getByTestId("category-name-input").click();
	await page.getByTestId("category-name-input").fill("Example 1");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-1").click();
	await page.getByTestId("add-property-input-1").fill("Ex 1");
	await page.getByTestId("add-property-input-2").click();
	await page.getByTestId("add-property-input-2").fill("Ex 2");
	await page.getByTestId("create-category-button").click();
	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Example 1No items added$/ })
			.nth(2),
	).toBeVisible();
	await page
		.locator("div")
		.filter({ hasText: /^Add New Category$/ })
		.getByRole("button")
		.click();
	await page.getByTestId("category-name-input").click();
	await page.getByTestId("category-name-input").fill("Example 2");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-1").click();
	await page.getByTestId("add-property-input-1").fill("Exampleprop 1");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-2").click();
	await page.getByTestId("add-property-input-2").fill("Exampleprop 2");
	await page.getByTestId("create-category-button").click();
	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Example 2No items added$/ })
			.first(),
	).toBeVisible();
	await page
		.locator("div")
		.filter({ hasText: /^Example 1No items added$/ })
		.getByTestId("add-item-button")
		.click();
	await page.getByRole("textbox", { name: "Ex 1" }).click();
	await page.getByRole("textbox", { name: "Ex 1" }).fill("example1");
	await page.getByRole("textbox", { name: "Ex 2" }).click();
	await page.getByRole("textbox", { name: "Ex 2" }).fill("example2");
	await page.getByRole("button", { name: "+ Add" }).click();
	await page.getByRole("button", { name: "Hide add form" }).click();
	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Example 1IDEx 1Ex 2[0-9]+example1example2$/ })
			.first(),
	).toBeVisible();
	await page
		.locator("div")
		.filter({ hasText: /^Example 2No items added$/ })
		.getByTestId("add-item-button")
		.click();
	await page.getByRole("textbox", { name: "Exampleprop 1" }).click();
	await page.getByRole("textbox", { name: "Exampleprop 1" }).fill("prop1");
	await page.getByRole("textbox", { name: "Exampleprop 2" }).click();
	await page.getByRole("textbox", { name: "Exampleprop 2" }).fill("prop2");
	await page.getByRole("button", { name: "+ Add" }).click();
	await page.getByRole("textbox", { name: "Exampleprop 1" }).click();
	await page.getByRole("textbox", { name: "Exampleprop 1" }).fill("prop3");
	await page.getByRole("textbox", { name: "Exampleprop 2" }).click();
	await page.getByRole("textbox", { name: "Exampleprop 2" }).fill("prop4");
	await page.getByRole("button", { name: "+ Add" }).click();
	await page.getByRole("button", { name: "Hide add form" }).click();
	await expect(
		page
			.locator("div")
			.filter({
				hasText:
					/^Example 2IDExampleprop 1Exampleprop 2[0-9]+prop1prop2[0-9]+prop3prop4$/,
			})
			.first(),
	).toBeVisible();
});
