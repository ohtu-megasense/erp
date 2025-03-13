import supertest from "supertest";
import { describe, test } from "node:test";
import assert from "node:assert";
import app from "../../src/app";

const api = supertest(app);
const url = "/api/manage/categories";

describe("Category API - add category", () => {
	test("Adding a category without itemShape returns error", async () => {
		const response = await api
			.post(`${url}/`)
			.send({ id: 1, name: "testname", itemShape: {}, items: [] });
		assert.strictEqual(response.statusCode, 500);
		assert.ok(response.body.error, "Category needs a name or item needs shape");
	});
});
