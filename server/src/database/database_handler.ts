import format from 'pg-format';
import logger from '../utils/logger';
import { pool } from './database';
import { AddCategoryRequest, Category } from '../../../shared/types';

// TODO: In getCategories sql query if a category has
// no items the items array will contain a single object
// like { id: null, data: null }. Ideally an empty
// array would be returned.

// interface AddCategoryParams {
//   name: string;
//   module: string;
//   itemShape: Record<string, string>;
// }

// interface renameCategoryParams {
//   id: number;
//   name: string;
// }

export const getModuleIdByName = async (
  module_name: string
): Promise<string | null> => {
  try {
    const sql_text: string = 'SELECT id FROM modules WHERE module_name=%L;';

    logger.info('[getModuleIdByName] printing module_name:', module_name);

    const query = format(sql_text, module_name);
    logger.info('[getModuleIdByName] printing SQL text:', query);
    const result = await pool.query(query);

    //logger.info("printing result:", result);
    logger.info('[getModuleIdByName] printing result.rows[0]', result.rows[0]);

    return result.rows.length > 0 ? result.rows[0].id : null;
  } catch (error) {
    logger.error(
      '[getModuleIdByName] Error finding the module by name:',
      error
    );
    throw error;
  }
};

export const addCategory = async (
  params: AddCategoryRequest
): Promise<{
  id: number;
  module_id: number;
  name: string;
  itemShape: Record<string, string>;
}> => {
  const moduleName = params.module.toLowerCase();
  logger.info(params);
  logger.info('[addCategory] printing module name: ', moduleName);
  const module_id = await getModuleIdByName(moduleName);
  logger.info('[addCategory] module ID: ', module_id);

  const query = format(
    `
			INSERT INTO categories 
      (
        module_id,
				category_name,
				item_shape
			) 
      VALUES (%L, %L, %L)
      RETURNING
        id,
        module_id,
				category_name,
				item_shape;
      `,
    module_id,
    params.name,
    params.itemShape
  );

  const result = await pool.query<{
    id: number;
    module_id: number;
    category_name: string;
    item_shape: Record<string, string>;
  }>(query);

  const row = result.rows[0];

  return {
    id: row.id,
    module_id: row.module_id,
    name: row.category_name,
    // module: row.module_name tms
    itemShape: row.item_shape
  };
};

export const renameCategory = async (
  categoryName: string,
  categoryId: number
): Promise<{ name: string }> => {
  try {
    const query = {
      text: `
      UPDATE categories SET category_name = $1 WHERE id = $2 RETURNING category_name;
      `,
      values: [categoryName, categoryId]
    };

    const result = await pool.query(query);
    const row = result.rows[0];

    if (!row) {
      throw new Error(
        `[renameCategory] Category with ID ${categoryId} not found`
      );
    }

    return { name: row.category_name };
  } catch (error) {
    logger.error('[renameCategory] Error updating category name', error);
    throw error;
  }
};

export const getCategories = async (
  moduleName: string
): Promise<Category[]> => {
  const module_id = await getModuleIdByName(moduleName);
  logger.info('[getCategories] module ID:', module_id);
  const query = format(
    `
      SELECT 
        categories.id, 
        category_name, 
        item_shape, 
        ARRAY_AGG(
          json_build_object(
            'id', items.id, 
            'data', items.item_data  
          )
        ) as items 
      FROM categories
      LEFT JOIN items ON items.category_id = categories.id
      WHERE categories.module_id=%L
      GROUP BY category_name, categories.id
      ORDER BY categories.id;
    `,
    module_id
  );

  const result = await pool.query(query);

  // NOTE: The filtering is done to items because
  // the query can return items array with an object
  // like { id: null, data: null }

  const categories: Category[] = result.rows.map((row) => {
    return {
      id: row.id,
      name: row.category_name,
      itemShape: row.item_shape,
      items: row.items.filter((item: { id: number | null }) => item.id)
    };
  });

  return categories;
};

export async function deleteCategory(category_id: string) {
  try {
    const query = {
      text: `
      DELETE FROM categories WHERE id = $1 RETURNING category_name
      `,
      values: [category_id]
    };

    const result = await pool.query(query);
    const row = result.rows[0];

    if (!row) {
      throw new Error(
        `[deleteCategory] Category with ID ${category_id} not found`
      );
    }

    return row;
  } catch (error) {
    logger.error('[deleteCategory] Error deleting category', error);
    throw error;
  }
}

async function getCategoryById(category_id: string) {
  try {
    logger.info('[getCategoryById] category_id: ', category_id);
    const sql_text: string = 'SELECT * FROM categories WHERE id=%L';

    const query = format(sql_text, category_id);
    logger.info('[getCategoryById] SQL text: ', query);

    const result = await pool.query(query);

    // for later: add some other return if not found
    return result.rows[0];
  } catch (error) {
    logger.error('[getCategoryById] Error finding category by ID:', error);
  } finally {
    logger.info('[getCategoryById] Disconnected from the database');
  }
}

