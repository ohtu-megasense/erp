import { describe, test } from 'node:test';
import assert from 'node:assert';
import { PropertyFilter, AndFilter, OrFilter } from "../../src/filters/filters"
import { Item } from '../../../shared/types';

const items: Item[] = [
  {
    id: 5,
    item_data: {
      name: 'Sensor 1',
      customer: 'Aalto University',
      status: 'active',
      location: 'Helsinki'
    }
  },
  {
    id: 6,
    item_data: {
      name: 'Sensor 2',
      customer: 'Aalto University',
      status: 'active',
      location: 'Mäntsälä'
    }
  },
  {
    id: 7,
    item_data: {
      name: 'Sensor 3',
      customer: 'University of Helsinki',
      status: 'active',
      location: 'Iisalmi'
    }
  },
  {
    id: 9,
    item_data: {
      name: 'Sensor 4',
      customer: 'Aalto University',
      status: 'not active',
      location: 'Salla'
    }
  }
];

describe('Property filter ', () => {
  test('returns correct list', () => {
    const activeFilter = new PropertyFilter('status', 'active')
    const activeSensors = activeFilter.apply(items)
    assert.strictEqual(activeSensors.length, 3)
  })

  test('with no matching values returns empty list', () => {
    const activeFilter = new PropertyFilter('customer', 'Hesburger')
    const activeSensors = activeFilter.apply(items)
    assert.strictEqual(activeSensors.length, 0)
  })

  test('with no matching property returns empty list', () => {
    const activeFilter = new PropertyFilter('restaurant', 'Hesburger')
    const activeSensors = activeFilter.apply(items)
    assert.strictEqual(activeSensors.length, 0)
  })

});

describe('AND filter ', () => {
  test('returns correct list with proper filters', () => {
    const activeFilter = new PropertyFilter('status', 'active')
    const customerFilter = new PropertyFilter('customer', 'Aalto University')

    const activeAndCustomerFilter = new AndFilter([activeFilter, customerFilter])
    const activeAaltoSensors = activeAndCustomerFilter.apply(items)

    assert.strictEqual(activeAaltoSensors.length, 2)
  })
})

describe('OR filter ', () => {
  test('returns correct list with proper filters', () => {
    const activeFilter = new PropertyFilter('status', 'active')
    const customerFilter = new PropertyFilter('customer', 'Aalto University')
    const activeAndCustomerFilter = new AndFilter([activeFilter, customerFilter])
    const locationFilter = new PropertyFilter('location', 'Iisalmi')

    const activeAaltoOrIisalmiSensorsFilter = new OrFilter([activeAndCustomerFilter, locationFilter])
    const activeAaltoOrIisalmiSensors = activeAaltoOrIisalmiSensorsFilter.apply(items)
    console.log('activeAaltoOrIisalmiSensors: ', activeAaltoOrIisalmiSensors)

  })
})
