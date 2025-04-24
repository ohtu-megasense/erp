import supertest from 'supertest';
import { describe, beforeEach, test, after } from 'node:test';
import assert from 'node:assert';
import app from '../../src/app';

import {
  AddCategoryRequest,
  FilterConfig,
  Item,
  ViewConfig
} from '../../../shared/types';

const api = supertest(app);
const itemsUrl = '/api/items';
const viewsUrl = '/api/views';
const categoriesUrl = '/api/manage/categories';

// Helper function to add a category

const createTestCategory = async (): Promise<number> => {
  const categoryRequest: AddCategoryRequest = {
    name: 'Jassen hevoset',
    module: 'inventory',
    itemShape: {
      name: 'TEXT',
      age: 'TEXT',
      wins: 'TEXT',
      location: 'TEXT'
    }
  };
  const response = await api.post(categoriesUrl).send(categoryRequest);
  return response.body.id;
};

// Helper function to add an item to a test category

const createTestItem = async (
  name: string,
  age: string,
  wins: string,
  location: string,
  categoryId: number
) => {
  const itemData = {
    id: categoryId,
    item_data: {
      name,
      age,
      wins,
      location
    }
  };
  return await api.post(itemsUrl).send(itemData);
};

// Helper function to add a view to views

const createTestView = async (): Promise<number> => {
  const testViewConfig: ViewConfig = {
    name: 'Test View',
    module: 'inventory',
    filterConfig: {
      type: 'equals',
      property: 'location',
      value: 'Helsinki'
    } as unknown as FilterConfig
  };
  const response = await api.post(viewsUrl).send(testViewConfig);
  assert.strictEqual(response.status, 201);
  return response.body.id;
};

// Tests:


beforeEach(async () => {
  const { statusCode } = await api.post('/api/testing/reset');
  assert.strictEqual(statusCode, 200);
});

after(async () => {
  const { statusCode } = await api.post('/api/testing/reset');
  assert.strictEqual(statusCode, 200);
});


describe('Saving a view ', () => {
  test('succeeds with valid configuration', async () => {
    const categoryId = await createTestCategory();
    await createTestItem('Hallavaharja', '8654', '42', 'Helsinki', categoryId);
    await createTestItem('MyLittlePony', '4', '1', 'Helsinki', categoryId);
    await createTestItem('Ringo', '28', '10', 'Vantaa', categoryId);
    await createTestItem('ChatGPT', '2', '11010', 'Helsinki', categoryId);

    const testViewConfig: ViewConfig = {
      name: 'Horses in Helsinki',
      module: 'inventory',
      filterConfig: {
        type: 'equals',
        property: 'location',
        value: 'Helsinki'
      } as unknown as FilterConfig
    };
    const response = await api.post(viewsUrl).send(testViewConfig);
    assert.strictEqual(response.status, 201);
    assert.ok(response.body.id, 'Response should contain the created view ID');
    assert.strictEqual(response.body.name, testViewConfig.name);
  });
  test('fails with invalid module', async () => {
    const invalidViewConfig = {
      name: 'Invalid View',
      module: 'nonexistent-module',
      filterConfig: {
        type: 'equals',
        property: 'location',
        value: 'Helsinki'
      }
    };

    const response = await api.post(viewsUrl).send(invalidViewConfig);
    assert.strictEqual(response.status, 400);
    assert.ok(response.body.error, 'Response should contain an error message');
  });

  test('fails with invalid filter configuration', async () => {
    const invalidFilterConfig = {
      name: 'Invalid Filter',
      module: 'inventory',
      filterConfig: {
        type: 'unknown-filter-type',
        property: 'location',
        value: 'Helsinki'
      }
    };

    const response = await api.post(viewsUrl).send(invalidFilterConfig);
    assert.strictEqual(response.status, 400);
    assert.ok(response.body.error, 'Response should contain an error message');
  });
});

