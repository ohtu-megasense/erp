import { Pool } from "pg";
import format from "pg-format";
import { database_URL } from "../config";

const pool = new Pool({
	connectionString: database_URL,
});

export async function temporarySensorKoosteFunction() {
	const client = await pool.connect();
	try {
		console.log("Connected to the database");

		const sql_text: string =
			"SELECT COUNT(status) FROM sensors WHERE status='Active'";
		const query = format(sql_text);
		const result_active = await client.query(query);
		console.log(`Retrieved count from "sensors"!`);
		const results_active = result_active.rows;

		const sql_text_all: string = "SELECT COUNT(status) FROM sensors";
		const query_2 = format(sql_text_all);
		const result_all = await client.query(query_2);
		console.log(`Retrieved count from "sensors"!`);
		const results_all = result_all.rows;

		return {
			total_sensors: results_all[0]["count"],
			active_sensors: results_active[0]["count"],
			inactive_sensors: results_all[0]["count"] - results_active[0]["count"],
		};
	} catch (error) {
		console.error("Error retrieving from table:", error);
	} finally {
		client.release();
		console.log("Disconnected from the database");
	}
}

export async function AddCategory(category_name: string, item_shape: JSON) {
	const client = await pool.connect();
	try {
		console.log("Connected to database");
		let sql_text: string =
			"INSERT INTO category (category_name, item_shape) VALUES (";
		sql_text += "%I, %I::jsonb);";
		console.log(sql_text);
		console.log(category_name);
		console.log(item_shape);

		const query = format(sql_text, category_name, item_shape);
		await client.query(query);
		console.log(
			'category "${category_name}" with item shape "${item_shape}" added',
		);
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
		console.log("Connected to database");
		let sql_text: string = "INSERT INTO item (category_id, item_data) VALUES (";
		sql_text += "%I, %I::jsonb);";
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

if (require.main == module) {
	//pass;
}
