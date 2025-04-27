import { pool } from '../database/database';
import format from 'pg-format';
import { generateFilterFromConfig } from '../filters/filterGenerator';
import { ItemFilterService } from './itemFilterService';
import { ViewConfig } from '../../../shared/types';
import { getModuleIdByName } from '../database/database_handler';
import logger from '../utils/logger';

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
          items: filteredItems,
          filterConfig: viewRow.filter_config
        };
      })
    );

    return viewsWithFilteredItems;
  }

  async saveView(viewConfig: ViewConfig): Promise<object> {
    const { name, module, filterConfig } = viewConfig;

    const moduleId = await getModuleIdByName(module);
    if (!moduleId) {
      throw new Error(`Module "${module}" not found`);
    }

    const filterConfigJson =
      typeof filterConfig === 'string'
        ? filterConfig
        : JSON.stringify(filterConfig);

    const query = format(
      `INSERT INTO views (name, module_id, filter_config) VALUES (%L, %L, %L) RETURNING id, name;`,
      name,
      moduleId,
      filterConfigJson
    );
    const result = await pool.query(query);
    return result.rows[0];
  }

  async updateView(viewId: number, viewConfig: ViewConfig): Promise<object> {
    const { name, filterConfig } = viewConfig;

    const checkViewExists = format(
      'SELECT id FROM views WHERE id = %L',
      viewId
    );
    const checkResult = await pool.query(checkViewExists);

    if (checkResult.rows.length === 0) {
      throw new Error(`View with ID ${viewId} not found`);
    }

    const filterConfigJson =
      typeof filterConfig === 'string'
        ? filterConfig
        : JSON.stringify(filterConfig);

    const query = format(
      `UPDATE views SET name = %L, filter_config = %L WHERE id = %L RETURNING id, name`,
      name,
      filterConfigJson,
      viewId
    );

    const result = await pool.query(query);
    logger.info(`"${name}" with ID ${viewId} updated `);

    return result.rows[0];
  }

  async deleteView(viewId: number): Promise<{ id: number; message: string }> {
    const checkViewExists = format(
      'SELECT id FROM views WHERE id = %L',
      viewId
    );
    const checkResult = await pool.query(checkViewExists);

    if (checkResult.rows.length === 0) {
      throw new Error(`View with ID ${viewId} not found`);
    }

    const query = format('DELETE FROM views WHERE id= %L', viewId);
    await pool.query(query);

    logger.info(`Deleted view with ID ${viewId}`);
    return {
      id: viewId,
      message: `View with ID ${viewId} deleted successfully`
    };
  }
}
