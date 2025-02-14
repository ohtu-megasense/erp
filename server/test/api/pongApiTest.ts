import supertest from "supertest";
import { describe, test } from "node:test";
import assert from "node:assert";
import app from "../../src/app";

const api = supertest(app);
const url = "/api/ping";

describe("Ping api", () => {
	test("Object with message property is returned", async () => {
		const response = await api.get(url);
		assert.strictEqual(response.body.message, "pong");
		assert.strictEqual(response.statusCode, 200);
	});
});