describe('Getting views for a module ', () => {
  test('succeeds with valid module', async () => {
    const categoryId = await createTestCategory();
    await createTestItem('Hallavaharja', '8', '42', 'Helsinki', categoryId);
    await createTestItem('MyLittlePony', '4', '1', 'Helsinki', categoryId);

    const testViewConfig: ViewConfig = {
      name: 'Horses in Helsinki',
      module: 'inventory',
      filterConfig: {
        type: 'equals',
        property: 'location',
        value: 'Helsinki'
      } as unknown as FilterConfig
    };

    await api.post(viewsUrl).send(testViewConfig);

    const response = await api.get(`${viewsUrl}/inventory`);

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body), 'Response should be an array');

    if (response.body.length > 0) {
      const firstView = response.body[0];
      assert.strictEqual(firstView.name, testViewConfig.name);
      assert.ok(
        Array.isArray(firstView.items),
        'View should contain items array'
      );

      firstView.items.forEach((item: Item) => {
        assert.strictEqual(item.item_data.location, 'Helsinki');
      });

      assert.strictEqual(firstView.items.length, 2);
    }
  });

  test('returns empty array for valid module with no views', async () => {
    const response = await api.get(`${viewsUrl}/inventory`);
    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body), 'Response should be an array');
    assert.strictEqual(response.body.length, 0);
  });

  test('fails with invalid module parameter', async () => {
    const response = await api.get(`${viewsUrl}/invalid-module`);
    assert.strictEqual(response.status, 400);
    assert.ok(response.body.error, 'Response should contain an error message');
  });
});

describe('Updating a view ', () => {
  test('works with proper request', async () => {
    const viewId = await createTestView();

    const updatedViewConfig: ViewConfig = {
      name: 'Updated Test View',
      module: 'inventory',
      filterConfig: {
        type: 'equals',
        property: 'status',
        value: 'active'
      } as unknown as FilterConfig
    };

    const updateResponse = await api
      .put(`${viewsUrl}/${viewId}`)
      .send(updatedViewConfig);

    assert.strictEqual(updateResponse.status, 200);
    assert.strictEqual(updateResponse.body.id, viewId);
    assert.strictEqual(updateResponse.body.name, 'Updated Test View');

    const getResponse = await api.get(`${viewsUrl}/inventory`);
    const views = getResponse.body;
    const updatedView = views.find((view) => view.id === viewId);

    assert.ok(updatedView, 'Updated view should exist');
    assert.strictEqual(updatedView.name, 'Updated Test View');
  });

  test('updating a non-existent view fails with 404', async () => {
    const nonExistentId = 999999;
    const updatedViewConfig: ViewConfig = {
      name: 'This Should Fail',
      module: 'inventory',
      filterConfig: {
        type: 'equals',
        property: 'status',
        value: 'active'
      } as unknown as FilterConfig
    };

    const response = await api
      .put(`${viewsUrl}/${nonExistentId}`)
      .send(updatedViewConfig);

    assert.strictEqual(response.status, 404);
    assert.ok(response.body.error.includes('not found'));
  });
});

describe('Deleting a view ', () => {

  test('deleting a view works', async () => {
    const viewId = await createTestView();

    const deleteResponse = await api.delete(`${viewsUrl}/${viewId}`);

    assert.strictEqual(deleteResponse.status, 200);
    assert.strictEqual(deleteResponse.body.id, viewId);
    assert.ok(deleteResponse.body.message.includes('deleted successfully'));

    const getResponse = await api.get(`${viewsUrl}/inventory`);
    const views = getResponse.body;
    const deletedView = views.find((v: any) => v.id === viewId);

    assert.strictEqual(deletedView, undefined, 'Deleted view should not exist');
  });

  test('deleting a non-existent view fails with 404', async () => {
    const nonExistentId = 999999;
    const response = await api.delete(`${viewsUrl}/${nonExistentId}`);

    assert.strictEqual(response.status, 404);
    assert.ok(response.body.error.includes('not found'));
  });
});
