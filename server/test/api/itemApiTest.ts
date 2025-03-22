import supertest from 'supertest';
import { describe, beforeEach, test, after } from 'node:test';
import assert from 'node:assert';
import app from '../../src/app';

import { AddCategoryRequest } from '../../../shared/types';

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


// Helper function to add item to test category

const createTestItem = async (categoryId: number) => {
  const itemData = {
    id: categoryId,
    data: {
      name: 'Primadonna',
      age: '16',
      wins: '9001'
    }
  }
  return await api.post(itemsUrl).send(itemData)

}


beforeEach(async () => {
  const { statusCode } = await api.post('/api/testing/reset')
  assert.strictEqual(statusCode, 200)
})

after(async () => {
  const { statusCode } = await api.post('/api/testing/reset')
  assert.strictEqual(statusCode, 200)
})

describe('Items API - Add Item', () => {
  test('item can be added to an existing category', async () => {
    const categoryId = await createTestCategory()

    const itemData = {
      id: categoryId,
      data: {
        name: 'Mustang',
        age: '5',
        wins: '17'
      }
    }
    const response = await api.post(itemsUrl).send(itemData)

    assert.strictEqual(response.statusCode, 200)
  })
})
