import { Filter } from '../filters/filters';
import { pool } from '../database/database';
import logger from '../utils/logger';
import { Item } from '../../../shared/types';

export class ItemFilterService {
  async getFilteredItems(filter?: Filter): Promise<Item[]> {
    try {
      const query = 'SELECT * FROM items;';
      const result = await pool.query(query);
      let items = result.rows;

      if (filter) {
        items = filter.apply(items);
        logger.info(`Used filter: ${filter.getDescription()}`);
      }

      return items;
    } catch (error) {
      logger.error('Error filtering items:', error);
      throw error;
    }
  }
}
