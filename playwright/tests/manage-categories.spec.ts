import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const response = await request.post("/api/testing/reset");
  expect(response.status()).toBe(200);
});

const pageUrl = "/inventory/data";

test("dummy test", async ({ page }) => {
  await page.goto(pageUrl);
  await expect(page.getByText("Megasense")).toBeVisible();
});

test("category with 2 properties can be created", async ({ page }) => {
  await page.goto(pageUrl);

  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Test category");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("Property 1");
  await page.locator("#propertyType-0").click();
  await page.getByRole("option", { name: "TEXT" }).click();
  await page.getByTestId("add-property-input-2").click();
  await page.getByTestId("add-property-input-2").fill("Property 2");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "INTEGER" }).click();
  await page.getByTestId("create-category-button").click();
  await expect(page.getByText("New category created")).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Test categoryNo items added$/ })
      .nth(2)
  ).toBeVisible();
});

test("items can be added to a category", async ({ page }) => {
  await page.goto(pageUrl);

  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Test Category 1234");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("Test property 1");
  await page.locator("#propertyType-0").click();
  await page.getByRole("option", { name: "TEXT" }).click();
  await page.getByTestId("add-property-input-2").click();
  await page.getByTestId("add-property-input-2").fill("Test property 2");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "INTEGER" }).click();
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-3").click();
  await page.getByTestId("add-property-input-3").fill("Test property 3");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "FLOAT" }).click();
  await page.getByTestId("create-category-button").click();
  await page.getByTestId("add-item-button").click();
  await page.getByRole("textbox", { name: "Test property 1 TEXT" }).click();
  await page
    .getByRole("textbox", { name: "Test property 1 TEXT" })
    .fill("Test value 1");
  await page.getByRole("textbox", { name: "Test property 2 INTEGER" }).click();
  await page
    .getByRole("textbox", { name: "Test property 2 INTEGER" })
    .fill("123");
  await page.getByRole("textbox", { name: "Test property 3 FLOAT" }).click();
  await page
    .getByRole("textbox", { name: "Test property 3 FLOAT" })
    .fill("123.123");
  await page.getByRole("button", { name: "+ Add" }).click();
  await expect(
    page
      .locator("div")
      .filter({
        hasText:
          /^IDTest property 1Test property 2Test property 3[0-9]+Test value 1123123\.123$/,
      })
      .first()
  ).toBeVisible();
});

