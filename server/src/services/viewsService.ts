import { pool } from '../database/database';
import logger from '../utils/logger';
import format from 'pg-format';
import { generateFilterFromConfig } from '../filters/filterGenerator';
import { ItemFilterService } from './itemFilterService';

const filterService = new ItemFilterService();

export class ViewsService {
  async getViewsForModule(moduleName: string): Promise<object[]> {
    const sqlQuery =
      'SELECT views.id, views.name, views.filter_config FROM views LEFT JOIN modules ON views.module_id = modules.id WHERE modules.module_name = %L;';
    const formattedQuery = format(sqlQuery, moduleName);
    const queryResult = await pool.query(formattedQuery);

    const viewsWithFilteredItems = await Promise.all(
      queryResult.rows.map(async (viewRow) => {
        const filter = generateFilterFromConfig(viewRow.filter_config);
        const filteredItems = await filterService.getFilteredItems(filter);

        return {
          id: viewRow.id,
          name: viewRow.name,
          items: filteredItems
        };
      })
    );

    return viewsWithFilteredItems;
  }
}
