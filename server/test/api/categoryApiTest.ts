import supertest from "supertest";
import { describe, test } from "node:test";
import assert from "node:assert";
import app from "../../src/app";

const api = supertest(app);
const url = "/api/category";

describe("Category API", () => {
    test("Adding a category returns confirmation message", async () => {
        const newCategory = { category_name: "TestCategory" };
        
        const response = await api.post(url).send(newCategory);
        
        assert.strictEqual(response.statusCode, 200);
        assert.ok(response.body, "Response body should not be empty");
    });
    
    test("Adding a category with missing category_name returns error", async () => {
        const response = await api.post(url).send({});
        
        assert.strictEqual(response.statusCode, 500);
        assert.ok(response.body.error, "Response should contain an error message");
    });
});