test("multiple categories can be created and items can be deleted", async ({
  page,
}) => {
  await page.goto(pageUrl);
  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Ex1");
  await page.getByTestId("add-property-button").click();
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "TEXT" }).click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("test1");
  await page.getByTestId("create-category-button").click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Ex1No items added$/ })
      .nth(2)
  ).toBeVisible();
  await page
    .locator("div")
    .filter({ hasText: /^Add New Category$/ })
    .getByRole("button")
    .click();
  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Ex2");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("example1");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "INTEGER" }).click();
  await page.getByTestId("create-category-button").click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Ex2No items added$/ })
      .first()
  ).toBeVisible();
  await page.getByTestId("add-item-button").first().click();
  await page.getByRole("textbox", { name: "test1 TEXT" }).click();
  await page.getByRole("textbox", { name: "test1 TEXT" }).fill("example");
  await page.getByRole("button", { name: "+ Add" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Ex1IDtest1[0-9]+example$/ })
      .first()
  ).toBeVisible();
  await page.getByTestId("add-item-button").nth(1).click();
  await page.getByRole("textbox", { name: "example1 INTEGER" }).click();
  await page.getByRole("textbox", { name: "example1 INTEGER" }).fill("123");
  await page.getByRole("button", { name: "+ Add" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Ex2IDexample1[0-9]+123$/ })
      .first()
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit category" }).nth(1).click();
  await page.getByRole("row", { name: "123" }).getByRole("button").click();
  await expect(
    page.getByRole("heading", { name: "Do you want to delete this" })
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^If you delete this item, it can't be undone$/ })
  ).toBeVisible();
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^No items added$/ })
      .first()
  ).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.locator("#root")).toMatchAriaSnapshot(`

    - main:
      - paragraph: INVENTORY
      - paragraph: Manage Data
      - paragraph: Create new categories
      - button
      - heading "Add New Category" [level=6]
      - paragraph: Ex1
      - button "Edit category"
      - button "Show add form"
      - table:
        - rowgroup:
          - row "ID test1":
            - columnheader "ID"
            - columnheader "test1"
        - rowgroup:
          - row /\\d+ example/:
            - cell /\\d+/
            - cell "example"
      - paragraph: Ex2
      - button "Edit category"
      - button "Show add form"
      - text: No items added
    `);
});
test("int and float values get added correctly", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Ints and floats");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("int");
  await page.locator("#propertyType-0").click();
  await page.getByRole("option", { name: "INTEGER" }).click();
  await page.getByTestId("add-property-input-2").click();
  await page.getByTestId("add-property-input-2").fill("float");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "FLOAT" }).click();
  await page.getByTestId("create-category-button").click();
  await page.getByTestId("add-item-button").click();
  await page.getByRole("textbox", { name: "int INTEGER" }).click();
  await page.getByRole("textbox", { name: "int INTEGER" }).fill("d");
  await page.getByRole("textbox", { name: "float FLOAT" }).click();
  await page.getByRole("textbox", { name: "float FLOAT" }).fill("s");
  await page.getByRole("textbox", { name: "int INTEGER" }).click();
  await page.getByRole("textbox", { name: "int INTEGER" }).fill("123");
  await page.getByRole("textbox", { name: "float FLOAT" }).click();
  await page.getByRole("textbox", { name: "float FLOAT" }).fill("123.123");
  await page.getByRole("button", { name: "+ Add" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^IDintfloat[0-9]+123123\.123$/ })
      .first()
  ).toBeVisible();
});

test("category can be renamed", async ({ page }) => {
  await page.goto(pageUrl);

  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Example category");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("Ex11");
  await page.locator("#propertyType-0").click();
  await page.getByRole("option", { name: "TEXT" }).click();
  await page.getByTestId("add-property-input-2").click();
  await page.getByTestId("add-property-input-2").fill("Ex12");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "INTEGER" }).click();
  await page.getByTestId("create-category-button").click();
  await page.getByRole("button", { name: "Edit category" }).click();
  await page.locator("#categoryName").click();
  await page.locator("#categoryName").fill("Example 111");
  await page.getByTestId("save-category-button").click();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Example 111No items added$/ })
      .nth(2)
  ).toBeVisible();
});
test("cancelling rename doesnt change name", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Example1");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("Ex1");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "TEXT" }).click();
  await page.getByTestId("create-category-button").click();
  await page.getByRole("button", { name: "Edit category" }).click();
  await page.locator("#categoryName").click();
  await page.locator("#categoryName").fill("Renamed");
  await page.getByTestId("save-category-button").click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Example1No items added$/ })
      .nth(2)
  ).toBeVisible();
});
test("deleting category deletes category", async ({ page }) => {
  await page.goto(pageUrl);

  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Deletetest");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("exprop1");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "TEXT" }).click();
  await page.getByTestId("create-category-button").click();
  await page.getByRole("button", { name: "Edit category" }).click();
  await page.getByTestId("delete-category-button").click();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.locator("html")).toMatchAriaSnapshot(`
    - document:
      - main:
        - paragraph: Create new categories
        - button
        - heading "Add New Category" [level=6]
    `);
});

test("cancelling category deletion doesnt delete", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Canceltest");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("something");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "TEXT" }).click();
  await page.getByTestId("create-category-button").click();
  await page.getByRole("button", { name: "Edit category" }).click();
  await page.getByTestId("delete-category-button").click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator("html")).toMatchAriaSnapshot(`
    - document:
      - alert:
        - text: New category created
        - button "Close"
      - banner:
        - separator
      - main:
        - paragraph: INVENTORY
        - paragraph: Manage Data
        - paragraph: Create new categories
        - button
        - heading "Add New Category" [level=6]
        - paragraph: Canceltest
        - button "Edit category"
        - button "Show add form"
        - text: No items added
    `);
});

