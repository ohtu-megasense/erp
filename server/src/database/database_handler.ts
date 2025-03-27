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
  itemShape: Record<string, string>;
}

// interface renameCategoryParams {
//   id: number;
//   name: string;
// }

export const addCategory = async (
  params: AddCategoryParams
): Promise<{ id: number; name: string; itemShape: Record<string, string> }> => {
  const query = {
    text: `
			INSERT INTO category (
				category_name,
				item_shape
			) VALUES (
				$1,
				$2
			) RETURNING
			 	id,
				category_name,
				item_shape;
		`,
    values: [params.name, params.itemShape]
  };

  const result = await pool.query<{
    id: number;
    category_name: string;
    item_shape: Record<string, string>;
  }>(query);

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.category_name,
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
      UPDATE category SET category_name = $1 WHERE id = $2 RETURNING category_name;
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
export const getCategories = async (): Promise<Category[]> => {
  const query = {
    text: `
      SELECT 
        category.id, 
        category_name, 
        item_shape, 
        ARRAY_AGG(
          json_build_object(
            'id', item.id, 
            'data', item.item_data  
          )
        ) as items 
      FROM category LEFT JOIN item ON item.category_id = category.id
      GROUP BY category_name, category.id ORDER BY category.id;
    `
  };

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

export async function AddItem(category_id: string, item_data: JSON) {
  try {
    let sql_text: string = 'INSERT INTO item (category_id, item_data) VALUES (';
    sql_text += '%L, %L);';

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
    const sql_text: string = 'UPDATE item SET item_data = (%L) WHERE id=%L';

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
    let sql_text: string = 'DELETE FROM item WHERE id=';
    sql_text += '%L;';

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
    let sql_text: string = 'SELECT * FROM item WHERE id=';
    sql_text += '%L;';

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
  const sqlText = `SELECT id, category_name, item_shape FROM category;`;
  const result = await pool.query(sqlText);
  logger.info('Categories from database', result.rows);
};

export async function AlterCategory(category_id: string, item_shape: JSON) {
  const client = await pool.connect();
  try {
    logger.info('Connected to database AlterCategory');

    //updating the item_shape JSON of a category, replacing it with a new JSON structure
    const sql_text: string =
      'UPDATE category SET item_shape = %L WHERE id = %L;';
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
