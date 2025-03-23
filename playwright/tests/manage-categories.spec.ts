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
		page.getByRole("cell", { name: "Test property 1 value" }),
	).toBeVisible();

	await expect(
		page.getByRole("cell", { name: "Test property 2 value" }),
	).toBeVisible();
});

test("items are shown as a part of a category they belong to", async ({
	page,
}) => {
	await page.goto("/categories/manage");
	//first category
	await page.getByTestId("category-name-input").click();
	await page.getByTestId("category-name-input").fill("T 1");
	await page.getByTestId("category-name-input").press("Tab");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-button").press("Tab");
	await page.getByTestId("add-property-input-1").fill("E 1");
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-2").click();
	await page.getByTestId("add-property-input-2").fill("E 2");
	await page.getByTestId("create-category-button").click();
	await page
		.locator("div")
		.filter({ hasText: /^Add New Category$/ })
		.getByRole("button")
		.click();
	await page.getByTestId("category-name-input").click();
	await page.getByTestId("category-name-input").fill("T 2");
	await page
		.getByText(
			'Category NameCategory NameDefine Item ShapeExample: "Hardware Sensor" could',
		)
		.click();
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-button").click();
	await page.getByTestId("add-property-input-1").click();
	await page.getByTestId("add-property-input-1").fill("E3");
	await page.getByTestId("add-property-input-1").press("Tab");
	await page.locator("form").getByRole("button").nth(1).press("Tab");
	await page.getByTestId("add-property-input-2").fill("E4");
	await page.getByTestId("create-category-button").click();
	await page.getByTestId("add-item-button").nth(1).click();
	await page.getByRole("textbox", { name: "E 1" }).click();
	await page.getByRole("textbox", { name: "E 1" }).fill("Ex1");
	await page.getByRole("textbox", { name: "E 1" }).press("Tab");
	await page.getByRole("textbox", { name: "E 2" }).fill("Ex2");
	await page.getByRole("button", { name: "+ Add" }).click();
	await page.getByRole("textbox", { name: "E 1" }).click();
	await page.getByRole("textbox", { name: "E 1" }).fill("E3");
	await page.getByRole("textbox", { name: "E 1" }).press("Tab");
	await page.getByRole("textbox", { name: "E 2" }).fill("E4");
	await page.getByRole("button", { name: "+ Add" }).click();
	await page.getByRole("button", { name: "Hide add form" }).click();
	await page.getByTestId("add-item-button").first().click();
	await page.getByRole("textbox", { name: "E3" }).click();
	await page.getByRole("textbox", { name: "E3" }).fill("S1");
	await page.getByRole("textbox", { name: "E3" }).press("Tab");
	await page.getByRole("textbox", { name: "E4" }).fill("S2");
	await page.getByRole("button", { name: "+ Add" }).click();
	await page.getByRole("textbox", { name: "E3" }).click();
	await page.getByRole("textbox", { name: "E3" }).fill("S3");
	await page.getByRole("textbox", { name: "E4" }).click();
	await page.getByRole("textbox", { name: "E4" }).fill("S4");
	await page.getByRole("button", { name: "+ Add" }).click();
	await page.getByRole("button", { name: "Hide add form" }).click();
	await expect(page.getByRole("columnheader", { name: "E3" })).toBeVisible();
	await expect(page.getByRole("columnheader", { name: "E4" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "S1" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "S2" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "S3" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "S4" })).toBeVisible();
	await expect(page.getByRole("columnheader", { name: "E 1" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "Ex1" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "E3" })).toBeVisible();
	await expect(page.getByRole("columnheader", { name: "E 2" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "Ex2" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "E4" })).toBeVisible();
	await expect(
		page.getByRole("columnheader", { name: "ID" }).nth(1),
	).toBeVisible();
	await expect(
		page.getByRole("columnheader", { name: "ID" }).first(),
	).toBeVisible();
	await expect(
		page.getByRole("cell", { name: "3", exact: true }),
	).toBeVisible();
	await expect(
		page.getByRole("cell", { name: "4", exact: true }),
	).toBeVisible();
	await expect(
		page.getByRole("cell", { name: "1", exact: true }),
	).toBeVisible();
	await expect(
		page.getByRole("cell", { name: "2", exact: true }),
	).toBeVisible();
});
