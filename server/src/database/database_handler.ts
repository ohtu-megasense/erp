import format from 'pg-format';
import logger from '../utils/logger';
import { pool } from './database';

export async function AddCategory(category_name: string, item_shape: JSON) {
  try {
    let sql_text: string =
      'INSERT INTO category (category_name, item_shape) VALUES (';
    sql_text += '%L, %L);';

    console.log(sql_text);
    console.log(category_name);
    console.log(item_shape);

    const query = format(sql_text, category_name, item_shape);
    await pool.query(query);

    console.log(
      'category "${category_name}" with item shape "${item_shape}" added'
    );
  } catch (error) {
    console.error('Error adding category:', error);
  }
}

export async function AddItem(category_id: string, item_data: JSON) {
  try {
    let sql_text: string = 'INSERT INTO item (category_id, item_data) VALUES (';
    sql_text += "'%L, %L);";

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
  }
}

export const testLogCategories = async () => {
  const sqlText = `SELECT id, category_name, item_shape FROM category;`;
  const result = await pool.query(sqlText);
  logger.info('Categories from database', result.rows);
};
