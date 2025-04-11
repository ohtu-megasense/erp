import { describe, test } from 'node:test';
import assert from 'node:assert';
import { PropertyFilter, AndFilter } from "../../src/filters/filters"

describe('Filter ', () => {
  const items = [
    {
      item_data: {
        name: 'Sensor 1',
        customer: 'Aalto University',
        status: 'active',
        location: 'Helsinki'
      }
    },
    {
      item_data: {
        name: 'Sensor 2',
        customer: 'Aalto University',
        status: 'active',
        location: 'Mäntsälä'
      }
    },
    {
      item_data: {
        name: 'Sensor 3',
        customer: 'University of Helsinki',
        status: 'not active',
        location: 'Iisalmi'
      }
    },
    {
      item_data: {
        name: '',
        customer: 'Aalto University',
        status: 'active',
        location: 'Salla'
      }
    }
  ];

  test('for property returns correct list', () => {
    const activeFilter = new PropertyFilter('status', 'active')
    const activeSensors = activeFilter.apply(items)
    assert.strictEqual(activeSensors.length, 3)
  })

  test('with no matches returns empty list', () => {
    const activeFilter = new PropertyFilter('customer', 'Hesburger')
    const activeSensors = activeFilter.apply(items)
    assert.strictEqual(activeSensors.length, 0)
  })

});