async function validateAddItem(
  category_id: string,
  item_data: { [key: string]: string }
) {
  try {
    const category = await getCategoryById(category_id);
    const columns = category['item_shape'];
    logger.info('[validateAddItem] item_shape: ', columns);
    logger.info('[validateAddItem] item_data: ', item_data);

    for (const key in columns) {
      if (key in item_data) {
        if (columns[key] === 'INTEGER') {
          // Convert the value to a number first
          const realType = typeof item_data[key];
          if (realType !== 'number') {
            logger.info('[validateAddItem] invalid value for Integer');
            return false;
          }
        } else if (columns[key] === 'FLOAT') {
          const realType = typeof item_data[key];
          if (realType !== 'number') {
            logger.info('[validateAddItem] invalid value for Float');
            return false;
          }
        }
        logger.info(
          `[validateAddItem] ${key}: ${columns[key]} - ${item_data[key]}`
        );
      }
    }

    return true;
  } catch (error) {
    logger.error('[validateAddItem] Error adding item:', error);
  } finally {
    logger.info('[validateAddItem] Disconnected from the database');
  }
}

export async function AddItem(
  category_id: string,
  item_data: { [key: string]: string }
) {
  try {
    const isValid = await validateAddItem(category_id, item_data);
    if (isValid) {
      const sql_text: string =
        'INSERT INTO items (category_id, item_data) VALUES (%L, %L)';

      logger.info(sql_text);
      logger.info(category_id);
      logger.info(item_data);

      const query = format(sql_text, category_id, item_data);
      await pool.query(query);

      logger.info(
        `[addItem] category ${category_id} with item data ${item_data}" added`
      );
    } else {
      logger.info('[addItem] invalid input');
    }
  } catch (error) {
    logger.error('[addItem] Error adding item:', error);
  } finally {
    logger.info('[addItem] Disconnected from the database');
  }
}

export async function UpdateItem(
  item_id: string,
  item_data: Record<string, string>
) {
  try {
    const sql_text: string = 'UPDATE items SET item_data = (%L) WHERE id=%L';

    logger.info('[updateItem] SQL text: ', sql_text);
    logger.info('[updateItem] item_id: ', item_id);
    logger.info('[updateItem] item_data: ', item_data);

    const query = format(sql_text, item_data, item_id);
    await pool.query(query);

    logger.info(
      `[updateItem] Updated item with ID ${item_id} with data ${item_data}"`
    );
  } catch (error) {
    logger.error('[updateItem] Error updating item:', error);
  } finally {
    logger.info('[updateItem] Disconnected from the database');
  }
}

export async function DeleteItem(item_id: string) {
  try {
    const sql_text: string = 'DELETE FROM items WHERE id=%L;';

    logger.info(sql_text);
    logger.info(item_id);

    const query = format(sql_text, item_id);
    const result = await pool.query(query);

    logger.info(`[deleteItem] item with item_id "${item_id}" deleted`);
    return {
      success: true,
      rowsDeleted: result.rowCount
    };
  } catch (error) {
    logger.error('[deleteItem] Error deleting item:', error);
    return {
      success: false,
      rowsDeleted: 0
    };
  }
}

export async function CheckItemIdFound(item_id: string): Promise<boolean> {
  try {
    const sql_text: string = 'SELECT * FROM items WHERE id=%L;';

    logger.info(sql_text);
    logger.info('[checkItemIdFound] printing item id:', item_id);

    const query = format(sql_text, item_id);
    const result = await pool.query(query);

    logger.info(result.rows.length);
    if (result.rows.length == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error('[checkItemIdFound] Error finding the item by ID:', error);
    return false;
  }
}

export const testLogCategories = async () => {
  const sqlText = `SELECT id, category_name, item_shape FROM categories;`;
  const result = await pool.query(sqlText);
  logger.info('Categories from database', result.rows);
};

export async function AlterCategory(category_id: string, item_shape: JSON) {
  const client = await pool.connect();
  try {
    logger.info('[alterCategory] Connected to database AlterCategory');

    //updating the item_shape JSON of a category, replacing it with a new JSON structure
    const sql_text: string =
      'UPDATE categories SET item_shape = %L WHERE id = %L;';
    const query = format(sql_text, item_shape, category_id);
    await client.query(query);
    logger.info(
      '[alterCategory] category "${category_id}" updated with item shape "${item_shape}"'
    );
  } catch (error) {
    logger.error('[alterCategory] Error updating category:', error);
  } finally {
    client.release();
    logger.info('[alterCategory] Disconnected from database AlterCategory');
  }
}

if (require.main == module) {
  //
}
