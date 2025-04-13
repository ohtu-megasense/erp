import { describe, test } from 'node:test';
import assert from 'node:assert';
import { generateFilterFromConfig } from '../../src/filters/filterGenerator';
import { FilterConfig } from '../../../shared/types';

const config: FilterConfig = {
  type: 'and',
  filters: [
    {
      type: 'equals',
      property: 'customer',
      value: 'Aalto University'
    },
    {
      type: 'equals',
      property: 'status',
      value: 'active'
    }
  ]
};

describe('Filter generator ', () => {
  test('generates correct filter from config', () => {
    const filter = generateFilterFromConfig(config);
    assert.ok(filter, "Filter should be defined")
    assert.strictEqual(
      filter.getDescription(),
      'customer is "Aalto University" AND status is "active"'
    );
  });

  test('returns "undefined" if no config provided', () => {
    assert.strictEqual(generateFilterFromConfig(undefined), undefined);
  });

  test('throws an error if wrong filter type', () => {
    const wrongConfig = {
      type: 'notAFilter',
      property: 'customer',
      value: 'Puolustusvoimat'
    } as  unknown as FilterConfig;
    assert.throws(() => generateFilterFromConfig(wrongConfig), {
      message: 'Unknown filter type: notAFilter'
    });
  });

  test('throws an error if AND does not get an array', () => {
    const noArrayConfig = {
      type: 'and',
      filters: {
        type: 'equals',
        property: 'customer',
        value: 'Aalto University'
      }
    } as unknown as FilterConfig

    assert.throws(() => generateFilterFromConfig(noArrayConfig), {
      message: 'AND requires array of filters'
    })
  })
});
