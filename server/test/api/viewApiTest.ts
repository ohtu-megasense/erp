import supertest from 'supertest';
import { describe, beforeEach, test, after } from 'node:test';
import assert from 'node:assert';
import app from '../../src/app';

import { AddCategoryRequest, Category, Item, ViewConfig } from '../../../shared/types';

const api = supertest(app);
const itemsUrl = '/api/items';
const viewsUrl = '/api/views';
const categoriesUrl = '/api/manage/categories';
const categoriesGetUrl = '/api/manage/categories/inventory';

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
    data: {
      name,
      age,
      wins,
      location
    }
  };
  return await api.post(itemsUrl).send(itemData);
};

const testViewConfig: ViewConfig = {
  
  name: "Horses in Helsinki",
  module: 'inventory',
  filterConfig: {
    type: 'equals',
    property: 'location',
    value: 'Helsinki'
  }
}


beforeEach(async () => {
  const { statusCode } = await api.post('/api/testing/reset');
  assert.strictEqual(statusCode, 200);
  const categoryId = await createTestCategory()
  createTestItem("Hallavaharja", "8654", "42", "Helsinki", categoryId)
  createTestItem("MyLittlePony", "4", "1", "Helsinki", categoryId)
  createTestItem("Ringo", "28", "10", "Vantaa", categoryId)
  createTestItem("ChatGPT", "2", "11010", "Helsinki", categoryId)

});

after(async () => {
  const { statusCode } = await api.post('/api/testing/reset');
  assert.strictEqual(statusCode, 200);
});

describe('Saving a view ', () => {
  test('succeeds with valid configuration', async () => {
    const response = await api.post(viewsUrl).send(testViewConfig)
    assert.strictEqual(response.status, 201)
  })
})

describe('Getting views for a module ', () => {
  test('succeeds with valide call', async () => {
    await api.post(viewsUrl).send(testViewConfig)
    const response = await api.get(`${viewsUrl}/inventory`)
    assert.strictEqual(response.status, 200)
  })
})
