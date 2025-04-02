import format from 'pg-format';
import logger from '../utils/logger';
import { pool } from './database';
import { Category } from '../../../shared/types';

// TODO: In getCategories sql query if a category has
// no items the items array will contain a single object
// like { id: null, data: null }. Ideally an empty
// array would be returned.

interface AddCategoryParams {
  name: string;
  module: string;
  itemShape: Record<string, string>;
}

// interface renameCategoryParams {
//   id: number;
//   name: string;
// }

export const getModuleIdByName = async(module_name: string): Promise<string|null> => {
  try {
    let sql_text: string = 'SELECT id FROM modules WHERE module_name=%L;';

    console.log("printing module_name:", module_name);

    const query = format(sql_text, module_name);
    console.log("printing SQL text:", query);
    const result = await pool.query(query);

    //console.log("printing result:", result);
    console.log("printing result.rows[0]", result.rows[0]);

    return result.rows.length > 0 ? result.rows[0].id : null;

  } catch (error) {
    logger.error('Error finding the module by name:', error);
    throw error;
  }
};

export const addCategory = async (
  params: AddCategoryParams
): Promise<{ id: number, module_id: number, name: string; itemShape: Record<string, string> }> => {

  let moduleName = params.module.toLowerCase();
  console.log(params)
  console.log("printing module name: ", moduleName);
  let module_id = await getModuleIdByName(moduleName);
  console.log("module ID: ", module_id);

  const query = format(`
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
      module_id, params.name, params.itemShape);

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
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    return { name: row.category_name };
  } catch (error) {
    logger.error('Error updating category name', error);
    throw error;
  }
};

// export const getCategories = async (module): etc.
// jos halutaan hakea moduulin kategoriat
export const getCategories = async (module: string|undefined): Promise<Category[]> => {
  const query = format(`
    SELECT 
        categories.id, 
        categories.category_name, 
        categories.item_shape, 
        ARRAY_AGG(
            json_build_object(
                'id', items.id, 
                'data', items.item_data  
            )
        ) AS query_items 
    FROM categories
    LEFT JOIN items ON items.category_id = categories.id
    LEFT JOIN modules ON modules.id = categories.module_id
    WHERE modules.module_name = %L
    GROUP BY categories.category_name, categories.id
    ORDER BY categories.id;
    `, module
    );

  const result = await pool.query(query);


  console.log(result);

  // NOTE: The filtering is done to items because
  // the query can return items array with an object
  // like { id: null, data: null }

  const categories: Category[] = result.rows.map((row) => {
    return {
      id: row.id,
      module_id: row.module_id,
      name: row.category_name,
      itemShape: row.item_shape,
      items: row.items.filter((item: { id: number | null }) => item.id)
    };
  });

  return categories;
};

export async function AddItem(category_id: string, item_data: JSON) {
  try {
    let sql_text: string = 'INSERT INTO items (category_id, item_data) VALUES (%L, %L)';

    logger.info(sql_text);
    logger.info(category_id);
    logger.info(item_data);

    const query = format(sql_text, category_id, item_data);
    await pool.query(query);

    logger.info(`category ${category_id} with item data ${item_data}" added`);
  } catch (error) {
    logger.error('Error adding item:', error);
  } finally {
    logger.info('Disconnected from the database');
  }
}

export async function UpdateItem(
  item_id: string,
  item_data: Record<string, string>
) {
  try {
    const sql_text: string = 'UPDATE items SET item_data = (%L) WHERE id=%L';

    logger.info('SQL text: ', sql_text);
    logger.info('item_id: ', item_id);
    logger.info('item_data: ', item_data);

    const query = format(sql_text, item_data, item_id);
    await pool.query(query);

    logger.info(`Updated item with ID ${item_id} with data ${item_data}"`);
  } catch (error) {
    logger.error('Error updating item:', error);
  } finally {
    logger.info('Disconnected from the database');
  }
}

export async function DeleteItem(item_id: string) {
  try {
    let sql_text: string = 'DELETE FROM items WHERE id=%L;';

    logger.info(sql_text);
    logger.info(item_id);

    const query = format(sql_text, item_id);
    const result = await pool.query(query);

    logger.info(`item with item_id "${item_id}" deleted`);
    return {
      success: true,
      rowsDeleted: result.rowCount
    };
  } catch (error) {
    logger.error('Error deleting item:', error);
    return {
      success: false,
      rowsDeleted: 0
    };
  }
}

export async function CheckItemIdFound(item_id: string): Promise<boolean> {
  try {
    let sql_text: string = 'SELECT * FROM items WHERE id=%L;';

    logger.info(sql_text);
    logger.info('printing item id:', item_id);

    const query = format(sql_text, item_id);
    const result = await pool.query(query);

    logger.info(result.rows.length);
    if (result.rows.length == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error('Error finding the item by ID:', error);
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
    logger.info('Connected to database AlterCategory');

    //updating the item_shape JSON of a category, replacing it with a new JSON structure
    const sql_text: string =
      'UPDATE categories SET item_shape = %L WHERE id = %L;';
    const query = format(sql_text, item_shape, category_id);
    await client.query(query);
    logger.info(
      'category "${category_id}" updated with item shape "${item_shape}"'
    );
  } catch (error) {
    logger.error('Error updating category:', error);
  } finally {
    client.release();
    logger.info('Disconnected from database AlterCategory');
  }
}

if (require.main == module) {
  //
}
