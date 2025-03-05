import { test, expect } from "@playwright/test";
import { baseUrl } from "../config";

const url = baseUrl

test("contains Megasense text", async ({ page }) => {
  await page.goto(url);

  await expect(page.getByText("Megasense")).toBeVisible();
});

test("create new category with 2 properties", async ({ page }) => {
  await page.goto(url);

  await page.click("text=Categories");
  await page.click("text=Manage");

  await page.locator("input").first().fill("New category");

  await page.click("text=Add property");
  await page.locator("input").nth(1).fill("Property1");

  await page.click("text=Add property");
  await page.locator("input").nth(2).fill("Property2");

  await expect(page.locator("input")).toHaveCount(3);

  await page.click("button:has-text('Create')");

  await expect(page.getByText("New category created")).toBeVisible();
});

test("add 2 values", async ({ page }) => {
  
  //navigate to  manage categories
  await page.goto(url);
  await page.click("text=Categories");
  await page.click("text=Manage");
  
  // create new category with two properites
  await page.locator("input").first().fill("New category");
  await page.click("text=Add property");
  await page.locator("input").nth(1).fill("Property1");
  await page.click("text=Add property");
  await page.locator("input").nth(2).fill("Property2");
  await page.click("button:has-text('Create')");

  // add two values
  const newCategorySection = page.locator("text=New Category").locator("..");
  await newCategorySection.locator("[data-testid='AddIcon']").locator("..").click();
  await newCategorySection.locator("input").nth(0).fill("Value1");
  await newCategorySection.locator("input").nth(1).fill("Value2");
  await newCategorySection.locator("button:has-text('+ ADD')").click();

  //check that two values are added
  await expect(newCategorySection.getByText("Value1")).toBeVisible();
  await expect(newCategorySection.getByText("Value2")).toBeVisible();
});

