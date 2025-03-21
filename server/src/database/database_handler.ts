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
      GROUP BY category_name, category.id;
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

    console.log(sql_text);
    console.log(category_id);
    console.log(item_data);

    const query = format(sql_text, category_id, item_data);
    await pool.query(query);

    console.log(
      'category "${category_id}" with item data "${item_data}" added'
    );
  } catch (error) {
    console.error('Error adding item:', error);
  } finally {
    console.log('Disconnected from the database');
  }
}

export async function DeleteItem(item_id: string) {
  try {
    let sql_text: string = 'DELETE FROM item WHERE id=';
    sql_text += '%L;';

    console.log(sql_text);
    console.log(item_id);

    const query = format(sql_text, item_id);
    await pool.query(query);

    console.log('item with item_id "${item_id}" deleted');
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

export async function CheckItemIdFound(item_id: string): Promise<boolean> {
  try {
    let sql_text: string = 'SELECT * FROM item WHERE id=';
    sql_text += '%L;';

    console.log(sql_text);
    console.log('printing item id:', item_id);

    const query = format(sql_text, item_id);
    const result = await pool.query(query);

    console.log(result.rows.length);
    if (result.rows.length == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error finding the item by ID:', error);
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
    console.log('Connected to database AlterCategory');

    //updating the item_shape JSON of a category, replacing it with a new JSON structure
    const sql_text: string =
      'UPDATE category SET item_shape = %L WHERE id = %L;';
    const query = format(sql_text, item_shape, category_id);
    await client.query(query);
    console.log(
      'category "${category_id}" updated with item shape "${item_shape}"'
    );
  } catch (error) {
    console.error('Error updating category:', error);
  } finally {
    client.release();
    console.log('Disconnected from database AlterCategory');
  }
}

if (require.main == module) {
  //
}
