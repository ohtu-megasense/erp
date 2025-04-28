import supertest from "supertest";
import { describe, test, beforeEach, after } from "node:test";
import assert from "node:assert";
import app from "../../src/app";

const api = supertest(app);
const chatUrl = "/api/chat";

beforeEach(async () => {
	const { statusCode } = await api.post("/api/testing/reset");
	assert.strictEqual(statusCode, 200);
});

after(async () => {
	const { statusCode } = await api.post("/api/testing/reset");
	assert.strictEqual(statusCode, 200);
});

describe("Chat API endpoint", () => {
	test("fails when messages array is missing", async () => {
		const response = await api.post(chatUrl).send({});

		assert.strictEqual(response.status, 400);
		assert.ok(response.body.error.includes("Messages array is required"));
	});

	test("fails when messages is not an array", async () => {
		const response = await api.post(chatUrl).send({ messages: "not-an-array" });

		assert.strictEqual(response.status, 400);
		assert.ok(response.body.error.includes("Messages array is required"));
	});
});
