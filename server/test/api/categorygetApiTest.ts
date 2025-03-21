import supertest from 'supertest';
import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import app from '../../src/app';
import { AddCategoryRequest } from '../../../shared/types';

// TODO: Maybe also test that a category
// with items is returned in correct form

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

describe('Categories API - Get categories', async () => {
  after(async () => {
    await api.post('/api/testing/reset');
  });

  test('initially an empty array is returned', async () => {
    const response = await api.get(url);
    assert.strictEqual(response.statusCode, 200);
    assert(Array.isArray(response.body));
    assert(response.body.length === 0);
  });

  // Implicitly also tests the add category post request in part
  test('after adding 2 categories, 2 are returned with correct properties', async () => {
    const addRequest1: AddCategoryRequest = {
      name: 'Test category 1',
      itemShape: {
        property1: 'TEXT'
      }
    };

    const addRequest2: AddCategoryRequest = {
      name: 'Test category 2',
      itemShape: {
        property1: 'TEXT'
      }
    };

    const addResponse1 = await api.post(url).send(addRequest1);
    const addResponse2 = await api.post(url).send(addRequest2);

    assert.strictEqual(addResponse1.statusCode, 201);
    assert.strictEqual(addResponse2.statusCode, 201);

    const getCategoriesResponse = await api.get(url);

    assert.strictEqual(getCategoriesResponse.statusCode, 200);

    // An array with 2 items should be returned
    assert(Array.isArray(getCategoriesResponse.body));
    assert(getCategoriesResponse.body.length === 2);

    const category1 = getCategoriesResponse.body.find(
      (category) => category.name === addRequest1.name
    );

    const category2 = getCategoriesResponse.body.find(
      (category) => category.name === addRequest2.name
    );

    // Both elements should have properties id, name,
    // itemshape and items so 4 properties should exist
    assert.strictEqual(Object.keys(category1).length, 4);
    assert.strictEqual(Object.keys(category2).length, 4);

    assert(Number.isSafeInteger(category1.id));
    assert(Number.isSafeInteger(category2.id));

    assert.strictEqual(category1.name, addRequest1.name);
    assert.strictEqual(category2.name, addRequest2.name);

    assert.deepStrictEqual(category1.itemShape, addRequest1.itemShape);
    assert.deepStrictEqual(category2.itemShape, addRequest2.itemShape);

    assert(Array.isArray(category1.items));
    assert(Array.isArray(category2.items));

    assert.strictEqual(category1.items.length, 0);
    assert.strictEqual(category2.items.length, 0);
  });
});
