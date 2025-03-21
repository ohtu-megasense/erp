import supertest from 'supertest';
import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import app from '../../src/app';
import { AddCategoryRequest } from '../../../shared/types';

// TODO: Can add more invalid type tests if necessary.
// TODO: Special case -> status 500 test when 'Something went wrong' :D
// Could happen if there was an issue with database query.

const api = supertest(app);
const url = '/api/manage/categories';

beforeEach(async () => {
  const { statusCode } = await api.post('/api/testing/reset');
  assert.strictEqual(statusCode, 200);
});

after(async () => {
  const { statusCode } = await api.post('/api/testing/reset');
  assert.strictEqual(statusCode, 200);
});

describe('Category API - Add Category', () => {
  describe('correct status codes and error messages are sent when', () => {
    test('name is missing from request', async () => {
      const requestBody: Omit<AddCategoryRequest, 'name'> = {
        itemShape: {
          a: 'string'
        }
      };

      const response = await api.post(url).send(requestBody);

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(
        response.body.error,
        'Property "name" must be a string'
      );
    });

    test('name is an object', async () => {
      const requestBody = {
        name: {},
        itemShape: {
          a: 'string'
        }
      };

      const response = await api.post(url).send(requestBody);

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(
        response.body.error,
        'Property "name" must be a string'
      );
    });

    test('itemShape is missing from request', async () => {
      const requestBody: Omit<AddCategoryRequest, 'itemShape'> = {
        name: 'Test category name'
      };

      const response = await api.post(url).send(requestBody);

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(
        response.body.error,
        'Property "itemShape" must be an object'
      );
    });

    test('itemShape is an empty object', async () => {
      const requestBody = {
        name: 'Test category name',
        itemShape: {}
      };

      const response = await api.post(url).send(requestBody);

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(
        response.body.error,
        'Item shape must have at least one property'
      );
    });

    test('itemShape has some invalid value', async () => {
      const requestBody = {
        name: 'Test category name',
        itemShape: {
          'Monthly cost': 'string',
          'Wrong type': 'number'
        }
      };

      const response = await api.post(url).send(requestBody);

      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(
        response.body.error,
        "Item shape can only contain 'TEXT' values"
      );
    });
  });

  describe('correct status code and response is sent when', () => {
    test('a new category is created', async () => {
      const requestBody: AddCategoryRequest = {
        name: 'A valid category request',
        itemShape: {
          a: 'TEXT',
          b: 'TEXT'
        }
      };

      const response = await api.post(url).send(requestBody);

      assert.strictEqual(response.statusCode, 201);
      assert(Number.isSafeInteger(response.body.id));
      assert.strictEqual(response.body.name, requestBody.name);
      assert.deepStrictEqual(response.body.itemShape, requestBody.itemShape);
    });
  });
});
