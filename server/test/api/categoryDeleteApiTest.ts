import supertest from "supertest";
import { describe, test, beforeEach } from "node:test";
import assert from "node:assert";
import app from "../../src/app";
import { AddCategoryRequest } from "../../../shared/types";

const api = supertest(app);
const url = "/api/manage/categories";

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
	const response = await api.post(url).send(categoryRequest);
	return response.body.id;
};

beforeEach(async () => {
	const { statusCode } = await api.post("/api/testing/reset");
	assert.strictEqual(statusCode, 200);
});

describe("Category API - Delete category", () => {
	test("Deleting a category works", async () => {
		const categoryId = await createTestCategory();
		const getCategoriesResponse = await api.get(
			"/api/manage/categories/inventory",
		);
		assert(getCategoriesResponse.body.length === 1);
		const deleteCategoryResponse = await api.delete(
			`/api/manage/categories/${categoryId}`,
		);
		assert.strictEqual(
			deleteCategoryResponse.body.category_name,
			"Joonaksen salimaksimit",
		);
		const getCategoriesResponse2 = await api.get(
			"/api/manage/categories/inventory",
		);
		assert(getCategoriesResponse2.body.length === 0);
	});
});
