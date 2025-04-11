import { describe, test } from 'node:test';
import assert from 'node:assert';

describe('Filter ', () => {
  const items = [
    {
      itemData: {
        name: 'Sensor 1',
        customer: 'Aalto University',
        status: 'active',
        location: 'Helsinki'
      }
    },
    {
      itemData: {
        name: 'Sensor 2',
        customer: 'Aalto University',
        status: 'active',
        location: 'Mäntsälä'
      }
    },
    {
      itemData: {
        name: 'Sensor 1',
        customer: 'University of Helsinki',
        status: 'not active',
        location: 'Iisalmi'
      }
    },
    {
      itemData: {
        name: 'Sensor 1',
        customer: 'Aalto University',
        status: 'active',
        location: 'Salla'
      }
    }
  ];

  test('test mock data works', () => {
    assert.strictEqual(items[0].itemData.name, 'Sensor 1');
  });
});