test("can i) open AI ERP chat, ii) ask a question, and iii) see DeepSeeks first answer", async ({
  page,
}) => {
  await page.goto(pageUrl);
  await page.getByRole("link", { name: "AI Insights" }).click();
  await page.getByRole("textbox", { name: "Type your message..." }).click();
  await page
    .getByRole("textbox", { name: "Type your message..." })
    .fill("Can you access the data?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(
    page.locator("div").filter({ hasText: /.{5,}/ }).last()
  ).toBeVisible({ timeout: 150000 });
});

test("updating works", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByTestId("category-name-input").click();
  await page.getByTestId("category-name-input").fill("Example");
  await page.getByTestId("add-property-button").click();
  await page.getByTestId("add-property-input-1").click();
  await page.getByTestId("add-property-input-1").fill("somethign");
  await page.getByLabel("", { exact: true }).click();
  await page.getByRole("option", { name: "TEXT" }).click();
  await page.getByTestId("create-category-button").click();
  await page.getByTestId("add-item-button").click();
  await page.getByRole("textbox", { name: "somethign TEXT" }).click();
  await page.getByRole("textbox", { name: "somethign TEXT" }).fill("ex1");
  await page.getByRole("button", { name: "+ Add" }).click();
  await page.getByTestId("add-item-button").click();
  await page.getByRole("textbox", { name: "somethign TEXT" }).click();
  await page.getByRole("textbox", { name: "somethign TEXT" }).fill("ex2");
  await page.getByRole("button", { name: "+ Add" }).click();
  await page.getByRole("button", { name: "Edit category" }).click();
  await page.getByRole("row", { name: "ex1" }).getByRole("textbox").click();
  await page
    .getByRole("row", { name: "ex1" })
    .getByRole("textbox")
    .fill("ex122");
  await page.getByTestId("save-category-button").click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("cell", { name: "ex122" })).toBeVisible();
  await expect(page.locator("#root")).toMatchAriaSnapshot(`
    - main:
      - paragraph: INVENTORY
      - button
      - heading "Add New Category" [level=6]
      - paragraph: Example
      - button "Edit category"
      - button "Show add form"
      - table:
        - rowgroup:
          - row "ID somethign":
            - columnheader "ID"
            - columnheader "somethign"
        - rowgroup:
          - row /\\d+ ex122/:
            - cell /\\d+/
            - cell "ex122"
          - row /\\d+ ex2/:
            - cell /\\d+/
            - cell "ex2"
    `);
  await page.getByRole("button", { name: "Edit category" }).click();
  await page
    .getByRole("row", { name: "ex122" })
    .getByRole("textbox")
    .dblclick();
  await page
    .getByRole("row", { name: "ex122" })
    .getByRole("textbox")
    .fill("somethingelse1");
  await page.getByRole("row", { name: "ex2" }).getByRole("textbox").click();
  await page
    .getByRole("row", { name: "ex2" })
    .getByRole("textbox")
    .fill("somethingelse2");
  await page
    .getByRole("row", { name: "somethingelse2" })
    .getByRole("textbox")
    .press("Enter");
  await page.getByTestId("save-category-button").click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("alert")).toContainText(
    /^Item #[0-9]+ updated successfully$/
  );
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.locator("#root")).toMatchAriaSnapshot(`
    - main:	
      - button
      - heading "Add New Category" [level=6]
      - paragraph: Example
      - button "Edit category"
      - button "Show add form"
      - table:
        - rowgroup:
          - row "ID somethign":
            - columnheader "ID"
            - columnheader "somethign"
        - rowgroup:
          - row /\\d+ somethingelse1/:
            - cell /\\d+/
            - cell "somethingelse1"
          - row /\\d+ somethingelse2/:
            - cell /\\d+/
            - cell "somethingelse2"
    `);
});
