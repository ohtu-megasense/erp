import supertest from 'supertest';
import { describe, beforeEach, test, after } from 'node:test';
import assert from 'node:assert';
import app from '../../src/app';

import { AddCategoryRequest, Category, Item } from '../../../shared/types';

const api = supertest(app);
const itemsUrl = '/api/items';
const categoriesUrl = '/api/manage/categories';

// Helper function to add a category

const createTestCategory = async (): Promise<number> => {
  const categoryRequest: AddCategoryRequest = {
    name: 'Jassen hevoset',
    itemShape: {
      name: 'TEXT',
      age: 'TEXT',
      wins: 'TEXT'
    }
  };
  const response = await api.post(categoriesUrl).send(categoryRequest);
  return response.body.id;
};

// Helper function to add an item to a test category

const createTestItem = async (categoryId: number) => {
  const itemData = {
    id: categoryId,
    data: {
      name: 'Primadonna',
      age: '16',
      wins: '9001'
    }
  };
  return await api.post(itemsUrl).send(itemData);
};

beforeEach(async () => {
  const { statusCode } = await api.post('/api/testing/reset');
  assert.strictEqual(statusCode, 200);
});

after(async () => {
  const { statusCode } = await api.post('/api/testing/reset');
  assert.strictEqual(statusCode, 200);
});

describe('Items API - Add Item', () => {
  test('item can be added to an existing category', async () => {
    const categoryId = await createTestCategory();

    const itemData = {
      id: categoryId,
      data: {
        name: 'Mustang',
        age: '5',
        wins: '17'
      }
    };
    const response = await api.post(itemsUrl).send(itemData);

    assert.strictEqual(response.statusCode, 200);
  });

  test('returns error when category ID is missing', async () => {
    const invalidItemData = {
      data: {
        name: 'Humma',
        age: '15',
        wins: '0'
      }
    };
    const response = await api.post(itemsUrl).send(invalidItemData);

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(
      response.body.error,
      'Category ID and item data are required'
    );
  });

  test('returns error when item data is missing', async () => {
    const categoryId = await createTestCategory();

    const invalidItemData = {
      id: categoryId
    };

    const response = await api.post(itemsUrl).send(invalidItemData);

    // Check error response
    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(
      response.body.error,
      'Category ID and item data are required'
    );
  });
});

describe('Items API - Delete Item', () => {
  test('item can be deleted using its ID', async () => {
    const categoryId = await createTestCategory();

    await createTestItem(categoryId);

    const categoriesResponse = await api.get(categoriesUrl);
    assert.strictEqual(categoriesResponse.statusCode, 200);

    const categories = categoriesResponse.body;
    const category = categories.find((c: Category) => c.id === categoryId);
    assert(category, 'Category should exist');
    assert(category.items.length > 0, 'Category should have items');

    const itemId = category.items[0].id;

    // Delete test item
    const deleteResponse = await api.delete(`${itemsUrl}/${itemId}`);

    assert.strictEqual(deleteResponse.statusCode, 200);
    assert.strictEqual(
      deleteResponse.body.message,
      `Item with ID ${itemId} deleted successfully`
    );

    // Check that item was deleted
    const afterDeleteResponse = await api.get(categoriesUrl);
    const categoriesAfterDelete = afterDeleteResponse.body;
    const categoryAfterDelete = categoriesAfterDelete.find(
      (c: Category) => c.id === categoryId
    );

    const itemExists = categoryAfterDelete.items.some(
      (item: Item) => item.id === itemId
    );
    assert.strictEqual(itemExists, false, 'Item should be deleted');
  });

  test('returns error when ID does not exist', async () => {
    const invalideItemId = 9999;
    const response = await api.delete(`${itemsUrl}/${invalideItemId}`);

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.body.error, 'Item with ID 9999 not found');
  });
});

describe('Items API - Update Item', () => {
  test('item can be updated using its ID', async () => {
    const categoryId = await createTestCategory();
    await createTestItem(categoryId);

    const categoriesResponse = await api.get(categoriesUrl);
    const category = categoriesResponse.body.find(
      (c: Category) => c.id === categoryId
    );
    const itemId = category.items[0].id;

    const updatedData = {
      categoryId,
      data: {
        name: 'Updated Horse',
        age: '10',
        wins: '42'
      }
    };

    const updateResponse = await api
      .put(`${itemsUrl}/${itemId}`)
      .send(updatedData);

    assert.strictEqual(updateResponse.statusCode, 200);
    assert.strictEqual(updateResponse.body.id, itemId);
    assert.strictEqual(updateResponse.body.categoryId, categoryId);

    const verifyResponse = await api.get(categoriesUrl);
    const updatedCategory = verifyResponse.body.find(
      (c: Category) => c.id === categoryId
    );
    const updatedItem = updatedCategory.items.find(
      (item: Item) => item.id === itemId
    );

    assert.strictEqual(updatedItem.data.name, 'Updated Horse');
    assert.strictEqual(updatedItem.data.age, '10');
    assert.strictEqual(updatedItem.data.wins, '42');
  });

  test('returns 400 if data is missing in update', async () => {
    const categoryId = await createTestCategory();
    await createTestItem(categoryId);

    const categoriesResponse = await api.get(categoriesUrl);
    const category = categoriesResponse.body.find(
      (c: Category) => c.id === categoryId
    );
    const itemId = category.items[0].id;

    const response = await api.put(`${itemsUrl}/${itemId}`).send({
      categoryId
    });

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(
      response.body.error,
      'Item ID and updated data are required'
    );
  });
});
