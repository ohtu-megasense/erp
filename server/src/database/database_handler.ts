import { Pool } from "pg";
import format from "pg-format";
import { database_URL } from "../config";

const pool = new Pool({
	connectionString: database_URL,
});

export async function AddCategory(category_name: string, item_shape: JSON) {
	const client = await pool.connect();
	try {
		console.log("Connected to database addcategory");
		let sql_text: string =
			"INSERT INTO category (category_name, item_shape) VALUES (";
		sql_text += "%L, %L) RETURNING category_name, item_shape;";
		console.log(sql_text);
		console.log(category_name);
		console.log(item_shape);

		const query = format(sql_text, category_name, item_shape);
		const result = await client.query(query);
		console.log(
			'category "${category_name}" with item shape "${item_shape}" added',
		);
		return result.rows.map((row) => ({
			id: row.id,
			name: row.category_name,
			itemShape: row.item_shape || {},
			items: row.items || [],
		}));
	} catch (error) {
		console.error("Error adding category:", error);
	} finally {
		client.release();
		console.log("Disconnected from the database");
	}
}
export async function AddItem(category_id: string, item_data: JSON) {
	const client = await pool.connect();
	try {
		console.log("Connected to database additem");
		let sql_text: string = "INSERT INTO item (category_id, item_data) VALUES (";
		sql_text += "%L, %L);";
		console.log(sql_text);
		console.log(category_id);
		console.log(item_data);

		const query = format(sql_text, category_id, item_data);
		await client.query(query);
		console.log(
			'category "${category_id}" with item data "${item_data}" added',
		);
	} catch (error) {
		console.error("Error adding item:", error);
	} finally {
		client.release();
		console.log("Disconnected from the database");
	}
}

export async function GetCategories() {
	const client = await pool.connect();
	try {
		console.log("Connected to database GetCategories");
		let sql_text: string =
			"SELECT category.id, category_name, item_shape, ARRAY_AGG( json_build_object( 'id', item.id, 'data', item.item_data  ) ) as items FROM category LEFT JOIN item ON item.category_id = category.id GROUP BY category_name, category.id;";
		const query = format(sql_text);
		const result = await client.query(query);
		console.log("Retrieved categories", result.rows);

		return result.rows.map((row) => ({
			id: row.id,
			name: row.category_name,
			itemShape: row.item_shape || {},
			items: row.items || [],
		}));
	} catch (error) {
		console.error("Error retrieving categories: ", error);
	} finally {
		client.release();
		console.log("Disconnected from database GetCategories");
	}
}

export async function AlterCategory(category_id: string, item_shape: JSON) {
	const client = await pool.connect();
	try {
		console.log("Connected to database AlterCategory");

		//updating the item_shape JSON of a category, replacing it with a new JSON structure
		let sql_text: string = "UPDATE category SET item_shape = %L WHERE id = %L;";
		const query = format(sql_text, item_shape, category_id);
		await client.query(query);
		console.log(
			'category "${category_id}" updated with item shape "${item_shape}"',
		);
	} catch (error) {
		console.error("Error updating category:", error);
	} finally {
		client.release();
		console.log("Disconnected from database AlterCategory");
	}
}

if (require.main == module) {
	//Test
	//AlterCategory("1", {"name": "TEXT", "tilanne": "TEXT", "location": "TEXT"} as any);
	//pass;
}
