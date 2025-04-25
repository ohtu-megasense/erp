import supertest from "supertest";
import { describe, test, beforeEach, after } from "node:test";
import assert from "node:assert";
import app from "../../src/app";

import { AddCategoryRequest } from "../../../shared/types";
const api = supertest(app);
const itemsUrl = "/api/items";
const categoriesUrl = "/api/manage/categories";
// Helper function to add a category

const createTestCategory = async (): Promise<number> => {
	const categoryRequest: AddCategoryRequest = {
		name: "Joonaksen salimaksimit",
		module: "inventory",
		itemShape: {
			movement: "TEXT",
			date: "TEXT",
			weight: "TEXT",
		},
	};
	const response = await api.post(categoriesUrl).send(categoryRequest);
	return response.body.id;
};

// Helper function to add an item to a test category

const createTestItem = async (categoryId: number) => {
	const itemData = {
		id: categoryId,
		data: {
			movement: "Mave",
			date: "eilen",
			weight: "500 kg",
		},
	};
	return await api.post(itemsUrl).send(itemData);
};

beforeEach(async () => {
	const { statusCode } = await api.post("/api/testing/reset");
	assert.strictEqual(statusCode, 200);
});

after(async () => {
	const { statusCode } = await api.post("/api/testing/reset");
	assert.strictEqual(statusCode, 200);
});

describe("Category API - Update Category", () => {
	test("Updating a category returns confirmation message", async () => {
		const categoryId = await createTestCategory();
		await createTestItem(categoryId);

		const updateData = {
			itemShape: JSON.stringify({ shape: "NewShape" }),
			categoryName: "name",
		};

		const response = await api
			.put(`${categoriesUrl}/${categoryId}`)
			.send(updateData);

		assert.strictEqual(response.statusCode, 200);
		assert.ok(
			response.body.message,
			"Response body should contain a success message",
		);
		assert.strictEqual(
			response.body.message,
			`Category ${categoryId} updated successfully`,
		);
	});

	test("Updating a category with missing itemShape returns error", async () => {
		const categoryId = "123";

		const response = await api.put(`${categoriesUrl}/${categoryId}`).send({});

		assert.strictEqual(response.statusCode, 400);
		assert.ok(response.body.error, "Response should contain an error message");
	});

	test("Updating a category with missing categoryId returns error", async () => {
		const updateData = { itemShape: "NewShape" };

		const response = await api.put(`${categoriesUrl}/`).send(updateData);

		assert.strictEqual(response.statusCode, 404); // Expecting 404 because the endpoint is incorrect
	});
});
