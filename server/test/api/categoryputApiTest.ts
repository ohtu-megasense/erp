import supertest from "supertest";
import { describe, test } from "node:test";
import assert from "node:assert";
import app from "../../src/app";

const api = supertest(app);
const url = "/api/manage/categories";

describe("Category API - Update Category", () => {
    test("Updating a category returns confirmation message", async () => {
        const categoryId = "123"; // Example category ID
        const updateData = { itemShape: JSON.stringify({ shape: "NewShape" }), categoryName: 'name'};

        const response = await api.put(`${url}/${categoryId}`).send(updateData);

        assert.strictEqual(response.statusCode, 200);
        assert.ok(response.body.message, "Response body should contain a success message");
        assert.strictEqual(response.body.message, `Category ${categoryId} updated successfully`);
    });

    test("Updating a category with missing itemShape returns error", async () => {
        const categoryId = "123";

        const response = await api.put(`${url}/${categoryId}`).send({});

        assert.strictEqual(response.statusCode, 400);
        assert.ok(response.body.error, "Response should contain an error message");
    });

    test("Updating a category with missing categoryId returns error", async () => {
        const updateData = { itemShape: "NewShape" };

        const response = await api.put(`${url}/`).send(updateData);

        assert.strictEqual(response.statusCode, 404); // Expecting 404 because the endpoint is incorrect
    });
});
